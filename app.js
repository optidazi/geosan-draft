import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, onSnapshot, runTransaction, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";
import { firebaseConfig, ADMIN_UID } from "./firebase-config.js";

// ---------- i18n ----------
const I18N = {
  en: {
    appSub: "Company basketball tournament · Player draft",
    tab_teams: "Teams", tab_players: "Players", tab_lottery: "Lottery", tab_draft: "Draft", tab_results: "Results",
    led: "Pick",
    teams_title: "Last year's standings",
    teams_lead: "Teams in order of last season's finish. The champion gets 1 lottery ticket and last place gets 5. More tickets means a better chance at the first pick.",
    place: ["Champion", "2nd place", "3rd place", "4th place", "5th place"],
    team_name: "Team name", captain: "Captain",
    tickets1: "1 ticket", tickets: "{n} tickets", odds: "{p}% first-pick odds",
    move_up: "Move up", move_down: "Move down",
    locked: "Standings are locked because the lottery has started. Use Reset to change them.",
    next_players: "Next: players",
    players_title: "Player pool",
    players_lead: "Everyone available in the draft.",
    players_lead_admin: "Replace the sample names with the people who signed up.",
    add_player: "Add player", name: "Name", pos: "Position",
    pos_G: "Guard", pos_F: "Forward", pos_C: "Center",
    bulk_title: "Paste a list", bulk_hint: "One player per line. Put the position after a comma, e.g. Bat-Erdene, G", bulk_add: "Add all",
    clear_players: "Remove undrafted", remove: "Remove",
    count_players: "{n} players · {r} rounds",
    next_lottery: "Next: lottery",
    lottery_title: "Draft lottery",
    lottery_lead: "15 balls, one per ticket. When a ball comes out, that team takes the pick and all its other balls leave the drum.",
    draw_btn: "Draw pick #{n}", draw_last: "Place the last team", drawing: "Mixing…", start_draft: "Start the draft",
    order_title: "First-round order", odds_next: "Odds for pick #{n}",
    reveal_idle: "The admin draws the first pick",
    reveal_idle_admin: "Press the button to draw the first pick",
    reveal_pick: "Ball #{b} · pick #{n} goes to",
    reveal_last: "Last team left · pick #{n} goes to", last_auto: "last team left, no draw",
    ball_label: "ball #{n}",
    snake: "Snake order (reverses every round)",
    redo_lottery: "Redo lottery",
    redo_q: "Redo the lottery? The current order will be cleared.", redo_yes: "Clear and redo",
    redo_blocked: "The draft has started. Use Reset to redo the lottery.",
    draft_need_lottery: "Run the lottery first to set the draft order.", go_lottery: "Go to lottery",
    draft_need_players: "Add players before starting the draft.", go_players: "Go to players",
    on_clock: "On the clock", round: "Round {r}", pick_of: "Pick {n} of {t}",
    next_up: "Up next",
    search: "Search players", all: "All",
    undo: "Undo last pick",
    confirm_title: "Confirm the pick", confirm: "Draft player", cancel: "Cancel",
    pick_in: "The pick is in!",
    rosters: "Rosters", no_picks: "No picks yet",
    draft_done: "Draft complete!", see_results: "See final rosters",
    results_title: "Final rosters", results_lead: "Every player has a team. Copy the list to share it in chat.",
    results_none: "Rosters appear here once the draft starts.",
    copy: "Copy as text", copied: "Copied to clipboard", copy_fail: "Copy was blocked. Select the text below and copy it.",
    reset: "Reset", reset_q: "Start over? This clears the lottery and all picks for everyone. Teams, logins and players stay.", reset_yes: "Clear lottery and picks",
    reset_done: "Lottery and picks cleared",
    empty_pool: "No players match.",
    captain_short: "Captain: {c}",
    undone: "Pick undone",
    signin_title: "Sign in to the draft",
    signin_lead: "Use the email and password the admin sent you.",
    email: "Email", password: "Password", signin: "Sign in", signout: "Sign out",
    signin_err: "Wrong email or password.",
    signin_err_other: "Couldn't sign in ({e}).",
    role_admin: "Admin", role_captain: "Captain · {t}", role_none: "No team",
    no_access: "Your account isn't linked to a team yet. Ask the admin to link it on the Teams step.",
    no_draft_admin: "No draft yet. Create one with 5 sample teams and the 45-player men's roster, then edit them.",
    create_draft: "Create draft",
    loading: "Loading…",
    follow_admin: "The admin moves everyone through the steps.",
    login_col: "Captain login",
    captain_email: "Captain's email",
    create_login: "Create login", gen: "Generate",
    login_ready: "Login: {e}", unlink: "Unlink",
    unlink_q: "Unlink this login from the team? The captain will lose access until you link a login again.",
    login_created_title: "Login created",
    login_created: "Send these to {t}'s captain:",
    email_in_use: "This email already has an account. Paste its User UID from Firebase console → Authentication → Users.",
    uid: "User UID", link_uid: "Link UID",
    pw_short: "The password needs at least 6 characters.",
    bad_email: "Enter a valid email address.",
    your_turn: "Your pick! Choose a player.",
    waiting_for: "Waiting for {t} to pick",
    admin_pick: "As admin you can pick for any team.",
    not_your_turn: "It's not your turn anymore.",
    taken: "That player was just picked.",
    save_err: "Couldn't save ({e}). Check your connection and try again.",
    done: "Done",
    setup_title: "Connect Firebase first",
    setup_lead: "This draft needs a Firebase project for logins and live sync. Fill in firebase-config.js and firestore.rules as described in the README, then reload.",
    title_turn: "🏀 Your pick!",
    watch: "Watch the draft",
    watch_hint: "No login needed. You'll see everything live but can't change anything.",
    role_spectator: "Spectator",
    not_started: "The draft hasn't been set up yet. This page updates by itself when it starts.",
    copy_watch: "Copy spectator link",
  },
  mn: {
    appSub: "Компанийн сагсан бөмбөгийн тэмцээн · Тоглогчийн драфт",
    tab_teams: "Багууд", tab_players: "Тоглогчид", tab_lottery: "Сугалаа", tab_draft: "Драфт", tab_results: "Үр дүн",
    led: "Сонголт",
    teams_title: "Өнгөрсөн жилийн байр",
    teams_lead: "Багууд өнгөрсөн улирлын байраараа эрэмбэлэгдсэн. Аварга баг 1 сугалааны тасалбар, сүүлийн байр 5 тасалбар авна. Тасалбар олон байх тусам эхний сонголтыг авах магадлал өндөр.",
    place: ["Аварга", "2-р байр", "3-р байр", "4-р байр", "5-р байр"],
    team_name: "Багийн нэр", captain: "Ахлагч",
    tickets1: "1 тасалбар", tickets: "{n} тасалбар", odds: "Эхний сонголт: {p}%",
    move_up: "Дээш", move_down: "Доош",
    locked: "Сугалаа эхэлсэн тул байрыг өөрчлөх боломжгүй. Өөрчлөхийн тулд «Шинээр эхлэх» товчийг дарна уу.",
    next_players: "Дараах: тоглогчид",
    players_title: "Тоглогчдын жагсаалт",
    players_lead: "Драфтад оролцох бүх тоглогч.",
    players_lead_admin: "Жишээ нэрсийг бүртгүүлсэн хүмүүсээр солиорой.",
    add_player: "Тоглогч нэмэх", name: "Нэр", pos: "Байрлал",
    pos_G: "Хамгаалагч", pos_F: "Довтлогч", pos_C: "Төвийн",
    bulk_title: "Жагсаалт буулгах", bulk_hint: "Мөр бүрт нэг тоглогч. Байрлалыг таслалын дараа бичнэ, жишээ нь: Бат-Эрдэнэ, G", bulk_add: "Бүгдийг нэмэх",
    clear_players: "Сонгогдоогүйг устгах", remove: "Хасах",
    count_players: "{n} тоглогч · {r} тойрог",
    next_lottery: "Дараах: сугалаа",
    lottery_title: "Драфтын сугалаа",
    lottery_lead: "Тасалбар бүрт нэг бөмбөг, нийт 15. Бөмбөг гарахад тэр баг сонголтыг авч, үлдсэн бөмбөгнүүд нь хүрднээс гарна.",
    draw_btn: "#{n} сонголтыг сугалах", draw_last: "Үлдсэн багийг байрлуулах", drawing: "Хольж байна…", start_draft: "Драфтыг эхлүүлэх",
    order_title: "Эхний тойргийн дараалал", odds_next: "#{n} сонголтын магадлал",
    reveal_idle: "Админ эхний сонголтыг сугална",
    reveal_idle_admin: "Эхний сонголтыг сугалахын тулд товчийг дарна уу",
    reveal_pick: "#{b} бөмбөг · #{n} сонголт",
    reveal_last: "Үлдсэн баг · #{n} сонголт", last_auto: "үлдсэн баг, сугалаагүй",
    ball_label: "#{n} бөмбөг",
    snake: "Могой дараалал (тойрог бүр урвуу)",
    redo_lottery: "Сугалааг дахин хийх",
    redo_q: "Сугалааг дахин хийх үү? Одоогийн дараалал устна.", redo_yes: "Устгаад дахин хийх",
    redo_blocked: "Драфт эхэлсэн байна. Сугалааг дахин хийхийн тулд «Шинээр эхлэх» товчийг дарна уу.",
    draft_need_lottery: "Эхлээд сугалаа явуулж сонголтын дарааллыг тогтооно уу.", go_lottery: "Сугалаа руу очих",
    draft_need_players: "Драфт эхлэхээс өмнө тоглогч нэмнэ үү.", go_players: "Тоглогчид руу очих",
    on_clock: "Сонголт хийх ээлж", round: "{r}-р тойрог", pick_of: "Сонголт {n} / {t}",
    next_up: "Дараагийн ээлж",
    search: "Тоглогч хайх", all: "Бүгд",
    undo: "Сүүлийн сонголтыг буцаах",
    confirm_title: "Сонголтоо баталгаажуулна уу", confirm: "Тоглогчийг сонгох", cancel: "Болих",
    pick_in: "Сонголт хийгдлээ!",
    rosters: "Багийн бүрэлдэхүүн", no_picks: "Сонголт алга",
    draft_done: "Драфт дууслаа!", see_results: "Эцсийн бүрэлдэхүүн",
    results_title: "Эцсийн бүрэлдэхүүн", results_lead: "Бүх тоглогч багтай боллоо. Жагсаалтыг хуулж чатад хуваалцаарай.",
    results_none: "Драфт эхэлмэгц бүрэлдэхүүн энд гарна.",
    copy: "Текстээр хуулах", copied: "Хуулагдлаа", copy_fail: "Хуулах боломжгүй байна. Доорх текстийг сонгож хуулна уу.",
    reset: "Шинээр эхлэх", reset_q: "Шинээр эхлэх үү? Сугалаа болон бүх сонголт бүх хүнд устна. Баг, нэвтрэх эрх, тоглогчид хэвээр үлдэнэ.", reset_yes: "Сугалаа, сонголтыг устгах",
    reset_done: "Сугалаа, сонголт устлаа",
    empty_pool: "Тохирох тоглогч алга.",
    captain_short: "Ахлагч: {c}",
    undone: "Сонголтыг буцаалаа",
    signin_title: "Драфтад нэвтрэх",
    signin_lead: "Админаас ирсэн имэйл, нууц үгээр нэвтэрнэ үү.",
    email: "Имэйл", password: "Нууц үг", signin: "Нэвтрэх", signout: "Гарах",
    signin_err: "Имэйл эсвэл нууц үг буруу байна.",
    signin_err_other: "Нэвтэрч чадсангүй ({e}).",
    role_admin: "Админ", role_captain: "Ахлагч · {t}", role_none: "Баггүй",
    no_access: "Таны бүртгэл багт холбогдоогүй байна. Админаас «Багууд» алхам дээр холбуулахыг хүснэ үү.",
    no_draft_admin: "Драфт үүсээгүй байна. 5 жишээ баг, 45 тоглогчийн жагсаалттай драфт үүсгээд засварлана уу.",
    create_draft: "Драфт үүсгэх",
    loading: "Ачаалж байна…",
    follow_admin: "Алхмуудыг админ удирдана.",
    login_col: "Ахлагчийн нэвтрэх эрх",
    captain_email: "Ахлагчийн имэйл",
    create_login: "Нэвтрэх эрх үүсгэх", gen: "Үүсгэх",
    login_ready: "Нэвтрэх эрх: {e}", unlink: "Салгах",
    unlink_q: "Энэ нэвтрэх эрхийг багаас салгах уу? Дахин холбох хүртэл ахлагч нэвтэрч чадахгүй.",
    login_created_title: "Нэвтрэх эрх үүслээ",
    login_created: "{t} багийн ахлагчид илгээнэ үү:",
    email_in_use: "Энэ имэйл бүртгэлтэй байна. Firebase console → Authentication → Users хэсгээс User UID-г хуулж оруулна уу.",
    uid: "User UID", link_uid: "UID холбох",
    pw_short: "Нууц үг дор хаяж 6 тэмдэгттэй байх ёстой.",
    bad_email: "Зөв имэйл хаяг оруулна уу.",
    your_turn: "Таны ээлж! Тоглогчоо сонгоно уу.",
    waiting_for: "{t} сонголт хийхийг хүлээж байна",
    admin_pick: "Админ та аль ч багийн өмнөөс сонгож болно.",
    not_your_turn: "Таны ээлж өнгөрсөн байна.",
    taken: "Энэ тоглогч дөнгөж сонгогдлоо.",
    save_err: "Хадгалж чадсангүй ({e}). Холболтоо шалгаад дахин оролдоно уу.",
    done: "Болсон",
    setup_title: "Эхлээд Firebase холбоно уу",
    setup_lead: "Энэ драфт нэвтрэх болон шууд синк хийхэд Firebase төсөл шаарддаг. README-д заасны дагуу firebase-config.js, firestore.rules-г бөглөөд дахин ачаална уу.",
    title_turn: "🏀 Таны ээлж!",
    watch: "Драфтыг үзэх",
    watch_hint: "Нэвтрэх шаардлагагүй. Бүгдийг шууд харах боловч өөрчлөх боломжгүй.",
    role_spectator: "Үзэгч",
    not_started: "Драфт хараахан бэлэн болоогүй байна. Эхлэхэд энэ хуудас автоматаар шинэчлэгдэнэ.",
    copy_watch: "Үзэгчийн холбоос хуулах",
  },
};

// ---------- setup ----------
const COLORS = ["#f26b1d", "#3ba3f5", "#5fd39a", "#e0559b", "#f2c230"];
const SAMPLE_TEAMS = ["Eagles", "Wolves", "Snow Leopards", "Steeds", "Tigers"];
// Men's team roster (from "Mens team.xlsx"): [name, position]
const ROSTER = [
  ["Алтанбагана", "F"], ["Амарбаясгалан", "G"], ["Ариунбилэг", "F"], ["Баатар", "G"], ["Баатарсүрэн", "F"],
  ["Бат-Амгалан", "G"], ["Бат-Эрдэнэ.Г", "G"], ["Бат-Эрдэнэ.Д", "G"], ["Бат-Эрдэнэ.П", "F"], ["Батбаяр", "G"],
  ["Батзориг", "C"], ["Баярсайхан", "G"], ["Билгүүн", "G"], ["Бишрэлт", "F"], ["Бямбаравдан", "G"],
  ["Ган-Эрдэнэ", "G"], ["Даваасүрэн", "G"], ["Мөнхбаяр", "G"], ["Мөнхжаргал.Б", "F"], ["Мөнхжаргал.Н", "F"],
  ["Мөнхтогтох", "C"], ["Мөнхтулга", "G"], ["Отгонбайгал", "G"], ["Отгонтулга", "F"], ["Оюунбаатар", "G"],
  ["Оюунболд", "G"], ["Сумъяабазар", "F"], ["Сүхбат", "F"], ["Сэмжид", "G"], ["Төрбат", "F"],
  ["Түвшинбадрах", "F"], ["Түвшинсайхан", "G"], ["Тэгшжаргал", "G"], ["Тэмүүжин", "F"], ["Хатанбүүвэй", "F"],
  ["Хөхтөмөр", "F"], ["Хүдэрчулуун", "G"], ["Цэдэндамба", "C"], ["Чинзориг", "G"], ["Энх-Оргил", "G"],
  ["Энхтөр", "G"], ["Энхцогт", "G"], ["Эрдэнэбаяр", "C"], ["Эрдэнэдалай", "F"], ["Эрхэмбаяр", "C"],
];
const STEPS = ["teams", "players", "lottery", "draft", "results"];
const SHOT = 60;
const uid = () => Math.random().toString(36).slice(2, 9);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = s => document.querySelector(s);
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const cfgReady = !!firebaseConfig?.apiKey && !firebaseConfig.apiKey.startsWith("PASTE") && !ADMIN_UID.startsWith("PASTE");
let fbApp, auth, db, ref, privRef, secAuth;
if (cfgReady) {
  fbApp = initializeApp(firebaseConfig);
  auth = getAuth(fbApp);
  db = getFirestore(fbApp);
  ref = doc(db, "draft", "main");       // readable by anyone, including spectators
  privRef = doc(db, "draft", "private"); // admin only: captain login emails
}

let lang = "en";
try { lang = localStorage.getItem("gd-lang") || "en"; } catch {}
let user = null, authReady = false, D = null, docState = "loading", unsub = null, lastKey = "", lastNewPick = -1;
let spectator = location.hash === "#watch", privEmails = {}, privUnsub = null, migrating = false;
const watchUrl = () => location.origin + location.pathname + "#watch";
let filter = { q: "", pos: "all" }, uidMode = new Set(), busy = false;

const t = (k, v = {}) => {
  let s = I18N[lang]?.[k] ?? I18N.en[k] ?? k;
  if (typeof s === "string") for (const [a, b] of Object.entries(v)) s = s.replaceAll("{" + a + "}", b);
  return s;
};

// ---------- derived ----------
const isAdmin = () => !!user && user.uid === ADMIN_UID;
const myTeamId = () => user && D ? Object.keys(D.captains || {}).find(k => D.captains[k] === user.uid) : undefined;
const team = id => D.teams.find(x => x.id === id);
const playerList = d => Object.entries((d || D).players || {}).map(([id, p]) => ({ id, ...p })).sort((a, b) => a.o - b.o);
const player = id => D.players[id] ? { id, ...D.players[id] } : null;
const ticketsFor = idx => idx + 1;
const draws = d => (d || D).lottery?.draws || [];
const order = d => draws(d).map(x => x.teamId);
const lotteryDone = d => draws(d).length === 5;
const totalPicks = () => Object.keys(D.players).length;
const rounds = () => Math.ceil(totalPicks() / 5);
const drafted = () => new Set(D.draftedIds || []);
const draftDone = () => totalPicks() > 0 && D.picks.length >= totalPicks();

function buildTickets(d) {
  const out = []; let n = 1;
  d.teams.forEach((tm, i) => { for (let j = 0; j < ticketsFor(i); j++) out.push({ n: n++, teamId: tm.id }); });
  return out;
}
function computePickOrder(d) {
  const o = order(d); if (o.length < 5) return [];
  const n = Object.keys(d.players).length, out = [];
  for (let i = 0; i < n; i++) { const r = Math.floor(i / 5), k = i % 5; out.push(d.snake && r % 2 === 1 ? o[4 - k] : o[k]); }
  return out;
}
function secureRand(max) { const a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % max; }
function seedDoc() {
  const players = {};
  ROSTER.forEach(([n, pos], i) => { players[uid()] = { name: n, pos, o: i }; });
  return {
    stage: "teams", snake: true,
    teams: SAMPLE_TEAMS.map((n, i) => ({ id: "t" + i, name: n, captain: "", color: COLORS[i] })),
    captains: {}, players, lottery: null, pickOrder: [], picks: [], draftedIds: [], turnStartedAt: null,
  };
}

// ---------- writes ----------
async function adminSave(mut) {
  try {
    await runTransaction(db, async tx => {
      const s = await tx.get(ref); const d = s.data();
      mut(d);
      d.pickOrder = computePickOrder(d);
      tx.set(ref, d);
    });
    return true;
  } catch (e) { toast(t("save_err", { e: e.code || e.message })); return false; }
}
const debouncers = {};
function adminSaveLater(key, mut) {
  clearTimeout(debouncers[key]);
  debouncers[key] = setTimeout(() => adminSave(mut), 450);
}
async function setStage(stage) {
  await adminSave(d => {
    d.stage = stage;
    if (stage === "lottery" && !d.lottery) d.lottery = { tickets: buildTickets(d), draws: [], drawing: false };
    // start a fresh shot clock when the draft opens; an earlier visit (e.g. before the lottery
    // finished) would otherwise leave an expired clock behind
    if (stage === "draft" && (!d.turnStartedAt || !d.picks.length)) d.turnStartedAt = lotteryDone(d) ? serverTimestamp() : null;
  });
  window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
}
async function drawNext() {
  if (busy || lotteryDone()) return;
  busy = true;
  if (draws().length === 4) { await placeLastTeam(); busy = false; return; }
  await adminSave(d => {
    if (!d.lottery) d.lottery = { tickets: buildTickets(d), draws: [], drawing: false };
    d.lottery.drawing = true;
  });
  await sleep(reduced ? 300 : 2400);
  let drawn = 0;
  await adminSave(d => {
    const taken = new Set(order(d));
    const pool = d.lottery.tickets.filter(tk => !taken.has(tk.teamId));
    if (pool.length) { const w = pool[secureRand(pool.length)]; d.lottery.draws.push({ teamId: w.teamId, ball: w.n }); }
    d.lottery.drawing = false;
    drawn = d.lottery.draws.length;
  });
  // one team left after the 4th draw: no spin, it simply gets the last pick
  if (drawn === 4) { await sleep(reduced ? 400 : 2200); await placeLastTeam(); }
  busy = false;
}
async function placeLastTeam() {
  await adminSave(d => {
    if (draws(d).length !== 4) return;
    const left = d.teams.find(tm => !order(d).includes(tm.id));
    if (left) d.lottery.draws.push({ teamId: left.id, ball: null, auto: true });
  });
}
async function makePick(pid) {
  try {
    await runTransaction(db, async tx => {
      const d = (await tx.get(ref)).data();
      const n = d.picks.length, tid = d.pickOrder[n];
      if (!tid || d.stage !== "draft") throw new Error("turn");
      if (!isAdmin() && d.captains[tid] !== user.uid) throw new Error("turn");
      if (d.draftedIds.includes(pid) || !d.players[pid]) throw new Error("taken");
      tx.update(ref, {
        picks: [...d.picks, { playerId: pid, teamId: tid, by: user.uid }],
        draftedIds: [...d.draftedIds, pid],
        turnStartedAt: serverTimestamp(),
      });
    });
  } catch (e) {
    toast(e.message === "turn" ? t("not_your_turn") : e.message === "taken" ? t("taken") : t("save_err", { e: e.code || e.message }));
  }
}
async function createCaptainLogin(teamId, email, pw) {
  email = email.trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return toast(t("bad_email"));
  if (pw.length < 6) return toast(t("pw_short"));
  try {
    secAuth ||= getAuth(initializeApp(firebaseConfig, "secondary"));
    const cred = await createUserWithEmailAndPassword(secAuth, email, pw);
    const newUid = cred.user.uid;
    await signOut(secAuth);
    const ok = await adminSave(d => { d.captains[teamId] = newUid; });
    if (!ok) return;
    await setDoc(privRef, { emails: { [teamId]: email } }, { merge: true });
    const tm = team(teamId);
    modal(`<h3>${esc(t("login_created_title"))}</h3><p>${esc(t("login_created", { t: tm.name }))}</p>
      <div class="pwbox" id="credBox">${esc(location.origin + location.pathname)}<br>${esc(t("email"))}: ${esc(email)}<br>${esc(t("password"))}: ${esc(pw)}</div>
      <div class="row"><button type="button" class="btn" id="copyCred">⧉ ${esc(t("copy"))}</button><button type="button" class="btn primary" data-close>${esc(t("done"))}</button></div>`, () => {
      $("#copyCred").onclick = () => copyText($("#credBox").innerText);
    });
  } catch (e) {
    if (e.code === "auth/email-already-in-use") { uidMode.add(teamId); lastKey = ""; render(); toast(t("email_in_use")); }
    else toast(t("save_err", { e: e.code || e.message }));
  }
}

// ---------- auth + live data ----------
function subscribe() {
  unsub?.(); privUnsub?.(); unsub = privUnsub = null; D = null; privEmails = {}; lastKey = "";
  if (user || spectator) {
    docState = "loading";
    unsub = onSnapshot(ref, snap => {
      const prev = D;
      D = snap.exists() ? snap.data() : null;
      docState = D ? "ok" : "missing";
      render();
      if (D && prev) liveEffects(prev);
      if (isAdmin()) migrateEmails();
    }, err => { docState = err.code === "permission-denied" ? "denied" : "error"; D = null; render(); });
    if (isAdmin()) privUnsub = onSnapshot(privRef, s => { privEmails = s.data()?.emails || {}; lastKey = ""; render(); }, () => {});
  }
  render();
}
// drafts created before spectator mode kept captain emails on the public doc
async function migrateEmails() {
  if (migrating || !D?.teams?.some(tm => tm.email)) return;
  migrating = true;
  try {
    const moved = Object.fromEntries(D.teams.filter(tm => tm.email).map(tm => [tm.id, tm.email]));
    await setDoc(privRef, { emails: moved }, { merge: true });
    await adminSave(d => { d.teams.forEach(tm => delete tm.email); });
  } catch (e) { toast(t("save_err", { e: e.code || e.message })); }
  finally { migrating = false; }
}
if (cfgReady) {
  onAuthStateChanged(auth, u => {
    user = u; authReady = true;
    if (u) spectator = false;
    subscribe();
  });
}
function liveEffects(prev) {
  const pn = prev.picks?.length || 0, n = D.picks.length;
  if (n === pn + 1) {
    const p = D.picks[n - 1], tm = team(p.teamId), pl = player(p.playerId);
    lastNewPick = n - 1; lastKey = ""; render();
    $("#clockCard")?.classList.add("change");
    const ov = document.createElement("div"); ov.className = "pickin"; ov.style.setProperty("--c", tm.color);
    ov.innerHTML = `<div>${esc(t("pick_in"))}<small>#${n} · ${esc(pl?.name)} → ${esc(tm.name)}</small></div>`;
    document.body.appendChild(ov); setTimeout(() => ov.remove(), reduced ? 900 : 1700);
    burst(tm.color, draftDone() ? 260 : 140);
    if (draftDone()) setTimeout(() => burst("#f2c230", 200), 500);
  } else if (n < pn) toast(t("undone"));
  if (draws().length > draws(prev).length) burst(team(draws().at(-1).teamId).color, 90);
}

// ---------- render ----------
function render() {
  document.documentElement.lang = lang;
  renderChrome();
  const m = $("#main");
  let key;
  if (!cfgReady) key = "setup";
  else if (!authReady) key = "auth-loading";
  else if (!user && !spectator) key = "login";
  else if (docState !== "ok") key = docState;
  else {
    // the lottery "drawing" flag and the shot-clock timestamp update in place, not via re-render
    const { turnStartedAt, lottery, ...rest } = D;
    key = JSON.stringify([rest, lottery?.draws, lottery?.tickets?.length, uidMode.size, filter.pos]);
  }
  key += "|" + lang + "|" + (user?.uid || (spectator ? "spectator" : ""));
  if (key !== lastKey) {
    lastKey = key;
    const keep = [...m.querySelectorAll("input[id], textarea[id], select[id]")].filter(el => el.dataset.local != null || el === document.activeElement)
      .map(el => ({ id: el.id, v: el.value, f: el === document.activeElement, s: el.selectionStart, e: el.selectionEnd }));
    stopDrum();
    if (!cfgReady) renderSetup(m);
    else if (!user && !spectator && authReady) renderLogin(m);
    else if (!authReady || docState === "loading") m.innerHTML = `<div class="card done-banner"><p>${esc(t("loading"))}</p></div>`;
    else if (docState === "missing") m.innerHTML = isAdmin()
      ? `<section class="panel"><div class="card done-banner"><div style="font-size:42px">🏀</div><p style="margin:0;font-size:17px">${esc(t("no_draft_admin"))}</p><button type="button" class="btn primary big" id="createDraft">${esc(t("create_draft"))}</button></div></section>`
      : `<section class="panel"><div class="card done-banner"><div style="font-size:42px">🏀</div><p style="margin:0;font-size:17px">${esc(t("not_started"))}</p></div></section>`;
    else if (docState !== "ok") m.innerHTML = `<section class="panel"><div class="card done-banner"><div style="font-size:42px">🔒</div><p style="margin:0;font-size:17px">${esc(docState === "denied" ? t("no_access") : t("save_err", { e: docState }))}</p></div></section>`;
    else ({ teams: renderTeams, players: renderPlayers, lottery: renderLottery, draft: renderDraft, results: renderResults })[D.stage](m);
    for (const k of keep) {
      const el = document.getElementById(k.id); if (!el) continue;
      el.value = k.v;
      if (k.f) { el.focus(); try { el.setSelectionRange(k.s, k.e); } catch {} }
    }
  }
  syncLive();
}
function renderChrome() {
  $("#appSub").textContent = t("appSub");
  $("#langEn").setAttribute("aria-pressed", lang === "en");
  $("#langMn").setAttribute("aria-pressed", lang === "mn");
  const rb = $("#resetBtn"); rb.hidden = !(isAdmin() && D); rb.textContent = "↺ " + t("reset");
  $("#ledLbl").textContent = t("led");
  const tot = D ? totalPicks() : 0, n = D ? D.picks.length : 0;
  $("#ledVal").textContent = String(Math.min(n, tot)).padStart(2, "0") + "/" + String(tot).padStart(2, "0");
  const ub = $("#userBox");
  if (user) {
    const mt = myTeamId();
    const role = isAdmin() ? `<span class="role admin">${esc(t("role_admin"))}</span>`
      : `<span class="role" title="${esc(user.email)}">${esc(mt ? t("role_captain", { t: team(mt).name }) : t("role_none"))}</span>`;
    ub.innerHTML = `${role}<button type="button" class="btn ghost" id="signOut">${esc(t("signout"))}</button>`;
  } else if (spectator) {
    ub.innerHTML = `<span class="role">👀 ${esc(t("role_spectator"))}</span><button type="button" class="btn ghost" id="toLogin">${esc(t("signin"))}</button>`;
  } else ub.innerHTML = "";
  const nav = $("#steps");
  if (!D) { nav.hidden = true; return; }
  nav.hidden = false;
  const done = { teams: true, players: totalPicks() >= 5, lottery: lotteryDone(), draft: draftDone(), results: draftDone() };
  nav.innerHTML = STEPS.map((s, i) => {
    const cur = s === D.stage, mark = done[s] && !cur;
    return `<button type="button" class="step ${mark ? "done" : ""}" data-step="${s}" ${cur ? 'aria-current="step"' : ""} ${!isAdmin() && !cur ? "disabled" : ""} title="${esc(isAdmin() ? t("tab_" + s) : t("follow_admin"))}">
      <span class="n">${mark ? "✓" : i + 1}</span><span class="lbl">${esc(t("tab_" + s))}</span></button>`;
  }).join("");
  const myTurn = !isAdmin() && D.stage === "draft" && D.pickOrder[D.picks.length] === myTeamId() && !draftDone();
  document.title = myTurn ? t("title_turn") : "Geosan Cup Draft";
}
function renderSetup(m) {
  m.innerHTML = `<section class="panel"><div class="card auth"><h2>${esc(t("setup_title"))}</h2><p>${esc(t("setup_lead"))}</p></div></section>`;
}
function renderLogin(m) {
  m.innerHTML = `<section class="panel"><form class="card auth" id="loginForm">
    <h2>${esc(t("signin_title"))}</h2><p>${esc(t("signin_lead"))}</p>
    <div class="field"><label for="liEmail">${esc(t("email"))}</label><input class="input" id="liEmail" data-local type="email" autocomplete="username" required></div>
    <div class="field"><label for="liPw">${esc(t("password"))}</label><input class="input" id="liPw" data-local type="password" autocomplete="current-password" required></div>
    <p class="err" id="liErr" role="alert"></p>
    <button class="btn primary big" type="submit" id="liBtn">${esc(t("signin"))}</button>
  </form>
  <div class="auth" style="margin-top:0;text-align:center;justify-items:center">
    <button type="button" class="btn big" id="watchBtn">👀 ${esc(t("watch"))}</button>
    <p style="font-size:13px">${esc(t("watch_hint"))}</p>
  </div></section>`;
}
function gate(msg, step, label) {
  return `<section class="panel"><div class="card done-banner"><div style="font-size:42px">🏀</div><p style="margin:0;font-size:17px">${esc(msg)}</p>
    ${isAdmin() ? `<button type="button" class="btn primary big" data-step="${step}">${esc(label)} →</button>` : `<p style="margin:0;color:var(--muted)">${esc(t("follow_admin"))}</p>`}</div></section>`;
}

// ---------- teams ----------
function renderTeams(m, movedId) {
  const admin = isAdmin(), locked = draws().length > 0;
  m.innerHTML = `<section class="panel">
    <div class="head"><div><h2>${esc(t("teams_title"))}</h2><p>${esc(t("teams_lead"))}</p></div>
      ${admin ? `<button type="button" class="btn" id="copyWatch">👀 ${esc(t("copy_watch"))}</button>` : ""}</div>
    ${admin && locked ? `<div class="note">🔒 ${esc(t("locked"))}</div>` : ""}
    <div class="teams">${D.teams.map((tm, i) => {
      const n = ticketsFor(i), pct = Math.round(n / 15 * 1000) / 10;
      const linked = !!D.captains?.[tm.id];
      return `<div class="team-row ${tm.id === movedId ? "moved" : ""}" style="--c:${tm.color}">
        <div class="place"><b>#${i + 1}</b><span>${esc(t("place")[i])}</span></div>
        ${admin ? `<div class="field f-name"><label for="tn-${tm.id}">${esc(t("team_name"))}</label>
          <input class="input" id="tn-${tm.id}" data-tname="${tm.id}" value="${esc(tm.name)}" maxlength="28"></div>
        <div class="field f-cap"><label for="tc-${tm.id}">${esc(t("captain"))}</label>
          <input class="input" id="tc-${tm.id}" data-tcap="${tm.id}" value="${esc(tm.captain)}" maxlength="32"></div>`
        : `<div class="field f-name"><label>${esc(t("team_name"))}</label><div class="ro">${esc(tm.name)}</div></div>
           <div class="field f-cap"><label>${esc(t("captain"))}</label><div class="ro ${tm.captain ? "" : "muted"}">${esc(tm.captain || "—")}</div></div>`}
        <div class="tix">
          <div class="tix-row" aria-label="${esc(n === 1 ? t("tickets1") : t("tickets", { n }))}">${Array.from({ length: n }, (_, j) => `<span class="ticket" style="animation-delay:${j * 60}ms"></span>`).join("")}</div>
          <small>${esc(n === 1 ? t("tickets1") : t("tickets", { n }))} · ${esc(t("odds", { p: pct }))}</small>
          <div class="oddsbar"><i style="width:${pct / (5 / 15 * 100) * 100}%"></i></div>
        </div>
        <div class="movers">${admin ? `
          <button type="button" class="btn icon" data-move="${i}" data-dir="-1" ${i === 0 || locked ? "disabled" : ""} aria-label="${esc(t("move_up"))}" title="${esc(t("move_up"))}">▲</button>
          <button type="button" class="btn icon" data-move="${i}" data-dir="1" ${i === 4 || locked ? "disabled" : ""} aria-label="${esc(t("move_down"))}" title="${esc(t("move_down"))}">▼</button>` : ""}
        </div>
        ${admin ? `<div class="login-row"><span class="lbl">${esc(t("login_col"))}</span>${linked
          ? `<span class="ok">✓ ${esc(t("login_ready", { e: privEmails[tm.id] || tm.email || D.captains[tm.id] }))}</span><button type="button" class="btn ghost danger" data-unlink="${tm.id}">${esc(t("unlink"))}</button>`
          : uidMode.has(tm.id)
            ? `<span class="hint">${esc(t("email_in_use"))}</span>
               <input class="input" id="lu-${tm.id}" data-local placeholder="${esc(t("uid"))}" aria-label="${esc(t("uid"))}" autocomplete="off">
               <button type="button" class="btn primary" data-linkuid="${tm.id}">${esc(t("link_uid"))}</button>`
            : `<input class="input" id="le-${tm.id}" data-local type="email" placeholder="${esc(t("captain_email"))}" aria-label="${esc(t("captain_email"))}" autocomplete="off">
               <input class="input" id="lp-${tm.id}" data-local placeholder="${esc(t("password"))}" aria-label="${esc(t("password"))}" autocomplete="new-password">
               <button type="button" class="btn" data-genpw="${tm.id}">${esc(t("gen"))}</button>
               <button type="button" class="btn primary" data-mklogin="${tm.id}">${esc(t("create_login"))}</button>`}</div>` : ""}
      </div>`;
    }).join("")}</div>
    ${admin ? `<div class="actions"><button type="button" class="btn primary big" data-step="players">${esc(t("next_players"))} →</button></div>` : ""}
  </section>`;
}

// ---------- players ----------
function renderPlayers(m) {
  const admin = isAdmin(), dr = drafted(), list = playerList();
  m.innerHTML = `<section class="panel">
    <div class="head"><div><h2>${esc(t("players_title"))}</h2><p>${esc(admin ? t("players_lead_admin") : t("players_lead"))}</p></div>
      <span class="chip"><b>${esc(t("count_players", { n: list.length, r: rounds() }))}</b></span></div>
    <div class="${admin ? "players-layout" : ""}">
      <div class="pgrid">${list.map(p => `
        <div class="pcard">
          <span class="pos ${p.pos}">${p.pos}</span>
          <span class="nm" title="${esc(p.name)}">${esc(p.name)}</span>
          ${admin ? `<select class="input" data-ppos="${p.id}" aria-label="${esc(t("pos"))}" ${dr.has(p.id) ? "disabled" : ""}>
            ${["G","F","C"].map(x => `<option value="${x}" ${p.pos === x ? "selected" : ""}>${x}</option>`).join("")}</select>
          <button type="button" class="x" data-premove="${p.id}" ${dr.has(p.id) ? "disabled" : ""} aria-label="${esc(t("remove"))} ${esc(p.name)}" title="${esc(t("remove"))}">✕</button>` : ""}
        </div>`).join("")}</div>
      ${admin ? `<aside class="side">
        <form class="card" id="addForm">
          <h3>${esc(t("add_player"))}</h3>
          <div class="row2">
            <div class="field"><label for="newName">${esc(t("name"))}</label><input class="input" id="newName" data-local required maxlength="40"></div>
            <div class="field"><label for="newPos">${esc(t("pos"))}</label>
              <select class="input" id="newPos" data-local>${["G","F","C"].map(x => `<option value="${x}">${x} · ${esc(t("pos_" + x))}</option>`).join("")}</select></div>
          </div>
          <div class="actions" style="margin-top:12px"><button class="btn primary" type="submit">+ ${esc(t("add_player"))}</button></div>
        </form>
        <div class="card">
          <h3>${esc(t("bulk_title"))}</h3>
          <div class="field"><label for="bulk">${esc(t("bulk_hint"))}</label><textarea class="input" id="bulk" data-local rows="5"></textarea></div>
          <div class="actions" style="margin-top:12px">
            <button type="button" class="btn ghost danger" id="clearPlayers">${esc(t("clear_players"))}</button>
            <button type="button" class="btn" id="bulkAdd">${esc(t("bulk_add"))}</button>
          </div>
        </div>
      </aside>` : ""}
    </div>
    ${admin ? `<div class="actions"><button type="button" class="btn ghost" data-step="teams">← ${esc(t("tab_teams"))}</button>
      <button type="button" class="btn primary big" data-step="lottery">${esc(t("next_lottery"))} →</button></div>` : ""}
  </section>`;
}

// ---------- lottery ----------
let drum = null;
function renderLottery(m) {
  const admin = isAdmin(), ds = draws(), next = ds.length + 1, done = lotteryDone();
  const tickets = D.lottery?.tickets || buildTickets(D);
  const remainingTeams = D.teams.filter(tm => !order().includes(tm.id));
  const remTickets = tickets.filter(tk => !order().includes(tk.teamId));
  const last = ds.at(-1);
  m.innerHTML = `<section class="panel">
    <div class="head"><div><h2>${esc(t("lottery_title"))}</h2><p>${esc(t("lottery_lead"))}</p></div>
      <label class="toggle"><input type="checkbox" id="snake" ${D.snake ? "checked" : ""} ${!admin || D.picks.length ? "disabled" : ""}> ${esc(t("snake"))}</label></div>
    <div class="lottery">
      <div class="card machine">
        <div class="drum-wrap"><canvas id="drum" width="640" height="640"></canvas></div>
        <div class="chute"></div>
        <div class="reveal ${last ? "" : "idle"}" id="reveal">${last ? revealHTML(last, ds.length) : `<span class="lbl">${esc(admin ? t("reveal_idle_admin") : t("reveal_idle"))}</span>`}</div>
        ${!admin ? "" : done
          ? `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
               <button type="button" class="btn ghost" id="redo">${esc(t("redo_lottery"))}</button>
               <button type="button" class="btn primary big" data-step="draft">${esc(t("start_draft"))} →</button></div>`
          : `<button type="button" class="btn primary big" id="drawBtn">🏀 ${esc(next === 5 ? t("draw_last") : t("draw_btn", { n: next }))}</button>`}
      </div>
      <div class="side">
        <div class="card">
          <h3>${esc(t("order_title"))}</h3>
          <div class="order">${[0, 1, 2, 3, 4].map(i => {
            const d = ds[i], tm = d && team(d.teamId);
            return d ? `<div class="slot filled" style="--c:${tm.color}"><span class="no">${i + 1}</span>
                <div style="min-width:0"><div class="tn">${esc(tm.name)}</div><div class="meta">${esc(t("place")[D.teams.indexOf(tm)])} · ${esc(d.auto ? t("last_auto") : t("ball_label", { n: d.ball }))}</div></div>
                <span class="swatch"></span></div>`
              : `<div class="slot"><span class="no">${i + 1}</span><span>—</span><span></span></div>`;
          }).join("")}</div>
        </div>
        ${done ? "" : `<div class="card">
          <h3>${esc(t("odds_next", { n: next }))}</h3>
          <div class="odds-list">${remainingTeams.map(tm => {
            const k = remTickets.filter(x => x.teamId === tm.id).length, p = k / remTickets.length * 100;
            return `<div class="odds-item" style="--c:${tm.color}"><div class="nm"><span class="swatch"></span><span>${esc(tm.name)}</span></div><b>${p.toFixed(1)}%</b>
              <div class="oddsbar"><i style="width:${p}%"></i></div></div>`;
          }).join("")}</div>
        </div>`}
      </div>
    </div>
  </section>`;
  startDrum(remTickets);
}
function revealHTML(d, n) {
  const tm = team(d.teamId);
  return `<div class="bigball" style="--c:${tm.color}">${d.auto ? n : d.ball}</div>
    <span class="lbl">${esc(d.auto ? t("reveal_last", { n }) : t("reveal_pick", { b: d.ball, n }))}</span>
    <span class="who" style="color:${tm.color}">${esc(tm.name)}</span>`;
}
function startDrum(tickets) {
  const cv = $("#drum"); if (!cv) return;
  const ctx = cv.getContext("2d"), W = cv.width, R = W / 2 - 18, cx = W / 2, cy = W / 2, br = 30;
  const balls = tickets.map(tk => {
    const a = Math.random() * Math.PI * 2, d = Math.random() * (R - br - 10);
    return { ...tk, x: cx + Math.cos(a) * d, y: cy + Math.sin(a) * d + R * .3, vx: (Math.random() - .5) * 2, vy: 0, color: team(tk.teamId).color };
  });
  drum = { raf: 0, mix: 0, target: 0 };
  let angle = 0;
  const step = () => {
    drum.mix += (drum.target - drum.mix) * 0.06;
    const mixP = drum.mix;
    angle += 0.004 + mixP * 0.05;
    for (const b of balls) {
      b.vy += 0.35;
      if (mixP > .02) { b.vx += (Math.random() - .5) * 3.2 * mixP; b.vy -= Math.random() * 1.6 * mixP + .25 * mixP; }
      b.vx *= .992; b.vy *= .992; b.x += b.vx; b.y += b.vy;
      const dx = b.x - cx, dy = b.y - cy, dist = Math.hypot(dx, dy), lim = R - br;
      if (dist > lim) {
        const nx = dx / dist, ny = dy / dist;
        b.x = cx + nx * lim; b.y = cy + ny * lim;
        const dot = b.vx * nx + b.vy * ny;
        b.vx -= 1.75 * dot * nx; b.vy -= 1.75 * dot * ny;
        b.vx += -ny * 0.4; b.vy += nx * 0.4;
      }
    }
    for (let i = 0; i < balls.length; i++) for (let j = i + 1; j < balls.length; j++) {
      const a = balls[i], c = balls[j], dx = c.x - a.x, dy = c.y - a.y, d = Math.hypot(dx, dy) || 1;
      if (d < br * 2) {
        const o = (br * 2 - d) / 2, nx = dx / d, ny = dy / d; a.x -= nx * o; a.y -= ny * o; c.x += nx * o; c.y += ny * o;
        const rv = (c.vx - a.vx) * nx + (c.vy - a.vy) * ny; if (rv < 0) { a.vx += rv * nx * .9; a.vy += rv * ny * .9; c.vx -= rv * nx * .9; c.vy -= rv * ny * .9; }
      }
    }
    ctx.clearRect(0, 0, W, W);
    const g = ctx.createRadialGradient(cx - 60, cy - 80, 20, cx, cy, R + 10);
    g.addColorStop(0, "rgba(120,160,240,.16)"); g.addColorStop(1, "rgba(20,30,60,.5)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.fill();
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(angle); ctx.strokeStyle = "rgba(160,190,255,.10)"; ctx.lineWidth = 3;
    for (let k = 0; k < 6; k++) { ctx.rotate(Math.PI / 3); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(R, 0); ctx.stroke(); }
    ctx.restore();
    for (const b of balls) {
      const bg = ctx.createRadialGradient(b.x - 9, b.y - 10, 2, b.x, b.y, br);
      bg.addColorStop(0, "#ffffffcc"); bg.addColorStop(.25, b.color); bg.addColorStop(1, shade(b.color));
      ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(b.x, b.y, br, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(b.x, b.y, 15, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0a1222"; ctx.font = "700 17px 'JetBrains Mono', monospace"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
      ctx.fillText(b.n, b.x, b.y + 1);
    }
    ctx.strokeStyle = "rgba(180,205,255,.35)"; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,.18)"; ctx.lineWidth = 4; ctx.beginPath(); ctx.arc(cx, cy, R - 14, Math.PI * 1.1, Math.PI * 1.45); ctx.stroke();
    drum.raf = requestAnimationFrame(step);
  };
  step();
}
function shade(hex) {
  const n = parseInt(hex.slice(1), 16), f = .55;
  return `rgb(${(n >> 16 & 255) * f | 0},${(n >> 8 & 255) * f | 0},${(n & 255) * f | 0})`;
}
function stopDrum() { if (drum) { cancelAnimationFrame(drum.raf); drum = null; } }

// state that changes without a re-render: lottery mixing, shot clock
function syncLive() {
  if (!D || docState !== "ok") return;
  const drawing = !!D.lottery?.drawing;
  if (drum) drum.target = drawing ? 1 : 0;
  const rv = $("#reveal");
  if (rv && drawing && !rv.dataset.mixing) { rv.dataset.mixing = "1"; rv.className = "reveal idle"; rv.innerHTML = `<span class="lbl">${esc(t("drawing"))}</span>`; }
  const db = $("#drawBtn");
  if (db) { db.disabled = drawing || busy; db.textContent = drawing ? t("drawing") : "🏀 " + (draws().length === 4 ? t("draw_last") : t("draw_btn", { n: draws().length + 1 })); }
  paintClock();
}
function paintClock() {
  const led = $("#shotLed"); if (!led || !D) return;
  const start = D.turnStartedAt?.toMillis?.();
  const left = start ? Math.max(0, SHOT - Math.floor((Date.now() - start) / 1000)) : SHOT;
  led.textContent = String(Math.min(SHOT, left)).padStart(2, "0");
  led.classList.toggle("warn", left <= 10);
}
setInterval(paintClock, 250);

// ---------- draft ----------
function renderDraft(m) {
  if (totalPicks() === 0) return m.innerHTML = gate(t("draft_need_players"), "players", t("go_players"));
  if (!lotteryDone()) return m.innerHTML = gate(t("draft_need_lottery"), "lottery", t("go_lottery"));
  const tot = totalPicks(), i = D.picks.length, admin = isAdmin();
  let top;
  if (draftDone()) {
    top = `<div class="card done-banner"><div style="font-size:48px">🏆</div><h2>${esc(t("draft_done"))}</h2>
      ${admin ? `<div style="display:flex;gap:10px;flex-wrap:wrap;justify-content:center">
      <button type="button" class="btn ghost" id="undoBtn">↶ ${esc(t("undo"))}</button>
      <button type="button" class="btn primary big" data-step="results">${esc(t("see_results"))} →</button></div>` : ""}</div>`;
  } else {
    const tid = D.pickOrder[i], tm = team(tid), mine = tid === myTeamId();
    const canPick = admin || mine;
    const ups = [];
    for (let k = i + 1; k < Math.min(tot, i + 6); k++) { const u = team(D.pickOrder[k]); ups.push(`<span class="chip"><span class="num">#${k + 1}</span><span class="swatch" style="--c:${u.color}"></span>${esc(u.name)}</span>`); }
    const banner = admin ? `<div class="turn admin">⚑ ${esc(t("admin_pick"))}</div>`
      : mine ? `<div class="turn mine">🏀 ${esc(t("your_turn"))}</div>`
      : `<div class="turn wait">⏳ ${esc(t("waiting_for", { t: tm.name }))}</div>`;
    top = `${banner}<div class="clock" id="clockCard" style="--c:${tm.color}">
        <div class="who"><span class="tag">${esc(t("on_clock"))}</span><h2>${esc(tm.name)}</h2>
          <div class="sub">${esc(t("round", { r: Math.floor(i / 5) + 1 }))} · ${esc(t("pick_of", { n: i + 1, t: tot }))}${tm.captain ? " · " + esc(t("captain_short", { c: tm.captain })) : ""}</div></div>
        <div class="shot"><div class="led" id="shotLed">${SHOT}</div></div>
      </div>
      <div class="upnext">${ups.length ? `<b>${esc(t("next_up"))}:</b> ${ups.join("")}` : ""}
        <span style="flex:1"></span>${admin ? `<button type="button" class="btn ghost" id="undoBtn" ${D.picks.length ? "" : "disabled"}>↶ ${esc(t("undo"))}</button>` : ""}</div>
      <div class="filters">
        <input class="input" id="q" data-local type="search" placeholder="${esc(t("search"))}" value="${esc(filter.q)}" aria-label="${esc(t("search"))}">
        ${["all", "G", "F", "C"].map(p => `<button type="button" class="fchip" data-fpos="${p}" aria-pressed="${filter.pos === p}">${esc(p === "all" ? t("all") : p + " · " + t("pos_" + p))}</button>`).join("")}
      </div>
      <div class="pool" id="pool" data-can="${canPick ? 1 : 0}" style="--oc:${tm.color}"></div>`;
  }
  m.innerHTML = `<section class="panel"><div class="draft"><div style="min-width:0">${top}</div>
    <aside><div class="head" style="margin-bottom:10px"><h2 style="font-size:18px">${esc(t("rosters"))}</h2></div><div class="rosters" id="rosters"></div></aside></div></section>`;
  renderPool(); renderRosters(); paintClock();
}
function renderPool() {
  const el = $("#pool"); if (!el) return;
  const can = el.dataset.can === "1", d = drafted(), q = filter.q.trim().toLowerCase();
  const list = playerList().filter(p => !d.has(p.id) && (filter.pos === "all" || p.pos === filter.pos) && (!q || p.name.toLowerCase().includes(q)));
  el.innerHTML = list.length ? list.map(p => `<button type="button" class="pbtn" data-pick="${p.id}" ${can ? "" : "disabled"}><span class="pos ${p.pos}">${p.pos}</span><span class="nm">${esc(p.name)}</span></button>`).join("")
    : `<div class="empty" style="grid-column:1/-1">${esc(t("empty_pool"))}</div>`;
}
function renderRosters() {
  const el = $("#rosters"); if (!el) return;
  const cur = draftDone() ? null : D.pickOrder[D.picks.length];
  el.innerHTML = order().map(id => {
    const tm = team(id), mine = D.picks.map((p, i) => ({ ...p, i })).filter(p => p.teamId === id);
    return `<div class="roster ${id === cur ? "active" : ""}" style="--c:${tm.color}">
      <header><span class="swatch"></span><b>${esc(tm.name)}</b><span class="cnt">${mine.length}</span></header>
      ${mine.length ? `<ol>${mine.map(p => `<li class="${p.i === lastNewPick ? "new" : ""}"><span class="pk">${p.i + 1}</span>${esc(player(p.playerId)?.name)}</li>`).join("")}</ol>` : `<div class="none">${esc(t("no_picks"))}</div>`}
    </div>`;
  }).join("");
}
function askPick(pid) {
  const p = player(pid), tm = team(D.pickOrder[D.picks.length]);
  modal(`<h3>${esc(t("confirm_title"))}</h3>
    <div class="vs" style="--c:${tm.color}"><span class="pos ${p.pos}" style="width:34px;height:34px">${p.pos}</span><span class="p">${esc(p.name)}</span><span class="arrow">↓</span><span class="t"><span class="swatch"></span>${esc(tm.name)}</span></div>
    <div class="row"><button type="button" class="btn" data-close>${esc(t("cancel"))}</button><button type="button" class="btn primary big" id="doPick">🏀 ${esc(t("confirm"))}</button></div>`,
    () => { const ok = $("#doPick"); ok.focus(); ok.onclick = () => { ok.disabled = true; closeModal(); makePick(pid); }; });
}

// ---------- results ----------
function resultsText() {
  return order().map(id => {
    const tm = team(id);
    const names = D.picks.map((p, i) => ({ ...p, i })).filter(p => p.teamId === id).map(p => `  ${p.i + 1}. ${player(p.playerId)?.name} (${player(p.playerId)?.pos})`);
    return `${tm.name}${tm.captain ? " — " + t("captain_short", { c: tm.captain }) : ""}\n${names.join("\n")}`;
  }).join("\n\n");
}
function renderResults(m) {
  if (!lotteryDone() || !D.picks.length) return m.innerHTML = gate(t("results_none"), lotteryDone() ? "draft" : "lottery", lotteryDone() ? t("tab_draft") : t("go_lottery"));
  m.innerHTML = `<section class="panel">
    <div class="head"><div><h2>${esc(t("results_title"))}</h2><p>${esc(t("results_lead"))}</p></div>
      <button type="button" class="btn primary" id="copyBtn">⧉ ${esc(t("copy"))}</button></div>
    <div class="results">${order().map((id, k) => {
      const tm = team(id), mine = D.picks.map((p, i) => ({ ...p, i })).filter(p => p.teamId === id);
      return `<div class="rcard" style="--c:${tm.color};animation-delay:${k * 80}ms"><h3>${esc(tm.name)}</h3>
        <div class="cap">${tm.captain ? esc(t("captain_short", { c: tm.captain })) : esc(t("place")[D.teams.indexOf(tm)])}</div>
        <ol>${mine.map(p => { const pl = player(p.playerId); return `<li><span class="pos ${pl.pos}">${pl.pos}</span><span class="nm">${esc(pl.name)}</span><span class="pk">#${p.i + 1}</span></li>`; }).join("")}</ol></div>`;
    }).join("")}</div>
    <textarea class="input" id="copyText" readonly hidden aria-label="${esc(t("copy"))}"></textarea>
  </section>`;
}

// ---------- modal / toast / confetti ----------
function modal(html, after) {
  closeModal();
  const o = document.createElement("div"); o.className = "overlay"; o.id = "overlay";
  o.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
  o.addEventListener("click", e => { if (e.target === o || e.target.closest("[data-close]")) closeModal(); });
  document.body.appendChild(o); after && after();
}
function closeModal() { $("#overlay")?.remove(); }
function confirmBox(msg, yes, fn) {
  modal(`<p style="font-size:16px">${esc(msg)}</p><div class="row"><button type="button" class="btn" data-close>${esc(t("cancel"))}</button>
    <button type="button" class="btn primary" id="yesBtn">${esc(yes)}</button></div>`, () => { $("#yesBtn").onclick = () => { closeModal(); fn(); }; $("#yesBtn").focus(); });
}
function toast(msg) { const d = document.createElement("div"); d.className = "toast"; d.setAttribute("role", "status"); d.textContent = msg; document.body.appendChild(d); setTimeout(() => d.remove(), 2700); }
async function copyText(txt) {
  try { await navigator.clipboard.writeText(txt); toast(t("copied")); return true; } catch { toast(t("copy_fail")); return false; }
}

const cf = $("#confetti"), cx2 = cf.getContext("2d"); let parts = [], cfRaf = 0;
function burst(color, n) {
  if (reduced) return;
  cf.width = innerWidth * devicePixelRatio; cf.height = innerHeight * devicePixelRatio;
  const pal = [color, "#ffffff", "#ffb547", color];
  for (let i = 0; i < n; i++) {
    const fromLeft = i % 2;
    parts.push({ x: (fromLeft ? .05 : .95) * cf.width, y: cf.height * .75, vx: (fromLeft ? 1 : -1) * (6 + Math.random() * 14) * devicePixelRatio, vy: -(12 + Math.random() * 16) * devicePixelRatio,
      s: (5 + Math.random() * 7) * devicePixelRatio, r: Math.random() * 6, vr: (Math.random() - .5) * .4, c: pal[i % pal.length], life: 0 });
  }
  if (!cfRaf) cfRaf = requestAnimationFrame(cfStep);
}
function cfStep() {
  cx2.clearRect(0, 0, cf.width, cf.height);
  parts = parts.filter(p => p.life < 220 && p.y < cf.height + 40);
  for (const p of parts) {
    p.vy += .45 * devicePixelRatio; p.vx *= .985; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
    cx2.save(); cx2.translate(p.x, p.y); cx2.rotate(p.r); cx2.fillStyle = p.c; cx2.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); cx2.restore();
  }
  cfRaf = parts.length ? requestAnimationFrame(cfStep) : 0;
  if (!cfRaf) cx2.clearRect(0, 0, cf.width, cf.height);
}

// ---------- events ----------
document.addEventListener("click", e => {
  const el = e.target.closest("button"); if (!el || el.disabled) return;
  if (el.dataset.lang) { lang = el.dataset.lang; try { localStorage.setItem("gd-lang", lang); } catch {} render(); return; }
  if (el.id === "signOut") return signOut(auth);
  if (el.id === "watchBtn") { spectator = true; history.replaceState(null, "", "#watch"); subscribe(); return; }
  if (el.id === "toLogin") { spectator = false; history.replaceState(null, "", location.pathname); subscribe(); return; }
  if (el.id === "copyWatch") return copyText(watchUrl());
  if (el.id === "createDraft") return setDoc(ref, seedDoc()).catch(err => toast(t("save_err", { e: err.code })));
  if (el.dataset.step) { if (isAdmin() && el.dataset.step !== D.stage) setStage(el.dataset.step); return; }
  if (el.dataset.fpos) { filter.pos = el.dataset.fpos; document.querySelectorAll("[data-fpos]").forEach(b => b.setAttribute("aria-pressed", b === el)); renderPool(); return; }
  if (el.dataset.pick) return askPick(el.dataset.pick);
  if (el.id === "copyBtn") {
    const txt = resultsText();
    copyText(txt).then(ok => { if (!ok) { const ta = $("#copyText"); ta.hidden = false; ta.value = txt; ta.focus(); ta.select(); } });
    return;
  }
  if (!isAdmin()) return;
  // admin-only actions below; firestore.rules rejects them for anyone else
  if (el.id === "resetBtn") return confirmBox(t("reset_q"), t("reset_yes"), async () => {
    if (await adminSave(d => { d.lottery = null; d.picks = []; d.draftedIds = []; d.turnStartedAt = null; d.stage = "teams"; })) toast(t("reset_done"));
  });
  if (el.dataset.move != null) {
    const i = +el.dataset.move, j = i + +el.dataset.dir; if (j < 0 || j > 4) return;
    adminSave(d => { [d.teams[i], d.teams[j]] = [d.teams[j], d.teams[i]]; if (!draws(d).length) d.lottery = null; });
    return;
  }
  if (el.dataset.genpw) {
    const chars = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789", a = new Uint32Array(10); crypto.getRandomValues(a);
    $("#lp-" + el.dataset.genpw).value = [...a].map(x => chars[x % chars.length]).join("");
    return;
  }
  if (el.dataset.mklogin) { const id = el.dataset.mklogin; el.disabled = true; createCaptainLogin(id, $("#le-" + id).value, $("#lp-" + id).value).finally(() => { el.disabled = false; }); return; }
  if (el.dataset.linkuid) {
    const id = el.dataset.linkuid, v = $("#lu-" + id).value.trim(); if (!v) return;
    adminSave(d => { d.captains[id] = v; }).then(ok => { if (ok) { uidMode.delete(id); lastKey = ""; render(); } });
    return;
  }
  if (el.dataset.unlink) {
    const id = el.dataset.unlink;
    return confirmBox(t("unlink_q"), t("unlink"), async () => {
      if (!await adminSave(d => { delete d.captains[id]; delete d.teams.find(x => x.id === id).email; })) return;
      const { [id]: _, ...rest } = privEmails;
      setDoc(privRef, { emails: rest }).catch(e => toast(t("save_err", { e: e.code })));
    });
  }
  if (el.dataset.premove) { const id = el.dataset.premove; adminSave(d => { if (!d.draftedIds.includes(id)) delete d.players[id]; }); return; }
  if (el.id === "clearPlayers") return confirmBox(t("clear_players") + "?", t("clear_players"), () => adminSave(d => {
    for (const id of Object.keys(d.players)) if (!d.draftedIds.includes(id)) delete d.players[id];
  }));
  if (el.id === "bulkAdd") {
    const lines = $("#bulk").value.split(/\n+/).map(s => s.trim()).filter(Boolean);
    if (!lines.length) return;
    adminSave(d => {
      let o = Math.max(-1, ...Object.values(d.players).map(p => p.o)) + 1;
      for (const ln of lines) {
        const [nm, ps] = ln.split(/[,;\t]/).map(s => s.trim());
        const pos = (ps || "").toUpperCase()[0];
        if (nm) d.players[uid()] = { name: nm.slice(0, 40), pos: ["G", "F", "C"].includes(pos) ? pos : "F", o: o++ };
      }
    }).then(ok => { if (ok) $("#bulk").value = ""; });
    return;
  }
  if (el.id === "drawBtn") return drawNext();
  if (el.id === "redo") {
    if (D.picks.length) return toast(t("redo_blocked"));
    return confirmBox(t("redo_q"), t("redo_yes"), () => adminSave(d => { d.lottery = { tickets: buildTickets(d), draws: [], drawing: false }; }));
  }
  if (el.id === "undoBtn") {
    if (!D.picks.length) return;
    adminSave(d => { d.picks.pop(); d.draftedIds.pop(); d.turnStartedAt = serverTimestamp(); });
  }
});
document.addEventListener("input", e => {
  const el = e.target;
  if (el.id === "q") { filter.q = el.value; renderPool(); return; }
  if (!isAdmin()) return;
  if (el.dataset.tname) { const id = el.dataset.tname, v = el.value.trim() || "—"; adminSaveLater("n" + id, d => { d.teams.find(x => x.id === id).name = v; }); }
  else if (el.dataset.tcap) { const id = el.dataset.tcap, v = el.value; adminSaveLater("c" + id, d => { d.teams.find(x => x.id === id).captain = v; }); }
});
document.addEventListener("change", e => {
  const el = e.target;
  if (!isAdmin()) return;
  if (el.dataset.ppos) { const id = el.dataset.ppos, v = el.value; adminSave(d => { if (d.players[id]) d.players[id].pos = v; }); }
  if (el.id === "snake") { const v = el.checked; adminSave(d => { d.snake = v; }); }
});
document.addEventListener("submit", async e => {
  e.preventDefault();
  if (e.target.id === "loginForm") {
    const btn = $("#liBtn"), err = $("#liErr"); btn.disabled = true; err.textContent = "";
    try { await signInWithEmailAndPassword(auth, $("#liEmail").value.trim(), $("#liPw").value); }
    catch (x) {
      err.textContent = ["auth/invalid-credential", "auth/wrong-password", "auth/user-not-found", "auth/invalid-email"].includes(x.code) ? t("signin_err") : t("signin_err_other", { e: x.code || x.message });
      btn.disabled = false;
    }
    return;
  }
  if (e.target.id === "addForm" && isAdmin()) {
    const nm = $("#newName").value.trim(), pos = $("#newPos").value; if (!nm) return;
    const ok = await adminSave(d => { const o = Math.max(-1, ...Object.values(d.players).map(p => p.o)) + 1; d.players[uid()] = { name: nm, pos, o }; });
    if (ok) { $("#newName").value = ""; $("#newName").focus(); }
  }
});
document.addEventListener("keydown", e => { if (e.key === "Escape") closeModal(); });

render();
