const {chromium}=require('playwright');
(async()=>{
const browser=await chromium.launch({headless:true,executablePath:"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"}); const context=await browser.newContext({viewport:{width:1440,height:1000},acceptDownloads:true});const page=await context.newPage();let errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('file://'+require('node:path').join(__dirname,'ROYZ.html'));
await page.screenshot({path:'evidence-desktop.png',fullPage:true});
await page.getByRole('button',{name:'Enter the room'}).click();
await page.getByRole('radio').first().click(); await page.getByRole('button',{name:'Continue →',exact:true}).click();
await page.reload();if(!await page.locator('#question-title').innerText().then(t=>t.includes('describes Royz')))throw Error('Resume failed');
// Complete all question types through actual controls.
for(let i=1;i<42;i++){
 const text=page.locator('#written-answer');if(await text.count())await text.fill('Test answer <script>alert(1)</script> & Royz');else await page.getByRole('radio').nth(i%4).click();
 await page.getByRole('button',{name:i===41?'Finish session →':'Continue →',exact:true}).click();
}
await page.getByRole('button',{name:'Build my pitch deck ↗',exact:true}).first().click();
if(await page.locator('.slide').count()!==11)throw Error('Slide count');
await page.getByRole('button',{name:'The label',exact:true}).click();
await page.getByRole('button',{name:'Present ↗',exact:true}).click();await page.keyboard.press('ArrowRight');
if(await page.locator('#slide-counter').innerText()!=='2 / 11')throw Error('Presentation navigation');await page.keyboard.press('Escape');
const [backup]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Export answers',exact:true}).click()]);await backup.saveAs('test-backup.json');
const [md]=await Promise.all([page.waitForEvent('download'),page.getByRole('button',{name:'Download written brief',exact:true}).click()]);await md.saveAs('test-brief.md');
await page.locator('#rating-identity').selectOption('4');await page.locator('#rating-emotion').selectOption('4');await page.locator('#rating-artifacts').selectOption('4');await page.locator('#rating-repeatable').selectOption('4');
if(!(await page.locator('#lab-result').innerText()).includes('second listener'))throw Error('Lab verdict');
await page.screenshot({path:'evidence-report.png',fullPage:true});
await page.emulateMedia({media:'print'});await page.pdf({path:'evidence-print.pdf',format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
await page.setViewportSize({width:390,height:844});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Report mobile overflow');await page.screenshot({path:'evidence-mobile-report.png',fullPage:true});
await page.getByRole('link',{name:'Royz home',exact:true}).click();await page.screenshot({path:'evidence-mobile.png',fullPage:true});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Intro mobile overflow');
await page.getByRole('button',{name:'Continue your session ↗',exact:true}).click();await page.locator('#chapter-select').selectOption('0');await page.screenshot({path:'evidence-mobile-quiz.png',fullPage:true});
if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth))throw Error('Quiz mobile overflow');
const result=await page.evaluate(()=>({score:score(),answers:count(),textSafe:!document.querySelector('script[src="bad"]')}));
console.log(JSON.stringify({errors,result,tests:'42-question flow, resume, report lenses, slides, export JSON/Markdown, lab ratings, print, mobile overflow'},null,2));
await browser.close();if(errors.length)process.exit(1);
})().catch(e=>{console.error(e);process.exit(1)});
