from pathlib import Path
import base64
p=Path(__file__).parent
html=(p/'index.html').read_text()
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>'+(p/'styles.css').read_text()+'</style>')
js=(p/'questions.js').read_text()+'\n'+(p/'app.js').read_text()
for name in ['royz-night.jpg','royz-day.jpg']:
 js=js.replace('assets/'+name,'data:image/jpeg;base64,'+base64.b64encode((p/'assets'/name).read_bytes()).decode())
html=html.replace('<script src="questions.js"></script><script src="app.js"></script>','<script>'+js.replace('</script','<\\/script')+'</script>')
(p/'ROYZ.html').write_text(html)
print('Built standalone ROYZ.html:',len(html),'bytes')
