(() => {
  'use strict';

  const STORAGE_KEY = 'softWellnessStateV4';
  const APP_VERSION = 4;
  const MEALS = [
    { id: 'breakfast', name: 'Завтрак', icon: '☀️' },
    { id: 'lunch', name: 'Обед', icon: '🌤️' },
    { id: 'dinner', name: 'Ужин', icon: '🌙' },
    { id: 'snack', name: 'Перекус', icon: '🥣' }
  ];

  const BUILTIN_FOODS = [
    { id: 'chicken-breast', name: 'Куриное филе запечённое', emoji: '🍗', calories: 120, protein: 23, fat: 3, carbs: 0 },
    { id: 'oats', name: 'Овсяные хлопья', emoji: '🥣', calories: 370, protein: 13, fat: 7, carbs: 62 },
    { id: 'rice', name: 'Рис жасмин варёный', emoji: '🍚', calories: 130, protein: 2.7, fat: 0.3, carbs: 28 },
    { id: 'egg', name: 'Яйцо куриное', emoji: '🥚', calories: 143, protein: 13, fat: 10, carbs: 1.1 },
    { id: 'salmon', name: 'Лосось', emoji: '🐟', calories: 208, protein: 20, fat: 13, carbs: 0 },
    { id: 'greek-yogurt', name: 'Йогурт греческий 2%', emoji: '🥛', calories: 73, protein: 9.8, fat: 2, carbs: 3.9 },
    { id: 'banana', name: 'Банан', emoji: '🍌', calories: 89, protein: 1.1, fat: 0.3, carbs: 23 },
    { id: 'apple', name: 'Яблоко', emoji: '🍎', calories: 52, protein: 0.3, fat: 0.2, carbs: 14 },
    { id: 'avocado', name: 'Авокадо', emoji: '🥑', calories: 160, protein: 2, fat: 15, carbs: 8.5 },
    { id: 'cottage-cheese', name: 'Творог 5%', emoji: '🧀', calories: 121, protein: 17, fat: 5, carbs: 1.8 },
    { id: 'buckwheat', name: 'Гречка варёная', emoji: '🌾', calories: 110, protein: 4.2, fat: 1.1, carbs: 21.3 },
    { id: 'pasta', name: 'Макароны из твёрдых сортов', emoji: '🍝', calories: 350, protein: 12, fat: 1.5, carbs: 72 },
    { id: 'potato', name: 'Картофель отварной', emoji: '🥔', calories: 82, protein: 2, fat: 0.4, carbs: 17 },
    { id: 'beef', name: 'Говядина постная', emoji: '🥩', calories: 187, protein: 26, fat: 8, carbs: 0 },
    { id: 'turkey', name: 'Филе индейки', emoji: '🍖', calories: 135, protein: 29, fat: 1.5, carbs: 0 },
    { id: 'olive-oil', name: 'Оливковое масло', emoji: '🫒', calories: 884, protein: 0, fat: 100, carbs: 0 },
    { id: 'almonds', name: 'Миндаль', emoji: '🥜', calories: 579, protein: 21, fat: 50, carbs: 22 },
    { id: 'bread', name: 'Хлеб цельнозерновой', emoji: '🍞', calories: 247, protein: 13, fat: 4.2, carbs: 41 },
    { id: 'broccoli', name: 'Брокколи', emoji: '🥦', calories: 34, protein: 2.8, fat: 0.4, carbs: 7 },
    { id: 'tomato', name: 'Помидор', emoji: '🍅', calories: 18, protein: 0.9, fat: 0.2, carbs: 3.9 },
    { id: 'whey', name: 'Сывороточный протеин', emoji: '⚡', calories: 390, protein: 78, fat: 6, carbs: 8 },
    { id: 'dark-chocolate', name: 'Тёмный шоколад 70%', emoji: '🍫', calories: 598, protein: 7.8, fat: 43, carbs: 46 }
  ];

  const $ = (selector) => document.querySelector(selector);
  const $$ = (selector) => [...document.querySelectorAll(selector)];
  const clamp = (number, min, max) => Math.min(max, Math.max(min, number));
  const round = (number, digits = 0) => {
    const factor = 10 ** digits;
    return Math.round((Number(number) + Number.EPSILON) * factor) / factor;
  };
  const format = (number, digits = 0) => Number(number || 0).toLocaleString('ru-RU', { maximumFractionDigits: digits });
  const escapeHtml = (value) => String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const dateKey = (date) => {
    const local = new Date(date);
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toISOString().slice(0, 10);
  };

  const calculateGoals = (weight) => {
    const protein = weight * 2;
    const calories = weight * 27;
    const fat = weight * 0.8;
    const carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);
    return { calories, protein, fat, carbs };
  };

  const defaultState = () => ({
    version: APP_VERSION,
    profile: { name: '', age: 30, height: 175, weight: 72.4 },
    goals: calculateGoals(72.4),
    days: {},
    customFoods: [],
    recentFoodIds: ['chicken-breast', 'oats', 'rice', 'egg'],
    weightHistory: [],
    selectedDate: dateKey(new Date()),
    ui: {
      onboardingComplete: false,
      profileComplete: false,
      installDevice: /android/i.test(navigator.userAgent) ? 'android' : 'ios'
    }
  });

  let state = loadState();
  let currentScreen = 'diary';
  let addTab = 'catalog';
  let selectedFood = null;
  let selectedMeal = 'lunch';
  let selectedGrams = 150;
  let reportPeriod = 7;
  let scannerStream = null;
  let deferredInstallPrompt = null;

  function loadState() {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!raw || typeof raw !== 'object') return defaultState();
      const fallback = defaultState();
      return {
        ...fallback,
        ...raw,
        profile: { ...fallback.profile, ...(raw.profile || {}) },
        goals: { ...fallback.goals, ...(raw.goals || {}) },
        ui: { ...fallback.ui, ...(raw.ui || {}) },
        days: raw.days || {},
        customFoods: Array.isArray(raw.customFoods) ? raw.customFoods : [],
        recentFoodIds: Array.isArray(raw.recentFoodIds) ? raw.recentFoodIds : fallback.recentFoodIds,
        weightHistory: Array.isArray(raw.weightHistory) ? raw.weightHistory : []
      };
    } catch {
      return defaultState();
    }
  }

  function persist(showToast = true) {
    state.version = APP_VERSION;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (showToast) toast('Сохранено на этом устройстве');
  }

  function toast(message) {
    const element = $('#toast');
    element.textContent = message;
    element.classList.add('is-visible');
    clearTimeout(element._timer);
    element._timer = setTimeout(() => element.classList.remove('is-visible'), 1900);
  }

  function getDay(key = state.selectedDate) {
    if (!state.days[key]) {
      state.days[key] = { breakfast: [], lunch: [], dinner: [], snack: [] };
    }
    for (const meal of MEALS) {
      if (!Array.isArray(state.days[key][meal.id])) state.days[key][meal.id] = [];
    }
    return state.days[key];
  }

  function entryNutrition(entry) {
    const ratio = Number(entry.grams || 0) / 100;
    return {
      calories: Number(entry.calories || 0) * ratio,
      protein: Number(entry.protein || 0) * ratio,
      fat: Number(entry.fat || 0) * ratio,
      carbs: Number(entry.carbs || 0) * ratio
    };
  }

  function totalsForDate(key = state.selectedDate) {
    const totals = { calories: 0, protein: 0, fat: 0, carbs: 0, count: 0 };
    const day = getDay(key);
    for (const meal of MEALS) {
      for (const entry of day[meal.id]) {
        const nutrition = entryNutrition(entry);
        totals.calories += nutrition.calories;
        totals.protein += nutrition.protein;
        totals.fat += nutrition.fat;
        totals.carbs += nutrition.carbs;
        totals.count += 1;
      }
    }
    return totals;
  }

  function allFoods() {
    return [...BUILTIN_FOODS, ...state.customFoods];
  }

  function foodById(id) {
    return allFoods().find((food) => food.id === id) || null;
  }

  function describeDate(key) {
    const date = new Date(`${key}T12:00:00`);
    const today = dateKey(new Date());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const short = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
    if (key === today) return { title: `Сегодня, ${short}`, eyebrow: 'Сегодня' };
    if (key === dateKey(yesterdayDate)) return { title: `Вчера, ${short}`, eyebrow: 'Вчера' };
    if (key === dateKey(tomorrowDate)) return { title: `Завтра, ${short}`, eyebrow: 'Завтра' };
    return { title: date.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' }), eyebrow: date.toLocaleDateString('ru-RU', { weekday: 'short' }) };
  }

  function navigate(screen) {
    currentScreen = screen;
    $$('.screen').forEach((element) => element.classList.toggle('is-active', element.dataset.screen === screen));
    $$('.nav-item').forEach((button) => button.classList.toggle('is-active', button.dataset.nav === screen));
    const configuration = {
      diary: { title: 'Дневник', eyebrow: describeDate(state.selectedDate).eyebrow, action: 'add' },
      add: { title: selectedFood ? 'Порция' : 'Добавить продукт', eyebrow: selectedFood ? selectedMealName() : 'Каталог', action: 'custom' },
      reports: { title: 'Отчёты', eyebrow: `${reportPeriod} дней`, action: 'weight' },
      profile: { title: 'Профиль', eyebrow: state.profile.name || 'Soft Wellness', action: 'edit' }
    }[screen];
    $('#screenTitle').textContent = configuration.title;
    $('#screenEyebrow').textContent = configuration.eyebrow;
    $('#headerBack').style.visibility = screen === 'diary' ? 'hidden' : 'visible';
    $('#headerAction').innerHTML = iconForAction(configuration.action);
    $('#headerAction').dataset.action = configuration.action;
    if (screen === 'diary') renderDiary();
    if (screen === 'add') renderAddScreen();
    if (screen === 'reports') renderReports();
    if (screen === 'profile') renderProfile();
  }

  function iconForAction(action) {
    const icons = {
      add: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
      custom: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
      weight: '<svg viewBox="0 0 24 24"><path d="M12 3v18M5 10h14"/></svg>',
      edit: '<svg viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/></svg>'
    };
    return icons[action] || icons.add;
  }

  function selectedMealName() {
    return MEALS.find((meal) => meal.id === selectedMeal)?.name || 'Приём пищи';
  }

  function renderDiary() {
    const totals = totalsForDate();
    const goals = state.goals;
    const dateDescription = describeDate(state.selectedDate);
    $('#dateText').textContent = dateDescription.title;
    $('#dateSubtext').textContent = totals.count ? `${totals.count} позиций в дневнике` : 'Дневник питания';
    $('#eatenCalories').textContent = format(totals.calories);
    $('#goalCalories').textContent = format(goals.calories);
    $('#remainingCalories').textContent = totals.calories <= goals.calories
      ? `Осталось ${format(goals.calories - totals.calories)} ккал`
      : `Превышение на ${format(totals.calories - goals.calories)} ккал`;
    const caloriePercent = clamp((totals.calories / goals.calories) * 100 || 0, 0, 100);
    $('#calorieRing').style.setProperty('--progress', caloriePercent);
    $('#caloriePercent').textContent = `${Math.round(caloriePercent)}%`;
    renderMacro('protein', totals.protein, goals.protein);
    renderMacro('fat', totals.fat, goals.fat);
    renderMacro('carb', totals.carbs, goals.carbs);
    renderMealList();
    if (currentScreen === 'diary') {
      $('#screenEyebrow').textContent = dateDescription.eyebrow;
    }
  }

  function renderMacro(prefix, value, goal) {
    $(`#${prefix}Value`).textContent = `${format(value)} / ${format(goal)} г`;
    $(`#${prefix}Progress`).style.setProperty('--width', `${clamp((value / goal) * 100 || 0, 0, 100)}%`);
  }

  function renderMealList() {
    const day = getDay();
    $('#mealList').innerHTML = MEALS.map((meal) => {
      const entries = day[meal.id];
      const mealTotals = entries.reduce((acc, entry) => {
        const nutrition = entryNutrition(entry);
        acc.calories += nutrition.calories;
        acc.protein += nutrition.protein;
        acc.fat += nutrition.fat;
        acc.carbs += nutrition.carbs;
        return acc;
      }, { calories: 0, protein: 0, fat: 0, carbs: 0 });
      const names = entries.length ? entries.map((entry) => entry.name).join(', ') : 'Пока пусто';
      const entriesHtml = entries.length
        ? entries.map((entry, index) => {
            const nutrition = entryNutrition(entry);
            return `<button class="meal-entry" type="button" data-edit-meal="${meal.id}" data-edit-index="${index}">
              <div><h4>${escapeHtml(entry.name)}</h4><p>${format(entry.grams)} г · Б ${format(nutrition.protein, 1)} · Ж ${format(nutrition.fat, 1)} · У ${format(nutrition.carbs, 1)}</p></div>
              <div class="meal-entry__value"><strong>${format(nutrition.calories)} ккал</strong><small>изменить</small></div>
            </button>`;
          }).join('')
        : '<div class="meal-empty">Нажмите «＋», чтобы добавить продукт</div>';
      return `<article class="meal-card ${entries.length ? 'is-open' : ''}" data-meal-card="${meal.id}">
        <div class="meal-card__header">
          <button class="meal-card__main" type="button" data-toggle-meal="${meal.id}">
            <span class="meal-icon">${meal.icon}</span>
            <span class="meal-card__copy"><h3>${meal.name}</h3><p>${escapeHtml(names)}</p></span>
          </button>
          <div class="meal-card__side"><div class="meal-card__calories"><strong>${format(mealTotals.calories)} ккал</strong><small>${entries.length} поз.</small></div><button class="add-circle" type="button" data-add-meal="${meal.id}" aria-label="Добавить в ${meal.name}">＋</button></div>
        </div>
        <div class="meal-card__entries">${entriesHtml}</div>
      </article>`;
    }).join('');

    $$('[data-toggle-meal]').forEach((button) => {
      button.addEventListener('click', () => button.closest('.meal-card').classList.toggle('is-open'));
    });
    $$('[data-add-meal]').forEach((button) => {
      button.addEventListener('click', () => {
        selectedMeal = button.dataset.addMeal;
        clearFoodSelection();
        navigate('add');
      });
    });
    $$('[data-edit-meal]').forEach((button) => {
      button.addEventListener('click', () => openEditEntry(button.dataset.editMeal, Number(button.dataset.editIndex)));
    });
  }

  function renderAddScreen() {
    $$('.segment').forEach((button) => button.classList.toggle('is-active', button.dataset.addTab === addTab));
    $('#addCatalog').classList.toggle('is-hidden', addTab !== 'catalog' || Boolean(selectedFood));
    $('#addCustom').classList.toggle('is-hidden', addTab !== 'custom' || Boolean(selectedFood));
    $('#addBarcode').classList.toggle('is-hidden', addTab !== 'barcode' || Boolean(selectedFood));
    $('#foodDetail').classList.toggle('is-hidden', !selectedFood);
    if (selectedFood) {
      renderFoodDetail();
      $('#screenTitle').textContent = 'Порция';
      $('#screenEyebrow').textContent = selectedMealName();
    } else {
      renderFoodCatalog();
      $('#screenTitle').textContent = 'Добавить продукт';
      $('#screenEyebrow').textContent = addTab === 'catalog' ? 'Каталог' : addTab === 'custom' ? 'Свой продукт' : 'Штрихкод';
    }
  }

  function renderFoodCatalog() {
    const query = ($('#foodSearch').value || '').trim().toLocaleLowerCase('ru');
    const foods = allFoods().filter((food) => food.name.toLocaleLowerCase('ru').includes(query));
    const recentFoods = state.recentFoodIds.map(foodById).filter(Boolean).slice(0, 6);
    $('#recentFoods').innerHTML = recentFoods.length
      ? recentFoods.map((food) => `<button class="recent-chip" type="button" data-food-id="${food.id}"><span>${food.emoji || '🍽️'}</span>${escapeHtml(food.name)}</button>`).join('')
      : '';
    $('#foodCatalog').innerHTML = foods.length
      ? foods.map((food) => `<button class="food-row" type="button" data-food-id="${food.id}">
          <span class="food-avatar">${food.emoji || '🍽️'}</span>
          <span class="food-row__copy"><h3>${escapeHtml(food.name)}</h3><p>На 100 г: ${format(food.calories)} ккал · Б ${format(food.protein, 1)} · Ж ${format(food.fat, 1)} · У ${format(food.carbs, 1)}</p></span>
          <svg class="food-row__chevron" viewBox="0 0 24 24"><path d="M9 18l6-6-6-6"/></svg>
        </button>`).join('')
      : '<div class="meal-empty">Продукт не найден. Создайте его во вкладке «Мой продукт».</div>';
    $$('[data-food-id]').forEach((button) => button.addEventListener('click', () => selectFood(foodById(button.dataset.foodId))));
  }

  function selectFood(food) {
    if (!food) return;
    selectedFood = { ...food };
    selectedGrams = Number(food.defaultGrams || 150);
    renderAddScreen();
  }

  function clearFoodSelection() {
    selectedFood = null;
    selectedGrams = 150;
    stopScanner();
  }

  function renderFoodDetail() {
    if (!selectedFood) return;
    $('#selectedFoodAvatar').textContent = selectedFood.emoji || '🍽️';
    $('#selectedFoodName').textContent = selectedFood.name;
    $('#selectedFoodMeta').textContent = `На 100 г · ${format(selectedFood.calories)} ккал`;
    $('#gramsValue').textContent = format(selectedGrams);
    $('#gramsRange').value = String(clamp(selectedGrams, Number($('#gramsRange').min), Number($('#gramsRange').max)));
    const ratio = selectedGrams / 100;
    $('#portionLabel').textContent = `на ${format(selectedGrams)} г`;
    $('#portionCalories').textContent = format(selectedFood.calories * ratio);
    $('#portionProtein').textContent = format(selectedFood.protein * ratio, 1);
    $('#portionFat').textContent = format(selectedFood.fat * ratio, 1);
    $('#portionCarbs').textContent = format(selectedFood.carbs * ratio, 1);
    $('#mealSelector').innerHTML = MEALS.map((meal) => `<button class="meal-choice ${meal.id === selectedMeal ? 'is-active' : ''}" type="button" data-meal-choice="${meal.id}"><span>${meal.icon}</span>${meal.name}</button>`).join('');
    $$('[data-meal-choice]').forEach((button) => button.addEventListener('click', () => {
      selectedMeal = button.dataset.mealChoice;
      renderFoodDetail();
      $('#screenEyebrow').textContent = selectedMealName();
    }));
  }

  function addSelectedFood() {
    if (!selectedFood) return;
    const entry = {
      uid: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      foodId: selectedFood.id,
      name: selectedFood.name,
      emoji: selectedFood.emoji || '🍽️',
      calories: Number(selectedFood.calories),
      protein: Number(selectedFood.protein),
      fat: Number(selectedFood.fat),
      carbs: Number(selectedFood.carbs),
      grams: Number(selectedGrams),
      createdAt: new Date().toISOString()
    };
    getDay()[selectedMeal].push(entry);
    state.recentFoodIds = [selectedFood.id, ...state.recentFoodIds.filter((id) => id !== selectedFood.id)].slice(0, 8);
    persist(false);
    toast(`${selectedFood.name} добавлен в «${selectedMealName()}»`);
    clearFoodSelection();
    navigate('diary');
  }

  function createCustomFood(event) {
    event.preventDefault();
    const food = {
      id: `custom-${Date.now()}`,
      name: $('#customName').value.trim(),
      emoji: '🍽️',
      calories: Number($('#customCalories').value),
      protein: Number($('#customProtein').value),
      fat: Number($('#customFat').value),
      carbs: Number($('#customCarbs').value),
      custom: true
    };
    if (!food.name || [food.calories, food.protein, food.fat, food.carbs].some((value) => !Number.isFinite(value) || value < 0)) {
      toast('Проверьте данные продукта');
      return;
    }
    state.customFoods.unshift(food);
    persist(false);
    event.target.reset();
    addTab = 'catalog';
    selectFood(food);
    toast('Продукт сохранён');
  }

  async function lookupBarcode() {
    const barcode = $('#barcodeInput').value.replace(/\D/g, '');
    if (barcode.length < 8) {
      toast('Введите корректный штрихкод');
      return;
    }
    const button = $('#lookupBarcode');
    const previous = button.textContent;
    button.textContent = 'Ищем…';
    button.disabled = true;
    try {
      const response = await fetch(`/api/food/${encodeURIComponent(barcode)}`);
      const result = await response.json();
      if (!response.ok || !result.found) throw new Error(result.error || 'Продукт не найден');
      selectFood({
        id: `barcode-${barcode}`,
        name: result.product.name,
        emoji: '📦',
        calories: result.product.calories,
        protein: result.product.protein,
        fat: result.product.fat,
        carbs: result.product.carbs,
        barcode
      });
      toast('Продукт найден');
    } catch (error) {
      toast(error.message || 'Не удалось найти продукт');
    } finally {
      button.textContent = previous;
      button.disabled = false;
    }
  }

  async function startScanner() {
    if (!('BarcodeDetector' in window) || !navigator.mediaDevices?.getUserMedia) {
      toast('Камера-сканер не поддерживается. Введите код вручную.');
      return;
    }
    try {
      const detector = new BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'] });
      scannerStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      const video = $('#scannerVideo');
      video.srcObject = scannerStream;
      video.classList.remove('is-hidden');
      await video.play();
      const scan = async () => {
        if (!scannerStream) return;
        const codes = await detector.detect(video).catch(() => []);
        if (codes.length) {
          $('#barcodeInput').value = codes[0].rawValue;
          stopScanner();
          lookupBarcode();
          return;
        }
        requestAnimationFrame(scan);
      };
      requestAnimationFrame(scan);
    } catch {
      stopScanner();
      toast('Не удалось открыть камеру');
    }
  }

  function stopScanner() {
    if (scannerStream) {
      scannerStream.getTracks().forEach((track) => track.stop());
      scannerStream = null;
    }
    const video = $('#scannerVideo');
    if (video) {
      video.pause();
      video.srcObject = null;
      video.classList.add('is-hidden');
    }
  }

  function openEditEntry(mealId, index) {
    const entry = getDay()[mealId][index];
    if (!entry) return;
    const nutrition = entryNutrition(entry);
    openModal(`<div class="sheet__handle"></div>
      <div class="sheet__header"><div><h2>Изменить <em>запись</em></h2><p>Количество продукта и удаление из дневника.</p></div><button class="sheet__close" type="button" data-close-modal>×</button></div>
      <div class="sheet__body">
        <div class="edit-entry-summary"><h3>${escapeHtml(entry.name)}</h3><p>${format(nutrition.calories)} ккал · Б ${format(nutrition.protein,1)} · Ж ${format(nutrition.fat,1)} · У ${format(nutrition.carbs,1)}</p></div>
        <label class="field"><span>Количество, г</span><input id="editEntryGrams" type="number" min="1" max="3000" step="1" value="${Number(entry.grams)}"></label>
        <div class="sheet__actions"><button id="deleteEntry" class="danger-button" type="button">Удалить</button><button id="saveEntry" class="primary-button" type="button">Сохранить</button></div>
      </div>`);
    $('#saveEntry').addEventListener('click', () => {
      const grams = clamp(Number($('#editEntryGrams').value) || 1, 1, 3000);
      getDay()[mealId][index].grams = grams;
      persist(false);
      closeModal();
      renderDiary();
      toast('Запись обновлена');
    });
    $('#deleteEntry').addEventListener('click', () => {
      getDay()[mealId].splice(index, 1);
      persist(false);
      closeModal();
      renderDiary();
      toast('Запись удалена');
    });
  }

  function renderReports() {
    $('#averagePeriodLabel').textContent = `За последние ${reportPeriod} дней`;
    $('#screenEyebrow').textContent = `${reportPeriod} дней`;
    const history = [...state.weightHistory].sort((a, b) => a.date.localeCompare(b.date)).slice(-Math.max(reportPeriod, 8));
    $('#currentWeight').textContent = `${format(state.profile.weight, 1)} кг`;
    const firstWeight = history[0]?.weight ?? state.profile.weight;
    const delta = Number(state.profile.weight) - Number(firstWeight);
    $('#weightDelta').textContent = Math.abs(delta) < 0.05 ? 'Нет изменений' : `${delta < 0 ? '−' : '+'} ${format(Math.abs(delta), 1)} кг`;
    $('#weightDelta').style.color = delta <= 0 ? 'var(--sage)' : 'var(--peach)';
    drawWeightChart(history.length ? history.map((item) => Number(item.weight)) : [state.profile.weight]);

    const keys = [];
    for (let index = reportPeriod - 1; index >= 0; index -= 1) {
      const date = new Date();
      date.setDate(date.getDate() - index);
      keys.push(dateKey(date));
    }
    const total = keys.reduce((acc, key) => {
      const values = totalsForDate(key);
      acc.calories += values.calories;
      acc.protein += values.protein;
      acc.fat += values.fat;
      acc.carbs += values.carbs;
      return acc;
    }, { calories: 0, protein: 0, fat: 0, carbs: 0 });
    $('#averageCalories').textContent = format(total.calories / reportPeriod);
    $('#averageProtein').textContent = format(total.protein / reportPeriod);
    $('#averageFat').textContent = format(total.fat / reportPeriod);
    $('#averageCarbs').textContent = format(total.carbs / reportPeriod);

    const streak = calculateStreak();
    $('#streakDays').textContent = String(streak);
    $('#streakTitle').textContent = streak ? `${streak} ${pluralDays(streak)} подряд` : 'Первый шаг';
    $('#streakText').textContent = streak ? 'Вы регулярно отмечаете питание. Продолжайте в том же духе.' : 'Добавьте первый продукт и начните серию.';
  }

  function calculateStreak() {
    let streak = 0;
    const date = new Date();
    while (true) {
      const key = dateKey(date);
      if (totalsForDate(key).count === 0) break;
      streak += 1;
      date.setDate(date.getDate() - 1);
    }
    return streak;
  }

  function pluralDays(number) {
    const mod10 = number % 10;
    const mod100 = number % 100;
    if (mod10 === 1 && mod100 !== 11) return 'день';
    if ([2,3,4].includes(mod10) && ![12,13,14].includes(mod100)) return 'дня';
    return 'дней';
  }

  function drawWeightChart(weights) {
    const values = weights.length === 1 ? [weights[0], weights[0]] : weights;
    const min = Math.min(...values) - 0.5;
    const max = Math.max(...values) + 0.5;
    const points = values.map((value, index) => {
      const x = 14 + index * (332 / (values.length - 1));
      const y = 145 - ((value - min) / (max - min || 1)) * 112;
      return [round(x, 2), round(y, 2)];
    });
    const path = points.map((point, index) => `${index ? 'L' : 'M'}${point[0]},${point[1]}`).join(' ');
    $('#weightChart').innerHTML = `<defs><linearGradient id="weightFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b7d0a0" stop-opacity=".3"/><stop offset="1" stop-color="#b7d0a0" stop-opacity="0"/></linearGradient></defs>
      <path d="${path} L${points.at(-1)[0]},164 L${points[0][0]},164 Z" fill="url(#weightFill)" stroke="none"/>
      <path d="${path}" fill="none" stroke="#b7d0a0" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      ${points.map((point) => `<circle cx="${point[0]}" cy="${point[1]}" r="4" fill="#b7d0a0" stroke="#202521" stroke-width="3"/>`).join('')}`;
  }

  function openWeightModal() {
    openModal(`<div class="sheet__handle"></div>
      <div class="sheet__header"><div><h2>Новое <em>измерение</em></h2><p>Вес обновит цели и добавится в график прогресса.</p></div><button class="sheet__close" type="button" data-close-modal>×</button></div>
      <div class="sheet__body"><label class="field"><span>Вес, кг</span><input id="newWeight" type="number" min="30" max="300" step="0.1" value="${Number(state.profile.weight)}"></label><div class="sheet__actions sheet__actions--single"><button id="saveWeight" class="primary-button" type="button">Сохранить измерение</button></div></div>`);
    $('#saveWeight').addEventListener('click', () => {
      const weight = Number($('#newWeight').value);
      if (!Number.isFinite(weight) || weight < 30 || weight > 300) {
        toast('Проверьте вес');
        return;
      }
      state.profile.weight = weight;
      state.goals = calculateGoals(weight);
      const today = dateKey(new Date());
      const existing = state.weightHistory.find((item) => item.date === today);
      if (existing) existing.weight = weight;
      else state.weightHistory.push({ date: today, weight });
      state.weightHistory.sort((a, b) => a.date.localeCompare(b.date));
      persist(false);
      closeModal();
      renderReports();
      renderDiary();
      renderProfile();
      toast('Вес и цели обновлены');
    });
  }

  function renderProfile() {
    const profile = state.profile;
    $('#profileName').textContent = profile.name || 'Профиль';
    $('#profileBio').textContent = state.ui.profileComplete ? `${format(profile.age)} лет · ${format(profile.height)} см · ${format(profile.weight,1)} кг` : 'Заполните данные о себе';
    $('#profileCalories').textContent = `${format(state.goals.calories)} ккал`;
    $('#profileProtein').textContent = `${format(state.goals.protein)} г`;
    $('#profileFat').textContent = `${format(state.goals.fat)} г`;
    $('#profileCarbs').textContent = `${format(state.goals.carbs)} г`;
  }

  function openProfileModal({ firstRun = false } = {}) {
    const profile = state.profile;
    openModal(`<div class="sheet__handle"></div>
      <div class="sheet__header"><div><h2>${firstRun ? 'Расскажите' : 'Изменить'} <em>о себе</em></h2><p>Имя, возраст, рост и вес сохраняются только на вашем устройстве.</p></div>${firstRun ? '' : '<button class="sheet__close" type="button" data-close-modal>×</button>'}</div>
      <div class="sheet__body">
        <label class="field"><span>Имя</span><input id="profileInputName" maxlength="60" placeholder="Например, Михаил" value="${escapeHtml(profile.name)}"></label>
        <div class="field-grid"><label class="field"><span>Возраст</span><input id="profileInputAge" type="number" min="14" max="100" value="${Number(profile.age)}"></label><label class="field"><span>Рост, см</span><input id="profileInputHeight" type="number" min="120" max="230" value="${Number(profile.height)}"></label></div>
        <label class="field"><span>Вес, кг</span><input id="profileInputWeight" type="number" min="30" max="300" step="0.1" value="${Number(profile.weight)}"></label>
        <div class="preview-goals"><div class="preview-goal"><small>Калории</small><strong id="previewCalories">${format(state.goals.calories)}</strong></div><div class="preview-goal"><small>Белки</small><strong id="previewProtein">${format(state.goals.protein)} г</strong></div><div class="preview-goal"><small>Жиры</small><strong id="previewFat">${format(state.goals.fat)} г</strong></div><div class="preview-goal"><small>Углеводы</small><strong id="previewCarbs">${format(state.goals.carbs)} г</strong></div></div>
        <div class="sheet__actions sheet__actions--single"><button id="saveProfile" class="primary-button" type="button">${firstRun ? 'Сохранить и начать' : 'Сохранить профиль'}</button></div>
      </div>`);
    const updatePreview = () => {
      const weight = Number($('#profileInputWeight').value) || 0;
      const goals = calculateGoals(weight);
      $('#previewCalories').textContent = format(goals.calories);
      $('#previewProtein').textContent = `${format(goals.protein)} г`;
      $('#previewFat').textContent = `${format(goals.fat)} г`;
      $('#previewCarbs').textContent = `${format(goals.carbs)} г`;
    };
    $('#profileInputWeight').addEventListener('input', updatePreview);
    $('#saveProfile').addEventListener('click', () => {
      const weight = Number($('#profileInputWeight').value);
      const age = Number($('#profileInputAge').value);
      const height = Number($('#profileInputHeight').value);
      if (!Number.isFinite(weight) || weight < 30 || weight > 300 || age < 14 || age > 100 || height < 120 || height > 230) {
        toast('Проверьте данные профиля');
        return;
      }
      state.profile = { name: $('#profileInputName').value.trim(), age, height, weight };
      state.goals = calculateGoals(weight);
      state.ui.profileComplete = true;
      const today = dateKey(new Date());
      const existing = state.weightHistory.find((item) => item.date === today);
      if (existing) existing.weight = weight;
      else state.weightHistory.push({ date: today, weight });
      persist(false);
      closeModal();
      renderDiary();
      renderProfile();
      toast('Профиль сохранён');
      navigate('diary');
    });
  }

  function openOnboardingModal() {
    const renderSteps = () => {
      const ios = ['Откройте сайт в Safari.', 'Нажмите «Поделиться».', 'Выберите «На экран Домой» и нажмите «Добавить».'];
      const android = ['Откройте сайт в Chrome.', 'Нажмите меню ⋮.', 'Выберите «Установить приложение» и подтвердите.'];
      const steps = state.ui.installDevice === 'android' ? android : ios;
      $('#installTabs').innerHTML = `<button class="${state.ui.installDevice === 'ios' ? 'is-active' : ''}" data-install-device="ios" type="button">iPhone</button><button class="${state.ui.installDevice === 'android' ? 'is-active' : ''}" data-install-device="android" type="button">Android</button>`;
      $('#installSteps').innerHTML = steps.map((text, index) => `<div class="step-row"><i>${index + 1}</i><p>${text}</p></div>`).join('');
      $$('[data-install-device]').forEach((button) => button.addEventListener('click', () => {
        state.ui.installDevice = button.dataset.installDevice;
        persist(false);
        renderSteps();
      }));
    };

    openModal(`<div class="sheet__handle"></div>
      <div class="welcome-art">
        <img src="/assets/welcome-character.webp" width="1292" height="684" alt="Девушка с чашкой среди комнатных растений">
        <div class="welcome-art__scrim" aria-hidden="true"></div>
        <div class="welcome-art__badge"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19.5 4.5C13 4.6 8.8 7.8 7.2 13.1M16.8 7.2c-2.2 2.6-4.7 4.5-7.8 5.7M7.2 13.1c-1.4 1.7-2.2 3.8-2.4 6.4M7.2 13.1c-.7-3.5.2-6.4 2.7-8.6 3.4.6 5.7 2.4 6.9 5.4"/></svg><span>Мягкий подход к себе каждый день</span></div>
      </div>
      <div class="welcome-copy"><h2>Добро пожаловать<br>в <em>Soft Wellness</em> <span aria-hidden="true">🌿</span></h2><p>Питание без строгих правил, забота без изнуряющих ограничений и поддержка на пути к лучшей версии себя.</p></div>
      <div class="form-card welcome-install-card"><div class="form-card__title"><div><h2>Установите приложение</h2><p>Добавьте его на главный экран для быстрого доступа.</p></div></div><div id="installTabs" class="install-tabs"></div><div id="installSteps" class="step-list"></div></div>
      <div class="sheet__actions"><button id="continueWithoutInstall" class="secondary-button" type="button">Продолжить</button><button id="triggerInstall" class="primary-button" type="button">Установить</button></div>
      <div class="welcome-privacy"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3l7 3v5c0 4.5-2.8 8.4-7 10-4.2-1.6-7-5.5-7-10V6l7-3Z"/><path d="M9.4 12.2l1.7 1.7 3.7-4"/></svg><span>Ваши данные остаются на этом устройстве.</span></div>`);
    renderSteps();
    const finish = () => {
      state.ui.onboardingComplete = true;
      persist(false);
      closeModal();
      if (!state.ui.profileComplete) setTimeout(() => openProfileModal({ firstRun: true }), 180);
    };
    $('#continueWithoutInstall').addEventListener('click', finish);
    $('#triggerInstall').addEventListener('click', async () => {
      if (deferredInstallPrompt) {
        deferredInstallPrompt.prompt();
        await deferredInstallPrompt.userChoice;
        deferredInstallPrompt = null;
        finish();
      } else {
        toast(state.ui.installDevice === 'ios' ? 'Safari: Поделиться → На экран Домой' : 'Chrome: меню ⋮ → Установить приложение');
      }
    });
  }

  function openInstallGuide() {
    const wasComplete = state.ui.onboardingComplete;
    state.ui.onboardingComplete = false;
    openOnboardingModal();
    state.ui.onboardingComplete = wasComplete;
  }

  function exportState() {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `soft-wellness-backup-${dateKey(new Date())}.json`;
    link.click();
    URL.revokeObjectURL(link.href);
    toast('Резервная копия подготовлена');
  }

  function importState(file) {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const imported = JSON.parse(String(reader.result));
        if (!imported.profile || !imported.days) throw new Error('Неверный формат');
        state = { ...defaultState(), ...imported, ui: { ...defaultState().ui, ...(imported.ui || {}) } };
        persist(false);
        renderDiary();
        renderProfile();
        renderReports();
        toast('Данные восстановлены');
      } catch {
        toast('Не удалось импортировать файл');
      }
    };
    reader.readAsText(file);
  }

  function openCredits() {
    openModal(`<div class="sheet__handle"></div><div class="sheet__header"><div><h2>О <em>проекте</em></h2><p>Принципы, источники и ограничения.</p></div><button class="sheet__close" type="button" data-close-modal>×</button></div><div class="sheet__body credits"><p><strong>Soft Wellness</strong> — оригинальная локальная реализация дневника питания. Дизайн интерфейса основан на выбранном вами Soft Wellness-концепте.</p><p>Архитектурные идеи «настроить один раз — отмечать в несколько касаний», локальная приватность и быстрые пищевые сценарии вдохновлены публичным проектом <strong>Aerko_</strong> автора SrPakura. Код Aerko_ в этот проект не копировался.</p><p>Данные продуктов являются демонстрационными. Поиск штрихкода использует публичную базу Open Food Facts через Cloudflare Worker.</p><p>Формула целей реализована по заданию владельца проекта: вес × 27 ккал, вес × 2 белка, вес × 0,8 жиров, остаток калорий — углеводы.</p></div>`);
  }

  function confirmClearAll() {
    openModal(`<div class="sheet__handle"></div><div class="sheet__header"><div><h2>Удалить <em>все данные?</em></h2><p>Профиль, дневник, продукты и история веса будут удалены с этого устройства.</p></div><button class="sheet__close" type="button" data-close-modal>×</button></div><div class="sheet__actions"><button class="secondary-button" type="button" data-close-modal>Отмена</button><button id="confirmClear" class="danger-button" type="button">Удалить</button></div>`);
    $('#confirmClear').addEventListener('click', () => {
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState();
      closeModal();
      renderDiary();
      renderProfile();
      toast('Все данные удалены');
      setTimeout(openOnboardingModal, 180);
    });
  }

  function openModal(content) {
    const root = $('#modalRoot');
    root.innerHTML = `<div class="modal-backdrop"><div class="sheet" role="dialog" aria-modal="true">${content}</div></div>`;
    root.classList.add('is-open');
    root.querySelector('.modal-backdrop').addEventListener('click', (event) => {
      if (event.target.classList.contains('modal-backdrop')) closeModal();
    });
    root.querySelectorAll('[data-close-modal]').forEach((button) => button.addEventListener('click', closeModal));
  }

  function closeModal() {
    const root = $('#modalRoot');
    root.classList.remove('is-open');
    setTimeout(() => { if (!root.classList.contains('is-open')) root.innerHTML = ''; }, 230);
  }

  function changeDate(days) {
    const date = new Date(`${state.selectedDate}T12:00:00`);
    date.setDate(date.getDate() + days);
    state.selectedDate = dateKey(date);
    persist(false);
    renderDiary();
  }

  function initializeEvents() {
    $$('.nav-item').forEach((button) => button.addEventListener('click', () => {
      clearFoodSelection();
      navigate(button.dataset.nav);
    }));
    $('#headerBack').addEventListener('click', () => {
      if (currentScreen === 'add' && selectedFood) {
        clearFoodSelection();
        renderAddScreen();
      } else {
        navigate('diary');
      }
    });
    $('#headerAction').addEventListener('click', () => {
      const action = $('#headerAction').dataset.action;
      if (action === 'add') { selectedMeal = 'lunch'; navigate('add'); }
      if (action === 'custom') { clearFoodSelection(); addTab = 'custom'; renderAddScreen(); }
      if (action === 'weight') openWeightModal();
      if (action === 'edit') openProfileModal();
    });
    $('#previousDate').addEventListener('click', () => changeDate(-1));
    $('#nextDate').addEventListener('click', () => changeDate(1));
    $('#dateButton').addEventListener('click', () => { state.selectedDate = dateKey(new Date()); persist(false); renderDiary(); });
    $('#quickAdd').addEventListener('click', () => navigate('add'));
    $$('.segment').forEach((button) => button.addEventListener('click', () => {
      clearFoodSelection();
      addTab = button.dataset.addTab;
      renderAddScreen();
    }));
    $('#foodSearch').addEventListener('input', renderFoodCatalog);
    $('#clearSearch').addEventListener('click', () => { $('#foodSearch').value = ''; renderFoodCatalog(); $('#foodSearch').focus(); });
    $('#customFoodForm').addEventListener('submit', createCustomFood);
    $('#closeFoodDetail').addEventListener('click', () => { clearFoodSelection(); renderAddScreen(); });
    $('#decreaseGrams').addEventListener('click', () => { selectedGrams = clamp(selectedGrams - 10, 1, 3000); renderFoodDetail(); });
    $('#increaseGrams').addEventListener('click', () => { selectedGrams = clamp(selectedGrams + 10, 1, 3000); renderFoodDetail(); });
    $('#gramsRange').addEventListener('input', (event) => { selectedGrams = Number(event.target.value); renderFoodDetail(); });
    $('#addFoodToDiary').addEventListener('click', addSelectedFood);
    $('#lookupBarcode').addEventListener('click', lookupBarcode);
    $('#barcodeInput').addEventListener('keydown', (event) => { if (event.key === 'Enter') lookupBarcode(); });
    $('#scanCamera').addEventListener('click', startScanner);
    $$('.period-tabs button').forEach((button) => button.addEventListener('click', () => {
      reportPeriod = Number(button.dataset.period);
      $$('.period-tabs button').forEach((item) => item.classList.toggle('is-active', item === button));
      renderReports();
    }));
    $('#addWeight').addEventListener('click', openWeightModal);
    $('#editProfile').addEventListener('click', () => openProfileModal());
    $('#installGuide').addEventListener('click', openInstallGuide);
    $('#exportData').addEventListener('click', exportState);
    $('#importData').addEventListener('change', (event) => { const [file] = event.target.files; if (file) importState(file); event.target.value = ''; });
    $('#clearAllData').addEventListener('click', confirmClearAll);
    $('#openCredits').addEventListener('click', openCredits);
    window.addEventListener('beforeinstallprompt', (event) => { event.preventDefault(); deferredInstallPrompt = event; });
    window.addEventListener('pagehide', stopScanner);
  }

  function initializeTelegram() {
    const webApp = window.Telegram?.WebApp;
    if (!webApp) return;
    try {
      webApp.ready();
      webApp.expand();
      webApp.setHeaderColor?.('#171b18');
      webApp.setBackgroundColor?.('#111412');
      webApp.BackButton?.onClick(() => {
        if (selectedFood) { clearFoodSelection(); renderAddScreen(); }
        else if (currentScreen !== 'diary') navigate('diary');
        else webApp.close();
      });
    } catch {}
  }

  async function initializePwa() {
    if ('serviceWorker' in navigator) {
      try { await navigator.serviceWorker.register('/sw.js'); } catch {}
    }
  }

  function start() {
    initializeEvents();
    initializeTelegram();
    initializePwa();
    renderDiary();
    renderProfile();
    renderFoodCatalog();
    navigate('diary');
    if (!state.ui.onboardingComplete) setTimeout(openOnboardingModal, 180);
    else if (!state.ui.profileComplete) setTimeout(() => openProfileModal({ firstRun: true }), 180);
  }

  start();
})();
