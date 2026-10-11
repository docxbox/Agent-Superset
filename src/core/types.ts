export type BackendName = 'claude'|'codex'|'opencode'|string;
export type ExecutionMode = 'host'|'container'|'sandbox';
export interface AgentCapabilities {sessions:boolean; streaming:boolean; tools:boolean; headless:boolean; resume:boolean; stop:boolean;}
export interface AgentTask { prompt:string; cwd:string; sessionId?:string; timeoutMs?:number; env?:Record<string,string>; }
export interface AgentResult { backend:string; exitCode:number; stdout:string; stderr:string; sessionId?:string; duration:number; }
export interface AgentBackend { name():BackendName; capabilities():AgentCapabilities; available():boolean; run(task:AgentTask):Promise<AgentResult>; resume?(sessionId:string,task:AgentTask):Promise<AgentResult>; stop?(sessionId:string):Promise<void>; }
export interface Skill {name:string;description:string;version:string;triggers:string[];path:string;body:string;}
export interface CommandSpec {command:string;args:string[];display:string;cwd?:string;}
export interface VerificationResult {command:string;exitCode:number|null;duration:number;stdout:string;stderr:string;timedOut?:boolean;}
export interface RunLimits {maxIterations:number;maxRepairs:number;maxRuntimeMinutes:number;maxCostUsd:number;maxToolCalls:number;maxTestRuns:number;}
export interface RunMetrics {tokens?:number;estimatedCostUsd:number|null;runtimeMs:number;iterations:number;toolCalls:number;testRuns:number;repairAttempts:number;}
export interface ReviewResult {passed:boolean;findings:string[];score:number;categories:Record<string,number>;}
export interface RunReport {runId:string;backend:string;task:string;startedAt:string;duration:number;iterations:number;repairAttempts:number;toolCalls:number;tests:VerificationResult[];review:ReviewResult;status:string;securityPassed:boolean;productionReady:boolean;metrics:RunMetrics;changedFiles:string[];}
export interface ReconResult {root:string;language:string;framework:string;packageManager:string;testFramework:string;linting:string[];typeChecking:string[];buildSystem:string;ci:string[];deployment:string;files:string[];gitStatus:string;gitHistory:string;manifests:string[];}
export interface Plan {task:string;objective:string;existingArchitecture:string;affectedComponents:string[];steps:string[];risks:string[];verification:CommandSpec[];skills:string[];createdAt:string;}
