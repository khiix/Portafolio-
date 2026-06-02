
/* ============================================================
   1. PARTICLE / CONSTELLATION FIELD
   ============================================================ */
(function(){
  const canvas=document.getElementById('stars');
  const ctx=canvas.getContext('2d');
  let w,h,dpr,particles=[],mouse={x:-999,y:-999},scrollY=0;
  const COUNT_BASE=120;

  function resize(){
    dpr=Math.min(window.devicePixelRatio||1,2);
    w=canvas.width=innerWidth*dpr;
    h=canvas.height=innerHeight*dpr;
    canvas.style.width=innerWidth+'px';
    canvas.style.height=innerHeight+'px';
    init();
  }
  function init(){
    const count=Math.round(COUNT_BASE*(innerWidth*innerHeight)/(1440*900));
    particles=[];
    for(let i=0;i<Math.max(50,Math.min(count,180));i++){
      particles.push({
        x:Math.random()*w,y:Math.random()*h,
        vx:(Math.random()-.5)*.18*dpr,vy:(Math.random()-.5)*.18*dpr,
        r:(Math.random()*1.5+.4)*dpr,
        tw:Math.random()*Math.PI*2,
        teal:Math.random()<.25
      });
    }
  }
  function draw(){
    ctx.clearRect(0,0,w,h);
    const mx=mouse.x*dpr,my=(mouse.y)*dpr;
    for(let i=0;i<particles.length;i++){
      const p=particles[i];
      p.x+=p.vx;p.y+=p.vy;p.tw+=.02;
      if(p.x<0)p.x=w;if(p.x>w)p.x=0;
      if(p.y<0)p.y=h;if(p.y>h)p.y=0;
      // gentle mouse repulsion / attraction
      const dx=p.x-mx,dy=p.y-my,dist=Math.hypot(dx,dy);
      if(dist<140*dpr){
        const f=(140*dpr-dist)/(140*dpr);
        p.x+=dx/dist*f*1.2;p.y+=dy/dist*f*1.2;
      }
      const tw=.5+Math.sin(p.tw)*.5;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=p.teal
        ?`rgba(0,229,195,${.35+tw*.45})`
        :`rgba(180,178,220,${.22+tw*.35})`;
      ctx.fill();
    }
    // constellation links
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a=particles[i],b=particles[j];
        const dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
        if(d<120*dpr){
          const o=(1-d/(120*dpr))*.18;
          ctx.strokeStyle=`rgba(108,99,255,${o})`;
          ctx.lineWidth=dpr*.6;
          ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
        }
      }
      // link to cursor
      const a=particles[i];
      const dxm=a.x-mx,dym=a.y-my,dm=Math.hypot(dxm,dym);
      if(dm<160*dpr){
        const o=(1-dm/(160*dpr))*.4;
        ctx.strokeStyle=`rgba(0,229,195,${o})`;
        ctx.lineWidth=dpr*.6;
        ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(mx,my);ctx.stroke();
      }
    }
    requestAnimationFrame(draw);
  }
  addEventListener('resize',resize);
  addEventListener('mousemove',e=>{mouse.x=e.clientX;mouse.y=e.clientY;});
  addEventListener('mouseout',()=>{mouse.x=-999;mouse.y=-999;});
  resize();draw();
})();

/* ============================================================
   2. CUSTOM CURSOR
   ============================================================ */
(function(){
  if(matchMedia('(pointer:coarse)').matches)return;
  const dot=document.querySelector('.cursor-dot');
  const ring=document.querySelector('.cursor-ring');
  let mx=0,my=0,rx=0,ry=0;
  addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    dot.style.transform=`translate(${mx}px,${my}px) translate(-50%,-50%)`;
  });
  function loop(){
    rx+=(mx-rx)*.16;ry+=(my-ry)*.16;
    ring.style.transform=`translate(${rx}px,${ry}px) translate(-50%,-50%)`;
    requestAnimationFrame(loop);
  }
  loop();
  document.addEventListener('mouseover',e=>{
    if(e.target.closest('[data-cursor]'))ring.classList.add('hover');
  });
  document.addEventListener('mouseout',e=>{
    if(e.target.closest('[data-cursor]'))ring.classList.remove('hover');
  });
})();

/* ============================================================
   3. HERO INTRO — typewriter + staged fades
   ============================================================ */
(function(){
  const name="Christian Montes";
  const typed=document.getElementById('typed');
  const caret=document.getElementById('caret');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  function stage(){
    document.getElementById('role').classList.add('in');
    document.getElementById('desc').classList.add('in');
    document.getElementById('actions').classList.add('in');
    document.getElementById('socials').classList.add('in');
    setTimeout(()=>caret.classList.add('hide'),2600);
  }
  if(reduce){typed.textContent=name;stage();return;}
  let i=0;
  function type(){
    if(i<=name.length){
      typed.textContent=name.slice(0,i);
      i++;
      setTimeout(type,72+Math.random()*40);
    }else{stage();}
  }
  setTimeout(type,500);
})();

/* ============================================================
   4. NAV — scroll state, scrollspy, mobile, smooth offset
   ============================================================ */
(function(){
  const nav=document.getElementById('nav');
  const links=[...document.querySelectorAll('#navLinks a[href^="#"]')];
  const burger=document.getElementById('burger');
  const menu=document.getElementById('mobileMenu');

  addEventListener('scroll',()=>{
    nav.classList.toggle('scrolled',scrollY>40);
  });

  burger.addEventListener('click',()=>{
    burger.classList.toggle('open');
    menu.classList.toggle('open');
    document.body.style.overflow=menu.classList.contains('open')?'hidden':'';
  });
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
    burger.classList.remove('open');menu.classList.remove('open');
    document.body.style.overflow='';
  }));

  // scrollspy
  const sections=links.map(l=>document.querySelector(l.getAttribute('href'))).filter(Boolean);
  const spy=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        const id='#'+e.target.id;
        links.forEach(l=>l.classList.toggle('active',l.getAttribute('href')===id));
      }
    });
  },{rootMargin:'-45% 0px -50% 0px'});
  sections.forEach(s=>spy.observe(s));
})();

/* ============================================================
   5. SCROLL REVEAL + tech pill stagger + counters
   ============================================================ */
(function(){
  const io=new IntersectionObserver(es=>{
    es.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        // pill stagger
        if(e.target.querySelector&&e.target.matches('.tech-cat')){
          const pills=e.target.querySelectorAll('.pill');
          pills.forEach((p,i)=>setTimeout(()=>p.classList.add('in'),i*60));
        }
        // counters
        const counters=e.target.querySelectorAll?e.target.querySelectorAll('[data-count]'):[];
        counters.forEach(c=>animateCount(c));
        io.unobserve(e.target);
      }
    });
  },{threshold:.18,rootMargin:'0px 0px -8% 0px'});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  document.querySelectorAll('.tech-cat').forEach(el=>io.observe(el));

  function animateCount(el){
    const target=+el.dataset.count;let cur=0;
    const step=Math.max(1,Math.ceil(target/24));
    const t=setInterval(()=>{
      cur+=step;
      if(cur>=target){cur=target;clearInterval(t);}
      el.textContent=cur;
    },40);
  }
})();

/* ============================================================
   6. HERO PARALLAX
   ============================================================ */
(function(){
  const hero=document.querySelector('.hero-inner');
  const stars=document.getElementById('stars');
  addEventListener('scroll',()=>{
    const y=scrollY;
    if(y<innerHeight){
      hero.style.transform=`translateY(${y*0.18}px)`;
      hero.style.opacity=Math.max(0,1-y/(innerHeight*0.8));
      stars.style.transform=`translateY(${y*0.06}px)`;
    }
  });
})();

/* ============================================================
   7. COPY EMAIL
   ============================================================ */
(function(){
  const btn=document.getElementById('emailBtn');
  const hint=document.getElementById('copyHint');
  const toast=document.getElementById('toast');
  const email='cristiandarien100@gmail.com';
  btn.addEventListener('click',async()=>{
    try{await navigator.clipboard.writeText(email);}
    catch(e){
      const ta=document.createElement('textarea');ta.value=email;
      document.body.appendChild(ta);ta.select();document.execCommand('copy');ta.remove();
    }
    btn.classList.add('copied');
    hint.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m5 13 4 4L19 7"/></svg> Copiado';
    toast.classList.add('show');
    setTimeout(()=>{
      toast.classList.remove('show');btn.classList.remove('copied');
      hint.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg> Copiar';
    },2200);
  });
})();

/* image fallback for broken devicons */
document.querySelectorAll('.pill img').forEach(img=>{
  img.addEventListener('error',()=>{img.style.display='none';});
});
