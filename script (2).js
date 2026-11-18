/* =====================================================
   À PERSONNALISER : CONFIGURATION : modifie ici les textes des cartes,
   et la date. Le reste du texte est dans index.html
   ===================================================== */
const CONFIG = {
  // Anniversaire 21 nov. 2026 à minuit, heure de Dakar (UTC+0 toute l'année)
  target: "2026-11-21T00:00:00Z",
  // À PERSONNALISER : message de la carte « Il me reste quelque chose à te dire »
  secretCard: `Seynabou,

Il y a des choses que je ne prends pas toujours le temps de te dire, et pourtant elles méritent d'être exprimées.

Je sais que je ne suis pas parfait. J'ai mes défauts, mes maladresses et parfois mes réactions que je dois apprendre à mieux maîtriser. Mais malgré tout, je veux continuer à apprendre, à grandir et à devenir une meilleure personne.

Je ne veux pas que tu aies simplement quelqu'un qui te promette de belles choses. Je veux être quelqu'un qui sait t'écouter, comprendre tes silences, respecter tes sentiments et reconnaître ses erreurs.

Je veux que tu saches que ta présence compte énormément pour moi. J'apprécie nos discussions, nos moments de complicité, nos rires et même ces petites habitudes qui rendent notre histoire particulière.

Je ne te promets pas une histoire sans difficultés, mais je souhaite une histoire dans laquelle nous apprenons à nous comprendre plutôt qu'à nous éloigner.

Et si je devais te dire une seule chose aujourd'hui, ce serait celle-ci : ne doute jamais de la valeur que tu as en tant que personne.

Tu mérites le bonheur, la paix et un amour sincère.

Je t'aime, ma Seynounou. ❤️`,
  // À PERSONNALISER : message révélé par « Découvrir le dernier cadeau »
  finalGift: `Ma Seynounou,

Si tu es arrivée jusqu'ici, c'est que tu as parcouru toutes les petites attentions que j'ai préparées pour toi.

J'espère que tu as souri, que certains souvenirs t'ont fait du bien et que tu as ressenti, à travers ces quelques pages, toute l'affection que j'ai voulu y mettre.

Aujourd'hui, je célèbre tes 21 ans, mais je célèbre aussi la personne que tu es : une personne avec ses rêves, ses ambitions, ses qualités et tout ce qui fait qu'elle est unique.

Je prie Allah de t'accorder une longue vie remplie de bonheur, de santé, de réussite et de tranquillité. Qu'Il facilite tes projets, protège ton cœur et t'éloigne de tout ce qui pourrait te faire du mal.

Continue de croire en toi, même lorsque les choses deviennent difficiles. N'abandonne jamais tes rêves et n'oublie jamais ta valeur.

Enfin, merci d'avoir fait partie de mon histoire et de m'avoir offert des souvenirs que je garderai précieusement.

Je n'avais peut-être pas les moyens de t'offrir un grand cadeau matériel, alors j'ai choisi de t'offrir un petit morceau de mon cœur, construit avec du temps, des souvenirs et des mots.

Joyeux 21e anniversaire, ma Seynounou.

Avec toute mon affection,

Ton Mouhamed. ❤️`,
  // À PERSONNALISER : message caché révélé quand les 21 cartes sont ouvertes
  secret: "Tu as ouvert les 21 cartes. Il y en a une dernière, la plus importante : merci d'être toi. ❤️",
  reasons: [ // À PERSONNALISER : remplace chaque phrase par ta vraie raison (21 au total)
    "Ton sourire change l'ambiance d'une pièce sans que tu aies besoin de parler.",
    "Ta douceur apaise, même quand tout autour va trop vite.",
    "Tu as une force tranquille, qui n'a pas besoin de se montrer.",
    "Ta patience m'apprend à ralentir et à mieux écouter.",
    "Tu es sincère, et cela rend tout plus simple entre nous.",
    "Ta sensibilité te fait remarquer ce que les autres oublient.",
    "Ton soutien compte plus que tu ne l'imagines.",
    "Tu es toi-même, sans chercher à plaire à personne.",
    "Ta présence rassure, simplement, sans qu'on ait besoin de le dire.",
    "Tu as de l'ambition, et elle te va très bien.",
    "Ta façon de rire donne envie de rire aussi.",
    "Tu rends les moments simples plus beaux qu'ils ne le sont.",
    "Ta bienveillance se voit dans les petites choses.",
    "Tu sais rester digne, même quand les choses sont difficiles.",
    "Ton élégance est naturelle, elle ne doit rien à l'effort.",
    "Tu me donnes envie de devenir une meilleure version de moi.",
    "Ta manière de voir la vie me fait souvent réfléchir.",
    "Tu portes des rêves qui méritent qu'on y croie.",
    "Ta loyauté est précieuse, et je ne la prends jamais pour acquise.",
    "Ta voix, quand tu parles de ce qui te tient à cœur.",
    "Parce que tu es toi, tout simplement, et c'est déjà beaucoup."
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

/* ---------- Carte secrète ---------- */
// Transforme un texte (paragraphes séparés par une ligne vide) en <p>, avec mise en forme des lignes spéciales
const paras = t => t.trim().split(/\n\s*\n/).map(x => {
  const c = /^Joyeux 21e anniversaire/.test(x) ? "wish" : /^(Avec toute mon affection|Ton Mouhamed|Je t'aime, ma Seynounou)/.test(x) ? "end" : "";
  return `<p${c ? ` class="${c}"` : ""}>${x}</p>`;
}).join("");
$("scText").innerHTML = paras(CONFIG.secretCard);
$("scBtn").onclick = () => {
  const open = $("sc").classList.toggle("open");
  $("scBtn").setAttribute("aria-expanded", open);
  if (open) { burst(10); setTimeout(() => $("sc").scrollIntoView({behavior: "smooth", block: "start"}), 600); }
};

/* ---------- Dernier cadeau ---------- */
$("gift").onclick = () => {
  const m = $("giftMsg"); m.innerHTML = paras(CONFIG.finalGift); m.hidden = false;
  $("gift").textContent = "Cadeau ouvert ✓"; $("gift").disabled = true;
  confetti(180); burst(50);
  if (!reduce) { const f = document.createElement("div"); f.className = "flash"; document.body.appendChild(f); setTimeout(() => f.remove(), 1500); }
  m.scrollIntoView({behavior: "smooth", block: "start"});
};

/* ---------- Navigation : barre de progression + points ---------- */
const NAV = [["photo","Notre photo"],["lettre","La lettre"],["raisons","Les 21 raisons"],
  ["message","Message secret"],["countdown","Compte à rebours"],["final","Final"]];
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
