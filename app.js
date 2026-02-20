/* app.js (FINAL) */

/* ===== Helpers ===== */
const $ = (q, el=document) => el.querySelector(q);
const $$ = (q, el=document) => [...el.querySelectorAll(q)];

/* ===== Year ===== */
$("#year").textContent = new Date().getFullYear();

/* ===== Custom Cursor ===== */
const cursor = $(".cursor");
const dot = $(".cursor-dot");
let mouseX = window.innerWidth/2, mouseY = window.innerHeight/2;
let curX = mouseX, curY = mouseY;

window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  dot.style.left = mouseX + "px";
  dot.style.top  = mouseY + "px";
});

function animateCursor(){
  curX += (mouseX - curX) * 0.12;
  curY += (mouseY - curY) * 0.12;
  cursor.style.left = curX + "px";
  cursor.style.top  = curY + "px";
  requestAnimationFrame(animateCursor);
}
animateCursor();

$$("a, button, .card").forEach(el => {
  el.addEventListener("mouseenter", () => {
    cursor.style.boxShadow = "0 0 55px rgba(0,240,255,.30)";
    cursor.style.borderColor = "rgba(0,240,255,.55)";
  });
  el.addEventListener("mouseleave", () => {
    cursor.style.boxShadow = "0 0 24px rgba(0,240,255,.25)";
    cursor.style.borderColor = "rgba(0,240,255,.35)";
  });
});

/* ===== Reveal on scroll ===== */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});

function observeReveals(){
  $$(".reveal").forEach(el => {
    el.classList.remove("is-visible");
    observer.observe(el);
  });
}
observeReveals();

/* ===== Parallax for floating layer ===== */
const floatLayer = document.querySelector(".float-layer");
window.addEventListener("mousemove", (e) => {
  if (!floatLayer) return;
  const x = (e.clientX / window.innerWidth  - 0.5) * 10;
  const y = (e.clientY / window.innerHeight - 0.5) * 10;
  floatLayer.style.transform = `translate(${x}px, ${y}px)`;
});

/* ===== Parallax for glass frame (cinematic tilt) ===== */
const frame = document.querySelector(".glass-frame");
window.addEventListener("mousemove", (e) => {
  if (!frame) return;
  const x = (e.clientX / window.innerWidth - 0.5) * 8;
  const y = (e.clientY / window.innerHeight - 0.5) * 8;
  frame.style.transform = `rotateX(${-y}deg) rotateY(${x}deg)`;
});

/* ===== 3D Tilt effect for cards ===== */
function bindTilt(){
  $$(".tilt").forEach(el => {
    let rect;
    el.addEventListener("mouseenter", () => {
      rect = el.getBoundingClientRect();
      el.style.transition = "transform .12s ease, box-shadow .25s ease";
    });

    el.addEventListener("mousemove", (e) => {
      if (!rect) return;
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const dx = (x - cx) / cx;
      const dy = (y - cy) / cy;

      const tiltX = (-dy * 6).toFixed(2);
      const tiltY = (dx * 8).toFixed(2);

      el.style.transform = `perspective(900px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-2px)`;
      el.style.boxShadow = "0 0 40px rgba(0,240,255,.10), 0 12px 45px rgba(0,0,0,.35)";
    });

    el.addEventListener("mouseleave", () => {
      el.style.transition = "transform .25s ease, box-shadow .25s ease";
      el.style.transform = "none";
      el.style.boxShadow = "";
    });
  });
}
bindTilt();

/* ===== Language System (EN/AR) ===== */
const i18n = {
  en: {
    nav_portfolio: "Portfolio",
    nav_services: "Services",
    nav_about: "About",
    nav_contact: "Contact",

    hero_kicker: "Dark Tech • Creative Portfolio",
    hero_name: "Mohamed Eid",
    hero_role: "Graphic Designer & Video Editor",
    hero_desc: "I craft powerful brand identities and interactive visual experiences that help businesses stand out and grow.",
    hero_exp: "5+ Years Experience",
    hero_focus: "Branding • Social • UI/UX • Editing",
    scroll: "Scroll",

    btn_portfolio: "View Portfolio",
    btn_whatsapp: "WhatsApp",
    btn_call: "Call",
    btn_behance: "Behance",

    float_title: "Available for projects",
    float_sub: "Branding • UI/UX • Video",

    portfolio_title: "Featured Work",
    portfolio_desc: "Selected projects across UI/UX, branding, social media, and video editing.",
    tag_featured: "Featured",
    tag_social: "Social",
    tag_brand: "Branding",
    tag_video: "Video",

    open_inside: "Open Inside",
    open_external: "Open External",
    view_more: "View more work",
    back: "Back",

    hover_hint: "Hover me",
    click_hint: "Click anywhere",

    services_title: "Services",
    services_desc: "Clear deliverables, fast communication, premium output.",
    s1_title: "Graphic Design",
    s1_1: "Brand Identity • Logos • Guidelines",
    s1_2: "Social Media Campaign Designs",
    s1_3: "Posters • Ads • Print",

    s2_title: "Video Editing",
    s2_1: "Reels / Shorts / TikTok",
    s2_2: "YouTube Editing",
    s2_3: "Clean Motion & Transitions",

    s3_title: "UI/UX",
    s3_1: "Mobile App UI Design",
    s3_2: "UX Flow + Clean Hierarchy",
    s3_3: "Modern Dark-Tech Style",

    about_title: "About",
    about_desc: "A creative designer who cares about details and performance.",
    about_name: "Mohamed Eid AbdEl-Aziz",
    about_text: "Graphic Designer & Video Editor with 5 years of experience. I build strong visuals, consistent systems, and edits that feel premium.",
    stat_years: "Years",
    stat_uiux: "UI/UX",
    stat_video: "Video",

    contact_title: "Contact",
    contact_desc: "Let’s build something that looks premium and performs.",
    contact_name_label: "Name",
    contact_phone_label: "Phone",
    rating_label: "Rating",

    contact_note_title: "Fast Response",
    contact_note_text: "Send your idea on WhatsApp and I’ll reply with the best direction, timeline, and a clear quote.",
    back_top: "Back to top",

    project_overview: "Overview",
    project_highlights: "Highlights",
    project_tools: "Tools"
  },

  ar: {
    nav_portfolio: "الأعمال",
    nav_services: "الخدمات",
    nav_about: "عني",
    nav_contact: "تواصل",

    hero_kicker: "دارك تيك • بورتفوليو إبداعي",
    hero_name: "محمد عيد",
    hero_role: "مصمم جرافيك وفيديو إيديتور",
    hero_desc: "أصمم هويات بصرية وتجارب مرئية تفاعلية تساعد البراند يظهر بشكل أقوى ويحقق نتائج.",
    hero_exp: "خبرة +5 سنوات",
    hero_focus: "هوية • سوشيال • UI/UX • مونتاج",
    scroll: "انزل",

    btn_portfolio: "مشاهدة الأعمال",
    btn_whatsapp: "واتساب",
    btn_call: "اتصال",
    btn_behance: "بيهانس",

    float_title: "متاح لمشاريع جديدة",
    float_sub: "هوية • UI/UX • فيديو",

    portfolio_title: "أعمال مختارة",
    portfolio_desc: "مشاريع مختارة في UI/UX والهوية والسوشيال والمونتاج.",
    tag_featured: "مميز",
    tag_social: "سوشيال",
    tag_brand: "هوية",
    tag_video: "فيديو",

    open_inside: "فتح داخل الموقع",
    open_external: "فتح الرابط",
    view_more: "شوف أعمال أكتر",
    back: "رجوع",

    hover_hint: "جرّب تحريك الماوس",
    click_hint: "اضغط في أي مكان",

    services_title: "الخدمات",
    services_desc: "تسليمات واضحة، تواصل سريع، ونتيجة بروفيشنال.",
    s1_title: "تصميم جرافيك",
    s1_1: "هوية بصرية • لوجوهات • دليل استخدام",
    s1_2: "تصميمات حملات سوشيال",
    s1_3: "بوسترات • إعلانات • مطبوعات",

    s2_title: "مونتاج فيديو",
    s2_1: "رييلز / شورتس / تيك توك",
    s2_2: "مونتاج يوتيوب",
    s2_3: "انتقالات نظيفة ولمسات موشن",

    s3_title: "UI/UX",
    s3_1: "تصميم واجهات موبايل",
    s3_2: "تدفق استخدام + ترتيب محتوى",
    s3_3: "ستايل دارك تيك عصري",

    about_title: "عني",
    about_desc: "مصمم يهتم بالتفاصيل والأداء.",
    about_name: "محمد عيد عبدالعزيز",
    about_text: "مصمم جرافيك وفيديو إيديتور بخبرة 5 سنوات. أقدّم تصميمات قوية، أنظمة متناسقة، ومونتاج بلمسة premium.",
    stat_years: "سنوات",
    stat_uiux: "UI/UX",
    stat_video: "فيديو",

    contact_title: "تواصل",
    contact_desc: "خلّينا نعمل حاجة شكلها Premium وأداؤها قوي.",
    contact_name_label: "الاسم",
    contact_phone_label: "رقم الهاتف",
    rating_label: "التقييم",

    contact_note_title: "رد سريع",
    contact_note_text: "ابعت فكرتك على واتساب وهرد عليك بأفضل اتجاه وخطة واضحة وتسعير مناسب.",
    back_top: "ارجع للأعلى",

    project_overview: "نظرة عامة",
    project_highlights: "مميزات",
    project_tools: "الأدوات"
  }
};

let currentLang = "en";
const langToggle = $("#langToggle");
const langLabel  = $("#langLabel");

function applyLang(lang){
  currentLang = lang;

  const html = document.documentElement;
  if(lang === "ar"){
    html.lang = "ar";
    html.dir = "rtl";
    document.body.classList.add("rtl");
    langLabel.textContent = "AR";
  } else {
    html.lang = "en";
    html.dir = "ltr";
    document.body.classList.remove("rtl");
    langLabel.textContent = "EN";
  }

  $$("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    const value = i18n[lang][key];
    if(typeof value === "string") el.textContent = value;
  });

  localStorage.setItem("lang", lang);

  if (document.body.classList.contains("project-mode")) {
    const slug = (location.hash || "").split("/")[2];
    if (slug) renderProject(slug);
  }
}

langToggle.addEventListener("click", () => {
  applyLang(currentLang === "en" ? "ar" : "en");
});
applyLang(localStorage.getItem("lang") || "en");

/* ===== ⭐ Rating (5 Stars) ===== */
(function () {
  const wrap = document.getElementById("rating");
  const txt  = document.getElementById("ratingText");
  if (!wrap || !txt) return;

  const stars = [...wrap.querySelectorAll(".star")];
  const KEY = "site_rating";

  const clamp = (n) => Math.max(0, Math.min(5, n));

  function paint(val){
    stars.forEach(btn => {
      const s = Number(btn.dataset.star || 0);
      btn.classList.toggle("is-on", s <= val);
    });
    txt.textContent = `${val}/5`;
  }

  let value = clamp(Number(localStorage.getItem(KEY) || 0));
  paint(value);

  stars.forEach(btn => {
    btn.addEventListener("click", () => {
      value = clamp(Number(btn.dataset.star || 0));
      localStorage.setItem(KEY, String(value));
      paint(value);
    });

    btn.addEventListener("mouseenter", () => paint(clamp(Number(btn.dataset.star || 0))));
    btn.addEventListener("mouseleave", () => paint(value));
  });
})();

/* ===== Projects Data ===== */
const projects = {
  "islamic-app": {
    chip: { en: "UI/UX", ar: "UI/UX" },
    title: { en: "Islamic Mobile App UI/UX Design", ar: "تصميم تطبيق إسلامي UI/UX" },
    summary: { en: "A calm, modern mobile app UI with clear hierarchy and smooth navigation.", ar: "واجهات موبايل هادئة وعصرية بتنظيم واضح وتجربة استخدام سلسة." },
    overview: {
      en: "This project focuses on delivering an Islamic-themed mobile experience that feels premium, minimal, and easy to use. The screens follow a clean layout system with balanced spacing and modern components.",
      ar: "المشروع يركز على تجربة موبايل بطابع إسلامي بشكل Premium وبسيط وسهل الاستخدام. الواجهات مبنية على نظام Layout نظيف مع مساحات مريحة وترتيب محتوى واضح."
    },
    highlights: {
      en: ["Clean hierarchy and readable typography", "Consistent components and spacing system", "Calming color mood with dark-tech finish"],
      ar: ["ترتيب محتوى واضح وخطوط مقروءة", "مكونات متناسقة ونظام مسافات ثابت", "مود ألوان هادئ بلمسة Dark Tech"]
    },
    tools: { en: ["Figma / Adobe XD", "Illustrator", "Photoshop"], ar: ["Figma / Adobe XD", "Illustrator", "Photoshop"] },
    external: "https://www.behance.net/gallery/241383899/Islamic-Mobile-App-UIUX-Design?platform=direct"
  },

  "social-designs": {
    chip: { en: "Social", ar: "سوشيال" },
    title: { en: "Social Media Designs", ar: "تصميمات سوشيال ميديا" },
    summary: { en: "Scroll-stopping visuals designed for engagement and clarity.", ar: "تصميمات قوية لرفع التفاعل مع وضوح بصري عالي." },
    overview: { en: "A set of social media designs optimized for performance: strong hierarchy, bold contrast, and platform-friendly layout.", ar: "مجموعة تصميمات سوشيال متجهّزة للأداء: ترتيب واضح، كونتراست قوي، وتنسيق مناسب للمنصات." },
    highlights: { en: ["Campaign-ready layouts", "Clear messaging and emphasis", "Fast variations for A/B testing"], ar: ["تصميمات مناسبة للحملات", "رسالة واضحة وتركيز بصري", "تنويعات سريعة للاختبار"] },
    tools: { en: ["Photoshop", "Illustrator"], ar: ["Photoshop", "Illustrator"] },
    external: "https://www.behance.net/gallery/241397895/Social-media-designs-"
  },

  "home-maintenance-identity": {
    chip: { en: "Branding", ar: "هوية" },
    title: { en: "Visual Identity (Home Maintenance)", ar: "هوية بصرية (شركة صيانة منازل)" },
    summary: { en: "A consistent identity system with clear brand elements and applications.", ar: "نظام هوية متناسق بعناصر واضحة وتطبيقات عملية." },
    overview: { en: "Brand identity work including core visual elements and consistent applications that keep the brand professional across touchpoints.", ar: "هوية بصرية تشمل العناصر الأساسية وتطبيقات متناسقة تخلي البراند شكله احترافي في كل الاستخدامات." },
    highlights: { en: ["Logo + brand direction", "Consistent color and typography system", "Practical mockups and usage"], ar: ["توجيه بصري ولوجو", "نظام ألوان وخطوط متناسق", "تطبيقات واستخدامات عملية"] },
    tools: { en: ["Illustrator", "Photoshop"], ar: ["Illustrator", "Photoshop"] },
    external: "https://www.behance.net/gallery/212070967/Visual-identity-for-a-home-maintenance-company?platform=direct"
  },

  "video-1": {
    chip: { en: "Video", ar: "فيديو" },
    title: { en: "Video Editing Project", ar: "مشروع مونتاج فيديو" },
    summary: { en: "Smooth rhythm, clean cuts, and modern pacing.", ar: "إيقاع سلس، قصّات نظيفة، وسرعة مناسبة." },
    overview: { en: "A video edit focusing on timing, flow, and clean transitions. Presented as an internal project page with an external view link.", ar: "مونتاج يركز على التوقيت وتدفق المشاهد وانتقالات نظيفة. مع رابط خارجي للمشاهدة." },
    highlights: { en: ["Clean pacing", "Modern transitions", "Polished output"], ar: ["إيقاع مضبوط", "انتقالات حديثة", "نتيجة نهائية نظيفة"] },
    tools: { en: ["Premiere Pro / After Effects"], ar: ["Premiere Pro / After Effects"] },
    external: "https://drive.google.com/file/d/1p26SaBs22qkHGYNzM471NdWufxmAAQ8_/view?usp=drive_link"
  },

  "video-2": {
    chip: { en: "Video", ar: "فيديو" },
    title: { en: "Video Editing Project", ar: "مشروع مونتاج فيديو" },
    summary: { en: "Dynamic flow with a tech-inspired finish.", ar: "حركة ديناميكية بلمسة Tech احترافية." },
    overview: { en: "A second video project highlighting energy, rhythm, and creative finishing touches.", ar: "مشروع فيديو ثاني يوضح الطاقة والإيقاع مع لمسات ختامية إبداعية." },
    highlights: { en: ["Dynamic cuts", "Strong rhythm", "Clean export"], ar: ["قصّات ديناميكية", "إيقاع قوي", "تصدير نهائي نظيف"] },
    tools: { en: ["Premiere Pro / After Effects"], ar: ["Premiere Pro / After Effects"] },
    external: "https://drive.google.com/file/d/1jNVUvRU5IThKgl6orn1a-GvDScBICedD/view?usp=drive_link"
  }
};

/* ===== Internal Project Page Rendering ===== */
const projectSection = $("#project");
const projectChip = $("#projectChip");
const projectTitle = $("#projectTitle");
const projectSummary = $("#projectSummary");
const projectOverview = $("#projectOverview");
const projectHighlights = $("#projectHighlights");
const projectTools = $("#projectTools");
const projectExternal = $("#projectExternal");

function setProjectMode(on){
  if(on){
    document.body.classList.add("project-mode");
    projectSection.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    document.body.classList.remove("project-mode");
    projectSection.hidden = true;
  }
}

function renderProject(slug){
  const p = projects[slug];
  if(!p) return;

  const lang = currentLang;
  projectChip.textContent = p.chip[lang] || "Project";
  projectTitle.textContent = p.title[lang] || "Project";
  projectSummary.textContent = p.summary[lang] || "";
  projectOverview.textContent = p.overview[lang] || "";

  projectHighlights.innerHTML = "";
  (p.highlights[lang] || []).forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    projectHighlights.appendChild(li);
  });

  projectTools.innerHTML = "";
  (p.tools[lang] || []).forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    projectTools.appendChild(li);
  });

  projectExternal.href = p.external;
}

function openProject(slug){
  location.hash = `#project/${slug}`;
}
function closeProject(){
  location.hash = "#portfolio";
}

/* Open by clicking card or button */
$$(".card").forEach(card => {
  card.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-open-project]");
    const slug = btn?.getAttribute("data-open-project") || card.getAttribute("data-project");
    if (slug) openProject(slug);
  });
});

/* Back button */
$$("[data-back]").forEach(btn => btn.addEventListener("click", closeProject));

/* ===== Router (hash) ===== */
function handleRoute(){
  const hash = location.hash || "#home";
  const parts = hash.replace("#","").split("/");

  if(parts[0] === "project" && parts[1]){
    const slug = parts[1];
    setProjectMode(true);
    renderProject(slug);
    observeReveals();
    return;
  }

  setProjectMode(false);

  const targetId = parts[0];
  const el = document.getElementById(targetId);
  if(el){
    setTimeout(() => el.scrollIntoView({ behavior: "smooth", block: "start" }), 10);
  }
}

window.addEventListener("hashchange", handleRoute);
handleRoute();

/* =========================================================
   ✅ VOICE PLAYER (FINAL UPGRADE)
========================================================= */
(function () {
  const audio = document.getElementById("voiceAudio");
  const canvas = document.getElementById("waveCanvas");
  if (!audio || !canvas) return;

  const ctx = canvas.getContext("2d");

  const vPlay = document.getElementById("vPlay");
  const vIcon = document.getElementById("vIcon");
  const vBack = document.getElementById("vBack");
  const vFwd  = document.getElementById("vFwd");
  const vDown = document.getElementById("vDown");
  const vUp   = document.getElementById("vUp");
  const vVol  = document.getElementById("vVol");
  const vCur  = document.getElementById("vCur");
  const vDur  = document.getElementById("vDur");

  const clamp01 = (v) => Math.max(0, Math.min(1, v));

  const fmt = (s) => {
    if (!isFinite(s)) return "0:00";
    s = Math.max(0, Math.floor(s));
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${String(r).padStart(2, "0")}`;
  };

  audio.volume = clamp01(Number(vVol?.value ?? 0.85));

  let ac = null;
  let analyser = null;
  let data = null;

  function initWebAudio() {
    if (ac) return;
    ac = new (window.AudioContext || window.webkitAudioContext)();
    analyser = ac.createAnalyser();
    analyser.fftSize = 1024;
    data = new Uint8Array(analyser.frequencyBinCount);

    const src = ac.createMediaElementSource(audio);
    src.connect(analyser);
    analyser.connect(ac.destination);
  }

  async function safePlay() {
    initWebAudio();
    try {
      if (ac && ac.state === "suspended") await ac.resume();
      await audio.play();
    } catch (e) {
      console.warn("Audio play failed:", e);
      alert("الصوت لم يعمل. تأكد أن assets/voice.mp3 موجود، ويفضل تشغيل الموقع بسيرفر (Live Server).");
    }
  }

  function setPlayUI() {
    vIcon.textContent = audio.paused ? "▶" : "⏸";
  }

  vPlay?.addEventListener("click", async () => {
    if (audio.paused) await safePlay();
    else audio.pause();
    setPlayUI();
  });

  vBack?.addEventListener("click", () => {
    audio.currentTime = Math.max(0, (audio.currentTime || 0) - 10);
  });

  vFwd?.addEventListener("click", () => {
    const dur = audio.duration || 0;
    audio.currentTime = Math.min(dur || Infinity, (audio.currentTime || 0) + 10);
  });

  vDown?.addEventListener("click", () => {
    audio.volume = clamp01(audio.volume - 0.1);
    if (vVol) vVol.value = String(audio.volume);
  });

  vUp?.addEventListener("click", () => {
    audio.volume = clamp01(audio.volume + 0.1);
    if (vVol) vVol.value = String(audio.volume);
  });

  vVol?.addEventListener("input", () => {
    audio.volume = clamp01(Number(vVol.value));
  });

  audio.addEventListener("play", setPlayUI);
  audio.addEventListener("pause", setPlayUI);
  audio.addEventListener("ended", setPlayUI);

  audio.addEventListener("loadedmetadata", () => {
    vDur.textContent = fmt(audio.duration || 0);
  });

  canvas.addEventListener("click", (e) => {
    const rect = canvas.getBoundingClientRect();
    const pct = clamp01((e.clientX - rect.left) / rect.width);
    const dur = audio.duration || 0;
    if (dur) audio.currentTime = dur * pct;
  });

  function draw() {
    requestAnimationFrame(draw);

    const w = canvas.clientWidth;
    const h = canvas.clientHeight;

    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    ctx.clearRect(0, 0, w, h);

    vCur.textContent = fmt(audio.currentTime || 0);
    vDur.textContent = fmt(audio.duration || 0);

    const bars = 64;
    const gap = 3;
    const totalGap = gap * (bars - 1);
    const barW = Math.max(2, Math.floor((w - totalGap) / bars));
    const mid = h * 0.5;
    const maxAmp = h * 0.42;

    if (analyser) analyser.getByteFrequencyData(data);

    for (let i = 0; i < bars; i++) {
      const idx = analyser ? Math.floor(i * (data.length / bars)) : i;
      const raw = analyser ? data[idx] : 40;

      const v = raw / 255;
      const amp = Math.max(0.08, v) * maxAmp;

      const x = i * (barW + gap);

      const grad = ctx.createLinearGradient(0, mid - amp, 0, mid + amp);
      grad.addColorStop(0, "rgba(0,240,255,.95)");
      grad.addColorStop(1, "rgba(20,112,142,.70)");

      ctx.fillStyle = grad;
      ctx.fillRect(x, mid - amp, barW, amp * 2);
    }

    const dur = audio.duration || 0;
    const cur = audio.currentTime || 0;
    const pct = dur ? cur / dur : 0;
    const px = Math.floor(w * pct);

    ctx.fillStyle = "rgba(203,183,132,.55)";
    ctx.fillRect(px, 0, 2, h);
  }

  setPlayUI();
  draw();
})();