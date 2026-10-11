import fs from 'node:fs';
import path from 'node:path';
import {redactSecrets} from '../security/policy.js';
import type {ReviewResult,VerificationResult} from '../core/types.js';

export interface ProductionCheck {id:string;category:ProductionCategory;status:'pass'|'warn'|'fail';detail:string;}
export type ProductionCategory='correctness'|'security'|'reliability'|'maintainability'|'observability'|'deployment';
export interface ProductionReadinessReport {passed:boolean;score:number;checks:ProductionCheck[];}

function hasAny(root:string,names:string[]):string|null{for(const n of names)if(fs.existsSync(path.join(root,n)))return n;return null;}
function readText(root:string,name:string,limit=100000):string{try{const p=path.join(root,name);if(!fs.existsSync(p))return '';return fs.readFileSync(p,'utf8').slice(0,limit);}catch{return '';}}
/** Added (+) lines of a unified diff, without the +++ header. */
function addedLines(diff:string):string[]{return diff.split(/\r?\n/).filter(l=>l.startsWith('+')&&!l.startsWith('+++')).map(l=>l.slice(1));}
function count(re:RegExp,s:string):number{const m=s.match(re);return m?m.length:0;}
function gitignoreIgnores(root:string,needle:string):boolean{const p=path.join(root,'.gitignore');if(!fs.existsSync(p))return false;return fs.readFileSync(p,'utf8').split(/\r?\n/).some(l=>{const t=l.trim();if(!t||t.startsWith('#'))return false;return t===needle||t===`/${needle}`||(t.endsWith('/')&&t.slice(0,-1)===needle)||(needle.endsWith('/')&&t===needle.slice(0,-1));});}

export function evaluateProduction(root:string,diff:string,tests:VerificationResult[]|null,review:ReviewResult):ProductionReadinessReport{const checks:ProductionCheck[]=[];
// Correctness
if(!diff.trim())checks.push({id:'diff-present',category:'correctness',status:'fail',detail:'No implementation diff is available.'});else checks.push({id:'diff-present',category:'correctness',status:'pass',detail:'Working-tree diff detected.'});
if(tests===null)checks.push({id:'tests-executed',category:'correctness',status:'warn',detail:'Verification was not evaluated in this invocation.'});else if(tests.length===0)checks.push({id:'tests-executed',category:'correctness',status:'fail',detail:'No verification commands were detected or executed.'});else{const failed=tests.filter(t=>t.exitCode!==0||t.timedOut);checks.push({id:'tests-executed',category:'correctness',status:failed.length?'fail':'pass',detail:failed.length?`Failing commands: ${failed.map(t=>t.command).join(', ')}`:`${tests.length} verification command(s) passed.`});}
const a=addedLines(diff).join('\n');
const emptyCatch=/catch\s*\{\s*\}/.test(a)||/catch\s*\([^)]*\)\s*\{\s*\}/.test(a);
checks.push({id:'error-handling',category:'correctness',status:emptyCatch?'fail':'pass',detail:emptyCatch?'Empty catch blocks introduced in diff.':'No empty error handlers introduced.'});
const riskyNull=/\b(null|undefined)\b/.test(a)&&!/\?\./.test(a);
checks.push({id:'null-handling',category:'correctness',status:riskyNull?'warn':'pass',detail:riskyNull?'Diff mentions null/undefined without optional-chaining guards; verify null paths are covered.':'No obvious unguarded null handling introduced.'});
const concurrent=/Promise\.all\s*\(/.test(a)&&/\blet\s+\w+\s*(=|\.push)/.test(a);
checks.push({id:'concurrency',category:'correctness',status:concurrent?'warn':'pass',detail:concurrent?'Concurrent execution mutates shared state; verify race safety.':'No obvious shared-state concurrency hazard.'});
const newBranches=count(/\bif\s*\(|\bswitch\s*\(/g,a);
const testsTouched=/test|spec/i.test(diff);
// Security
checks.push({id:'edge-cases',category:'correctness',status:newBranches>3&&!testsTouched?'warn':'pass',detail:newBranches>3&&!testsTouched?`${newBranches} new branches but no test files touched; confirm edge cases are covered.`:'Branch coverage looks consistent with tests touched.'});
const securityFindings=review.categories.security??0;checks.push({id:'secret-scan',category:'security',status:securityFindings>=40?'fail':securityFindings>0?'warn':'pass',detail:securityFindings?'Security findings present in diff review.':'No secret patterns detected in diff.'});
const envTracked=fs.existsSync(path.join(root,'.env'))&&!gitignoreIgnores(root,'.env');checks.push({id:'env-untracked',category:'security',status:envTracked?'fail':'pass',detail:envTracked?'.env exists but is not covered by .gitignore.':'No unignored .env file in workspace.'});
const hardcoded=/(?:api[_-]?key|secret|token|password)\s*[:=]\s*['"][^'"]{4,}['"]/i.test(a);
checks.push({id:'hardcoded-credentials',category:'security',status:hardcoded?'fail':'pass',
detail:hardcoded?'Possible hard-coded credential in added lines.':'No hard-coded credentials in added lines.'});
const sqlConcat=/(SELECT|INSERT|UPDATE|DELETE)\b[^;]*(\+\s*['"`]|\$\{|\+ *req\.|\+ *request\.)/i.test(a);
checks.push({id:'sql-injection',category:'security',status:sqlConcat?'fail':'pass',
detail:sqlConcat?'String-concatenated SQL detected; use parameterized queries.':'No string-built SQL detected.'});
const cmdExec=/(child_process|execSync|new Function\s*\(|\beval\s*\()/.test(a);
checks.push({id:'command-injection',category:'security',status:cmdExec?'warn':'pass',
detail:cmdExec?'Dynamic code or shell execution introduced; confirm inputs are allow-listed.':'No dynamic code execution introduced.'});
const pathTrav=/\.\.\/|fs\.\w+\([^)]*req/i.test(a);
checks.push({id:'path-traversal',category:'security',status:pathTrav?'warn':'pass',
detail:pathTrav?'Filesystem path built from request-like input; confirm root-bounding.':'No request-derived filesystem paths detected.'});
const pkg=readText(root,'package.json');
let hasAuditScript=false;try{const j=JSON.parse(pkg||'null');hasAuditScript=Boolean(j?.scripts?.security||j?.scripts?.audit);}catch{}
checks.push({id:'dependency-audit',category:'security',status:hasAuditScript?'pass':'warn',
detail:hasAuditScript?'Repository defines a security/audit script.':'No security/audit script; run npm audit before release.'});
// Reliability
const fetchNoTimeout=/(fetch\s*\(|axios\.(get|post)|http\.(get|request)\s*\()/.test(a)&&!/Abort(Signal|Controller)|timeout/i.test(a);
checks.push({id:'timeouts',category:'reliability',status:fetchNoTimeout?'warn':'pass',
detail:fetchNoTimeout?'Network call without visible timeout/abort handling.':'No timeout-less network calls detected.'});
const retryNoBackoff=/retry/i.test(a)&&!/backoff|jitter|maxAttempts/i.test(a);
checks.push({id:'retries',category:'reliability',status:retryNoBackoff?'warn':'pass',
detail:retryNoBackoff?'Retry logic without backoff/jitter or attempt cap.':'Retry policy looks bounded or absent by design.'});
const resOpen=/(createReadStream|createWriteStream|acquire\s*\()/.test(a);
const resClose=/(close\s*\(|\.destroy\s*\(|finally|release\s*\()/.test(a);
checks.push({id:'resource-handling',category:'reliability',status:resOpen&&!resClose?'warn':'pass',
detail:resOpen&&!resClose?'Resource acquired without visible release path.':'Resource handling looks balanced.'});
checks.push({id:'test-command',category:'reliability',status:pkg.includes('"test"')?'pass':'warn',
detail:pkg.includes('"test"')?'Repository defines a test command.':'No test command detected in package.json scripts.'});
// Maintainability
const addedCount=addedLines(diff).length;
checks.push({id:'todo-markers',category:'maintainability',status:/TODO|FIXME/.test(diff)?'warn':'pass',detail:/TODO|FIXME/.test(diff)?'TODO/FIXME markers introduced in diff.':'No new TODO/FIXME markers.'});
checks.push({id:'change-size',category:'maintainability',status:addedCount>500?'warn':'pass',
detail:addedCount>500?`Large change (${addedCount} added lines); consider splitting.`:`Change size is reviewable (${addedCount} added lines).`});
checks.push({id:'readme',category:'maintainability',status:hasAny(root,['README.md','README'])?'pass':'warn',detail:hasAny(root,['README.md','README'])?'README present.':'No README detected at repository root.'});
// Observability
checks.push({id:'logging-policy',category:'observability',status:/console\.log/.test(diff)?'warn':'pass',detail:/console\.log/.test(diff)?'console.log introduced in diff; confirm observability policy.':'No ad-hoc console logging introduced.'});
// Deployment
const ci=fs.existsSync(path.join(root,'.github','workflows'))&&fs.readdirSync(path.join(root,'.github','workflows')).some(f=>/\.(yml|yaml)$/.test(f));checks.push({id:'ci-config',category:'deployment',status:ci?'pass':'warn',detail:ci?'CI workflow configuration detected.':'No CI workflow detected.'});
const lock=hasAny(root,['package-lock.json','pnpm-lock.yaml','yarn.lock','bun.lock','bun.lockb','Cargo.lock','go.sum','poetry.lock']);checks.push({id:'lockfile',category:'deployment',status:lock?'pass':'warn',detail:lock?`Lock file present: ${lock}.`:'No dependency lock file detected.'});
const envExample=hasAny(root,['.env.example','.env.sample']);
const usesEnv=/process\.env|os\.environ|System\.getenv/.test(a);
checks.push({id:'env-docs',category:'deployment',status:usesEnv&&!envExample?'warn':'pass',
detail:usesEnv&&!envExample?'New environment variables without .env.example documentation.':'Environment configuration is documented or unchanged.'});
const fails=checks.filter(c=>c.status==='fail').length;const warns=checks.filter(c=>c.status==='warn').length;const score=Math.max(0,100-fails*20-warns*4);return {passed:fails===0,score,checks:checks.map(c=>({...c,detail:redactSecrets(c.detail)}))};}