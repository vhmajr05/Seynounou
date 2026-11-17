/* =====================================================
   À PERSONNALISER : CONFIGURATION : modifie ici les textes des cartes,
   la galerie et la date. Le reste du texte est dans index.html
   ===================================================== */
const CONFIG = {
  // Anniversaire 21 nov. 2026 à minuit, heure de Dakar (UTC+0 toute l'année)
  target: "2026-11-21T00:00:00Z",
  // À PERSONNALISER : ta chronologie (ajoute/supprime des étapes librement)
  timeline: [
    {date: "Date à personnaliser", title: "Premier souvenir", text: "Écris ici ce souvenir, avec tes propres mots."},
    {date: "Date à personnaliser", title: "Deuxième souvenir", text: "Écris ici ce souvenir, avec tes propres mots."},
    {date: "Date à personnaliser", title: "Troisième souvenir", text: "Écris ici ce souvenir, avec tes propres mots."}
  ],
  // À PERSONNALISER : message de la carte « Il me reste quelque chose à te dire »
  secretCard: "Écris ici ton message personnel, avec tes propres mots.",
  // À PERSONNALISER : message révélé par « Découvrir le dernier cadeau »
  finalGift: "Écris ici ton dernier message, avec tes propres mots.",
  // À PERSONNALISER : message caché révélé quand les 21 cartes sont ouvertes
  secret: "Tu as ouvert les 21 cartes. Il y en a une dernière, la plus importante : merci d'être toi. ❤️",
  reasons: [ // À PERSONNALISER : remplace chaque phrase par ta vraie raison (21 au total)
    "Ton sourire éclaire mes journées.","Ta douceur me fait du bien.","Ta force m'inspire.",
    "Tu sais m'écouter.","Ton rire est contagieux.","Ta bienveillance se remarque.",
    "Tu as une belle sensibilité.","Tu me pousses à avancer.","Ta présence me rassure.",
    "Ta façon de voir la vie.","Ton courage.","Ton élégance naturelle.",
    "Ta patience avec moi.","Ta curiosité.","Tes petites attentions.",
    "Ta sincérité.","Tes rêves et ton ambition.","Ta façon de rendre l'ordinaire plus beau.",
    "Ta loyauté.","Ta voix, quand tu parles de ce que tu aimes.","Simplement parce que tu es toi."
  ],
  gallery: [ // ajoute une ligne par photo (dépose l'image dans )
    {src:"photo-1.jpg",caption:"Un souvenir précieux"},
    {src:"photo-2.jpg",caption:"Légende de la photo 2"} // À PERSONNALISER
  ]
};

const $ = id => document.getElementById(id);
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Photos manquantes -> cadre élégant ---------- */
function placeholder(img){
  const d = document.createElement("div");
  d.className = "ph"; d.textContent = img.dataset.ph || "Ajoute ta photo"; d.dataset.missing = "1";
  img.replaceWith(d);
}
document.querySelectorAll("img[data-ph]").forEach(i => { i.onerror = () => placeholder(i); if (i.complete && !i.naturalWidth) placeholder(i); });

/* ---------- Ouverture de l'enveloppe ---------- */
$("openBtn").addEventListener("click", () => {
  $("openBtn").disabled = true;
  $("env").classList.add("open");
  setTimeout(() => {
    $("intro").classList.add("gone");
    document.body.classList.remove("locked");
    $("site").hidden = false; $("player").hidden = false;
    const t = $("title"), words = t.textContent.split(" ");
    t.innerHTML = words.map((w, i) => `<span class="w" style="animation-delay:${i * .35}s">${w}</span>`).join(" ");
    scrollTo(0, 0); watch(); burst(18); confetti(100);
  }, 1700);
});

/* ---------- Révélations au scroll + lettre progressive ---------- */
function watch(){
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in"); io.unobserve(e.target);
    if (e.target.id === "letter") e.target.querySelectorAll("p").forEach((p, i) => setTimeout(() => p.classList.add("in"), i * 1100));
  }), {threshold: .15});
  document.querySelectorAll(".reveal").forEach(el => io.observe(el));
}

/* ---------- 21 cartes ---------- */
let opened = 0;
CONFIG.reasons.slice(0, 21).forEach((txt, i) => {
  const n = String(i + 1).padStart(2, "0");
  const b = document.createElement("button");
  b.className = "card"; b.setAttribute("aria-label", "Carte " + n);
  b.innerHTML = `<span class="face front">${n}</span><span class="face back">${txt}</span>`;
  b.setAttribute("aria-pressed", "false");
  b.onclick = () => {
    const on = b.classList.toggle("on"); b.setAttribute("aria-pressed", on);
    if (on && !b.dataset.seen) { // on ne compte chaque carte qu'une fois
      b.dataset.seen = 1; const c = $("count"); c.textContent = ++opened;
      c.classList.remove("pop"); void c.offsetWidth; c.classList.add("pop");
      $("barfill").style.width = (opened / 21 * 100) + "%"; $("barfill").parentNode.setAttribute("aria-valuenow", opened);
      if (opened === 21) { // célébration finale
        confetti(140); burst(40); $("cards").classList.add("done");
        const s = $("secret"); s.textContent = CONFIG.secret; s.hidden = false;
        s.scrollIntoView({behavior: "smooth", block: "center"});
      }
    }
  };
  $("cards").appendChild(b);
});

/* ---------- Galerie + lightbox (précédent/suivant, flèches, balayage) ---------- */
let cur = 0; const figs = [];
CONFIG.gallery.forEach((g, i) => {
  const f = document.createElement("figure");
  f.tabIndex = 0; f.setAttribute("role", "button");
  f.innerHTML = `<img src="${g.src}" alt="${g.caption}" loading="lazy" data-ph="Ajoute une photo : ${g.src}"><figcaption>${g.caption}</figcaption>`;
  const img = f.querySelector("img"); img.onerror = () => placeholder(img);
  f.onclick = () => openLb(i);
  f.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openLb(i); } };
  figs.push(f); $("gallery").appendChild(f);
});
const valid = () => CONFIG.gallery.map((g, i) => i).filter(i => figs[i].querySelector("img"));
function show(i){
  cur = i; const g = CONFIG.gallery[i];
  $("lbi").src = g.src; $("lbi").alt = g.caption; $("lbc").textContent = g.caption;
  $("prev").hidden = $("next").hidden = valid().length < 2;
}
function openLb(i){ if (!figs[i].querySelector("img")) return; show(i); $("lb").hidden = false; $("lbx").focus(); }
function step(d){ const v = valid(); if (v.length > 1) show(v[(v.indexOf(cur) + d + v.length) % v.length]); }
const closeLb = () => $("lb").hidden = true;
$("prev").onclick = () => step(-1); $("next").onclick = () => step(1); $("lbx").onclick = closeLb;
$("lb").onclick = e => { if (e.target.id === "lb") closeLb(); };
addEventListener("keydown", e => {
  if ($("lb").hidden) return;
  if (e.key === "Escape") closeLb(); if (e.key === "ArrowLeft") step(-1); if (e.key === "ArrowRight") step(1);
});
let sx = 0;
$("lb").addEventListener("touchstart", e => sx = e.touches[0].clientX, {passive: true});
$("lb").addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); });

/* ---------- Compte à rebours dynamique (Africa/Dakar = UTC+0 toute l'année) ---------- */
const target = new Date(CONFIG.target).getTime();
const p2 = n => String(n).padStart(2, "0");
function setNum(id, v){ // flip à chaque changement de chiffre
  const e = $(id); if (e.textContent === v) return;
  e.textContent = v; e.classList.remove("flip"); void e.offsetWidth; e.classList.add("flip");
}
function tick(){
  const diff = target - Date.now();
  if (diff <= 0) { // jour J, ou date déjà passée
    const today = -diff < 864e5;
    $("cd").hidden = true; $("celebrate").hidden = false;
    $("cdTitle").textContent = today ? "Le grand jour est arrivé" : "Joyeux anniversaire";
    $("celebrate").textContent = today ? "🎉 C'est aujourd'hui ! 🎉" : "🎂 Joyeux anniversaire, ma Seynounou ! 🎂";
    clearInterval(timer); return;
  }
  setNum("d", String(Math.floor(diff / 864e5))); setNum("h", p2(Math.floor(diff / 36e5) % 24));
  setNum("m", p2(Math.floor(diff / 6e4) % 60)); setNum("s", p2(Math.floor(diff / 1e3) % 60));
}
const timer = setInterval(tick, 1000); tick();

/* ---------- Musique (jamais automatique) ---------- */
const audio = $("audio"), play = $("play");
audio.volume = .6;
play.onclick = () => {
  if (audio.paused) audio.play().catch(() => $("amsg").textContent = "Ajoute musique.mp3");
  else audio.pause();
};
audio.onplay = () => { play.textContent = "❚❚"; $("player").classList.add("playing"); };
audio.onpause = () => { play.textContent = "▶"; $("player").classList.remove("playing"); };
audio.onerror = () => $("amsg").textContent = "Ajoute musique.mp3";
$("vol").oninput = e => audio.volume = e.target.value;

/* ---------- Particules : lumières dorées + pétales ---------- */
const cv = $("fx"), cx = cv.getContext("2d");
let W, H, parts = [];
const dpr = Math.min(devicePixelRatio || 1, 1.5);
function size(){ W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; cx.setTransform(dpr, 0, 0, dpr, 0, 0); }
addEventListener("resize", size); size();
const mk = (petal, y) => ({petal, x: Math.random() * W, y: y ?? Math.random() * H, r: petal ? 5 + Math.random() * 5 : 1 + Math.random() * 1.8,
  vy: petal ? .5 + Math.random() * .7 : -.15 - Math.random() * .25, vx: (Math.random() - .5) * .4, a: Math.random() * 6, va: (Math.random() - .5) * .03, o: .25 + Math.random() * .5});
const base = W < 600 ? 22 : 45;
for (let i = 0; i < base; i++) parts.push(mk(i % 4 === 0));
function burst(n){ if (reduce) return; for (let i = 0; i < n; i++) parts.push(mk(true, -20 - Math.random() * H * .4)); }
$("burst").onclick = () => burst(45);
function frame(){
  cx.clearRect(0, 0, W, H);
  parts.forEach((p, i) => {
    p.x += p.vx + Math.sin(p.a) * .3; p.y += p.vy; p.a += p.va + .01;
    if (p.petal) {
      cx.save(); cx.translate(p.x, p.y); cx.rotate(p.a); cx.globalAlpha = p.o;
      cx.fillStyle = "#a3475f"; cx.beginPath(); cx.ellipse(0, 0, p.r, p.r * .6, 0, 0, 6.3); cx.fill(); cx.restore();
      if (p.y > H + 20) { if (i >= base) parts.splice(i, 1); else { p.y = -20; p.x = Math.random() * W; } }
    } else {
      cx.globalAlpha = p.o * (.6 + Math.sin(p.a * 3) * .4); cx.fillStyle = "#D6B36A";
      cx.shadowColor = "#D6B36A"; cx.shadowBlur = 8; cx.beginPath(); cx.arc(p.x, p.y, p.r, 0, 6.3); cx.fill(); cx.shadowBlur = 0;
      if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
    }
  });
  if (!document.hidden) requestAnimationFrame(frame);
}
if (!reduce) { frame(); document.addEventListener("visibilitychange", () => { if (!document.hidden) frame(); }); }

/* ---------- Confettis (canvas séparé, au-dessus du contenu) ---------- */
const cc = $("cf"), cctx = cc.getContext("2d"); let conf = [], cfRun = false;
function confetti(n){
  if (reduce) return;
  cc.width = innerWidth; cc.height = innerHeight;
  const cols = ["#E6CFA3", "#F8F0E8", "#D6B36A", "#B8924A"];
  for (let i = 0; i < n; i++) conf.push({x: cc.width / 2, y: cc.height * .6, vx: (Math.random() - .5) * 14, vy: -6 - Math.random() * 9,
    w: 5 + Math.random() * 5, h: 3 + Math.random() * 4, a: Math.random() * 6, va: (Math.random() - .5) * .3, c: cols[i % 4]});
  if (!cfRun) { cfRun = true; requestAnimationFrame(cfFrame); }
}
function cfFrame(){
  cctx.clearRect(0, 0, cc.width, cc.height);
  conf = conf.filter(p => p.y < cc.height + 20);
  conf.forEach(p => {
    p.vy += .3; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.a += p.va;
    cctx.save(); cctx.translate(p.x, p.y); cctx.rotate(p.a); cctx.fillStyle = p.c; cctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); cctx.restore();
  });
  if (conf.length) requestAnimationFrame(cfFrame); else cfRun = false;
}

/* ---------- Partager ---------- */
$("share").onclick = async () => {
  const data = {title: "Pour Seynabou ❤️", text: "Une surprise t'attend...", url: location.href}; // À PERSONNALISER
  try {
    if (navigator.share) await navigator.share(data);
    else { await navigator.clipboard.writeText(location.href); $("share").textContent = "Lien copié ✓"; }
  } catch (e) {}
};

/* ---------- Notre histoire (chronologie) ---------- */
CONFIG.timeline.forEach(t => {
  const li = document.createElement("li"); li.className = "reveal";
  li.innerHTML = `<time>${t.date}</time><h3>${t.title}</h3><p>${t.text}</p>`;
  $("tl").appendChild(li);
});

/* ---------- Carte secrète ---------- */
$("scText").textContent = CONFIG.secretCard;
$("scBtn").onclick = () => {
  const open = $("sc").classList.toggle("open");
  $("scBtn").setAttribute("aria-expanded", open);
  if (open) { burst(10); setTimeout(() => $("scMsg").scrollIntoView({behavior: "smooth", block: "center"}), 600); }
};

/* ---------- Dernier cadeau ---------- */
$("gift").onclick = () => {
  const m = $("giftMsg"); m.textContent = CONFIG.finalGift; m.hidden = false;
  $("gift").textContent = "Cadeau ouvert ✓"; $("gift").disabled = true;
  confetti(180); burst(50);
  if (!reduce) { const f = document.createElement("div"); f.className = "flash"; document.body.appendChild(f); setTimeout(() => f.remove(), 1500); }
  m.scrollIntoView({behavior: "smooth", block: "center"});
};

/* ---------- Navigation : barre de progression + points ---------- */
const NAV = [["photo","Notre photo"],["lettre","La lettre"],["histoire","Notre histoire"],["raisons","Les 21 raisons"],
  ["galerie","Galerie"],["message","Message secret"],["countdown","Compte à rebours"],["final","Final"]];
NAV.forEach(([id, label]) => {
  const a = document.createElement("a"); a.href = "#" + id; a.setAttribute("aria-label", label); a.title = label; a.dataset.id = id;
  $("dots").appendChild(a);
});
const bar = document.querySelector("#prog i"); let ticking = false;
function prog(){
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`; ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(prog); } }, {passive: true});
const navIo = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) document.querySelectorAll("#dots a").forEach(a => a.classList.toggle("on", a.dataset.id === e.target.id));
}), {rootMargin: "-45% 0px -45% 0px"});
NAV.forEach(([id]) => navIo.observe($(id)));
