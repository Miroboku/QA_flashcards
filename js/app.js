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
  localStorage.setItem('darkmode', null);
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
    setActiveSubtab(targetId);
  });
});

// ===== Flashcards =====
const cards = [
  // ===== БАЗА =====
  {
    topic: 'База',
    question: 'Що таке Software Testing?',
    answer:
      'Це процес перевірки програмного забезпечення, щоб виявити дефекти та переконатися, що продукт відповідає вимогам.',
  },
  {
    topic: 'База',
    question: 'Чим відрізняється дефект (defect) від бага (bug)?',
    answer:
      'Defect — помилка в коді, вимогах або дизайні. Bug — прояв дефекту під час виконання програми (коли система поводиться неправильно).',
  },
  {
    topic: 'База',
    question: 'Що таке QA (Quality Assurance)?',
    answer:
      'Це діяльність, орієнтована на процеси: планування, стандарти, покращення процесу розробки, щоб запобігати дефектам.',
  },
  {
    topic: 'База',
    question: 'Що таке QC (Quality Control)?',
    answer:
      'Це діяльність, орієнтована на сам продукт: тестування, рев’ю, інспекції, щоб знайти дефекти у вже створеному продукті.',
  },
  {
    topic: 'База',
    question: 'Що таке Black Box Testing?',
    answer:
      'Метод тестування без знання внутрішньої реалізації. Тестувальник працює з вхідними даними та очікуваними результатами.',
  },
  {
    topic: 'База',
    question: 'Що таке White Box Testing?',
    answer:
      'Метод тестування з повним доступом до коду та внутрішньої логіки. Перевіряються гілки, умови, покриття коду.',
  },
  {
    topic: 'База',
    question: 'Що таке Grey Box Testing?',
    answer:
      'Метод тестування з частковим знанням внутрішньої логіки системи (наприклад, знання структури БД, API, архітектури).',
  },
  {
    topic: 'База',
    question: 'Що таке Functional Testing?',
    answer:
      'Тестування, яке перевіряє функції системи згідно з вимогами: чи робить система те, що повинна робити.',
  },
  {
    topic: 'База',
    question: 'Що таке Non-functional Testing?',
    answer:
      'Тестування нефункціональних характеристик: продуктивність, безпека, навантаження, юзабіліті, надійність тощо.',
  },
  {
    topic: 'База',
    question: 'Назви основні рівні тестування.',
    answer: 'Unit Testing, Integration Testing, System Testing, Acceptance Testing (UAT).',
  },
  {
    topic: 'База',
    question: 'Що перевіряється на рівні Unit Testing?',
    answer:
      'Окремі модулі: функції, методи, класи в ізоляції від інших частин системи.',
  },
  {
    topic: 'База',
    question: 'Що перевіряється на рівні Integration Testing?',
    answer:
      'Взаємодія між окремими модулями/сервісами: наприклад, фронтенд ↔ бекенд, бекенд ↔ база даних.',
  },
  {
    topic: 'База',
    question: 'Що таке System Testing?',
    answer:
      'Тестування всієї системи цілком у середовищі, максимально наближеному до продакшену.',
  },
  {
    topic: 'База',
    question: 'Що таке Acceptance Testing (UAT)?',
    answer:
      'Приймальне тестування, яке зазвичай проводиться замовником або кінцевими користувачами, щоб підтвердити готовність до релізу.',
  },

  // ===== ФУНКЦІОНАЛЬНЕ =====
  {
    topic: 'Функціональне',
    question: 'Що таке Smoke Testing?',
    answer:
      'Це поверхнева перевірка критично важливого функціоналу після нової збірки, щоб визначити, чи придатна вона для більш глибокого тестування.',
  },
  {
    topic: 'Функціональне',
    question: 'Коли зазвичай проводиться Smoke Testing?',
    answer:
      'Одразу після деплою нової збірки на тестове середовище, перед повноцінним регресом або детальним тестуванням.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Sanity Testing?',
    answer:
      'Це швидка перевірка конкретних змін або виправлень, щоб переконатися, що потрібний функціонал працює після фіксу.',
  },
  {
    topic: 'Функціональне',
    question: 'Чим відрізняється Smoke Testing від Sanity Testing?',
    answer:
      'Smoke — широка поверхнева перевірка всієї системи; Sanity — вузька перевірка конкретних змін/функцій після фіксу.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Regression Testing?',
    answer:
      'Повторне тестування раніше перевіреного функціоналу після змін у коді, щоб переконатися, що нічого не зламалося.',
  },
  {
    topic: 'Функціональне',
    question: 'Коли проводиться Regression Testing?',
    answer:
      'Після додавання нових фіч, виправлення багів, рефакторингу або змін у залежностях.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Exploratory Testing?',
    answer:
      'Дослідницьке тестування без жорстко прописаних сценаріїв: тестувальник паралельно вивчає продукт і придумує нові тести.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Ad-hoc Testing?',
    answer:
      'Неформальне тестування без документації й детального плану, часто базується на досвіді та інтуїції тестувальника.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Positive Testing?',
    answer:
      'Тестування з використанням коректних даних і очікуваної поведінки користувача, щоб перевірити, що система працює за вимогами.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Negative Testing?',
    answer:
      'Тестування з некоректними даними або діями, щоб перевірити, як система обробляє помилки та невалідні введення.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Boundary Value Testing?',
    answer:
      'Тестування граничних значень (мінімальні, максимальні, трохи нижче та вище меж), щоб перевірити поведінку системи на краях діапазону.',
  },
  {
    topic: 'Функціональне',
    question: 'Що таке Equivalence Partitioning?',
    answer:
      'Метод, коли вхідні дані діляться на класи еквівалентності (валідні/невалідні), і з кожного класу береться кілька представників для тестів.',
  },

  // ===== STLC / ДОКУМЕНТАЦІЯ =====
  {
    topic: 'STLC',
    question: 'Що таке Test Case?',
    answer:
      'Це опис тесту, який містить кроки, вхідні дані, очікуваний результат і фактичний результат виконання.',
  },
  {
    topic: 'STLC',
    question: 'Що таке Test Suite?',
    answer:
      'Набір пов’язаних між собою тест-кейсів, об’єднаних за певною ознакою (модуль, функціонал, регресія).',
  },
  {
    topic: 'STLC',
    question: 'Що таке Test Plan?',
    answer:
      'Документ, який описує стратегію, обсяг, підходи, ресурси й графік тестування для проєкту або релізу.',
  },
  {
    topic: 'STLC',
    question: 'Назви основні етапи STLC (Software Testing Life Cycle).',
    answer:
      'Requirement Analysis, Test Planning, Test Design, Test Execution, Test Reporting/Closure.',
  },
  {
    topic: 'STLC',
    question: 'Що відбувається на етапі Requirement Analysis у STLC?',
    answer:
      'Аналізуються вимоги, виявляються прогалини та ризики, визначається, що саме і як буде тестуватися.',
  },
  {
    topic: 'STLC',
    question: 'Що відбувається на етапі Test Design у STLC?',
    answer:
      'Створюються тест-кейси, готуються тестові дані, налаштовується тестове середовище.',
  },
  {
    topic: 'STLC',
    question: 'Що таке Bug Life Cycle?',
    answer:
      'Це послідовність статусів, через які проходить баг: від створення до виправлення й закриття.',
  },
  {
    topic: 'STLC',
    question: 'Назви типові статуси бага.',
    answer:
      'New, Assigned, In Progress, Fixed, Retest, Closed, Reopened (можуть бути додаткові, залежно від проєкту).',
  },
  {
    topic: 'STLC',
    question: 'Коли баг отримує статус Reopened?',
    answer:
      'Коли після фіксу під час ретесту проблема знову відтворюється.',
  },
  {
    topic: 'STLC',
    question: 'Хто зазвичай змінює статус бага на Fixed?',
    answer:
      'Розробник, коли вносить зміни в код і вважає, що дефект виправлено.',
  },

  // ===== SQL / HTTP / API =====
  {
    topic: 'SQL/API',
    question: 'Що таке SQL і навіщо він QA?',
    answer:
      'SQL — мова запитів до баз даних. QA потрібен, щоб перевіряти дані, шукати причини багів, підтверджувати, що бекенд зберігає все коректно.',
  },
  {
    topic: 'SQL/API',
    question: 'Що робить запит: SELECT * FROM users;',
    answer: 'Повертає всі стовпці та всі рядки з таблиці users.',
  },
  {
    topic: 'SQL/API',
    question: 'Для чого використовується WHERE у SQL?',
    answer:
      'Для фільтрації рядків за умовою, наприклад: SELECT * FROM users WHERE is_active = 1;',
  },
  {
    topic: 'SQL/API',
    question: 'Що робить GROUP BY у SQL?',
    answer:
      'Групує рядки за значенням одного або кількох полів, щоб використовувати агрегатні функції (COUNT, SUM тощо) по групах.',
  },
  {
    topic: 'SQL/API',
    question: 'Що таке INNER JOIN?',
    answer:
      'JOIN, який повертає тільки ті рядки, для яких знайшлися співпадіння в обох таблицях.',
  },
  {
    topic: 'SQL/API',
    question: 'Що таке HTTP request і HTTP response?',
    answer:
      'Request — запит від клієнта до сервера. Response — відповідь сервера на цей запит.',
  },
  {
    topic: 'SQL/API',
    question: 'Назви основні HTTP-методи для REST API.',
    answer: 'GET (отримати), POST (створити), PUT/PATCH (оновити), DELETE (видалити).',
  },
  {
    topic: 'SQL/API',
    question: 'Що означає статус-код 200, 404, 500?',
    answer:
      '200 — успіх, 404 — ресурс не знайдено, 500 — внутрішня помилка сервера.',
  },
  {
    topic: 'SQL/API',
    question: 'Що таке JSON у контексті API?',
    answer:
      'Формат передачі даних (JavaScript Object Notation), у якому найчастіше приходять відповіді від REST API.',
  },
  {
    topic: 'SQL/API',
    question: 'Що перевіряє QA в API-тестуванні?',
    answer:
      'Статус-коди, структуру та вміст JSON, обробку помилок, авторизацію, валідацію даних, коректність змін у БД.',
  },

  // ===== GameDev QA =====
  {
    topic: 'GameDev',
    question: 'Чим GameDev QA відрізняється від звичайного веб-QA?',
    answer:
      'У GameDev QA більше уваги до геймплею, перфомансу, стабільності, візуальних багів, фізики, сейвів і кросплатформенності.',
  },
  {
    topic: 'GameDev',
    question: 'Які основні види тестування є в GameDev QA?',
    answer:
      'Gameplay/functional, balance, graphics/visual, physics/collision, performance, compatibility, network/multiplayer, regression.',
  },
  {
    topic: 'GameDev',
    question: 'Що таке gameplay testing?',
    answer:
      'Перевірка ігрових механік: квести, боївка, інвентар, AI, прогрес, щоб усе працювало логічно та цікаво.',
  },
  {
    topic: 'GameDev',
    question: 'Що таке visual bug у грі?',
    answer:
      'Будь-яка проблема з картинкою: зламані моделі, текстури, анімації, освітлення, UI, неправильний текст, кліппінг тощо.',
  },
  {
    topic: 'GameDev',
    question: 'Назви приклади багів з колізіями.',
    answer:
      'Гравець проходить крізь стіну, застрягає в дверях, провалюється під мапу, вороги не можуть правильно підійти.',
  },
  {
    topic: 'GameDev',
    question: 'Чому тестування сейвів важливе в іграх?',
    answer:
      'Бо втрата прогресу дуже критична для гравця; потрібно перевіряти збереження/завантаження в різних ситуаціях і після оновлень.',
  },
  {
    topic: 'GameDev',
    question: 'Що зазвичай вказують у баг-репорті для гри, окрім кроків?',
    answer:
      'Build/версію, платформу, локацію/рівень, частоту відтворення, очікуваний і фактичний результат, додатки (відео, скріни, сейви).',
  },
  {
    topic: 'GameDev',
    question: 'Що таке performance testing у GameDev?',
    answer:
      'Перевірка FPS, фрізів, часу завантаження рівнів, нагріву/ресурсів, особливо на слабших пристроях.',
  },
  {
    topic: 'GameDev',
    question: 'Що таке network / multiplayer testing?',
    answer:
      'Перевірка матчмейкінгу, підключення до сесій, синхронізації гравців, обробки лагів, reconnection після розриву мережі.',
  },
  {
    topic: 'GameDev',
    question: 'Що таке build-to-build regression у GameDev?',
    answer:
      'Перевірка того, що між збірками нові зміни не зламали вже працюючі фічі, квести, сейви та перфоманс.',
  },
];

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
/// ===== Зв'язок сайдбару з вкладками/карточками + підсвічування активної теми =====

// Беремо всі лінки, які керують вкладками / темами
const sidebarLinks = document.querySelectorAll('#sidebar a[data-main-tab]');

sidebarLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    const mainTab = link.getAttribute('data-main-tab');   // theoryTab / cardsTab
    const subtab = link.getAttribute('data-subtab');      // тільки для теорії
    const topic = link.getAttribute('data-topic');        // тільки для старих карточок

    if (mainTab) {
      e.preventDefault(); // блокуємо стандартний #скрол

      // Перемикаємо основну вкладку (Теорія / Карточки)
      setActiveTab(mainTab);

      // Прокручуємо до потрібного блоку (щоб візуально "перекинуло")
      const target = document.getElementById(mainTab);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    // Підсвічування активного пункту в сайдбарі
    sidebarLinks.forEach((l) => l.classList.remove('active'));
    link.classList.add('active');

    // Саб-вкладка теорії, якщо є
    if (subtab) {
      setActiveSubtab(subtab);
    }

    // Старий механізм фільтрації карточок по темі (якщо ще колись знадобиться)
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



