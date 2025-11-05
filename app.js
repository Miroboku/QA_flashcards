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
const sidebarLinks = document.querySelectorAll('#sidebar .sub-menu a');

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


