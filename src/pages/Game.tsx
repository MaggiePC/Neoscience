// pages/Game.tsx
import React, { useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

// ----------------------------------------------------------------------
// 1. INTERFACES Y ESTILOS
// ----------------------------------------------------------------------

interface AsteroidImage extends HTMLImageElement {
  ready: boolean;
}

const UISTYLES = `
  :root{--bg:#071423;--fg:#eaf2ff;--ok:#22c55e;--warn:#f59e0b;--bad:#ef4444;--ui:#94a3b8}
  .gameRoot *{box-sizing:border-box;font-family:system-ui,Segoe UI,Roboto,Arial,sans-serif}

  /* Contenedor del juego (encapsulado) */
  .gameRoot{
    width:100%;
    background-image:url('fondojuego.png');
    background-size:cover;
    background-repeat:no-repeat;
    background-position:center;
    color:var(--fg);
    position:relative; /* en flujo normal, para que el footer baje */
    overflow:hidden;   /* recorta overlays del juego */
  }

  .gameRoot canvas{
    display:block;
    width:100%;
    height:clamp(520px, 82vh, 100svh);
  }

  /* UI del juego */
  .gameHeader{
    position:absolute; left:12px; top:12px;
    background:#0008; border:1px solid #ffffff22; border-radius:14px;
    padding:8px 12px; font-size:25px; backdrop-filter:blur(4px); z-index:2;
  }
  .gameHeader b{ color:#a5b4fc }

  .gamePanel{ position:absolute; right:12px; top:12px; display:flex; gap:8px; z-index:2 }
  .btn{ background:#ffffff1a; border:1px solid #ffffff33; color:var(--fg); padding:8px 12px; border-radius:12px; cursor:pointer; font-size:18px }
  .btn:active{ transform:scale(0.98) }
  .btn-exit{ background:#ef44441a; border:1px solid #ef444455 }

  .gameTouch{ position:absolute; inset:auto 0 10px 0; display:flex; justify-content:center; gap:10px; z-index:2 }
  .pad{ background:#ffffff12; border:1px solid #ffffff22; color:var(--fg); width:70px; height:70px; border-radius:16px; font-size:22px; display:grid; place-items:center; user-select:none }
  .shoot{ width:120px }

  .banner{ position:absolute; left:50%; top:12%; transform:translateX(-50%); background:#000b; border:1px solid #ffffff33; border-radius:12px; padding:10px 16px; font-size:16px; z-index:2; display:none }

  /* Intro dentro del contenedor del juego */
  .intro-backdrop{ position:absolute; inset:0; background:rgba(0,0,0,.6); backdrop-filter:blur(3px); display:flex; align-items:center; justify-content:center; z-index:5 }
  .intro-card{ width:min(860px,92vw); max-height:86vh; overflow:auto; background:#0b1630; border:1px solid #3b425a; border-radius:16px; padding:18px; box-shadow:0 10px 30px rgba(0,0,0,.35) }
  .intro-card h1{ margin:0 0 8px; font-size:22px; color:#a5b4fc }
  .intro-grid{ display:grid; grid-template-columns:1.1fr .9fr; gap:14px }
  .intro-section{ background:#0d1e3e; border:1px solid #2a3656; border-radius:12px; padding:12px }
  .intro-section h2{ margin:0 0 6px; font-size:16px; color:#9bd1ff }
  .intro-list{ margin:8px 0 0; padding-left:18px; line-height:1.5; font-size:14px }
  .kbd{ display:inline-block; background:#0f172a; border:1px solid #334155; border-radius:8px; padding:2px 6px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace }
  .intro-actions{ display:flex; gap:8px; justify-content:flex-end; margin-top:12px; flex-wrap:wrap }
  .btn-cta{ background:#22c55e; border:0; color:#0b1020; padding:10px 14px; border-radius:10px; cursor:pointer; font-weight:600 }
  .intro-footer{ display:flex; justify-content:space-between; align-items:center; margin-top:6px; font-size:12px; color:#cbd5e1 }
  .intro-footer label{ display:flex; gap:8px; align-items:center; cursor:pointer }

  @media (max-width:840px){ .intro-grid{ grid-template-columns:1fr } }
  .hidden{ display:none !important }
`;

// ----------------------------------------------------------------------
// 2. LÓGICA DEL JUEGO
// ----------------------------------------------------------------------

const startGame = (canvas: HTMLCanvasElement, navigate: (route: string) => void) => {
  // ===== Storage seguro =====
  const storage = (() => {
    try{
      const t='__test__';
      localStorage.setItem(t,'1');
      localStorage.removeItem(t);
      return localStorage;
    } catch(e){
      const m=new Map<string, string>();
      return {
        getItem: (k: string) => m.has(k) ? m.get(k)! : null,
        setItem: (k: string, v: string) => m.set(k, String(v)),
        removeItem: (k: string) => m.delete(k)
      };
    }
  })();

  // ===== Salir a la app (recarga dura y limpia historial) =====
  const exitToApp = (route = "/") => {
    window.location.replace(route);
  };

  // ----- Canvas / escala -----
  const DPR = Math.max(1, devicePixelRatio||1);
  const ctx = canvas.getContext('2d');
  if (!ctx) return () => {}; // Salir si el contexto no existe

  let CW: number, CH: number;

  // ===== Geometría de la Tierra =====
  const EARTH = { cx: 0, cy: 0, R: 0 };
  function computeEarthGeom(){
    EARTH.cx = CW / 2;
    EARTH.cy = CH + 120 * DPR;
    EARTH.R  = CH * 0.60;
  }

  const resize = () => {
    canvas.width  = CW = innerWidth * DPR;
    canvas.height = CH = innerHeight * DPR;
    canvas.style.width  = innerWidth + "px";
    canvas.style.height = innerHeight + "px";
    computeEarthGeom();
  };
  resize();
  window.addEventListener('resize', resize);

  // 🔥 Margen de “culleo” off-screen (pero solo tras entrar)
  const OFF_M = 220 * DPR;
  function shouldCull(r:any){
    // culla sólo si ya entró y realmente salió lejos
    return r.entered && (
      r.x < -OFF_M || r.x > CW + OFF_M ||
      r.y > CH + OFF_M || r.y < -OFF_M * 1.5
    );
  }

  // ===== Sprites de asteroides =====
  const ASTEROID_STYLE = 'sprite';

  function loadAst(src: string): AsteroidImage {
    const img = new Image() as AsteroidImage;
    img.src = src;
    img.ready = false;
    img.onload = () => { img.ready = true; };
    return img;
  }

  const asteroidImgs = {
    metal:   loadAst('/asteroideMetalico.png'),
    ice:     loadAst('/asteroideHielo.png'),
    volcano: loadAst('/asteroideVolcan.png')
  };

  // Probabilidades
  const AST_WEIGHTS = { metal: 0.4, ice: 0.3, volcano: 0.3 };
  function pickAsteroidType(){
    const r = Math.random();
    const a = AST_WEIGHTS.metal;
    const b = a + AST_WEIGHTS.ice;
    return (r < a) ? 'metal' : (r < b) ? 'ice' : 'volcano';
  }

  // ----- UI (Busca los elementos renderizados por React) -----
  const hud=document.getElementById('hud'), banner=document.getElementById('banner');
  const btnRestart=document.getElementById('btnRestart'), btnHelp=document.getElementById('btnHelp');
  const btnExit=document.getElementById('btnExit');
  const btnExitIntro=document.getElementById('btnExitIntro');
  const touchCtrls=document.getElementById('touchCtrls'), shootBtn=document.getElementById('shootBtn');
  const introEl=document.getElementById('intro'), btnPlay=document.getElementById('btnPlay'), chkSkipIntro=document.getElementById('chkSkipIntro') as HTMLInputElement;

  if (innerWidth < 900 || 'ontouchstart' in window) {
    if (touchCtrls) touchCtrls.style.display='flex';
  }

  function showBanner(text: string, ms=1800){
    if (banner) {
      banner.textContent=text; banner.style.display='block';
      clearTimeout((showBanner as any)._t); (showBanner as any)._t=setTimeout(()=>banner.style.display='none', ms);
    }
  }
  const BEST_KEY='dartkids_best';
  let best=Number(storage.getItem(BEST_KEY))||0;

  // ===== Textura de la Tierra =====
  const earthTex = new Image();
  earthTex.src = '/earth_texture.png';
  let earthReady = false;
  earthTex.onload = () => (earthReady as boolean) = true;

  function earthTopYAt(x: number){
    const dx = x - EARTH.cx;
    if (Math.abs(dx) > EARTH.R) return Infinity;
    return EARTH.cy - Math.sqrt(EARTH.R*EARTH.R - dx*dx);
  }

  // ----- Juego -----
  const state = {
    ship:{x:0,y:0,w:44*DPR,h:44*DPR,speed:7*DPR,cooldown:0},
    bullets: [] as {x:number, y:number, vy:number}[],
    rocks: [] as any[],
    particles: [] as any[],
    score:0,
    lives:5,
    level:1,
    over:false,
    shake:0,
    earthAngle:0
  };
  let paused=false;
  let animFrameId: number;

  function reset(){
    state.ship.x = CW/2;
    state.ship.y = CH - 140*DPR;
    state.bullets=[]; state.rocks=[]; state.particles=[];
    state.score=0; state.lives=5; state.level=1; state.over=false; state.shake=0; state.earthAngle=0;
    spawnWave(); updateHUD();
    showBanner('Mueve la nave · Dispara a los asteroides · ¡Protege la Tierra! 🌍');
  }
  function updateHUD(){
    const total=5, hearts='❤️'.repeat(state.lives)+'🤍'.repeat(Math.max(0,total-state.lives));
    if (hud) hud.textContent=`Puntos: ${state.score} · Mejor: ${best} · Vidas: ${hearts} · Nivel: ${state.level}`;
  }

  // Spawns
  function spawnWave(){
    const n = 6 + state.level; // más acción
    for (let i=0;i<n;i++) state.rocks.push(newRock());
  }
  function newRock(){
    const size = Math.random()*18*DPR + 22*DPR;
    const range = EARTH.R * 0.9;

    let x = EARTH.cx + (Math.random()*2 - 1) * range;
    // clamp horizontal: evita nacer fuera de margen razonable
    x = Math.max(-OFF_M * 0.5, Math.min(CW + OFF_M * 0.5, x));

    const y = -50*DPR - Math.random()*300*DPR;
    const speed = (1.0 + state.level*0.25) * DPR;
    const biasTowardCenter = ((EARTH.cx - x) / EARTH.R) * 0.35 * DPR;
    const randomDrift = (Math.random()*0.30 - 0.15) * DPR;
    const drift = biasTowardCenter + randomDrift;
    const rot = Math.random()*Math.PI*2;
    const rotSpeed = (Math.random()*0.8 - 0.4) * 0.01;
    const shape = makeRockShape(size, Math.floor(8 + Math.random()*6));
    const hue = Math.max(200 - state.level*8, 160);
    const color = `hsl(${hue} 24% 35%)`;
    const type = pickAsteroidType();

    // Vida/deflexión/estela (más vida si es grande)
    const hp = size < 28*DPR ? 2 : size > 36*DPR ? 4 : 3;

    return {
      x, y, r: size, vy: speed, vx: drift,
      hit:false, rot, rotSpeed, shape, color, type,
      hp,
      prevX: x, prevY: y,
      trail: [] as {x:number,y:number,a:number}[],
      flash: 0,
      entered: false, // entra al menos una vez
      age: 0          // failsafe por edad (frames)
    };
  }
  function makeRockShape(radius: number, sides: number){
    const pts = [];
    for (let i=0;i<sides;i++){
      const a = (i/sides)*Math.PI*2;
      const wobble = 0.72 + Math.random()*0.5;
      pts.push({ x: Math.cos(a)*radius*wobble, y: Math.sin(a)*radius*wobble });
    }
    return pts;
  }

  // ----- Entrada -----
  const keys=new Set<string>();

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key===' '||e.code==='Space'){ shoot(); e.preventDefault(); }
    if (e.key.toLowerCase()==='p') paused=!paused;
    if (e.key.toLowerCase()==='r') reset();
    if (e.key.toLowerCase()==='h') showIntro();
    if (e.key === 'Escape') exitToApp('/');
    keys.add(e.key);
  };
  const onKeyup = (e: KeyboardEvent) => keys.delete(e.key);

  window.addEventListener('keydown', onKeydown);
  window.addEventListener('keyup', onKeyup);

  // Touch
  let touchDir=0, pressShoot=false;

  const onTouchStart = (e: TouchEvent) => {
    const t = e.target as HTMLElement;
    if (t.classList.contains('pad') && t.dataset.dir) touchDir=parseInt(t.dataset.dir,10);
    if (t===shootBtn){ pressShoot=true; shoot(); }
  };
  const onTouchEnd = () => { touchDir=0; pressShoot=false; };

  if(touchCtrls) {
    touchCtrls.addEventListener('touchstart', onTouchStart);
    touchCtrls.addEventListener('touchend', onTouchEnd);
  }

  // Disparo
  function shoot(){
    if (state.over||paused) return;
    if (state.ship.cooldown>0) return;
    const b={x:state.ship.x,y:state.ship.y - state.ship.h*0.6,vy:-12*DPR};
    state.bullets.push(b);
    state.ship.cooldown=10;
    for (let i=0;i<6;i++) state.particles.push(particle(b.x,b.y,1));
  }

  // Partículas
  function particle(x: number, y: number, mode=0){
    const a=Math.random()*Math.PI*2, s=(mode?3:2)*DPR + Math.random()*1*DPR;
    return { x,y, vx:Math.cos(a)*s, vy:Math.sin(a)*s, life:20, color: mode? '#cbd5e1' : '#f59e0b' };
  }

  // Física
  function update(){
    let dir=0;
    if (keys.has('ArrowLeft')||keys.has('a')) dir-=1;
    if (keys.has('ArrowRight')||keys.has('d')) dir+=1;
    if (touchDir!==0) dir=touchDir;
    state.ship.x += dir*state.ship.speed*(state.over?0:1);
    state.ship.x = Math.max(40*DPR, Math.min(CW-40*DPR, state.ship.x));
    if (state.ship.cooldown>0) state.ship.cooldown--;

    state.earthAngle += 0.003;

    for (let i=state.bullets.length-1;i>=0;i--){
      const b=state.bullets[i];
      b.y += b.vy;
      if (b.y < -40*DPR) state.bullets.splice(i,1);
    }

    if (!state.over){
      for (let r of state.rocks){
        // guarda posición previa
        r.prevX = r.x; r.prevY = r.y;

        // movimiento
        r.y += r.vy; r.x += r.vx; r.rot += r.rotSpeed;

        // marcar que ya entró (viewport o bordes inmediatos)
        if (!r.entered) {
          const enteredVert = r.y > -10 * DPR;
          const enteredHorz = r.x > -10 * DPR && r.x < CW + 10 * DPR;
          if (enteredVert || enteredHorz) r.entered = true;
        }

        // amortiguación para que el desvío no sea infinito
        r.vx *= 0.996;
        r.vy *= 0.998;

        // destello fade
        if (r.flash > 0) r.flash--;

        // puntos de estela
        if (Math.random() < 0.25){
          r.trail.push({ x:r.x, y:r.y, a:0.7 });
          if (r.trail.length > 16) r.trail.shift();
        }

        // edad (frames)
        r.age++;
      }

      // 🔥 Culleo off-screen SOLO si ya entró + premio “salvado”
      for (let i = state.rocks.length - 1; i >= 0; i--){
        const r = state.rocks[i];
        const tooOld = r.entered && r.age > 20 * 60; // ~20s @60fps
        if (shouldCull(r) || tooOld){
          state.rocks.splice(i,1);
          state.score += 5; // puntos por desviar / salvar
          updateHUD();
        }
      }
    }

    // Colisiones bala-roca con DEFLEXIÓN
    for (let i=state.rocks.length-1;i>=0;i--){
      const r=state.rocks[i];
      for (let j=state.bullets.length-1;j>=0;j--){
        const b=state.bullets[j], dx=r.x-b.x, dy=r.y-b.y;
        if (dx*dx + dy*dy < (r.r*0.8)*(r.r*0.8)){
          deflectRock(r, b);
          state.bullets.splice(j,1);
          if (r.hp <= 0){
            explodeRock(r);
            state.rocks.splice(i,1);
            state.score += 10; updateHUD();
          }
          break;
        }
      }
    }

    // Colisión con Tierra (debajo del arco)
    for (let i=state.rocks.length-1;i>=0;i--){
      const r = state.rocks[i];
      const yArc = earthTopYAt(r.x);
      if (r.y + r.r > yArc){
        state.rocks.splice(i,1);
        damageEarth();
      }
    }

    if (!state.over && state.rocks.length===0){
      state.level++; spawnWave(); showBanner(`Nivel ${state.level} ↑`,1200); updateHUD();
    }

    if (state.shake>0) state.shake--;
  }

  function deflectRock(r:any, b:{x:number,y:number}){
    // vector impacto desde bala hacia roca
    const ix = r.x - b.x, iy = r.y - b.y;
    const len = Math.hypot(ix, iy) || 1;
    const nx = ix / len, ny = iy / len;

    // impulso (ajustables)
    const Kt = 2.0 * DPR;
    const Kn = 1.2 * DPR;
    r.vx += nx * Kt;
    r.vy += ny * Kn;

    r.rotSpeed += (Math.random()*0.6 - 0.3) * 0.02;
    r.flash = 10;
    r.hp -= 1;

    // chispas
    for (let k=0;k<10;k++){
      const p=particle(r.x,r.y,1);
      p.vx*=1.7; p.vy*=1.7; p.life=18;
      state.particles.push(p);
    }

    // trazo de trayectoria
    r.trail.push({ x:r.x, y:r.y, a:0.9 });
    if (r.trail.length > 16) r.trail.shift();
  }

  function explodeRock(r:any){
    for (let k=0;k<16;k++){
      const p=particle(r.x,r.y,1);
      p.vx*=1.5; p.vy*=1.5; p.life=26;
      state.particles.push(p);
    }
  }

  function damageEarth(){
    state.lives--; state.shake=14; updateHUD();
    if (state.lives<=0){
      state.over=true;
      if (state.score>best){ best=state.score; storage.setItem('dartkids_best',String(best)); showBanner(`🎉 ¡Nuevo récord! ${best} puntos`); }
      else { showBanner(`Juego terminado · Puntos: ${state.score} · Nivel: ${state.level}`); }
    } else {
      showBanner('¡Cuidado! Un asteroide tocó la Tierra 😬',1400);
    }
  }

  // Dibujo
  function draw(){
    const ox=(state.shake?(Math.random()-0.5)*6*DPR:0), oy=(state.shake?(Math.random()-0.5)*6*DPR:0);
    ctx!.setTransform(1,0,0,1,ox,oy);
    ctx!.clearRect(-ox,-oy,CW,CH);

    // estrellitas de fondo
    ctx!.fillStyle='#ffffff18'; for (let i=0;i<60;i++){ const x=((i*73)%CW), y=((i*131)%CH); ctx!.fillRect(x,y,2,2); }

    drawEarth(); drawShip(); drawBullets(); drawRocks(); drawParticles();
  }

  function drawEarth(){
    const { cx, cy, R } = EARTH;
    ctx!.save(); ctx!.beginPath(); ctx!.arc(cx,cy,R,0,Math.PI*2); ctx!.clip();
    if (earthReady){
      ctx!.translate(cx,cy); ctx!.rotate(state.earthAngle);
      const S=R*2.2; ctx!.drawImage(earthTex,-S/2,-S/2,S,S); ctx!.setTransform(1,0,0,1,0,0);
    } else {
      const g=ctx!.createRadialGradient(cx-R/4, cy-R/4, R*.5, cx, cy, R);
      g.addColorStop(0,'#1d4ed8'); g.addColorStop(1,'#0c4a6e'); ctx!.fillStyle=g; ctx!.fillRect(cx-R, cy-R, R*2, R*2);
    }
    ctx!.restore();
    ctx!.beginPath(); ctx!.arc(cx,cy,R*1.02,0,Math.PI*2); ctx!.fillStyle='rgba(96,165,250,0.04)'; ctx!.fill();
  }

  function drawRocks(){
    for (const r of state.rocks){

      // estela de trayectoria
      if (r.trail && r.trail.length > 1){
        ctx!.save();
        ctx!.beginPath();
        for (let t=0; t<r.trail.length; t++){
          const p = r.trail[t];
          if (t===0) ctx!.moveTo(p.x, p.y); else ctx!.lineTo(p.x, p.y);
        }
        ctx!.strokeStyle = 'rgba(147,197,253,0.35)'; // #93c5fd
        ctx!.lineWidth = 2*DPR;
        ctx!.stroke();
        ctx!.restore();
      }

      if (ASTEROID_STYLE==='sprite'){
        const tex = asteroidImgs[r.type as keyof typeof asteroidImgs];
        if (tex && tex.ready){
          ctx!.save(); ctx!.translate(r.x,r.y); ctx!.rotate(r.rot);
          const s=r.r*2; ctx!.drawImage(tex,-s/2,-s/2,s,s); ctx!.restore();
        } else {
          ctx!.save(); ctx!.translate(r.x,r.y); ctx!.rotate(r.rot);
          ctx!.beginPath(); for (let i=0;i<r.shape.length;i++){ const p=r.shape[i]; i?ctx!.lineTo(p.x,p.y):ctx!.moveTo(p.x,p.y); }
          ctx!.closePath(); ctx!.fillStyle=r.color; ctx!.fill(); ctx!.lineWidth=2*DPR; ctx!.strokeStyle='#93c5fd66'; ctx!.stroke(); ctx!.restore();
        }
      } else {
        ctx!.beginPath(); ctx!.arc(r.x,r.y,r.r,0,Math.PI*2); ctx!.fillStyle='#334155'; ctx!.fill(); ctx!.strokeStyle='#93c5fd88'; ctx!.lineWidth=2*DPR; ctx!.stroke();
      }

      // destello por impacto reciente
      if (r.flash > 0){
        ctx!.save();
        ctx!.beginPath();
        ctx!.translate(r.x, r.y);
        ctx!.rotate(r.rot);
        ctx!.arc(0, 0, r.r*0.95, 0, Math.PI*2);
        ctx!.strokeStyle = `rgba(255,255,255,${0.15 + r.flash*0.05})`;
        ctx!.lineWidth = 3*DPR;
        ctx!.stroke();
        ctx!.restore();
      }

      // marcador de dirección (flecha)
      ctx!.beginPath(); ctx!.moveTo(r.x, r.y - r.r - 10*DPR); ctx!.lineTo(r.x, r.y - r.r - 26*DPR);
      ctx!.strokeStyle='#f59e0b88'; ctx!.lineWidth=2*DPR; ctx!.stroke();
    }
  }

  function drawShip(){
    const s=state.ship;
    ctx!.save(); ctx!.translate(s.x,s.y);
    ctx!.beginPath(); ctx!.moveTo(0,-s.h*0.6); ctx!.lineTo(s.w*0.35,s.h*0.4); ctx!.lineTo(-s.w*0.35,s.h*0.4); ctx!.closePath(); ctx!.fillStyle='#e5e7eb'; ctx!.fill();
    if (!state.over && !paused){
      ctx!.beginPath(); ctx!.moveTo(0,s.h*0.42); ctx!.lineTo(6*DPR,s.h*0.65); ctx!.lineTo(-6*DPR,s.h*0.65); ctx!.closePath(); ctx!.fillStyle='#f59e0b'; ctx!.fill();
    }
    ctx!.restore();
  }

  function drawBullets(){
    ctx!.strokeStyle='#a7f3d0'; ctx!.lineWidth=3*DPR;
    for (const b of state.bullets){ ctx!.beginPath(); ctx!.moveTo(b.x,b.y); ctx!.lineTo(b.x,b.y-14*DPR); ctx!.stroke(); }
  }

  function drawParticles(){
    for (let i=state.particles.length-1;i>=0;i--){
      const p=state.particles[i]; p.x+=p.vx; p.y+=p.vy; p.life--;
      if (p.life<=0){ state.particles.splice(i,1); continue; }
      ctx!.globalAlpha=Math.max(0,p.life/26); ctx!.fillStyle=p.color; ctx!.fillRect(p.x,p.y,3*DPR,3*DPR); ctx!.globalAlpha=1;
    }
  }

  // Intro handlers
  function showIntro(){ paused=true; if (chkSkipIntro) chkSkipIntro.checked = storage.getItem('dartkids_skip_intro')==='1'; introEl?.classList.remove('hidden'); }
  function hideIntro(){ introEl?.classList.add('hidden'); paused=false; }

  // Event Listeners para botones de UI
  const onPlayClick = () => {
    if (chkSkipIntro && chkSkipIntro.checked) storage.setItem('dartkids_skip_intro','1');
    else storage.removeItem('dartkids_skip_intro');
    hideIntro();
  };
  const onIntroBackdropClick = (e: MouseEvent) => { if(e.target===introEl) hideIntro(); };
  const onEnterKeyIntro = (e: KeyboardEvent) => { if(!introEl?.classList.contains('hidden') && e.key==='Enter' && btnPlay) onPlayClick(); };
  const onExitClick = () => exitToApp('/');

  if(btnPlay) btnPlay.onclick = onPlayClick;
  if(btnExit) btnExit.onclick = onExitClick;
  if(btnExitIntro) btnExitIntro.onclick = onExitClick;
  if(introEl) introEl.addEventListener('click', onIntroBackdropClick);
  document.addEventListener('keydown', onEnterKeyIntro);

  if(btnRestart) btnRestart.onclick=reset;
  if(btnHelp) btnHelp.onclick=showIntro;

  // Bucle
  let last=performance.now();
  function loop(now: number){
    const dt=Math.min(0.033,(now-last)/1000);
    last=now;
    if (!state.over && !paused) update();
    draw();
    animFrameId = requestAnimationFrame(loop);
  }

  // Inicio
  reset();
  if (storage.getItem('dartkids_skip_intro')!=='1') showIntro();
  animFrameId = requestAnimationFrame(loop);

  // Limpieza
  return () => {
    cancelAnimationFrame(animFrameId);
    window.removeEventListener('resize', resize);
    window.removeEventListener('keydown', onKeydown);
    window.removeEventListener('keyup', onKeyup);
    if(introEl) introEl.removeEventListener('click', onIntroBackdropClick);
    document.removeEventListener('keydown', onEnterKeyIntro);
    if(touchCtrls) {
      touchCtrls.removeEventListener('touchstart', onTouchStart);
      touchCtrls.removeEventListener('touchend', onTouchEnd);
    }
  };
};

// ----------------------------------------------------------------------
// 3. COMPONENTE REACT CON LA LÓGICA
// ----------------------------------------------------------------------

export default function Game() {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { t } = useTranslation();

  // Inyectar los estilos CSS encapsulados
  useMemo(() => {
    const styleTag = document.createElement('style');
    styleTag.innerHTML = UISTYLES;
    document.head.appendChild(styleTag);
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []);

  // Inicializar/limpiar juego
  useEffect(() => {
    if (canvasRef.current) {
      const cleanup = startGame(canvasRef.current, navigate);
      return cleanup;
    }
  }, [navigate]);

  return (
    <>
      {/* 4. ESTRUCTURA HTML/UI */}
      <section className="gameRoot">
        <div className="gameHeader">
          <div><b>{t("appGame.title")}</b> 🚀 {t("appGame.tagline")}</div>
          <div id="hud" style={{ fontSize: "25px" }}>
            {t("hudGame.points")}: 0 · {t("hudGame.best")}: 0 · {t("hudGame.lives")}: ❤️❤️❤️❤️❤️ · {t("hudGame.level")}: 1
          </div>
        </div>

        <div className="gamePanel">
          <button className="btn" id="btnRestart">Reiniciar</button>
          <button className="btn" id="btnHelp">¿Cómo jugar?</button>
          <button className="btn btn-exit" id="btnExit" title="Salir (ESC)">Salir</button>
        </div>

        <div className="gameTouch" id="touchCtrls" style={{ display: 'none' }}>
          <div className="pad" data-dir="-1">⟵</div>
          <div className="pad shoot" id="shootBtn">DISPARAR</div>
          <div className="pad" data-dir="1">⟶</div>
        </div>

        <div className="banner" id="banner"></div>

        <div id="intro" className="intro-backdrop hidden">
          <div className="intro-card">
            <h1>{t("introGame.title")}</h1>
            <div className="intro-grid">
              <section className="intro-section">
                <h2>{t("introGame.summaryTitle")}</h2>
                <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.55 }}>
                  La misión <b>DART</b> utilizó la técnica del <b>impacto cinético</b>, que consiste en estrellar intencionalmente una nave espacial
                  contra un asteroide para alterar ligeramente su velocidad y, con el tiempo, su trayectoria.
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.55 }}>
                  <b>Funcionó</b>: la trayectoria se desvió, mostrando que, con tiempo, podemos evitar que una roca peligrosa nos visite. 🌍🚀
                </p>
                <p style={{ margin: '6px 0 0', fontSize: '14px', lineHeight: 1.55 }}>
                  Mientras antes actúes, más fácil es desviar el asteroide.
                </p>
                <ul className="intro-list">
                  <li><span className="kbd">←</span>/<span className="kbd">→</span> mover</li>
                  <li><span className="kbd">Espacio</span> disparar</li>
                  <li><span className="kbd">R</span> reiniciar · <span className="kbd">H</span> ayuda · <span className="kbd">P</span> pausar · <span className="kbd">ESC</span> salir</li>
                </ul>
              </section>
              <section className="intro-section">
                <h2>Consejos para jugar</h2>
                <ul className="intro-list">
                  <li><b>Anticípate:</b> dispara cuando el asteroide está alto; tendrás más intentos.</li>
                  <li><b>Colócate debajo</b> de su trayectoria y muévete lo justo (ahorras tiempo).</li>
                  <li><b>Ritmo de disparo:</b> la nave tiene un pequeño enfriamiento; no martilles a lo loco.</li>
                  <li><b>Prioriza el peligro:</b> si uno va muy centrado hacia la Tierra, ese va primero.</li>
                  <li><b>Relájate y disfruta:</b> si fallás, reiniciás y ¡a la otra sale mejor! 😉</li>
                </ul>
              </section>
            </div>
            <div className="intro-actions">
              <button className="btn-cta" id="btnPlay">¡Jugar!</button>
              <button className="btn" id="btnExitIntro">Salir</button>
            </div>
            <div className="intro-footer">
              <label><input type="checkbox" id="chkSkipIntro" /> No mostrar esta intro la próxima vez</label>
              <small>Tip: tienes 5 vidas.</small>
            </div>
          </div>
        </div>

        {/* El Canvas */}
        <canvas id="game" ref={canvasRef}></canvas>
      </section>
    </>
  );
}
