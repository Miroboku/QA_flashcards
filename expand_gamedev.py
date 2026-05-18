import re

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8', errors='replace') as f:
    html = f.read()

new_gamedev = '''<div id="theoryGameDev" class="subtab-content">

    <div class="theory-section">
      <h2>0. Game Development Life Cycle (GDLC)</h2>
      <p><strong>GDLC</strong> — це повний цикл розробки гри від ідеї до підтримки після релізу. На відміну від SDLC, процес нелінійний: QA залучений від Pre-Production до Post-Launch.</p>
      <img src="png/gdlc.png" alt="Game Development Life Cycle" style="width:40%; max-width:420px; display:block; margin:12px auto; border-radius:8px;" />
      <ul class="theory-list">
        <li><strong>Pre-Production:</strong> GDD (Game Design Document), прототипи, вибір рушія (Unity / Unreal). QA перевіряє сам концепт і технічні ризики.</li>
        <li><strong>Production:</strong> Основна розробка. Ітеративні білди. QA тестує кожен новий модуль одразу після злиття (Feature Testing).</li>
        <li><strong>Alpha:</strong> Гра <em>Feature Complete</em> — всі основні механіки є, але контенту ще мало, багато плейсхолдерів і незакінченого рівня. QA починає повноцінну регресію між білдами. Більшість багів — критичні та блокуючі.</li>
        <li><strong>Beta:</strong> Гра <em>Content Complete</em> — весь контент інтегровано. Настає <em>Feature Freeze</em>. Більше немає нових механік, тільки баги і полішинг. Часто запускають Open/Closed Beta для збору зворотнього зв'язку від гравців.</li>
        <li><strong>Gold / Release Candidate (RC):</strong> Збірка, яка потенційно може стати фінальною (якщо немає нових Blocker-багів). <em>Gone Gold</em> — це коли RC затверджено і відправлено в продакшн.</li>
        <li><strong>Post-Launch / Live Service:</strong> Патчі, DLC, баланс-фікси. Навантаження на QA продовжується.</li>
      </ul>
    </div>

    <div class="theory-section">
      <h2>1. Специфічна термінологія GameDev QA</h2>
      <ul class="theory-list">
        <li><strong>Golden Path (Золотий шлях):</strong> Найочевидніший шлях проходження основного квесту/сюжету. QA перевіряє його першим під час Smoke-тесту нового білду.</li>
        <li><strong>Soft-lock / Hard-lock:</strong> <em>Soft-lock</em> — гравець застряг і не може прогресувати (NPC зник, скриптовий тригер не спрацював). <em>Hard-lock</em> — гра зависла або крашнулась (Blocker).</li>
        <li><strong>Exploit:</strong> Гравець використовує баг гри для нечесної переваги (нескінченне золото через дупу в торговця, проходження крізь стіну для скіпу частини рівня).</li>
        <li><strong>Z-fighting:</strong> Два полігони знаходяться на одній площині і "борються" за те, хто буде рендеритись поверх — з'являється мерехтіння текстур.</li>
        <li><strong>Clipping:</strong> Модель персонажа або об'єкта частково проходить крізь іншу геометрію (меч стирчить крізь стіну, коліно персонажа виходить крізь підлогу при сидінні).</li>
        <li><strong>LOD (Level of Detail):</strong> Система зниження деталізації моделі в залежності від відстані до камери. QA перевіряє різкі "стрибки" між рівнями LOD.</li>
        <li><strong>Popping:</strong> Об'єкти або текстури з'являються "з нізвідки" на очах у гравця — LOD не спрацював або дистанція завантаження налаштована неправильно.</li>
        <li><strong>TRC / TCR (Technical Certification Requirements):</strong> Обов'язкові технічні стандарти від Sony (TRC), Microsoft (TCR) і Nintendo. Якщо гра не проходить сертифікацію, вона не потрапляє в магазин платформи.</li>
        <li><strong>ESRB / PEGI рейтинг:</strong> Вікові рейтинги ігор. QA перевіряє, чи відповідає контент грі заявленому рейтингу.</li>
        <li><strong>Playtesting:</strong> Тести з реальними гравцями для оцінки зрозумілості механік і "фану".</li>
      </ul>
    </div>

    <div class="theory-section">
      <h2>2. Типи GameDev-тестування</h2>
      <table class="theory-table">
        <thead>
          <tr><th>Тип</th><th>Що перевіряється</th><th>Приклад дефекту</th></tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Gameplay / Functional</strong></td>
            <td>Квести, боівка, AI, механіки, інвентар</td>
            <td>Після прийому квесту лічильник вбивств не оновлюється</td>
          </tr>
          <tr>
            <td><strong>Balance / Economy</strong></td>
            <td>Складність, ціни, прокачка, крива досвіду</td>
            <td>Перший бос вбиває за 1 удар, хоча гравець тільки почав гру</td>
          </tr>
          <tr>
            <td><strong>Collision / Physics</strong></td>
            <td>Зіткнення, гравітація, невидимі стіни, Out of Bounds</td>
            <td>Гравець провалюється під карту в конкретному кутку рівня</td>
          </tr>
          <tr>
            <td><strong>Visual / Graphics</strong></td>
            <td>Текстури, анімації, освітлення, UI, Z-fighting, Clipping</td>
            <td>Рука персонажа видна крізь власний тулуб в анімації атаки</td>
          </tr>
          <tr>
            <td><strong>Performance</strong></td>
            <td>FPS (Frames Per Second), time to load, memory leaks, GPU/CPU</td>
            <td>FPS падає до 10 при вході в ліс через надто велику кількість об'єктів</td>
          </tr>
          <tr>
            <td><strong>Save / Load</strong></td>
            <td>Збереження прогресу, коректне завантаження, стан після патчу</td>
            <td>Після оновлення пари старі сейви не завантажуються або завантажуються некоректно</td>
          </tr>
          <tr>
            <td><strong>Localization (L10n)</strong></td>
            <td>Переклади, шрифти, довжина рядків, відповідність субтитрів аудіо</td>
            <td>Японський текст не вміщається в кнопку UI, текст виходить за межі</td>
          </tr>
          <tr>
            <td><strong>Compliance / Certification</strong></td>
            <td>Відповідність вимогам TRC/TCR (Sony/MS), ESRB/PEGI рейтинг</td>
            <td>Підказка каже "Натисніть X" на контролері Xbox — автоматичний фейл TCR</td>
          </tr>
          <tr>
            <td><strong>Multiplayer / Netcode</strong></td>
            <td>Десинхронізація (Desync), реконнект, матчмейкінг, чіти</td>
            <td>При втраті пакета у гравця 1 персонаж гравця 2 "телепортується"</td>
          </tr>
          <tr>
            <td><strong>Compatibility</strong></td>
            <td>Різні платформи (PC/PS/Xbox), версії ОС, конфігурації заліза</td>
            <td>На AMD GPU текстури відображаються некоректно через шейдерний баг</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="theory-section">
      <h2>3. Структура білду і термінологія QA-пайплайну</h2>
      <ul class="theory-list">
        <li><strong>Daily Build / Nightly Build:</strong> Автоматична збірка гри після злиття коду за ніч. Вранці QA проводить Smoke-тест і, якщо він пройшов, починає глибше тестування.</li>
        <li><strong>Smoke Test у GameDev:</strong> Запустилась? Можна зайти в головне меню? Можна почати нову гру? Можна дійти до першого чекпоінту? Якщо так — білд придатний для тестування.</li>
        <li><strong>Build-to-Build (B2B) Regression:</strong> Порівняння нового білду зі старим, щоб переконатися, що нові зміни не зламали вже перевірений функціонал або сейви.</li>
        <li><strong>Milestone Acceptance Test:</strong> Перевірка при переході між ключовими етапами (Alpha, Beta, RC). Включає повний перелік Entry/Exit критеріїв від видавця/платформотримача.</li>
        <li><strong>First Playable:</strong> Найраніший показовий прототип — демо без фінального контенту, щоб показати видавцю концепт.</li>
      </ul>
    </div>

    <div class="theory-section">
      <h2>4. Особливості баг-репорту в GameDev</h2>
      <ul class="theory-list">
        <li><strong>Build + Changelist / Revision:</strong> Обов'язково вказати точну версію білду (наприклад, "Build 2.4.1 CL#55234"). Щоб розробник знав, в якому саме коміті з'явився баг.</li>
        <li><strong>Координати / Локація:</strong> Більшість рушіїв мають debug-консоль з виводом координат і назви рівня (Level: Forest_01, X:1200, Y:300, Z:45). Це критично для колізій і поппінгу.</li>
        <li><strong>Save File (Сейв):</strong> Обов'язково прикласти файл збереження до репорту, особливо якщо баг пов'язаний зі станом квесту або інвентарю.</li>
        <li><strong>Відео відтворення:</strong> Глітч анімації чи Z-fighting неможливо описати словами — прикладаємо відео чи GIF завжди. Інструменти: OBS, ShareX, вбудований рекордер консолі.</li>
        <li><strong>Crash Dump / Log-файл:</strong> При крашах обов'язково прикладати .dmp файл (Windows) або консольний лог — без нього розробник не може знайти причину.</li>
        <li><strong>Reproducibility Rate:</strong> Вказуємо частоту відтворення: "100% — кожен раз", "50% — через раз", "Разово — не вдалось відтворити". Якщо рідко — ще важливіше мати відео.</li>
      </ul>
    </div>

    <div class="theory-section">
      <h2>5. Severity у GameDev (специфіка)</h2>
      <table class="theory-table">
        <thead>
          <tr><th>Severity</th><th>Опис</th><th>Приклад</th></tr>
        </thead>
        <tbody>
          <tr><td><strong>Blocker / Showstopper</strong></td><td>Гра не запускається або не можна пройти далі</td><td>Краш відразу після вибору персонажа</td></tr>
          <tr><td><strong>Critical</strong></td><td>Ключова механіка зламана, але обхідний шлях є</td><td>Квест не завершується, але можна перевантажитись і повторити</td></tr>
          <tr><td><strong>Major</strong></td><td>Важлива фіча зламана, але гру можна пройти</td><td>Звук у кат-сцені відсутній, але субтитри є</td></tr>
          <tr><td><strong>Minor</strong></td><td>Косметичний або рідкісний баг</td><td>Текстура плаща мерехтить лише при конкретному куті камери</td></tr>
          <tr><td><strong>Cosmetic</strong></td><td>Не впливає на геймплей взагалі</td><td>Піксель не того кольору в куті UI</td></tr>
        </tbody>
      </table>
    </div>

</div>'''

html = re.sub(
    r'<div id="theoryGameDev"[^>]*>.*?(?=<div id="theoryMethodologies")',
    new_gamedev + '\n\n',
    html,
    flags=re.DOTALL
)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)

print("GameDev section expanded successfully!")
