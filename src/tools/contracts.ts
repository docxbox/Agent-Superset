export interface BrowserProvider {observe():Promise<unknown>;navigate(url:string):Promise<void>;click(selector:string):Promise<void>;type(selector:string,text:string):Promise<void>;extract(selector?:string):Promise<string>;screenshot():Promise<unknown>;}
export interface ComputerUseProvider {screenshot():Promise<unknown>;click(x:number,y:number):Promise<void>;type(text:string):Promise<void>;}
export interface UniversalTools {shell:unknown;filesystem:unknown;git:unknown;github?:unknown;mcp?:unknown;browser?:BrowserProvider;http?:unknown;search?:unknown;documentation?:unknown;database?:unknown;testing?:unknown;build?:unknown;}
export interface SecondOpinionProvider {ask(input:{task:string;context:string;failure:string}):Promise<{recommendation:string;confidence?:number}>;}
export interface AgentRole {name:string;backend:string;prompt:string;artifacts:string[];}
export interface FleetReportLike {runId:string;passed:boolean;[key:string]:unknown;}
export interface MultiAgentOrchestrator {run(roles:AgentRole[]):Promise<FleetReportLike>;}
