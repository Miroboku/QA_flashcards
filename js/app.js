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

  // НЕ закриваємо інші підменю – просто тицяємо це
  button.nextElementSibling.classList.toggle('show');
  button.classList.toggle('rotate');

  // Якщо сайдбар був згорнутий – розгортаємо його
  if (sidebar.classList.contains('close')) {
    sidebar.classList.toggle('close');
    toggleButton.classList.toggle('rotate');
  }
}


// зробимо функції доступними для inline-обробників
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
  localStorage.removeItem('darkmode');
};

if (darkmode === 'active') {
  enableDarkmode();
}

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

  // запам'ятати, яку вкладку обрали
  if (targetId) {
    localStorage.setItem('qa_activeMainTab', targetId);
  }
}

// при завантаженні пробуємо відновити попередню вкладку
const savedMainTab = localStorage.getItem('qa_activeMainTab');
if (savedMainTab) {
  setActiveTab(savedMainTab);
}

tabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-tab');
    setActiveTab(targetId);
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

  // запам'ятати активну саб-вкладку
  if (targetId) {
    localStorage.setItem('qa_activeSubtab', targetId);
  }
}

// при завантаженні пробуємо відновити попередню саб-вкладку
const savedSubtab = localStorage.getItem('qa_activeSubtab');
if (savedSubtab) {
  setActiveSubtab(savedSubtab);
}

subtabButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const targetId = btn.getAttribute('data-subtab');

    // міняємо контент теорії
    setActiveSubtab(targetId);

    // і синхронізуємо підсвітку в сайдбарі
    highlightSidebarBySubtab(targetId);
  });
});


/* Data arrays (cards, quizQuestions) moved to data.js */

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
  if (topic === 'all') {
    filteredCards = cards.slice();
  } else {
    filteredCards = cards.filter((c) => c.topic === topic);
  }
  currentIndex = -1;
  shownCount = 0;
  progressInfo.textContent = `Карточка: 0 / ${filteredCards.length}`;
  indexInfo.textContent = '';
  questionText.textContent = 'Натисни «Наступна карточка», щоб розпочати.';
  answerBlock.style.display = 'none';
  topicTag.textContent = 'Тема: —';
}
// Фільтрація карточок по назві теми з сайдбару
function filterCardsByTopicName(topic) {
  if (topic === 'all') {
    filteredCards = cards.slice();
  } else {
    filteredCards = cards.filter((c) => c.topic === topic);
  }

  currentIndex = -1;
  shownCount = 0;

  if (progressInfo) {
    progressInfo.textContent = `Карточка: 0 / ${filteredCards.length}`;
  }
  if (indexInfo) indexInfo.textContent = '';

  if (questionText) {
    questionText.textContent = 'Натисни «Наступна карточка», щоб розпочати.';
  }
  if (answerBlock) answerBlock.style.display = 'none';

  // одразу показуємо, з якою темою ти зараз тренуєшся
  if (topicTag) {
    if (topic === 'all') {
      topicTag.textContent = 'Тема: Усі теми';
    } else {
      topicTag.textContent = `Тема: ${topic}`;
    }
  }
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
    answerBlock.style.display = 'block';
    return;
  }
  answerBlock.style.display = 'block';
}

// === Ініціалізація карточок без селектора тем ===
if (nextCardBtn && showAnswerBtn) {
  // якщо селектора немає, просто беремо всі карточки
  filteredCards = cards.slice();
  currentIndex = -1;
  shownCount = 0;
  progressInfo.textContent = `Карточка: 0 / ${filteredCards.length}`;
  indexInfo.textContent = '';
  questionText.textContent = 'Натисни «Наступна карточка», щоб розпочати.';
  answerBlock.style.display = 'none';
  topicTag.textContent = 'Тема: —';

  // обробники кнопок
  nextCardBtn.addEventListener('click', showRandomCard);
  showAnswerBtn.addEventListener('click', showAnswer);
}


/// ===== Зв'язок сайдбару з вкладками/карточками + підсвічування активної теми =====
const sidebarLinks = document.querySelectorAll('#sidebar a[data-main-tab]');

function highlightSidebarBySubtab(subtabId) {
  if (!subtabId) return;

  sidebarLinks.forEach((link) => {
    const linkSubtab = link.getAttribute('data-subtab');
    if (!linkSubtab) return;

    link.classList.toggle('active', linkSubtab === subtabId);
  });
}

// стартове підсвічування пунктів сайдбару з localStorage
sidebarLinks.forEach((l) => l.classList.remove('active'));

if (savedMainTab === 'theoryTab' && savedSubtab) {
  // ми на вкладці "Теорія" → підсвічуємо тільки відповідну тему в підменю
  sidebarLinks.forEach((link) => {
    const linkSubtab = link.getAttribute('data-subtab');
    link.classList.toggle('active', linkSubtab === savedSubtab);
  });
} else if (savedMainTab) {
  // ми НЕ на "Теорії" → підсвічуємо тільки верхній пункт (Карточки або Тести)
  sidebarLinks.forEach((link) => {
    const mainTab = link.getAttribute('data-main-tab');
    const hasSubtab = link.hasAttribute('data-subtab'); // у теорії є data-subtab

    if (!hasSubtab) {
      link.classList.toggle('active', mainTab === savedMainTab);
    }
  });
}




sidebarLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();

    // 1) Підсвітити активний пункт у сайдбарі й зняти з інших
    sidebarLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');

    // 2) Перемкнути основну вкладку / сабвкладку / тему карточок
    const mainTab = link.getAttribute('data-main-tab');
    const subtab = link.getAttribute('data-subtab');
    const topic = link.getAttribute('data-topic'); // 'База', 'Функціональне', 'STLC', 'SQL/API', 'GameDev' або 'all'

    if (mainTab) {
      setActiveTab(mainTab);
    }
    if (subtab) {
      setActiveSubtab(subtab);
    }

    // якщо є селектор тем — користуємось ним (старий варіант)
    if (topic && topicFilter) {
      topicFilter.value = topic;
      filterCards();
    }
    // якщо селектора вже немає, фільтруємо напряму по назві теми
    else if (topic) {
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
let activeIndex3D = 0;      // яка картка зараз спереду
let qaCurrentIndex3D = 0;   // індекс поточного питання в масиві cards

// Беремо наступну флешкарту з нашого великого масиву cards
// function getNextQaCard() {
//   if (!Array.isArray(cards) || cards.length === 0) return null;
//   const card = cards[qaIndex3D % cards.length];
//   qaIndex3D++;
//   return card;
// }


// Створюємо 6 3D-карток
function build3DCarousel() {
  if (!carousel3D) return;

  carousel3D.innerHTML = '';
  carouselCards = [];

  for (let i = 0; i < VISIBLE_3D_CARDS; i++) {
    const wrapper = document.createElement('div');
    wrapper.className = 'memory-card';
    wrapper.dataset.index = i.toString();

    // Шаблон однієї картки
wrapper.innerHTML = `
  <div class="card-inner">
    <div class="card-front">
      <div class="card-content">
        <!-- Топ: тема -->
        <div class="memory-date"></div>

        <!-- Центр: питання -->
        <div class="memory-main">
          <h3 class="memory-question"></h3>
        </div>

        <!-- Низ: підказка -->
        <p class="memory-preview">
          Клікни по цій картці, щоб побачити відповідь.
        </p>

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


    // Фліп тільки якщо це центральна картка
    wrapper.addEventListener('click', () => {
      const idx = parseInt(wrapper.dataset.index, 10);
      if (idx === activeIndex3D) {
        wrapper.classList.toggle('flipped');
      }
    });

    carousel3D.appendChild(wrapper);
    carouselCards.push(wrapper);
  }

  arrange3DCards();
  updateActive3D();
  fillActiveCardWithQA(); // заповнюємо перше питання
}

// Розставляємо картки по колу
function arrange3DCards() {
  const radius = 380; // відстань від центру
  carouselCards.forEach((card, index) => {
    const angle = angleStep3D * index;
    card.style.transform = `rotateY(${angle}deg) translateZ(${radius}px)`;
  });
}

// Підсвічування активної (центральної) картки
function updateActive3D() {
  carouselCards.forEach((card, index) => {
    const isActive = index === activeIndex3D;
    card.classList.toggle('active', isActive);
    if (!isActive) {
      card.classList.remove('flipped'); // бічні завжди фронтом
    }
  });
}

// Повертаємо все коло
function rotate3D() {
  if (!carousel3D) return;
  carousel3D.style.transform = `rotateY(${theta3D}deg)`;
  updateActive3D();
}

// Заповнюємо центральну картку наступним питанням
function fillActiveCardWithQA() {
  const cardEl = carouselCards[activeIndex3D];
  if (!cardEl) return;
  if (!Array.isArray(cards) || cards.length === 0) return;

  // беремо поточне питання по qaCurrentIndex3D
  const qa = cards[qaCurrentIndex3D % cards.length];

  const topicFront = cardEl.querySelector('.memory-date');
  const topicBack = cardEl.querySelector('.back-topic');
  const questionEl = cardEl.querySelector('.memory-question');
  const answerEl = cardEl.querySelector('.memory-answer');

  if (topicFront) topicFront.textContent = `Тема: ${qa.topic}`;
  if (topicBack) topicBack.textContent = `Тема: ${qa.topic}`;
  if (questionEl) questionEl.textContent = qa.question;
  if (answerEl) answerEl.textContent = qa.answer;

  cardEl.classList.remove('flipped'); // завжди показуємо фронт
}


function showNext3D() {
  // наступне питання
  qaCurrentIndex3D = (qaCurrentIndex3D + 1) % cards.length;

  // повертаємо карусель вперед
  activeIndex3D = (activeIndex3D + 1) % VISIBLE_3D_CARDS;
  theta3D -= angleStep3D;
  rotate3D();

  // ставимо новий текст у центральну картку
  fillActiveCardWithQA();
}

function showPrev3D() {
  // попереднє питання
  qaCurrentIndex3D =
    (qaCurrentIndex3D - 1 + cards.length) % cards.length;

  // повертаємо карусель назад
  activeIndex3D = (activeIndex3D - 1 + VISIBLE_3D_CARDS) % VISIBLE_3D_CARDS;
  theta3D += angleStep3D;
  rotate3D();

  // ставимо текст попереднього питання
  fillActiveCardWithQA();
}

// Простий свайп/drag
function init3DDrag() {
  if (!carousel3D) return;

  let dragStartX = null;
  let dragging = false;

  const startDrag = (clientX) => {
    dragStartX = clientX;
    dragging = true;
  };

  const endDrag = (clientX) => {
    if (!dragging || dragStartX == null) return;
    const diff = clientX - dragStartX;
    dragging = false;

    if (diff > 40) {
      showPrev3D();  // свайп вправо — попередня
    } else if (diff < -40) {
      showNext3D();  // свайп вліво — наступна
    }
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

// Ініціалізація 3D-каруселі
if (carousel3D && prevBtn3D && nextBtn3D) {
  prevBtn3D.addEventListener('click', showPrev3D);
  nextBtn3D.addEventListener('click', showNext3D);

  init3DDrag();
  build3DCarousel();
}



// ===== QUIZ LOGIC =====

// DOM-елементи
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

// Простий shuffle-мінімум
function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}

function saveQuizProgress() {
  const progress = {
    quizFiltered,
    quizCurrentIndex,
    quizScore,
    topic: quizTopicSelect ? quizTopicSelect.value : 'all'
  };
  localStorage.setItem('qa_quizProgress', JSON.stringify(progress));
}

function clearQuizProgress() {
  localStorage.removeItem('qa_quizProgress');
}

function loadQuizProgress() {
  const saved = localStorage.getItem('qa_quizProgress');
  if (saved) {
    try {
      const data = JSON.parse(saved);
      if (data.quizFiltered && data.quizFiltered.length > 0) {
        quizFiltered = data.quizFiltered;
        quizCurrentIndex = data.quizCurrentIndex;
        quizScore = data.quizScore;
        if (quizTopicSelect) quizTopicSelect.value = data.topic;
        return true;
      }
    } catch (e) {
      console.error('Error parsing quiz progress', e);
    }
  }
  return false;
}

// Оновлення тексту рахунку
function updateQuizScore() {
  if (quizScoreElem) {
    quizScoreElem.textContent = `Рахунок: ${quizScore}`;
  }
}

// Показати поточне питання
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
    clearQuizProgress();
    
    // Зберігаємо найкращий результат
    const topic = quizTopicSelect ? quizTopicSelect.value : 'all';
    const bestScores = JSON.parse(localStorage.getItem('qa_quizBestScores') || '{}');
    let bestScoreMsg = '';
    
    if (!bestScores[topic] || quizScore > bestScores[topic]) {
      bestScores[topic] = quizScore;
      localStorage.setItem('qa_quizBestScores', JSON.stringify(bestScores));
      bestScoreMsg = ' 🎉 Новий рекорд!';
    } else {
      bestScoreMsg = ` (Твій найкращий результат: ${bestScores[topic]})`;
    }

    quizQuestionText.textContent = 'Тест завершено 🎉';
    quizOptionsContainer.innerHTML = '';
    quizQuestionCounter.textContent = `Питання ${quizFiltered.length} / ${quizFiltered.length}`;
    quizFeedback.textContent = `Твій результат: ${quizScore} з ${quizFiltered.length}.${bestScoreMsg}`;
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
        // підсвічуємо правильну
        const allButtons = quizOptionsContainer.querySelectorAll('.quiz-option-btn');
        if (allButtons[q.correctIndex]) {
          allButtons[q.correctIndex].classList.add('correct');
        }
      }
      updateQuizScore();
      saveQuizProgress();
    });

    quizOptionsContainer.appendChild(btn);
  });

  if (quizNextBtn) {
    quizNextBtn.disabled = false;
  }
}

// Старт / рестарт тесту
function startQuiz() {
  if (!quizTopicSelect) return;

  const topic = quizTopicSelect.value;
  if (topic === 'all') {
    quizFiltered = typeof quizQuestions !== 'undefined' ? quizQuestions.slice() : [];
  } else {
    quizFiltered = typeof quizQuestions !== 'undefined' ? quizQuestions.filter((q) => q.topic === topic) : [];
  }

  shuffleArray(quizFiltered);
  quizCurrentIndex = 0;
  quizScore = 0;
  updateQuizScore();
  saveQuizProgress();
  showQuizQuestion();
}

// Наступне питання
function goToNextQuestion() {
  if (quizFiltered.length === 0) return;

  quizCurrentIndex++;
  saveQuizProgress();
  showQuizQuestion();
}

// Навішуємо обробники, якщо елементи існують
if (quizTopicSelect && quizStartBtn && quizNextBtn) {
  quizStartBtn.addEventListener('click', startQuiz);
  quizNextBtn.addEventListener('click', goToNextQuestion);
  quizTopicSelect.addEventListener('change', startQuiz);
  
  // Спроба відновити прогрес після перезавантаження сторінки
  if (loadQuizProgress()) {
    updateQuizScore();
    showQuizQuestion();
  }
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

/* Scenarios moved to data.js */

// ===== Ініціалізація сценаріїв / зразків =====
function initPracticeScenarios() {
  // Баг-репорти
  const bugScenarioSelect = document.getElementById('bugScenarioSelect');
  const bugScenarioDescription = document.getElementById('bugScenarioDescription');
  const bugSampleText = document.getElementById('bugSampleText');

  if (bugScenarioSelect && bugScenarioDescription && bugSampleText) {
    const updateBugScenario = () => {
      const data = bugScenarios[bugScenarioSelect.value];
      if (!data) return;
      bugScenarioDescription.textContent = data.description;
      bugSampleText.textContent = data.sample;
      // якщо хочеш, щоб sample був одразу відкритий:
      // document.getElementById('bugSample')?.setAttribute('open', 'open');
    };

    bugScenarioSelect.addEventListener('change', updateBugScenario);
    updateBugScenario();
  }

  // Тест-кейси
  const caseScenarioSelect = document.getElementById('caseScenarioSelect');
  const caseScenarioDescription = document.getElementById('caseScenarioDescription');
  const caseSampleText = document.getElementById('caseSampleText');

  if (caseScenarioSelect && caseScenarioDescription && caseSampleText) {
    const updateCaseScenario = () => {
      const data = caseScenarios[caseScenarioSelect.value];
      if (!data) return;
      caseScenarioDescription.textContent = data.description;
      caseSampleText.textContent = data.sample;
      // document.getElementById('caseSample')?.setAttribute('open', 'open');
    };

    caseScenarioSelect.addEventListener('change', updateCaseScenario);
    updateCaseScenario();
  }

  // Чек-листи
  const checkScenarioSelect = document.getElementById('checkScenarioSelect');
  const checkScenarioDescription = document.getElementById('checkScenarioDescription');
  const checkSampleText = document.getElementById('checkSampleText');

  if (checkScenarioSelect && checkScenarioDescription && checkSampleText) {
    const updateCheckScenario = () => {
      const data = checkScenarios[checkScenarioSelect.value];
      if (!data) return;
      checkScenarioDescription.textContent = data.description;
      checkSampleText.textContent = data.sample;
      // document.getElementById('checkSample')?.setAttribute('open', 'open');
    };

    checkScenarioSelect.addEventListener('change', updateCheckScenario);
    updateCheckScenario();
  }
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

  if (!title || title.length < 15) {
    issues.push('• Title занадто короткий або порожній. Опиши що зламано + де.');
  }
  if (!env) {
    issues.push('• Заповни Environment (платформа, build, OS / браузер / відеокарта).');
  }
  const stepLines = steps.split('\n').filter((l) => l.trim() !== '');
  if (stepLines.length < 3) {
    issues.push('• Має бути хоча б 3 кроки відтворення (1., 2., 3. ...).');
  }
  if (!exp) issues.push('• Немає Expected result.');
  if (!act) issues.push('• Немає Actual result.');
  if (!sev) issues.push('• Вибери Severity.');
  if (!pri) issues.push('• Вибери Priority.');

  if (issues.length === 0) {
    feedbackEl.textContent =
      '✅ Добре! Структура заповнена. Далі можна порівняти зі зразком або віддати це ШІ на глибший фідбек.';
  } else {
    feedbackEl.textContent =
      '⚠ Підкоригуй баг-репорт:\n' + issues.join('\n');
  }
}

const bugValidateBtn = document.getElementById('bugValidateBtn');
if (bugValidateBtn) {
  bugValidateBtn.addEventListener('click', validateBugReport);
}

// Аналогічно можна зробити прості перевірки для тест-кейсів і чек-листів:
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

  feedbackEl.textContent =
    issues.length === 0
      ? '✅ Структура тест-кейсу ок. Тепер можна шліфувати формулювання.'
      : '⚠ Підкоригуй тест-кейс:\n' + issues.join('\n');
}
const caseValidateBtn = document.getElementById('caseValidateBtn');
if (caseValidateBtn) {
  caseValidateBtn.addEventListener('click', validateTestCase);
}

function validateChecklist() {
  const items = document.getElementById('checkItems')?.value.trim();
  const feedbackEl = document.getElementById('checkFeedback');
  if (!feedbackEl) return;

  const lines = items.split('\n').filter((l) => l.trim() !== '');
  const issues = [];
  if (lines.length < 8) {
    issues.push('• Спробуй додати хоча б 8–10 пунктів.');
  }
  const withoutCheckbox = lines.filter((l) => !l.trim().startsWith('[ ]'));
  if (withoutCheckbox.length > 0) {
    issues.push('• Не всі рядки починаються з "[ ]". Зроби формат єдиним.');
  }

  feedbackEl.textContent =
    issues.length === 0
      ? '✅ Непоганий чек-лист. Далі порівняй із зразком і подумай, що ще можна покрити.'
      : '⚠ Підкоригуй чек-лист:\n' + issues.join('\n');
}
const checkValidateBtn = document.getElementById('checkValidateBtn');
if (checkValidateBtn) {
  checkValidateBtn.addEventListener('click', validateChecklist);
}

// ===============================
// BUG REPORT EXPORT BUTTONS
// ===============================
document.getElementById("bugExportMdBtn")?.addEventListener("click", () => {
  const data = {
    title: document.getElementById("bugTitle").value.trim(),
    env: document.getElementById("bugEnvironment").value.trim(),
    steps: document.getElementById("bugSteps").value.trim(),
    expected: document.getElementById("bugExpected").value.trim(),
    actual: document.getElementById("bugActual").value.trim(),
    severity: document.getElementById("bugSeverity").value,
    priority: document.getElementById("bugPriority").value,
    scenarioObj: document.getElementById("bugScenarioSelect").selectedOptions[0].text,
    scenarioText: document.getElementById("bugScenarioDescription").textContent.trim()
  };

  const md =
`# Bug Report
**Title:** ${data.title}
**Environment:** ${data.env}
**Severity:** ${data.severity}
**Priority:** ${data.priority}

**Scenario:** ${data.scenarioObj}
${data.scenarioText}

## Steps to Reproduce
${data.steps}

## Expected
${data.expected}

## Actual
${data.actual}
`;

  download("bug-report.md", md, "text/markdown");
});

document.getElementById("bugExportCsvBtn")?.addEventListener("click", () => {
  const csv =
`Title,Environment,Steps,Expected,Actual,Severity,Priority
"${bugTitle.value.replace(/"/g,'""')}",
"${bugEnvironment.value.replace(/"/g,'""')}",
"${bugSteps.value.replace(/"/g,'""')}",
"${bugExpected.value.replace(/"/g,'""')}",
"${bugActual.value.replace(/"/g,'""')}",
"${bugSeverity.value}",
"${bugPriority.value}"`;

  download("bug-report.csv", csv, "text/csv");
});


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
if ($("bugExportMd")) $("bugExportMd").addEventListener("click", () => {
  const md = `# Bug Report
**Title:** ${val("bugTitle")}
**Environment:** ${val("bugEnvironment")}
**Severity:** ${val("bugSeverity")}  
**Priority:** ${val("bugPriority")}

## Steps to Reproduce
${val("bugSteps")}

## Expected
${val("bugExpected")}

## Actual
${val("bugActual")}
`;
  dl("bug-report.md", md, "text/markdown;charset=utf-8");
});

if ($("bugExportCsv")) $("bugExportCsv").addEventListener("click", () => {
  const row = [
    escCSV(val("bugTitle")),
    escCSV(val("bugEnvironment")),
    escCSV(val("bugSteps")),
    escCSV(val("bugExpected")),
    escCSV(val("bugActual")),
    escCSV(val("bugSeverity")),
    escCSV(val("bugPriority")),
  ].join(",");
  const csv = "Title,Environment,Steps,Expected,Actual,Severity,Priority\n" + row + "\n";
  dl("bug-report.csv", csv, "text/csv;charset=utf-8");
});

/* ========= TEST CASES: MD / CSV ========= */
if ($("caseExportMd")) $("caseExportMd").addEventListener("click", () => {
  const md = `# Test Case ${val("caseId")}
**Summary:** ${val("caseTitle")}
**Preconditions:**
${val("casePre")}

## Steps
${val("caseSteps")}

## Expected result
${val("caseExpected")}
`;
  dl("test-case.md", md, "text/markdown;charset=utf-8");
});

if ($("caseExportCsv")) $("caseExportCsv").addEventListener("click", () => {
  const row = [
    escCSV(val("caseId")),
    escCSV(val("caseTitle")),
    escCSV(val("casePre")),
    escCSV(val("caseSteps")),
    escCSV(val("caseExpected")),
  ].join(",");
  const csv = "ID,Summary,Preconditions,Steps,Expected\n" + row + "\n";
  dl("test-case.csv", csv, "text/csv;charset=utf-8");
});

/* ========= CHECKLISTS: MD / CSV ========= */
if ($("checkExportMd")) $("checkExportMd").addEventListener("click", () => {
  const items = val("checkItems").split("\n").map(s => s.trim()).filter(Boolean);
  const md = "# Checklist\n" + items.map(i => `- [ ] ${i}`).join("\n") + "\n";
  dl("checklist.md", md, "text/markdown;charset=utf-8");
});

if ($("checkExportCsv")) $("checkExportCsv").addEventListener("click", () => {
  const items = val("checkItems").split("\n").map(s => s.trim()).filter(Boolean);
  const csv = "Item\n" + items.map(escCSV).join("\n") + "\n";
  dl("checklist.csv", csv, "text/csv;charset=utf-8");
});

/* ========= COURSE NOTES (LOCALSTORAGE) ========= */
function saveCourseNote(moduleId, text) {
  const notes = JSON.parse(localStorage.getItem('qa_courseNotes') || '{}');
  notes[moduleId] = text;
  localStorage.setItem('qa_courseNotes', JSON.stringify(notes));
}

document.addEventListener("DOMContentLoaded", () => {
  const notes = JSON.parse(localStorage.getItem('qa_courseNotes') || '{}');
  const textareas = document.querySelectorAll('.course-notes');
  textareas.forEach((ta, index) => {
    const moduleId = index + 1; // Our 1-based index from python loop
    if (notes[moduleId]) {
      ta.value = notes[moduleId];
    }
  });
});
