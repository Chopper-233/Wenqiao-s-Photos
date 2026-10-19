(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const data = window.PHOTO_SITE;
  if (!data) return;
  const $ = (id) => document.getElementById(id);
  const state = { lang: 'zh', filter: 'all', photos: [...data.photos], viewerIndex: 0, activeStory: 0, lastFocus: null };
  const strings = {
    zh: {navWork:'作品',navGallery:'影像',navAbout:'关于',navContact:'联系',heroKicker:'光影所至，皆是故事。',heroDescription:'世界很大，而每一帧都是我看见它的方式。',introLead:'我喜欢在路上，<br/>也喜欢<span>按下快门的瞬间。</span>',introText:'那些偶然遇见的光、陌生城市里的片刻安静，以及平凡日子里微小的惊喜——我想用影像把它们留下来。',selectedLabel:'CURATED COLLECTIONS / 精选系列',storiesTitle:'Stories <em>in frames.</em>',storiesSubtitle:'每一组照片，都藏着一段旅程。',galleryLabel:'A VISUAL JOURNAL / 视觉日记',galleryTitle:'A few <em>moments.</em>',galleryHint:'点击照片，慢慢欣赏。',backToTop:'返回顶部 ↗',aboutLabel:'BEHIND THE LENS / 镜头背后',aboutText:'你好，我是李文峤。<br/>摄影对我而言，是一种观察世界的方式。比起宏大的叙事，我更愿意捕捉不经意间的光影、情绪与日常。这里是我的私人影像档案，也是我与世界持续展开的一场对话。',aboutCta:'说声你好',contactLabel:"LET'S CONNECT / 保持联系",contactText:'关于摄影、旅途，或只是想分享一个好故事，欢迎联系我。',emailButton:'给我写信',emailPlaceholder:'邮箱尚未设置 · 可在 config.js 中填写',demoCredit:'示例图片来自 Unsplash · 请替换为本人作品'},
    en: {navWork:'WORK',navGallery:'GALLERY',navAbout:'ABOUT',navContact:'CONTACT',heroKicker:'Some moments are meant to stay.',heroDescription:'One world, countless ways to see it.',introLead:'I love being <em>elsewhere.</em><br/>And the art of <span>noticing.</span>',introText:'Fleeting light, moments of quiet in unfamiliar cities, and the little surprises hidden in ordinary days — photographs help me keep them close.',selectedLabel:'CURATED COLLECTIONS / SELECTED WORK',storiesTitle:'Stories <em>in frames.</em>',storiesSubtitle:'Every photograph begins with a journey.',galleryLabel:'A VISUAL JOURNAL / THE ARCHIVE',galleryTitle:'A few <em>moments.</em>',galleryHint:'Select a frame to take a closer look.',backToTop:'BACK TO TOP ↗',aboutLabel:'BEHIND THE LENS / ABOUT ME',aboutText:"Hello, I'm Li Wenqiao.<br/>For me, photography is a way of observing the world. More than grand narratives, I'm drawn to the fleeting light, quiet emotions, and small details of everyday life. This is a personal visual archive — an ongoing conversation with the world.",aboutCta:'SAY HELLO',contactLabel:"LET'S CONNECT / GET IN TOUCH",contactText:'For photography, travels, or simply a good story — I would love to hear from you.',emailButton:'WRITE TO ME',emailPlaceholder:'Email not set · Edit config.js to add yours',demoCredit:'Demo imagery from Unsplash · Replace with your photos'}
  };
  const escapeHTML = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const photo = (src) => src || '';
  function notify(message){ const toast=$('toast');toast.textContent=message;toast.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>toast.classList.remove('show'),3400); }

  $('heroPhoto').src = photo(data.hero);
  $('aboutPhoto').src = photo(data.about);
  if (data.email) $('emailDisplay').textContent = data.email;
  const header = $('siteHeader');
  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 35);
  window.addEventListener('scroll', updateHeader, {passive:true}); updateHeader();

  function renderStories(){
    $('storiesList').innerHTML = data.series.map((s,i) => `<button class="story-row ${i===state.activeStory?'active':''}" type="button" data-story="${i}" aria-label="${escapeHTML(s.title)} / ${escapeHTML(s.zh)}"><span class="story-row-top"><span>${s.number} &nbsp; / &nbsp; ${escapeHTML(s.kind)}</span><span>${escapeHTML(s.period)}</span></span><span class="story-row-bottom"><span><span class="story-title">${escapeHTML(s.title)}</span><span class="story-zh">${escapeHTML(s.zh)}</span></span><span class="story-arrow">↗</span></span></button>`).join('');
    $('storiesList').querySelectorAll('.story-row').forEach(btn => {
      const index=Number(btn.dataset.story);
      btn.addEventListener('mouseenter',()=>setStory(index));
      btn.addEventListener('focus',()=>setStory(index));
      btn.addEventListener('click',()=>{ setStory(index);changeFilter(data.series[index].id);$('gallery').scrollIntoView({behavior:'smooth'}); });
    });
    setStory(state.activeStory,true);
  }
  function setStory(index,immediate=false){
    if(index===state.activeStory && !immediate)return;
    state.activeStory=index;
    $('storiesList').querySelectorAll('.story-row').forEach((b,i)=>b.classList.toggle('active',i===index));
    const series=data.series[index], img=$('storiesPreview');
    const update=()=>{img.src=series.image;img.alt=series.title;img.onload=()=>img.classList.remove('switching');$('previewIndex').textContent=`${String(index+1).padStart(2,'0')} / ${String(data.series.length).padStart(2,'0')}`;$('previewCaption').textContent=series.title.toUpperCase();};
    if(immediate){update();img.classList.remove('switching');} else {img.classList.add('switching');clearTimeout(setStory.timer);setStory.timer=setTimeout(update,155);}
  }

  function visiblePhotos(){return data.photos.filter(p=>state.filter==='all'||p.category===state.filter);}
  function renderGallery(){
    state.photos=visiblePhotos();
    $('galleryCount').textContent=`${String(state.photos.length).padStart(2,'0')} FRAMES`;
    $('galleryGrid').innerHTML=state.photos.map((p,i)=>`<button class="gallery-card" type="button" data-index="${i}" aria-label="查看 ${escapeHTML(p.title)}"><img src="${escapeHTML(p.src)}" alt="${escapeHTML(p.zh || p.title)}（示例摄影）" loading="lazy" decoding="async"/><span class="gallery-card-overlay"></span><span class="gallery-card-label"><span><small>${String(i+1).padStart(2,'0')} / ${escapeHTML(p.category.toUpperCase())}</small><strong>${escapeHTML(state.lang==='zh'?(p.zh||p.title):p.title)}</strong></span><span class="view-arrow">↗</span></span></button>`).join('');
    $('galleryGrid').querySelectorAll('.gallery-card').forEach(btn=>btn.addEventListener('click',()=>openViewer(Number(btn.dataset.index))));
  }
  function changeFilter(category){
    state.filter=category;
    $('galleryFilters').querySelectorAll('button').forEach(btn=>{const active=btn.dataset.filter===category;btn.classList.toggle('active',active);btn.setAttribute('aria-pressed',String(active));});
    renderGallery();
  }
  $('galleryFilters').querySelectorAll('button').forEach(btn=>btn.addEventListener('click',()=>changeFilter(btn.dataset.filter)));

  function translate(lang){
    state.lang=lang;document.documentElement.lang=lang==='zh'?'zh-CN':'en';
    document.querySelectorAll('[data-i18n]').forEach(el=>{const v=strings[lang][el.dataset.i18n];if(v)el.innerHTML=v;});
    $('languageToggle').innerHTML=lang==='zh'?'EN <span>/</span> <b>中</b>':'<b>EN</b> <span>/</span> 中';
    if(data.email)$('emailDisplay').textContent=data.email;
    renderGallery();
    if($('lightbox').classList.contains('open'))displayViewer();
  }
  $('languageToggle').addEventListener('click',()=>translate(state.lang==='zh'?'en':'zh'));

  const menu=$('menuToggle');
  menu.addEventListener('click',()=>{const open=!header.classList.contains('menu-open');header.classList.toggle('menu-open',open);menu.setAttribute('aria-expanded',String(open));});
  $('mainNav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}));
  $('backToTop').addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  $('emailButton').addEventListener('click',()=>{if(data.email){window.location.href=`mailto:${data.email}?subject=${encodeURIComponent('Hello Wenqiao')}`;}else{notify(state.lang==='zh'?'请先在 config.js 的 email 字段填写你的邮箱。':'Add your email in config.js before publishing.');}});

  function openViewer(index){state.viewerIndex=index;state.lastFocus=document.activeElement;$('lightbox').classList.add('open');$('lightbox').setAttribute('aria-hidden','false');document.body.classList.add('locked');displayViewer();$('lightboxClose').focus();}
  function displayViewer(){const p=state.photos[state.viewerIndex];if(!p)return;const img=$('lightboxImage');img.src=p.src;img.alt=state.lang==='zh'?(p.zh||p.title):p.title;$('lightboxCount').textContent=`${String(state.viewerIndex+1).padStart(2,'0')} / ${String(state.photos.length).padStart(2,'0')}`;$('lightboxTitle').textContent=state.lang==='zh'?(p.zh||p.title):p.title;$('lightboxSub').textContent=p.category.toUpperCase()+' / PHOTOGRAPHIC STUDY';}
  function closeViewer(){$('lightbox').classList.remove('open');$('lightbox').setAttribute('aria-hidden','true');document.body.classList.remove('locked');if(state.lastFocus && document.contains(state.lastFocus))state.lastFocus.focus();}
  function moveViewer(direction){state.viewerIndex=(state.viewerIndex+direction+state.photos.length)%state.photos.length;displayViewer();}
  $('lightboxClose').addEventListener('click',closeViewer);$('lightboxPrev').addEventListener('click',()=>moveViewer(-1));$('lightboxNext').addEventListener('click',()=>moveViewer(1));
  $('lightbox').addEventListener('click',(e)=>{if(e.target===$('lightbox')||e.target===$('lightboxImage').parentElement)closeViewer();});
  document.addEventListener('keydown',(e)=>{if($('lightbox').classList.contains('open')){if(e.key==='Escape')closeViewer();else if(e.key==='ArrowRight')moveViewer(1);else if(e.key==='ArrowLeft')moveViewer(-1);else if(e.key==='Tab'){const nodes=[$('lightboxClose'),$('lightboxPrev'),$('lightboxNext')];const current=nodes.indexOf(document.activeElement);if(e.shiftKey&&current===0){e.preventDefault();nodes[nodes.length-1].focus();}else if(!e.shiftKey&&current===nodes.length-1){e.preventDefault();nodes[0].focus();}}} else if(e.key==='Escape'){header.classList.remove('menu-open');menu.setAttribute('aria-expanded','false');}});
  let touchStartX=0;const viewer=$('lightbox');viewer.addEventListener('touchstart',e=>touchStartX=e.changedTouches[0].clientX,{passive:true});viewer.addEventListener('touchend',e=>{const dx=e.changedTouches[0].clientX-touchStartX;if(Math.abs(dx)>65)moveViewer(dx<0?1:-1);},{passive:true});
  if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});},{threshold:.09,rootMargin:'0px 0px -25px 0px'});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));}else document.querySelectorAll('.reveal').forEach(el=>el.classList.add('visible'));
  renderStories();translate('zh');
})();