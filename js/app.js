document.addEventListener('DOMContentLoaded', async () => {
  // ===== Fetch Data =====
  let cards = [];
  let quizQuestions = [];
  try {
    const [cardsRes, quizRes] = await Promise.all([
      fetch('data/flashcards.json'),
      fetch('data/quiz.json')
    ]);
    if (cardsRes.ok) cards = await cardsRes.json();
    if (quizRes.ok) quizQuestions = await quizRes.json();
  } catch (err) {
    console.error("Failed to load data:", err);
  }

  // ===== State & Elements =====
  const state = {
    activeMainTab: localStorage.getItem('qa_activeMainTab') || 'theory',
    activeSubtabs: JSON.parse(localStorage.getItem('qa_activeSubtabs') || '{"theory":"base","practice":"bugs"}'),
    darkmode: localStorage.getItem('darkmode') !== 'light'
  };

  // Setup Theme
  const themeSwitch = document.getElementById('theme-switch');
  const applyTheme = () => {
    if (state.darkmode) {
      document.body.classList.remove('lightmode');
      themeSwitch.innerHTML = '<i class="ph ph-sun"></i>';
    } else {
      document.body.classList.add('lightmode');
      themeSwitch.innerHTML = '<i class="ph ph-moon"></i>';
    }
  };
  applyTheme();

  themeSwitch.addEventListener('click', () => {
    state.darkmode = !state.darkmode;
    localStorage.setItem('darkmode', state.darkmode ? 'dark' : 'light');
    applyTheme();
  });

  // ===== Sidebar Toggle =====
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('toggle-btn');
  toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
  });

  // ===== Navigation =====
  const navLinks = document.querySelectorAll('[data-tab]');
  const tabContents = document.querySelectorAll('.tab-content');

  const switchMainTab = (tabId) => {
    state.activeMainTab = tabId;
    localStorage.setItem('qa_activeMainTab', tabId);
    
    // Update UI
    navLinks.forEach(link => {
      link.closest('.nav-item').classList.toggle('active', link.dataset.tab === tabId);
    });
    tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `tab-${tabId}`);
    });
  };

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      switchMainTab(link.dataset.tab);
    });
  });

  // Submenus
  const submenuToggles = document.querySelectorAll('.submenu-toggle');
  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      if (sidebar.classList.contains('collapsed')) {
        sidebar.classList.remove('collapsed');
      }
      const submenu = toggle.nextElementSibling;
      submenu.classList.toggle('open');
      const icon = toggle.querySelector('.caret');
      if (icon) icon.style.transform = submenu.classList.contains('open') ? 'rotate(180deg)' : 'rotate(0)';
    });
  });

  // Subtabs (Theory & Practice)
  const setupSubtabs = (containerClass) => {
    const containers = document.querySelectorAll(containerClass);
    containers.forEach(container => {
      const btns = container.querySelectorAll('.subtab-btn');
      btns.forEach(btn => {
        btn.addEventListener('click', () => {
          const targetId = btn.dataset.subtab;
          const group = btn.dataset.group;
          
          // Update state
          state.activeSubtabs[group] = targetId;
          localStorage.setItem('qa_activeSubtabs', JSON.stringify(state.activeSubtabs));

          // Update UI
          container.querySelectorAll('.subtab-btn').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');

          const mainTab = document.getElementById(`tab-${group}`);
          if (mainTab) {
            mainTab.querySelectorAll('.subtab-content').forEach(c => c.classList.remove('active'));
          }
          const targetEl = document.getElementById(targetId);
          if (targetEl) targetEl.classList.add('active');
        });
      });
    });
  };
  setupSubtabs('.subtabs-container');

  // Theory & Practice Sidebar Links (shortcut to subtabs)
  document.querySelectorAll('.submenu-link[data-subtab]').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parentNav = link.closest('.nav-item').querySelector('[data-tab]');
      if (parentNav) {
        switchMainTab(parentNav.dataset.tab);
      }
      const targetId = link.dataset.subtab;
      const btn = document.querySelector(`.subtab-btn[data-subtab="${targetId}"]`);
      if (btn) btn.click();
    });
  });

  // Restore initial state
  switchMainTab(state.activeMainTab);
  Object.entries(state.activeSubtabs).forEach(([group, targetId]) => {
    // Some old local storage might have "base" instead of "theoryBase"
    const safeTargetId = targetId.includes(group) ? targetId : group + targetId.charAt(0).toUpperCase() + targetId.slice(1);
    const btn = document.querySelector(`.subtab-btn[data-group="${group}"][data-subtab="${safeTargetId}"]`);
    if (btn) btn.click();
  });

  // ===== Flashcards Logic =====
  const fcState = {
    filtered: [...cards],
    currentIdx: 0,
    flipped: false
  };

  const fcSelect = document.getElementById('fc-topic-select');
  const fcCard = document.getElementById('flashcard');
  const fcTopic = document.getElementById('fc-topic');
  const fcQuestion = document.getElementById('fc-question');
  const fcAnswer = document.getElementById('fc-answer');
  const fcPrev = document.getElementById('fc-prev');
  const fcNext = document.getElementById('fc-next');
  const fcFlip = document.getElementById('fc-flip');

  const updateCardUI = () => {
    if (!fcCard || fcState.filtered.length === 0) return;
    const card = fcState.filtered[fcState.currentIdx];
    fcTopic.textContent = card.topic;
    fcQuestion.textContent = card.question;
    fcAnswer.textContent = card.answer;
    if (fcState.flipped) {
      fcCard.classList.remove('flipped');
      fcState.flipped = false;
    }
  };

  if (fcSelect) {
    fcSelect.addEventListener('change', () => {
      const topic = fcSelect.value;
      fcState.filtered = topic === 'all' ? [...cards] : cards.filter(c => c.topic === topic);
      fcState.currentIdx = 0;
      updateCardUI();
    });

    fcCard.addEventListener('click', () => {
      fcState.flipped = !fcState.flipped;
      fcCard.classList.toggle('flipped', fcState.flipped);
    });

    fcFlip.addEventListener('click', () => {
      fcState.flipped = !fcState.flipped;
      fcCard.classList.toggle('flipped', fcState.flipped);
    });

    fcNext.addEventListener('click', () => {
      if (fcState.filtered.length === 0) return;
      fcState.currentIdx = (fcState.currentIdx + 1) % fcState.filtered.length;
      updateCardUI();
    });

    fcPrev.addEventListener('click', () => {
      if (fcState.filtered.length === 0) return;
      fcState.currentIdx = (fcState.currentIdx - 1 + fcState.filtered.length) % fcState.filtered.length;
      updateCardUI();
    });

    updateCardUI();
  }

  // ===== Quiz Logic =====
  const quizState = {
    filtered: [...quizQuestions],
    currentIdx: 0,
    score: 0,
    answered: false
  };

  const qzSelect = document.getElementById('quiz-topic-select');
  const qzStart = document.getElementById('quiz-start');
  const qzQuestion = document.getElementById('quiz-question');
  const qzOptions = document.getElementById('quiz-options');
  const qzFeedback = document.getElementById('quiz-feedback');
  const qzNext = document.getElementById('quiz-next');
  const qzCounter = document.getElementById('quiz-counter');
  const qzScore = document.getElementById('quiz-score');

  const shuffleArray = (arr) => arr.sort(() => Math.random() - 0.5);

  const startQuiz = () => {
    if (!qzSelect) return;
    const topic = qzSelect.value;
    const baseList = topic === 'all' ? [...quizQuestions] : quizQuestions.filter(q => q.topic === topic);
    quizState.filtered = shuffleArray(baseList);
    quizState.currentIdx = 0;
    quizState.score = 0;
    showQuizQuestion();
  };

  const showQuizQuestion = () => {
    if (!qzQuestion) return;
    quizState.answered = false;
    qzFeedback.textContent = '';
    qzOptions.innerHTML = '';
    qzNext.disabled = true;
    qzScore.textContent = `Score: ${quizState.score}`;

    if (quizState.filtered.length === 0) {
      qzQuestion.textContent = 'Немає питань для цієї теми.';
      qzCounter.textContent = '0 / 0';
      return;
    }

    if (quizState.currentIdx >= quizState.filtered.length) {
      qzQuestion.textContent = 'Тест завершено! 🎉';
      qzCounter.textContent = `${quizState.filtered.length} / ${quizState.filtered.length}`;
      qzFeedback.textContent = `Твій фінальний рахунок: ${quizState.score} з ${quizState.filtered.length}`;
      return;
    }

    const q = quizState.filtered[quizState.currentIdx];
    qzQuestion.textContent = q.question;
    qzCounter.textContent = `Питання ${quizState.currentIdx + 1} / ${quizState.filtered.length}`;

    q.options.forEach((optText, i) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-opt-btn';
      btn.textContent = optText;
      btn.addEventListener('click', () => {
        if (quizState.answered) return;
        quizState.answered = true;
        
        if (i === q.correctIndex) {
          btn.classList.add('correct');
          quizState.score++;
          qzFeedback.textContent = '✅ Правильно!';
          qzFeedback.style.color = '#00ff80';
        } else {
          btn.classList.add('wrong');
          qzFeedback.textContent = `❌ Помилка. Правильна відповідь: ${q.options[q.correctIndex]}`;
          qzFeedback.style.color = 'var(--accent)';
          qzOptions.children[q.correctIndex].classList.add('correct');
        }
        qzScore.textContent = `Score: ${quizState.score}`;
        qzNext.disabled = false;
      });
      qzOptions.appendChild(btn);
    });
  };

  if (qzStart) {
    qzStart.addEventListener('click', startQuiz);
    qzSelect.addEventListener('change', startQuiz);
    qzNext.addEventListener('click', () => {
      quizState.currentIdx++;
      showQuizQuestion();
    });
    // init
    startQuiz();
  }

  // ===== Practice & AI Logic =====
  const geminiInput = document.getElementById('gemini-api-key');
  const geminiSave = document.getElementById('save-api-key');
  
  if (geminiInput && geminiSave) {
    geminiInput.value = localStorage.getItem('qa_gemini_key') || '';
    geminiSave.addEventListener('click', () => {
      localStorage.setItem('qa_gemini_key', geminiInput.value.trim());
      
      // Visual feedback
      const originalText = geminiSave.textContent;
      geminiSave.textContent = 'Збережено! ✅';
      geminiSave.style.background = 'rgba(0, 255, 128, 0.2)';
      setTimeout(() => {
        geminiSave.textContent = originalText;
        geminiSave.style.background = '';
      }, 2000);
    });
  }

  let cachedGeminiModel = null;
  
  async function getAIFeedback(type, content) {
    const apiKey = localStorage.getItem('qa_gemini_key');
    if (!apiKey) return null;
    
    const prompts = {
      bug: "Ти Senior QA Mentor. Проведи рев'ю цього баг-репорту, створеного твоїм студентом. Вкажи на сильні сторони і знайди помилки чи неточності (якщо є). Дай загальну оцінку з 10 балів.\n\n" + content,
      case: "Ти Senior QA Mentor. Проведи рев'ю цього тест-кейсу. Зверни увагу на повноту передумов, зрозумілість кроків та очікуваний результат. Вкажи на помилки. Дай оцінку з 10 балів.\n\n" + content,
      check: "Ти Senior QA Mentor. Перевір цей чек-лист. Чи він достатньо повний? Чи правильне форматування? Вкажи на недоліки. Дай оцінку з 10 балів.\n\n" + content
    };

    const makeRequest = async (model) => {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompts[type] }] }],
          generationConfig: { temperature: 0.7 }
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error?.message || 'API Error');
      return data.candidates[0].content.parts[0].text;
    };

    try {
      // Використовуємо новітні моделі Gemini 3 (згідно з офіційною документацією)
      return await makeRequest('gemini-3-flash-preview');
    } catch (err) {
      if (err.message.includes('not found') || err.message.includes('not supported')) {
        try {
          return await makeRequest('gemini-3.1-pro-preview');
        } catch (err2) {
          return `❌ Помилка AI (fallback): ${err2.message}`;
        }
      }
      return `❌ Помилка AI: ${err.message}`;
    }
  }

  const setupPractice = (prefix, validateFn, dlFn) => {
    const valBtn = document.getElementById(`${prefix}Validate`);
    const mdBtn = document.getElementById(`${prefix}ExportMd`);
    const csvBtn = document.getElementById(`${prefix}ExportCsv`);
    
    if (valBtn) valBtn.addEventListener('click', validateFn);
    if (mdBtn) mdBtn.addEventListener('click', () => dlFn('md'));
    if (csvBtn) csvBtn.addEventListener('click', () => dlFn('csv'));
  };

  const dl = (filename, content, mime) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };
  const val = (id) => (document.getElementById(id)?.value || '').trim();
  
  const showFeedback = async (id, issues, aiType, aiContent) => {
    const el = document.getElementById(id);
    if (!el) return;
    
    if (issues.length) {
      el.className = 'feedback-msg show error';
      el.innerHTML = `<strong>Виправ наступне:</strong><br>${issues.join('<br>')}`;
      return;
    }

    el.className = 'feedback-msg show success';
    el.innerHTML = '✅ Базова перевірка пройдена. Аналізую через AI... ⏳';
    
    const aiResponse = await getAIFeedback(aiType, aiContent);
    if (aiResponse) {
      const formatted = aiResponse.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
      el.innerHTML = `<strong>🤖 Фідбек від ШІ:</strong><br><br><div style="text-align: left; font-weight: normal; font-size: 14px; line-height: 1.6; color: var(--text-main);">${formatted}</div>`;
    } else {
      el.innerHTML = '✅ Виглядає чудово! Можеш експортувати.<br><br><small style="color:var(--text-muted)">(Введи Gemini API Key вище, щоб отримати розгорнуте рев\'ю від ШІ)</small>';
    }
  };
  // ===== Dynamic Scenarios =====
  const scenariosData = {
    bug: {
      "game-save": {
        desc: "GameDev: Після завантаження сейву гравець зʼявляється під мапою й безкінечно падає. Платформа: PC.",
        sample: "Title: Character falls infinitely under the map after loading a save\n\nSteps to Reproduce:\n1. Launch the game.\n2. Load any existing save file.\n3. Wait for the loading screen to finish.\n\nExpected Result: Character spawns at the correct coordinates on the ground.\nActual Result: Character spawns under the terrain mesh and falls infinitely.\n\nEnvironment: PC, Windows 10, RTX 3060"
      },
      "web-login": {
        desc: "Web: Користувач вводить правильний логін і пароль, натискає 'Увійти', але нічого не відбувається. Без помилок.",
        sample: "Title: Login button is unresponsive with valid credentials\n\nSteps to Reproduce:\n1. Open the login page.\n2. Enter valid email and password.\n3. Click 'Login' button.\n\nExpected Result: User is authenticated and redirected to the dashboard.\nActual Result: No action occurs, button appears clickable but nothing happens, no error shown.\n\nEnvironment: Web (Chrome 120), macOS"
      },
      "mobile-crash": {
        desc: "Mobile: Додаток вилітає (крашиться), коли користувач намагається відкрити камеру для сканування QR-коду.",
        sample: "Title: App crashes immediately when opening the QR scanner camera\n\nSteps to Reproduce:\n1. Open the application.\n2. Navigate to 'Settings' tab.\n3. Tap on 'Scan QR Code' button.\n\nExpected Result: Camera interface opens successfully asking for permissions if needed.\nActual Result: Application immediately crashes and returns to the home screen.\n\nEnvironment: iOS 17.2, iPhone 15 Pro"
      },
      "api-500": {
        desc: "API: При спробі оплати карткою ендпоінт повертає 500 Internal Server Error.",
        sample: "Title: POST /api/payment/process returns 500 Internal Server Error for valid Visa cards\n\nSteps to Reproduce:\n1. Send POST request to /api/payment/process.\n2. Include valid JSON payload with Visa card details.\n3. Send request.\n\nExpected Result: Returns 200 OK with transaction ID.\nActual Result: Returns 500 Internal Server Error with empty body.\n\nEnvironment: Production API v2.4.1"
      }
    },
    case: {
      "game-character": {
        desc: "GameDev: Екран створення персонажа: вибір класу, імені, складності. Потрібен позитивний тест-кейс.",
        sample: "Title: Successfully create a new character\nPre-conditions: Game launched, Create Character screen is open.\n\nSteps:\n1. Select 'Warrior' class.\n2. Enter name 'TestHero'.\n3. Select 'Normal' difficulty.\n4. Click 'Create' button.\n\nExpected Result: Character is created. Game loads the prologue level with the correct class and name."
      },
      "web-register": {
        desc: "Web: Форма реєстрації (Email, Pass, Confirm Pass). Створи позитивний тест-кейс успішної реєстрації.",
        sample: "Title: Successful user registration\nPre-conditions: User is on the /register page.\n\nSteps:\n1. Enter valid email (test@example.com).\n2. Enter valid password (P@ssw0rd123!).\n3. Enter matching password in 'Confirm'.\n4. Click 'Register' button.\n\nExpected Result: Account is created. User is redirected to /welcome page. Confirmation email is sent."
      },
      "mobile-checkout": {
        desc: "Mobile: Оплата товару в корзині через Apple Pay.",
        sample: "Title: Successfully purchase item using Apple Pay\nPre-conditions: User is logged in. Cart has 1 item. Apple Pay is configured on device.\n\nSteps:\n1. Go to Cart screen.\n2. Tap 'Checkout'.\n3. Select 'Apple Pay' as payment method.\n4. Authenticate with FaceID.\n\nExpected Result: Payment is processed. Success screen is shown with order number."
      },
      "api-search": {
        desc: "API: Перевірка пошуку товарів з фільтрацією по ціні (GET /api/products?minPrice=10&maxPrice=50).",
        sample: "Title: Filter products by price range\nPre-conditions: Database contains products with various prices.\n\nSteps:\n1. Send GET request to /api/products?minPrice=10&maxPrice=50.\n\nExpected Result: Server responds with HTTP 200. JSON array contains only products where price is >= 10 and <= 50. Total count matches expected DB items."
      }
    },
    check: {
      "game-main-menu": {
        desc: "GameDev: Головне меню гри: New Game, Continue, Settings, Exit. Склади чек-лист з 5–8 пунктів.",
        sample: "[ ] Кнопка 'New Game' запускає пролог\n[ ] 'Continue' недоступна, якщо немає збережень\n[ ] 'Continue' завантажує останній сейв\n[ ] Відкриття 'Settings' показує налаштування аудіо/відео\n[ ] 'Exit' показує діалогове вікно підтвердження виходу\n[ ] Звукові ефекти відтворюються при наведенні (Hover)\n[ ] Навігація в меню працює з клавіатури/геймпада"
      },
      "web-login-form": {
        desc: "Web: Форма логіну (Email, Password). Склади чек-лист на валідацію полів та загальну роботу форми.",
        sample: "[ ] Успішний логін з валідними даними\n[ ] Помилка при порожньому полі Email\n[ ] Помилка при порожньому полі Password\n[ ] Помилка при невірному форматі Email (напр. без @)\n[ ] Кнопка 'Увійти' блокується під час відправки запиту\n[ ] Пароль прихований (крапочки)\n[ ] Кнопка 'Показати пароль' перемикає видимість"
      },
      "mobile-profile": {
        desc: "Mobile: Екран профілю користувача. Перевірка UI та функціоналу.",
        sample: "[ ] Аватарка завантажується коректно (або показує default)\n[ ] Ім'я користувача відповідає базі даних\n[ ] Кнопка 'Редагувати' відкриває форму редагування\n[ ] Кнопка 'Вийти з акаунта' очищує сесію і кидає на логін\n[ ] Свайп вниз оновлює дані (Pull-to-refresh)\n[ ] Екран коректно виглядає в Dark Mode"
      },
      "cross-browser": {
        desc: "Web: Кросбраузерне тестування головної сторінки лендінгу.",
        sample: "[ ] Сторінка коректно відображається в Chrome (Windows/Mac)\n[ ] Сторінка коректно відображається в Safari (Mac)\n[ ] Сторінка коректно відображається в Firefox\n[ ] Сторінка коректно відображається в Edge\n[ ] Шрифти завантажуються у всіх браузерах\n[ ] Анімації не гальмують у Firefox/Safari\n[ ] Немає горизонтального скролу на жодній роздільній здатності"
      }
    }
  };

  const initScenarios = () => {
    ['bug', 'case', 'check'].forEach(prefix => {
      const select = document.getElementById(`${prefix}ScenarioSelect`);
      const desc = document.getElementById(`${prefix}ScenarioDescription`);
      const sample = document.getElementById(`${prefix}SampleText`);
      
      if (select && desc && sample) {
        select.addEventListener('change', (e) => {
          const data = scenariosData[prefix][e.target.value];
          if (data) {
            desc.textContent = data.desc;
            sample.textContent = data.sample;
          }
        });
        
        // Trigger initial update
        select.dispatchEvent(new Event('change'));
      }
    });
  };
  initScenarios();

  // Bugs
  setupPractice('bug', () => {
    const issues = [];
    if (val('bugTitle').length < 10) issues.push('• Title занадто короткий.');
    if (!val('bugEnv')) issues.push('• Вкажи Environment.');
    if (val('bugSteps').split('\n').filter(l=>l).length < 2) issues.push('• Опиши мінімум 2 кроки.');
    if (!val('bugExp') || !val('bugAct')) issues.push('• Заповни Expected та Actual result.');
    
    const aiContent = `Title: ${val('bugTitle')}\nEnv: ${val('bugEnv')}\nSteps:\n${val('bugSteps')}\nExp: ${val('bugExp')}\nAct: ${val('bugAct')}`;
    showFeedback('bugFeedback', issues, 'bug', aiContent);
  }, (type) => {
    const content = type === 'md' 
      ? `# Bug: ${val('bugTitle')}\n**Env:** ${val('bugEnv')}\n\n**Steps:**\n${val('bugSteps')}\n\n**Exp:** ${val('bugExp')}\n**Act:** ${val('bugAct')}`
      : `Title,Env,Steps,Exp,Act\n"${val('bugTitle')}","${val('bugEnv')}","${val('bugSteps')}","${val('bugExp')}","${val('bugAct')}"`;
    dl(`bug.${type}`, content, type === 'md' ? 'text/markdown' : 'text/csv');
  });

  // Cases
  setupPractice('case', () => {
    const issues = [];
    if (!val('caseTitle')) issues.push('• Вкажи назву.');
    if (val('caseSteps').split('\n').filter(l=>l).length < 2) issues.push('• Опиши кроки.');
    if (!val('caseExp')) issues.push('• Вкажи очікуваний результат.');
    
    const aiContent = `Title: ${val('caseTitle')}\nPre-conditions: ${val('casePre')}\nSteps:\n${val('caseSteps')}\nExp: ${val('caseExp')}`;
    showFeedback('caseFeedback', issues, 'case', aiContent);
  }, (type) => {
    const content = type === 'md' 
      ? `# TC: ${val('caseTitle')}\n**Pre:** ${val('casePre')}\n\n**Steps:**\n${val('caseSteps')}\n\n**Exp:** ${val('caseExp')}`
      : `Title,Pre,Steps,Exp\n"${val('caseTitle')}","${val('casePre')}","${val('caseSteps')}","${val('caseExp')}"`;
    dl(`case.${type}`, content, type === 'md' ? 'text/markdown' : 'text/csv');
  });

  // Checklists
  setupPractice('check', () => {
    const issues = [];
    const lines = val('checkItems').split('\n').filter(l=>l);
    if (lines.length < 3) issues.push('• Додай хоча б 3 пункти.');
    if (lines.some(l => !l.startsWith('[ ]'))) issues.push('• Кожен пункт має починатися з "[ ]".');
    
    const aiContent = `Checklist items:\n${val('checkItems')}`;
    showFeedback('checkFeedback', issues, 'check', aiContent);
  }, (type) => {
    const items = val('checkItems').split('\n').filter(l=>l);
    const content = type === 'md' 
      ? `# Checklist\n${items.map(i => `- ${i}`).join('\n')}`
      : `Item\n${items.map(i => `"${i}"`).join('\n')}`;
    dl(`checklist.${type}`, content, type === 'md' ? 'text/markdown' : 'text/csv');
  });
});