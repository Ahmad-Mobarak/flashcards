/* Flashcards logic: navigation, search, theme, keyboard shortcuts, persistence. */

const FLASHCARDS = [
  {
    q: "What are the main types of information security threats?",
    a: "There are three main types:\n\nNatural Threats: Like earthquakes or floods.\nPhysical Threats: Like theft or fire.\nHuman Threats: Like attacks by angry employees or outsiders",
  },
  {
    q: "What is the difference between ethical hackers and malicious hackers",
    a: "Ethical hackers have permission to hack and aim to fix problems. Malicious hackers hack to steal\nor cause harm.",
  },
  {
    q: "What are the types of ethical hacking mentioned?",
    a: "The types are:\n\nSystem Hacking\nSocial Engineering\nWeb Server Hacking\nWeb Application Hacking\nWireless Networks Hacking",
  },
  {
    q: "What are the goals of ethical hacking?",
    a: "The goals are:\n\nProtect the organization’s privacy.\nReport any security problems found.\nTell vendors about fixes needed.",
  },
  {
    q: "Explain the five phases of ethical hacking and their importance.",
    a: "The five phases are reconnaissance, scanning, gaining access, maintaining access, and covering\ntracks, all used to test security",
  },
  {
    q: "Describe some common tools used in reconnaissance and scanning.",
    a: "Common tools: Nslookup, Whois (reconnaissance); Nmap, Nessus (scanning); Metasploit, John\nthe Ripper (exploitation).",
  },
  {
    q: "What is Footprinting, and why is it important in ethical hacking?",
    a: "Footprinting is the process of gathering information about a target before an attack, helping to\nidentify vulnerabilities and minimize the attack surface.",
  },
  {
    q: "What is the difference between Passive and Active Footprinting?",
    a: "Passive Footprinting involves gathering information without direct interaction, while Active\nFootprinting includes direct engagement, such as DNS queries.",
  },
  {
    q: "What are some threats caused by Footprinting?",
    a: "Threats include social engineering, information leakage, privacy loss, corporate espionage, and\nfinancial losses.",
  },
  {
    q: "Why is NetBIOS enumeration commonly targeted by attackers?",
    a: "It provides details about network shares, users, and policies. Since NetBIOS is often enabled by\ndefault, attackers exploit it easily.",
  },
  {
    q: "What is Ethical Hacking?",
    a: "Ethical hacking is testing computers, networks, or apps to find security problems. It’s done with\npermission to make systems safer",
  },
  {
    q: "What does OSINT stand for?",
    a: "Open-Source Intelligence.",
  },
  {
    q: "What can be gathered using OSINT?",
    a: "Employee roles\nDomain names / IP ranges\nTech stacks from job posts",
  },
  {
    q: "What is the \"Path of Least Resistance\"?",
    a: "The weakest link in a defense that an attacker targets.",
  },
  {
    q: "What are valuable OSINT sources for an attacker?",
    a: "Social Media\nGitHub and Stack Overflow\nCorporate annual reports and job postings",
  },
  {
    q: "What is the primary purpose of Ethical Hacking?",
    a: "To identify and fix vulnerabilities before they are exploited.",
  },
  {
    q: "What is a \"Grey Hat\" hacker?",
    a: "Someone who hacks without permission but usually without malicious intent.",
  },
  {
    q: "What tool categories are commonly found in Kali Linux?",
    a: "Information Gathering\nPassword and Wireless Attacks\nExploitation Tools",
  },
  {
    q: "What must a successful ethical hacker do?",
    a: "Always get written authorization\nDocument everything for the final report\nThink like an attacker to find weaknesses",
  },
  {
    q: "What is the primary definition of Risk Management?",
    a: "A proactive and structured approach to manage and mitigate negative events.",
  },
  {
    q: "What are the two main factors used to assess a risk?",
    a: "Likelihood and Impact.",
  },
  {
    q: "What can happen if an attacker completes the Actions on Objectives stage?",
    a: "Data theft\nRansomware\nDamage to the organization's reputation",
  },
  {
    q: "What is the main difference between a hacker and an ethical hacker?",
    a: "Ethical hackers have the owner's permission to test the system.",
  },
  {
    q: "What does the acronym \"XSS\" stand for?",
    a: "Cross-Site Scripting.",
  },
  {
    q: "What are the recognized stages in the Hacking Life Cycle?",
    a: "Footprinting\nEnumeration\nGaining Access",
  },
  {
    q: "What are effective ways to prevent XSS attacks?",
    a: "Sanitize HTML input\nUse a Content Security Policy (CSP)\nUse proper output escaping or encoding",
  },
];

// Elements
const els = {
  question: document.getElementById("question"),
  answer: document.getElementById("answer"),
  answerWrap: document.getElementById("answerWrap"),
  progress: document.getElementById("progress"),

  prevBtn: document.getElementById("prevBtn"),
  nextBtn: document.getElementById("nextBtn"),
  randomBtn: document.getElementById("randomBtn"),
  toggleAnswerBtn: document.getElementById("toggleAnswerBtn"),

  themeToggle: document.getElementById("themeToggle"),

  searchInput: document.getElementById("searchInput"),
  searchStatus: document.getElementById("searchStatus"),
  prevMatch: document.getElementById("prevMatch"),
  nextMatch: document.getElementById("nextMatch"),
  clearSearch: document.getElementById("clearSearch"),
};

// Storage keys
const STORAGE = {
  index: "flashcards:lastIndex",
  show: "flashcards:showAnswer",
  theme: "flashcards:theme",
};

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}

function safeParseInt(v, fallback = 0) {
  const n = Number.parseInt(v, 10);
  return Number.isFinite(n) ? n : fallback;
}

let state = {
  index: 0,
  showAnswer: false,
  // Search state
  query: "",
  matchIndexes: /** @type {number[]} */ ([]),
  matchCursor: 0,
};

function loadState() {
  const idx = safeParseInt(localStorage.getItem(STORAGE.index), 0);
  const show = localStorage.getItem(STORAGE.show);

  state.index = clamp(idx, 0, FLASHCARDS.length - 1);
  state.showAnswer = show === "1";
}

function saveState() {
  localStorage.setItem(STORAGE.index, String(state.index));
  localStorage.setItem(STORAGE.show, state.showAnswer ? "1" : "0");
}

function setTheme(theme) {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
  localStorage.setItem(STORAGE.theme, theme);
}

function loadTheme() {
  const saved = localStorage.getItem(STORAGE.theme);
  if (saved === "light" || saved === "dark") {
    setTheme(saved);
    return;
  }
  // Default: follow OS preference
  const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
}

function render() {
  const card = FLASHCARDS[state.index];
  els.question.textContent = card.q;
  els.answer.textContent = card.a;
  els.progress.textContent = `${state.index + 1} / ${FLASHCARDS.length}`;

  els.answerWrap.hidden = !state.showAnswer;
  els.toggleAnswerBtn.textContent = state.showAnswer ? "Hide Answer" : "Show Answer";

  saveState();
}

function goTo(index, { showAnswer = null } = {}) {
  state.index = clamp(index, 0, FLASHCARDS.length - 1);
  if (showAnswer !== null) state.showAnswer = !!showAnswer;
  render();
}

function prev() {
  const nextIndex = (state.index - 1 + FLASHCARDS.length) % FLASHCARDS.length;
  goTo(nextIndex);
}

function next() {
  const nextIndex = (state.index + 1) % FLASHCARDS.length;
  goTo(nextIndex);
}

function random() {
  if (FLASHCARDS.length <= 1) return;
  let i = state.index;
  while (i === state.index) i = Math.floor(Math.random() * FLASHCARDS.length);
  goTo(i);
}

function toggleAnswer() {
  state.showAnswer = !state.showAnswer;
  render();
}

function normalize(s) {
  return s.toLowerCase().trim();
}

function computeMatches(query) {
  const qn = normalize(query);
  if (!qn) return [];

  const res = [];
  for (let i = 0; i < FLASHCARDS.length; i++) {
    const hay = `${FLASHCARDS[i].q}\n${FLASHCARDS[i].a}`.toLowerCase();
    if (hay.includes(qn)) res.push(i);
  }
  return res;
}

function updateSearchUI() {
  const hasQuery = !!state.query;
  const matches = state.matchIndexes.length;

  els.clearSearch.disabled = !hasQuery;
  els.prevMatch.disabled = !(hasQuery && matches > 0);
  els.nextMatch.disabled = !(hasQuery && matches > 0);

  if (!hasQuery) {
    els.searchStatus.textContent = "No search";
    return;
  }

  if (matches === 0) {
    els.searchStatus.textContent = "0 matches";
    return;
  }

  els.searchStatus.textContent = `${matches} match${matches === 1 ? "" : "es"} • viewing ${state.matchCursor + 1}/${matches}`;
}

function runSearch(query) {
  state.query = query;
  state.matchIndexes = computeMatches(query);
  state.matchCursor = 0;

  updateSearchUI();

  if (state.matchIndexes.length > 0) {
    goTo(state.matchIndexes[0]);
  }
}

function cycleMatch(dir) {
  const matches = state.matchIndexes.length;
  if (matches === 0) return;

  state.matchCursor = (state.matchCursor + dir + matches) % matches;
  updateSearchUI();
  goTo(state.matchIndexes[state.matchCursor]);
}

function clearSearch() {
  els.searchInput.value = "";
  state.query = "";
  state.matchIndexes = [];
  state.matchCursor = 0;
  updateSearchUI();
}

// Event wiring
els.prevBtn.addEventListener("click", prev);
els.nextBtn.addEventListener("click", next);
els.randomBtn.addEventListener("click", random);
els.toggleAnswerBtn.addEventListener("click", toggleAnswer);

els.themeToggle.addEventListener("click", () => {
  const current = localStorage.getItem(STORAGE.theme) || "dark";
  setTheme(current === "light" ? "dark" : "light");
});

let searchDebounce = null;
els.searchInput.addEventListener("input", (e) => {
  const value = e.target.value;
  if (searchDebounce) window.clearTimeout(searchDebounce);
  searchDebounce = window.setTimeout(() => runSearch(value), 120);
});

els.prevMatch.addEventListener("click", () => cycleMatch(-1));
els.nextMatch.addEventListener("click", () => cycleMatch(+1));
els.clearSearch.addEventListener("click", clearSearch);

document.addEventListener("keydown", (e) => {
  const tag = (e.target && e.target.tagName) ? e.target.tagName.toLowerCase() : "";
  const isTyping = tag === "input" || tag === "textarea" || e.target?.isContentEditable;

  // Allow Escape to blur search quickly
  if (e.key === "Escape" && isTyping) {
    e.target.blur();
    return;
  }

  if (isTyping) return;

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    prev();
  } else if (e.key === "ArrowRight") {
    e.preventDefault();
    next();
  } else if (e.key === " ") {
    e.preventDefault();
    toggleAnswer();
  } else if (e.key.toLowerCase() === "r") {
    e.preventDefault();
    random();
  }
});

// Init
loadTheme();
loadState();
updateSearchUI();
render();
