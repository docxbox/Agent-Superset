import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type {AgentBackend,AgentResult} from '../core/types.js';
import type {AgentRole,MultiAgentOrchestrator} from '../tools/contracts.js';
import {redactSecrets} from '../security/policy.js';

export interface RoleOutcome {role:string;backend:string;exitCode:number;artifact:string;duration:number;}
export interface FleetReport {runId:string;outcomes:RoleOutcome[];artifacts:Record<string,string>;passed:boolean;[key:string]:unknown;}

/**
 * Sequential multi-agent orchestrator (Crabfleet-inspired mission control).
 * Each role receives the structured artifacts of prior roles as compact
 * context instead of raw transcripts, and must produce an artifact of its own.
 * Communication is file-based under `.forge/sessions/<runId>/artifacts/`.
 */

export class ArtifactOrchestrator implements MultiAgentOrchestrator {
  constructor(private options:{root:string;backends:Record<string,AgentBackend>;maxRoleRuntimeMs?:number;requiredRoles?:string[]}) {}
  async run(roles:AgentRole[]):Promise<FleetReport> {
    const runId=crypto.randomUUID();
    const dir=path.join(this.options.root,'.forge','sessions',runId,'artifacts');
    fs.mkdirSync(dir,{recursive:true});
    const outcomes:RoleOutcome[]=[];
    const artifacts:Record<string,string>={};
    for(const role of roles){
      const backend=this.options.backends[role.backend];
      if(!backend)throw new Error(`No backend registered for role ${role.name}: ${role.backend}`);
      const context=Object.entries(artifacts).map(([k,v])=>`## Artifact from ${k}\n${v}`).join('\n\n')||'(no prior artifacts)';
      const prompt=`You are the ${role.name} agent in a multi-agent run.\n${role.prompt}\n\nPrior role artifacts:\n${context}\n\nProduce your final answer as plain text. Do not modify files.`;
      const started=Date.now();
      let result:AgentResult;
      try{result=await backend.run({prompt,cwd:this.options.root,timeoutMs:this.options.maxRoleRuntimeMs??120000});}
      catch(e:any){result={backend:role.backend,exitCode:1,stdout:'',stderr:String(e?.message??e),duration:Date.now()-started};}
      const artifact=redactSecrets((result.stdout||result.stderr||'').trim());
      fs.writeFileSync(path.join(dir,`${role.name}.md`),`# ${role.name}\n\nbackend: ${role.backend}\nexitCode: ${result.exitCode}\n\n${artifact}\n`);
      artifacts[role.name]=artifact;
      outcomes.push({role:role.name,backend:role.backend,exitCode:result.exitCode,artifact,duration:result.duration});
      for(const dep of role.artifacts)if(!(dep in artifacts))throw new Error(`Role ${role.name} requires artifact '${dep}' but no prior role produced it.`);
    }
    const required=this.options.requiredRoles??[];
    const passed=outcomes.every(o=>o.exitCode===0)&&required.every(r=>r in artifacts&&artifacts[r].length>0);
    return {runId,outcomes,artifacts,passed};
  }
}