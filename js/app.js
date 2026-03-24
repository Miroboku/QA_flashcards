// ===== SIDEBAR =====
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function closeAllSubMenus() {
  if (!sidebar) return;
  Array.from(sidebar.getElementsByClassName('show')).forEach((ul) => {
    ul.classList.remove('show');
    if (ul.previousElementSibling) {
      ul.previousElementSibling.classList.remove('rotate');
    }
  });
}

function toggleSidebar() {
  if (!sidebar || !toggleButton) return;
  sidebar.classList.toggle('close');
  toggleButton.classList.toggle('rotate');
  closeAllSubMenus();
}

function toggleSubMenu(button) {
  if (!sidebar || !button || !button.nextElementSibling) return;
  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  if (sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
  }
}

window.toggleSidebar = toggleSidebar;
window.toggleSubMenu = toggleSubMenu;

// ===== Darkmode =====
let darkmode = localStorage.getItem('darkmode');
const themeSwitch = document.getElementById('theme-switch');

const enableDarkmode = () => {
  document.body.classList.add('darkmode');
  localStorage.setItem('darkmode', 'active');
};

const disableDarkmode = () => {
  document.body.classList.remove('darkmode');
  localStorage.setItem('darkmode', null);
};

if (darkmode === 'active') enableDarkmode();

if (themeSwitch) {
  themeSwitch.addEventListener('click', () => {
    darkmode = localStorage.getItem('darkmode');
    darkmode !== 'active' ? enableDarkmode() : disableDarkmode();
  });
}

// ===== Основні вкладки (Теорія / Карточки) =====
const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function setActiveTab(targetId) {
  tabButtons.forEach((b) => {
    const t = b.getAttribute('data-tab');
    b.classList.toggle('active', t === targetId);
  });
  tabContents.forEach((c) => {
    c.classList.toggle('active', c.id === targetId);
  });
  if (targetId) localStorage.setItem('qa_activeMainTab', targetId);
}

const savedMainTab = localStorage.getItem('qa_activeMainTab');
if (savedMainTab) setActiveTab(savedMainTab);

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    setActiveTab(btn.getAttribute('data-tab'));
  });
});

// ===== Саб-вкладки Теорії =====
const subtabButtons = document.querySelectorAll('.subtab-btn');
const subtabContents = document.querySelectorAll('.subtab-content');

function setActiveSubtab(targetId) {
  subtabButtons.forEach((b) => {
    const t = b.getAttribute('data-subtab');
    b.classList.toggle('active', t === targetId);
  });
  subtabContents.forEach((c) => {
    c.classList.toggle('active', c.id === targetId);
  });
  if (targetId) localStorage.setItem('qa_activeSubtab', targetId);
}

const savedSubtab = localStorage.getItem('qa_activeSubtab');
if (savedSubtab) setActiveSubtab(savedSubtab);

subtabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-subtab');
    setActiveSubtab(targetId);
    highlightSidebarBySubtab(targetId);
  });
});

// ===== Flashcards (Дані беруться з data.js) =====
let filteredCards = cards.slice();
let currentIndex = -1;
let shownCount = 0;

const topicFilter = document.getElementById('topicFilter');
const nextCardBtn = document.getElementById('nextCardBtn');
const showAnswerBtn = document.getElementById('showAnswerBtn');
const questionText = document.getElementById('questionText');
const answerBlock = document.getElementById('answerBlock');
const answerText = document.getElementById('answerText');
const topicTag = document.getElementById('topicTag');
const indexInfo = document.getElementById('indexInfo');
const progressInfo = document.getElementById('progressInfo');

function filterCards() {
  if (!topicFilter) return;
  const topic = topicFilter.value;
  filteredCards = topic === 'all' ? cards.slice() : cards.filter((c) => c.topic === topic);
  currentIndex = -1;
  shownCount = 0;
  progressInfo.textContent = `Карточка: 0 / ${filteredCards.length}`;
  indexInfo.textContent = '';
  questionText.textContent = 'Натисни «Наступна карточка», щоб розпочати.';
  answerBlock.style.display = 'none';
  topicTag.textContent = 'Тема: —';
}

function filterCardsByTopicName(topic) {
  filteredCards = topic === 'all' ? cards.slice() : cards.filter((c) => c.topic === topic);
  currentIndex = -1;
  shownCount = 0;
  if (progressInfo) progressInfo.textContent = `Карточка: 0 / ${filteredCards.length}`;
  if (indexInfo) indexInfo.textContent = '';
  if (questionText) questionText.textContent = 'Натисни «Наступна карточка», щоб розпочати.';
  if (answerBlock) answerBlock.style.display = 'none';
  if (topicTag) topicTag.textContent = topic === 'all' ? 'Тема: Усі теми' : `Тема: ${topic}`;
}

function showRandomCard() {
  if (filteredCards.length === 0) {
    questionText.textContent = 'Немає карточок для цієї теми.';
    answerBlock.style.display = 'none';
    topicTag.textContent = 'Тема: —';
    indexInfo.textContent = '';
    progressInfo.textContent = 'Карточка: 0 / 0';
    return;
  }
  currentIndex = Math.floor(Math.random() * filteredCards.length);
  const card = filteredCards[currentIndex];
  questionText.textContent = card.question;
  answerText.textContent = card.answer;
  topicTag.textContent = `Тема: ${card.topic}`;
  answerBlock.style.display = 'none';
  shownCount++;
  progressInfo.textContent = `Карточка: ${shownCount} / ${filteredCards.length}`;
  indexInfo.textContent = `ID у вибірці: ${currentIndex + 1}`;
}

function showAnswer() {
  if (currentIndex === -1) {
    answerText.textContent = 'Спочатку обери «Наступна карточка».';
  }
  answerBlock.style.display = 'block';
}

if (nextCardBtn && showAnswerBtn) {
  filteredCards = cards.slice();
  currentIndex = -1;
  shownCount = 0;
  progressInfo.textContent = `Карточка: 0 / ${filteredCards.length}`;
  indexInfo.textContent = '';
  questionText.textContent = 'Натисни «Наступна карточка», щоб розпочати.';
  answerBlock.style.display = 'none';
  topicTag.textContent = 'Тема: —';
  nextCardBtn.addEventListener('click', showRandomCard);
  showAnswerBtn.addEventListener('click', showAnswer);
}

// ===== Зв'язок сайдбару з вкладками =====
const sidebarLinks = document.querySelectorAll('#sidebar a[data-main-tab]');

function highlightSidebarBySubtab(subtabId) {
  if (!subtabId) return;
  sidebarLinks.forEach((link) => {
    const linkSubtab = link.getAttribute('data-subtab');
    if (linkSubtab) link.classList.toggle('active', linkSubtab === subtabId);
  });
}

if (savedSubtab) highlightSidebarBySubtab(savedSubtab);
if (savedMainTab) {
  sidebarLinks.forEach((link) => {
    const mainTab = link.getAttribute('data-main-tab');
    if (!link.hasAttribute('data-subtab')) {
      link.classList.toggle('active', mainTab === savedMainTab);
    }
  });
}

sidebarLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    sidebarLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');

    const mainTab = link.getAttribute('data-main-tab');
    const subtab = link.getAttribute('data-subtab');
    const topic = link.getAttribute('data-topic'); 

    if (mainTab) setActiveTab(mainTab);
    if (subtab) setActiveSubtab(subtab);
    if (topic && topicFilter) {
      topicFilter.value = topic;
      filterCards();
    } else if (topic) {
      filterCardsByTopicName(topic);
    }
  });
});

// ===== 3D QA Flashcards Carousel =====
const carousel3D = document.getElementById('memory-carousel');
const prevBtn3D = document.getElementById('prev-btn');
const nextBtn3D = document.getElementById('next-btn');

const VISIBLE_3D_CARDS = 6;
let carouselCards = [];
let angleStep3D = 360 / VISIBLE_3D_CARDS;
let theta3D = 0;
let activeIndex3D = 0;      
let qaCurrentIndex3D = 0;   

function build3DCarousel() {
  if (!carousel3D) return;
  carousel3D.innerHTML = '';
  carouselCards = [];

  for (let i = 0; i < VISIBLE_3D_CARDS; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'memory-card';
    wrapper.dataset.index = i.toString();

    wrapper.innerHTML = `
      <div class="card-inner">
        <div class="card-front">
          <div class="card-content">
            <div class="memory-date"></div>
            <div class="memory-main">
              <h3 class="memory-question"></h3>
            </div>
            <p class="memory-preview">Клікни по цій картці, щоб побачити відповідь.</p>
            <div class="card-glow"></div>
          </div>
        </div>
        <div class="card-back">
          <div class="card-content">
            <div class="memory-date back-topic"></div>
            <p class="memory-answer"></p>
          </div>
        </div>
      </div>
    `;

    wrapper.addEventListener('click', () => {
      if (parseInt(wrapper.dataset.index, 10) === activeIndex3D) {
        wrapper.classList.toggle('flipped');
      }
    });

    carousel3D.appendChild(wrapper);
    carouselCards.push(wrapper);
  }

  arrange3DCards();
  updateActive3D();
  fillActiveCardWithQA(); 
}

function arrange3DCards() {
  const radius = 380; 
  carouselCards.forEach((card, index) => {
    const angle = angleStep3D * index;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
}

function updateActive3D() {
  carouselCards.forEach((card, index) => {
    const isActive = index === activeIndex3D;
    card.classList.toggle('active', isActive);
    if (!isActive) card.classList.remove('flipped'); 
  });
}

function rotate3D() {
  if (!carousel3D) return;
  carousel3D.style.transform = `rotateY(${theta3D}deg)`;
  updateActive3D();
}

function fillActiveCardWithQA() {
  const cardEl = carouselCards[activeIndex3D];
  if (!cardEl || !Array.isArray(cards) || cards.length === 0) return;

  const qa = cards[qaCurrentIndex3D % cards.length];
  const topicFront = cardEl.querySelector('.memory-date');
  const topicBack = cardEl.querySelector('.back-topic');
  const questionEl = cardEl.querySelector('.memory-question');
  const answerEl = cardEl.querySelector('.memory-answer');

  if (topicFront) topicFront.textContent = `Тема: ${qa.topic}`;
  if (topicBack) topicBack.textContent = `Тема: ${qa.topic}`;
  if (questionEl) questionEl.textContent = qa.question;
  if (answerEl) answerEl.textContent = qa.answer;

  cardEl.classList.remove('flipped'); 
}

function showNext3D() {
  qaCurrentIndex3D = (qaCurrentIndex3D + 1) % cards.length;
  activeIndex3D = (activeIndex3D + 1) % VISIBLE_3D_CARDS;
  theta3D -= angleStep3D;
  rotate3D();
  fillActiveCardWithQA();
}

function showPrev3D() {
  qaCurrentIndex3D = (qaCurrentIndex3D - 1 + cards.length) % cards.length;
  activeIndex3D = (activeIndex3D - 1 + VISIBLE_3D_CARDS) % VISIBLE_3D_CARDS;
  theta3D += angleStep3D;
  rotate3D();
  fillActiveCardWithQA();
}

function init3DDrag() {
  if (!carousel3D) return;
  let dragStartX = null;
  let dragging = false;

  const startDrag = (clientX) => { dragStartX = clientX; dragging = true; };
  const endDrag = (clientX) => {
    if (!dragging || dragStartX == null) return;
    const diff = clientX - dragStartX;
    dragging = false;
    if (diff > 40) showPrev3D();  
    else if (diff < -40) showNext3D();  
  };

  carousel3D.addEventListener('mousedown', (e) => startDrag(e.clientX));
  document.addEventListener('mouseup', (e) => endDrag(e.clientX));
  carousel3D.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) startDrag(e.touches[0].clientX);
  });
  document.addEventListener('touchend', (e) => {
    if (e.changedTouches.length > 0) endDrag(e.changedTouches[0].clientX);
  });
}

if (carousel3D && prevBtn3D && nextBtn3D) {
  prevBtn3D.addEventListener('click', showPrev3D);
  nextBtn3D.addEventListener('click', showNext3D);
  init3DDrag();
  build3DCarousel();
}

// ===== QUIZ LOGIC (Дані беруться з data.js) =====
const quizTopicSelect = document.getElementById('quizTopicSelect');
const quizStartBtn = document.getElementById('quizStartBtn');
const quizNextBtn = document.getElementById('quizNextBtn');
const quizQuestionText = document.getElementById('quizQuestionText');
const quizOptionsContainer = document.getElementById('quizOptions');
const quizFeedback = document.getElementById('quizFeedback');
const quizQuestionCounter = document.getElementById('quizQuestionCounter');
const quizScoreElem = document.getElementById('quizScore');

let quizFiltered = [];
let quizCurrentIndex = 0;
let quizScore = 0;
let quizAnswered = false;

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function updateQuizScore() {
  if (quizScoreElem) quizScoreElem.textContent = `Рахунок: ${quizScore}`;
}

function showQuizQuestion() {
  if (!quizQuestionText || !quizOptionsContainer || !quizQuestionCounter) return;

  if (quizFiltered.length === 0) {
    quizQuestionText.textContent = 'Немає питань для цієї теми.';
    quizOptionsContainer.innerHTML = '';
    quizQuestionCounter.textContent = 'Питання 0 / 0';
    quizFeedback.textContent = '';
    if (quizNextBtn) quizNextBtn.disabled = true;
    return;
  }

  if (quizCurrentIndex >= quizFiltered.length) {
    quizQuestionText.textContent = 'Тест завершено 🎉';
    quizOptionsContainer.innerHTML = '';
    quizQuestionCounter.textContent = `Питання ${quizFiltered.length} / ${quizFiltered.length}`;
    quizFeedback.textContent = `Твій результат: ${quizScore} з ${quizFiltered.length}.`;
    if (quizNextBtn) quizNextBtn.disabled = true;
    return;
  }

  const q = quizFiltered[quizCurrentIndex];
  quizAnswered = false;
  quizQuestionText.textContent = q.question;
  quizQuestionCounter.textContent = `Питання ${quizCurrentIndex + 1} / ${quizFiltered.length}`;
  quizFeedback.textContent = '';
  quizOptionsContainer.innerHTML = '';

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.className = 'quiz-option-btn';
    btn.type = 'button';
    btn.textContent = opt;

    btn.addEventListener('click', () => {
      if (quizAnswered) return;
      quizAnswered = true;

      if (index === q.correctIndex) {
        quizScore++;
        btn.classList.add('correct');
        quizFeedback.textContent = '✅ Правильно!';
      } else {
        btn.classList.add('wrong');
        quizFeedback.textContent = `❌ Неправильно. Правильна відповідь: ${q.options[q.correctIndex]}`;
        const allButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
        if (allButtons[q.correctIndex]) allButtons[q.correctIndex].classList.add('correct');
      }
      updateQuizScore();
    });
    quizOptionsContainer.appendChild(btn);
  });

  if (quizNextBtn) quizNextBtn.disabled = false;
}

function startQuiz() {
  if (!quizTopicSelect) return;
  const topic = quizTopicSelect.value;
  quizFiltered = topic === 'all' ? quizQuestions.slice() : quizQuestions.filter((q) => q.topic === topic);
  
  shuffleArray(quizFiltered);
  quizCurrentIndex = 0;
  quizScore = 0;
  updateQuizScore();
  showQuizQuestion();
}

function goToNextQuestion() {
  if (quizFiltered.length === 0) return;
  quizCurrentIndex++;
  showQuizQuestion();
}

if (quizTopicSelect && quizStartBtn && quizNextBtn) {
  quizStartBtn.addEventListener('click', startQuiz);
  quizNextBtn.addEventListener('click', goToNextQuestion);
  quizTopicSelect.addEventListener('change', startQuiz);
}

// ===== PRACTICE TABS =====
const practiceTabButtons = document.querySelectorAll('.practice-tab-btn');
const practicePanes = document.querySelectorAll('.practice-pane');

practiceTabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const target = btn.getAttribute('data-practice');
    practiceTabButtons.forEach((b) => b.classList.remove('active'));
    practicePanes.forEach((p) => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(`practice-${target}`).classList.add('active');
  });
});

// ===== Ініціалізація сценаріїв / зразків (Дані беруться з data.js) =====
function initPracticeScenarios() {
  const setupScenario = (selectId, descId, sampleId, dataObj) => {
    const select = document.getElementById(selectId);
    const desc = document.getElementById(descId);
    const sample = document.getElementById(sampleId);
    if (select && desc && sample) {
      const update = () => {
        const data = dataObj[select.value];
        if (data) {
          desc.textContent = data.description;
          sample.textContent = data.sample;
        }
      };
      select.addEventListener('change', update);
      update();
    }
  };
  
  setupScenario('bugScenarioSelect', 'bugScenarioDescription', 'bugSampleText', bugScenarios);
  setupScenario('caseScenarioSelect', 'caseScenarioDescription', 'caseSampleText', caseScenarios);
  setupScenario('checkScenarioSelect', 'checkScenarioDescription', 'checkSampleText', checkScenarios);
}

initPracticeScenarios();

// ===== Локальна перевірка полів =====
function validateBugReport() {
  const title = document.getElementById('bugTitle')?.value.trim();
  const env = document.getElementById('bugEnvironment')?.value.trim();
  const steps = document.getElementById('bugSteps')?.value.trim();
  const exp = document.getElementById('bugExpected')?.value.trim();
  const act = document.getElementById('bugActual')?.value.trim();
  const sev = document.getElementById('bugSeverity')?.value;
  const pri = document.getElementById('bugPriority')?.value;
  const feedbackEl = document.getElementById('bugFeedback');

  if (!feedbackEl) return;
  const issues = [];

  if (!title || title.length < 15) issues.push('• Title занадто короткий або порожній. Опиши що зламано + де.');
  if (!env) issues.push('• Заповни Environment (платформа, build, OS / браузер / відеокарта).');
  const stepLines = steps.split('\n').filter((l) => l.trim() !== '');
  if (stepLines.length < 3) issues.push('• Має бути хоча б 3 кроки відтворення (1., 2., 3. ...).');
  if (!exp) issues.push('• Немає Expected result.');
  if (!act) issues.push('• Немає Actual result.');
  if (!sev) issues.push('• Вибери Severity.');
  if (!pri) issues.push('• Вибери Priority.');

  feedbackEl.textContent = issues.length === 0
    ? '✅ Добре! Структура заповнена. Далі можна порівняти зі зразком або віддати це ШІ на глибший фідбек.'
    : '⚠ Підкоригуй баг-репорт:\n' + issues.join('\n');
}

document.getElementById('bugValidateBtn')?.addEventListener('click', validateBugReport);

function validateTestCase() {
  const id = document.getElementById('caseId')?.value.trim();
  const title = document.getElementById('caseTitle')?.value.trim();
  const pre = document.getElementById('casePre')?.value.trim();
  const steps = document.getElementById('caseSteps')?.value.trim();
  const exp = document.getElementById('caseExpected')?.value.trim();
  const feedbackEl = document.getElementById('caseFeedback');
  if (!feedbackEl) return;

  const issues = [];
  if (!id) issues.push('• Заповни ID тест-кейсу.');
  if (!title) issues.push('• Додай зрозумілу назву.');
  if (!pre) issues.push('• Опиши передумови.');
  const stepLines = steps.split('\n').filter((l) => l.trim() !== '');
  if (stepLines.length < 3) issues.push('• Розпиши хоча б 3 кроки.');
  if (!exp) issues.push('• Додай очікуваний результат.');

  feedbackEl.textContent = issues.length === 0
      ? '✅ Структура тест-кейсу ок. Тепер можна шліфувати формулювання.'
      : '⚠ Підкоригуй тест-кейс:\n' + issues.join('\n');
}
document.getElementById('caseValidateBtn')?.addEventListener('click', validateTestCase);

function validateChecklist() {
  const items = document.getElementById('checkItems')?.value.trim();
  const feedbackEl = document.getElementById('checkFeedback');
  if (!feedbackEl) return;

  const lines = items.split('\n').filter((l) => l.trim() !== '');
  const issues = [];
  if (lines.length < 8) issues.push('• Спробуй додати хоча б 8–10 пунктів.');
  const withoutCheckbox = lines.filter((l) => !l.trim().startsWith('[ ]'));
  if (withoutCheckbox.length > 0) issues.push('• Не всі рядки починаються з "[ ]". Зроби формат єдиним.');

  feedbackEl.textContent = issues.length === 0
      ? '✅ Непоганий чек-лист. Далі порівняй із зразком і подумай, що ще можна покрити.'
      : '⚠ Підкоригуй чек-лист:\n' + issues.join('\n');
}
document.getElementById('checkValidateBtn')?.addEventListener('click', validateChecklist);

/* ========= EXPORT HELPERS ========= */
function dl(filename, content, mime = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
}
const $ = (id) => document.getElementById(id);
const val = (id) => (($(id)?.value ?? "").trim());
const escCSV = (s) => `"${String(s ?? "").replace(/"/g, '""')}"`;

/* ========= BUGS: MD / CSV ========= */
$("bugExportMd")?.addEventListener("click", () => {
  const md = `# Bug Report\n**Title:** ${val("bugTitle")}\n**Environment:** ${val("bugEnvironment")}\n**Severity:** ${val("bugSeverity")}\n**Priority:** ${val("bugPriority")}\n\n## Steps to Reproduce\n${val("bugSteps")}\n\n## Expected\n${val("bugExpected")}\n\n## Actual\n${val("bugActual")}\n`;
  dl("bug-report.md", md, "text/markdown;charset=utf-8");
});

$("bugExportCsv")?.addEventListener("click", () => {
  const row = [escCSV(val("bugTitle")), escCSV(val("bugEnvironment")), escCSV(val("bugSteps")), escCSV(val("bugExpected")), escCSV(val("bugActual")), escCSV(val("bugSeverity")), escCSV(val("bugPriority"))].join(",");
  const csv = "Title,Environment,Steps,Expected,Actual,Severity,Priority\n" + row + "\n";
  dl("bug-report.csv", csv, "text/csv;charset=utf-8");
});

/* ========= TEST CASES: MD / CSV ========= */
$("caseExportMd")?.addEventListener("click", () => {
  const md = `# Test Case ${val("caseId")}\n**Summary:** ${val("caseTitle")}\n**Preconditions:**\n${val("casePre")}\n\n## Steps\n${val("caseSteps")}\n\n## Expected result\n${val("caseExpected")}\n`;
  dl("test-case.md", md, "text/markdown;charset=utf-8");
});

$("caseExportCsv")?.addEventListener("click", () => {
  const row = [escCSV(val("caseId")), escCSV(val("caseTitle")), escCSV(val("casePre")), escCSV(val("caseSteps")), escCSV(val("caseExpected"))].join(",");
  const csv = "ID,Summary,Preconditions,Steps,Expected\n" + row + "\n";
  dl("test-case.csv", csv, "text/csv;charset=utf-8");
});

/* ========= CHECKLISTS: MD / CSV ========= */
$("checkExportMd")?.addEventListener("click", () => {
  const items = val("checkItems").split("\n").map(s => s.trim()).filter(Boolean);
  const md = "# Checklist\n" + items.map(i => `- [ ] ${i}`).join("\n") + "\n";
  dl("checklist.md", md, "text/markdown;charset=utf-8");
});

$("checkExportCsv")?.addEventListener("click", () => {
  const items = val("checkItems").split("\n").map(s => s.trim()).filter(Boolean);
  const csv = "Item\n" + items.map(escCSV).join("\n") + "\n";
  dl("checklist.csv", csv, "text/csv;charset=utf-8");
});
