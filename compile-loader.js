const compStat = document.getElementById('compStat');
function setCompStat(s, cls){ compStat.textContent = s; compStat.className = cls||''; }

(async function initCompiler(){
  try{
    await import('./solc.min.js').catch(()=>{});
    if (typeof window.solc !== 'undefined') { setCompStat('loaded from solc.min.js', 'ok'); return; }
  }catch{}

  try{
    await new Promise((resolve,reject)=>{
      const s1 = document.createElement('script');
      s1.src = './soljson.js'; s1.onload = resolve; s1.onerror = reject; document.head.appendChild(s1);
    });
    await new Promise((resolve,reject)=>{
      const s2 = document.createElement('script');
      s2.src = './wrapper.js'; s2.onload = resolve; s2.onerror = reject; document.head.appendChild(s2);
    });
    if (typeof Module !== 'undefined' && typeof solcWrapper !== 'undefined'){
      window.solc = solcWrapper(Module);
      if (window.solc) { setCompStat('loaded from soljson.js + wrapper.js', 'ok'); return; }
    }
  }catch{}

  setCompStat('not loaded (paste compiler code below or add the files)', 'warn');
})();

document.getElementById('btn-load-paste').addEventListener('click', ()=>{
  try{
    const src = document.getElementById('pasteArea').value;
    if(!src || src.length < 1000) throw new Error('Paste compiler JS first.');
    eval(src); // defines Module
    if (typeof Module === 'undefined') throw new Error('Module not defined by pasted code.');
    if (typeof solcWrapper === 'undefined') throw new Error('wrapper missing. Add wrapper.js file.');
    window.solc = solcWrapper(Module);
    if (!window.solc) throw new Error('Failed to init solc from paste.');
    setCompStat('loaded from pasted compiler (with wrapper.js)', 'ok');
    alert('Compiler loaded. You can compile now.');
  }catch(err){
    alert('Failed to load from paste: '+ (err?.message||err));
  }
});
