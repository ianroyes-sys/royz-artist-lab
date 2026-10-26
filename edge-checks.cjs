const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch({headless:true,executablePath:process.env.CHROME_PATH||undefined});const page=await browser.newPage({viewport:{width:1280,height:900},acceptDownloads:true});const errors=[],network=[];page.on('pageerror',e=>errors.push(e.message));page.on('request',r=>{if(r.url().startsWith('http'))network.push(r.url());});await page.goto('file://'+require('node:path').join(__dirname,'ROYZ.html'));
const outcomes=await page.evaluate(()=>{
 const out=[];state=cleanState({version:1,answers:{},index:0.5,view:'quiz'});render();if(state.index!==0)throw Error('Fractional index');out.push('import fractional index normalized');
 state.view='report';render();if(context().p!==null)throw Error('Empty profile');out.push('empty profile stays open');
 const ids=Object.keys(PROFILES);state.answers={};for(let i=0;i<4;i++){const q=SCORED[i];state.answers[q.id]=q.options.find(o=>o.scores[ids[i]]===3).value;}const c=context();if(c.candidates.length!==4)throw Error('Tie candidates');render();if(!document.querySelector('#slide-2').innerText.includes('Sonic architecture'))throw Error('Tie missing sound');out.push('four-way tie includes every experiment');
 state.answers={};state.answers[SCORED[0].id]=SCORED[0].options[0].value;if(context().candidates.length!==1)throw Error('Zero runner-up included');out.push('single-answer profile excludes zero scores');
 state.answers.hours='under3';state.answers.posting='frequent';render();if(!document.querySelector('#slide-6').innerText.includes('One simple post per week at most'))throw Error('Capacity');out.push('capacity overrides cadence');
 state.answers.voice_priority='own_lead';state.answers.authenticity='release_generated';render();if(!document.querySelector('#slide-8').innerText.includes('pull in two directions'))throw Error('Contradiction');out.push('voice contradiction flagged');
 state.notes={references:'<img src=x onerror=alert(1)> Reference test'};render();if(document.querySelector('img[src=x]'))throw Error('Note XSS');out.push('notes escaped');
 return out;
});
// Valid backup round trip through the file input.
page.on('dialog',d=>d.accept());
await page.locator('#import-file').setInputFiles({name:'roundtrip.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify({version:1,answers:{hours:'under3',voice_priority:'own_lead'},notes:{references:'exact musical moment'},index:12,view:'quiz',ratings:{}}))});
assert.equal(await page.evaluate(()=>state.notes.references),'exact musical moment');assert.equal(await page.evaluate(()=>state.index),12);
await page.evaluate(()=>go('report'));
const wav=Buffer.alloc(2044);wav.write('RIFF',0);wav.writeUInt32LE(2036,4);wav.write('WAVEfmt ',8);wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);wav.writeUInt32LE(8000,24);wav.writeUInt32LE(16000,28);wav.writeUInt16LE(2,32);wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(2000,40);
await page.locator('#audio-a').setInputFiles({name:'dry-test.wav',mimeType:'audio/wav',buffer:wav});await page.locator('#rating-identity').selectOption('5');await page.getByRole('button',{name:'The label',exact:true}).click();assert.match(await page.locator('#player-a').getAttribute('src'),/^blob:/);await page.locator('#audio-b').setInputFiles({name:'candidate-test.wav',mimeType:'audio/wav',buffer:wav});assert.equal(await page.locator('#rating-identity').inputValue(),'');
await page.evaluate(()=>go('quiz',0));await page.getByRole('radio').first().focus();await page.keyboard.press('ArrowRight');assert.equal(await page.getByRole('radio').nth(1).getAttribute('aria-checked'),'true');
await page.getByRole('button',{name:'Still exploring / I don’t know yet'}).click();assert.equal(await page.locator('[data-action=next]').evaluate(e=>e===document.activeElement),true);
assert.equal(network.length,0);assert.equal(errors.length,0);
await page.evaluate(()=>{state={version:1,answers:{},notes:{},index:0,view:'intro',lens:'artist',ratings:{}};persist();render();});await page.screenshot({path:'preview.png',fullPage:false});
console.log(JSON.stringify({outcomes,other:'JSON import roundtrip, audio persistence, new audio clears ratings, arrow navigation, focus restoration, zero external requests',errors,network},null,2));await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
