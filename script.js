/* =====================================================
   ✏️ CONFIGURATION : modifie ici les textes des cartes,
   la galerie et la date. Le reste du texte est dans index.html
   ===================================================== */
const CONFIG = {
  // Anniversaire 21 nov. 2026 à minuit, heure de Dakar (UTC+0 toute l'année)
  target: "2026-11-21T00:00:00Z",
  reasons: [ // 21 messages provisoires, à remplacer
    "Ton sourire éclaire mes journées.","Ta douceur me fait du bien.","Ta force m'inspire.",
    "Tu sais m'écouter.","Ton rire est contagieux.","Ta bienveillance se remarque.",
    "Tu as une belle sensibilité.","Tu me pousses à avancer.","Ta présence me rassure.",
    "Ta façon de voir la vie.","Ton courage.","Ton élégance naturelle.",
    "Ta patience avec moi.","Ta curiosité.","Tes petites attentions.",
    "Ta sincérité.","Tes rêves et ton ambition.","Ta façon de rendre l'ordinaire plus beau.",
    "Ta loyauté.","Ta voix, quand tu parles de ce que tu aimes.","Simplement parce que tu es toi."
  ],
  gallery: [ // ajoute une ligne par photo (dépose l'image dans )
    {src:"photo-1.jpg",caption:"Un souvenir précieux"}
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
    scrollTo(0, 0); watch(); burst(18);
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
  b.onclick = () => {
    if (!b.classList.contains("on")) { b.classList.add("on"); $("count").textContent = ++opened; if (opened === 21) burst(40); }
    else b.classList.remove("on");
  };
  $("cards").appendChild(b);
});

/* ---------- Galerie + agrandissement ---------- */
CONFIG.gallery.forEach(g => {
  const f = document.createElement("figure");
  f.innerHTML = `<img src="${g.src}" alt="${g.caption}" loading="lazy" data-ph="Ajoute une photo : ${g.src}"><figcaption>${g.caption}</figcaption>`;
  const img = f.querySelector("img"); img.onerror = () => placeholder(img);
  f.onclick = () => {
    const im = f.querySelector("img"); if (!im) return;
    $("lbi").src = im.src; $("lbc").textContent = g.caption; $("lb").hidden = false;
  };
  $("gallery").appendChild(f);
});
const closeLb = () => $("lb").hidden = true;
$("lb").onclick = e => { if (e.target.tagName !== "IMG") closeLb(); };
addEventListener("keydown", e => { if (e.key === "Escape") closeLb(); });

/* ---------- Compte à rebours (Africa/Dakar = UTC+0) ---------- */
const target = new Date(CONFIG.target).getTime();
function tick(){
  const diff = target - Date.now();
  if (diff <= 0) {
    $("cd").hidden = true; $("celebrate").hidden = false; $("cdTitle").textContent = "Le grand jour est arrivé";
    clearInterval(timer); return;
  }
  const p = n => String(n).padStart(2, "0");
  $("d").textContent = Math.floor(diff / 864e5);
  $("h").textContent = p(Math.floor(diff / 36e5) % 24);
  $("m").textContent = p(Math.floor(diff / 6e4) % 60);
  $("s").textContent = p(Math.floor(diff / 1e3) % 60);
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
      cx.fillStyle = "#8a2a4c"; cx.beginPath(); cx.ellipse(0, 0, p.r, p.r * .6, 0, 0, 6.3); cx.fill(); cx.restore();
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
