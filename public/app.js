(() => {
  'use strict';

  const STORAGE_KEY = 'softWellnessStateV6';
  const LEGACY_STORAGE_KEYS = ['softWellnessStateV5', 'softWellnessStateV4'];
  const APP_VERSION = 6;
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

  const calculateWaterGoal = (weight) => Math.max(1200, Math.round((Number(weight || 0) * 30) / 50) * 50);

  const calculateGoals = (weight, customWaterMl = null) => {
    const protein = weight * 2;
    const calories = weight * 27;
    const fat = weight * 0.8;
    const carbs = Math.max(0, (calories - protein * 4 - fat * 9) / 4);
    const water = Number(customWaterMl) > 0 ? Number(customWaterMl) : calculateWaterGoal(weight);
    return { calories, protein, fat, carbs, water };
  };

  const defaultState = () => ({
    version: APP_VERSION,
    profile: { name: '', gender: '', salutation: '', age: 30, height: 175, weight: 72.4, waterGoalMl: calculateWaterGoal(72.4), waterGoalAuto: true },
    goals: calculateGoals(72.4),
    days: {},
    customFoods: [],
    recentFoodIds: ['chicken-breast', 'oats', 'rice', 'egg'],
    weightHistory: [],
    selectedDate: dateKey(new Date()),
    telegram: {
      authToken: '',
      connected: false,
      enabled: true,
      linkCode: '',
      botUsername: '',
      timezone: 'Europe/Kyiv',
      breakfastTime: '08:00',
      lunchTime: '13:00',
      dinnerTime: '19:00',
      waterMorningTime: '10:30',
      waterAfternoonTime: '16:00',
      mentalTime: '21:00',
      breakfastText: '',
      lunchText: '',
      dinnerText: '',
      autoMealSync: true
    },
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
  let telegramSyncTimer = null;

  function loadState() {
    try {
      let stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        for (const key of LEGACY_STORAGE_KEYS) {
          stored = localStorage.getItem(key);
          if (stored) break;
        }
      }
      const raw = JSON.parse(stored || 'null');
      if (!raw || typeof raw !== 'object') return defaultState();
      const fallback = defaultState();
      const profile = { ...fallback.profile, ...(raw.profile || {}) };
      if (!profile.gender && profile.salutation) profile.gender = profile.salutation === 'pani' ? 'female' : 'male';
      if (!profile.salutation && profile.gender) profile.salutation = profile.gender === 'female' ? 'pani' : 'pan';
      if (!Number(profile.waterGoalMl)) profile.waterGoalMl = calculateWaterGoal(profile.weight);
      if (typeof profile.waterGoalAuto !== 'boolean') profile.waterGoalAuto = true;
      const goals = { ...calculateGoals(profile.weight, profile.waterGoalMl), ...(raw.goals || {}), water: Number(raw.goals?.water) || profile.waterGoalMl };
      return {
        ...fallback,
        ...raw,
        profile,
        goals,
        telegram: { ...fallback.telegram, ...(raw.telegram || {}) },
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
      state.days[key] = { breakfast: [], lunch: [], dinner: [], snack: [], waterMl: 0, waterEntries: [] };
    }
    for (const meal of MEALS) {
      if (!Array.isArray(state.days[key][meal.id])) state.days[key][meal.id] = [];
    }
    if (!Number.isFinite(Number(state.days[key].waterMl))) state.days[key].waterMl = 0;
    if (!Array.isArray(state.days[key].waterEntries)) state.days[key].waterEntries = [];
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
    renderWater();
    renderMealList();
    if (currentScreen === 'diary') {
      $('#screenEyebrow').textContent = dateDescription.eyebrow;
    }
  }

  function renderMacro(prefix, value, goal) {
    $(`#${prefix}Value`).textContent = `${format(value)} / ${format(goal)} г`;
    $(`#${prefix}Progress`).style.setProperty('--width', `${clamp((value / goal) * 100 || 0, 0, 100)}%`);
  }

  function renderWater() {
    const day = getDay();
    const goal = Number(state.goals.water || state.profile.waterGoalMl || calculateWaterGoal(state.profile.weight));
    const current = Number(day.waterMl || 0);
    const percent = clamp((current / goal) * 100 || 0, 0, 100);
    $('#waterCaption').textContent = `${format(current)} из ${format(goal)} мл`;
    $('#waterPercent').textContent = `${Math.round(percent)}%`;
    $('#waterProgress').style.setProperty('--width', `${percent}%`);
  }

  function addWater(amount) {
    const day = getDay();
    const value = clamp(Number(amount) || 0, 0, 5000);
    if (!value) return;
    day.waterMl = clamp(Number(day.waterMl || 0) + value, 0, 12000);
    day.waterEntries.push({ amount: value, at: new Date().toISOString() });
    persist(false);
    renderWater();
    toast(`Добавлено ${format(value)} мл воды`);
  }

  function undoWater() {
    const day = getDay();
    const last = day.waterEntries.pop();
    const amount = Number(last?.amount || 250);
    day.waterMl = Math.max(0, Number(day.waterMl || 0) - amount);
    persist(false);
    renderWater();
    toast('Последняя порция воды отменена');
  }

  function openCustomWaterModal() {
    openModal(`<div class="sheet__handle"></div>
      <div class="sheet__header"><div><h2>Добавить <em>воду</em></h2><p>Укажите объём, который вы выпили.</p></div><button class="sheet__close" type="button" data-close-modal>×</button></div>
      <div class="sheet__body"><label class="field"><span>Объём, мл</span><input id="customWaterAmount" type="number" min="50" max="5000" step="50" value="250"></label><div class="sheet__actions sheet__actions--single"><button id="saveCustomWater" class="primary-button" type="button">Добавить воду</button></div></div>`);
    $('#saveCustomWater').addEventListener('click', () => {
      const amount = Number($('#customWaterAmount').value);
      if (!Number.isFinite(amount) || amount < 50 || amount > 5000) {
        toast('Проверьте объём воды');
        return;
      }
      addWater(amount);
      closeModal();
    });
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
    scheduleTelegramSync();
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
      scheduleTelegramSync();
      closeModal();
      renderDiary();
      toast('Запись обновлена');
    });
    $('#deleteEntry').addEventListener('click', () => {
      getDay()[mealId].splice(index, 1);
      persist(false);
      scheduleTelegramSync();
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
      acc.water += Number(getDay(key).waterMl || 0);
      return acc;
    }, { calories: 0, protein: 0, fat: 0, carbs: 0, water: 0 });
    $('#averageCalories').textContent = format(total.calories / reportPeriod);
    $('#averageProtein').textContent = format(total.protein / reportPeriod);
    $('#averageFat').textContent = format(total.fat / reportPeriod);
    $('#averageCarbs').textContent = format(total.carbs / reportPeriod);
    $('#averageWater').textContent = format(total.water / reportPeriod);

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
      if (state.profile.waterGoalAuto) state.profile.waterGoalMl = calculateWaterGoal(weight);
      state.goals = calculateGoals(weight, state.profile.waterGoalMl);
      const today = dateKey(new Date());
      const existing = state.weightHistory.find((item) => item.date === today);
      if (existing) existing.weight = weight;
      else state.weightHistory.push({ date: today, weight });
      state.weightHistory.sort((a, b) => a.date.localeCompare(b.date));
      persist(false);
      scheduleTelegramSync();
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
    const addressLabel = profile.gender === 'female' || profile.salutation === 'pani' ? 'Пані' : profile.gender === 'male' || profile.salutation === 'pan' ? 'Пан' : '';
    $('#profileBio').textContent = state.ui.profileComplete ? `${addressLabel ? `${addressLabel} · ` : ''}${format(profile.age)} лет · ${format(profile.height)} см · ${format(profile.weight,1)} кг` : 'Заполните данные о себе';
    $('#profileCalories').textContent = `${format(state.goals.calories)} ккал`;
    $('#profileProtein').textContent = `${format(state.goals.protein)} г`;
    $('#profileFat').textContent = `${format(state.goals.fat)} г`;
    $('#profileCarbs').textContent = `${format(state.goals.carbs)} г`;
    $('#profileWater').textContent = `${format(state.goals.water)} мл`;
    renderTelegramStatus();
  }

  function openProfileModal({ firstRun = false } = {}) {
    const profile = state.profile;
    const selectedGender = profile.gender || (profile.salutation === 'pani' ? 'female' : profile.salutation === 'pan' ? 'male' : '');
    openModal(`<div class="sheet__handle"></div>
      <div class="sheet__header"><div><h2>${firstRun ? 'Расскажите' : 'Изменить'} <em>о себе</em></h2><p>Данные остаются на устройстве. По выбранному полу бот автоматически использует обращение «пане» или «пані» — без AI.</p></div>${firstRun ? '' : '<button class="sheet__close" type="button" data-close-modal>×</button>'}</div>
      <div class="sheet__body">
        <div class="field"><span>Пол для обращения в напоминаниях</span><div id="genderSelector" class="salutation-selector"><button class="${selectedGender === 'male' ? 'is-active' : ''}" data-gender="male" type="button">Мужчина · пане</button><button class="${selectedGender === 'female' ? 'is-active' : ''}" data-gender="female" type="button">Женщина · пані</button></div></div>
        <label class="field"><span>Имя</span><input id="profileInputName" maxlength="60" placeholder="Например, Михаил" value="${escapeHtml(profile.name)}"></label>
        <div class="field-grid"><label class="field"><span>Возраст</span><input id="profileInputAge" type="number" min="14" max="100" value="${Number(profile.age)}"></label><label class="field"><span>Рост, см</span><input id="profileInputHeight" type="number" min="120" max="230" value="${Number(profile.height)}"></label></div>
        <label class="field"><span>Вес, кг</span><input id="profileInputWeight" type="number" min="30" max="300" step="0.1" value="${Number(profile.weight)}"></label>
        <label class="field"><span>Норма воды, мл</span><input id="profileInputWater" type="number" min="800" max="8000" step="50" value="${Number(profile.waterGoalMl || calculateWaterGoal(profile.weight))}" ${profile.waterGoalAuto ? 'disabled' : ''}></label>
        <div class="switch-row"><span>Рассчитывать воду автоматически: вес × 30 мл</span><label class="switch"><input id="profileWaterAuto" type="checkbox" ${profile.waterGoalAuto ? 'checked' : ''}><i></i></label></div>
        <div class="preview-goals"><div class="preview-goal"><small>Калории</small><strong id="previewCalories">${format(state.goals.calories)}</strong></div><div class="preview-goal"><small>Белки</small><strong id="previewProtein">${format(state.goals.protein)} г</strong></div><div class="preview-goal"><small>Жиры</small><strong id="previewFat">${format(state.goals.fat)} г</strong></div><div class="preview-goal"><small>Углеводы</small><strong id="previewCarbs">${format(state.goals.carbs)} г</strong></div><div class="preview-goal"><small>Вода</small><strong id="previewWater">${format(state.goals.water)} мл</strong></div></div>
        <p class="reminder-note">Норма воды является настраиваемой ориентировочной целью. Потребность может меняться из-за активности, жары, беременности, болезней и рекомендаций врача.</p>
        <div class="sheet__actions sheet__actions--single"><button id="saveProfile" class="primary-button" type="button">${firstRun ? 'Сохранить и начать' : 'Сохранить профиль'}</button></div>
      </div>`);
    let gender = selectedGender;
    const updatePreview = () => {
      const weight = Number($('#profileInputWeight').value) || 0;
      const auto = $('#profileWaterAuto').checked;
      const waterInput = $('#profileInputWater');
      const water = auto ? calculateWaterGoal(weight) : Number(waterInput.value || 0);
      waterInput.disabled = auto;
      if (auto) waterInput.value = String(water);
      const goals = calculateGoals(weight, water);
      $('#previewCalories').textContent = format(goals.calories);
      $('#previewProtein').textContent = `${format(goals.protein)} г`;
      $('#previewFat').textContent = `${format(goals.fat)} г`;
      $('#previewCarbs').textContent = `${format(goals.carbs)} г`;
      $('#previewWater').textContent = `${format(goals.water)} мл`;
    };
    $$('[data-gender]').forEach((button) => button.addEventListener('click', () => {
      gender = button.dataset.gender;
      $$('[data-gender]').forEach((item) => item.classList.toggle('is-active', item === button));
    }));
    $('#profileInputWeight').addEventListener('input', updatePreview);
    $('#profileInputWater').addEventListener('input', updatePreview);
    $('#profileWaterAuto').addEventListener('change', updatePreview);
    $('#saveProfile').addEventListener('click', () => {
      const weight = Number($('#profileInputWeight').value);
      const age = Number($('#profileInputAge').value);
      const height = Number($('#profileInputHeight').value);
      const waterGoalAuto = $('#profileWaterAuto').checked;
      const waterGoalMl = waterGoalAuto ? calculateWaterGoal(weight) : Number($('#profileInputWater').value);
      if (!gender) {
        toast('Выберите: мужчина или женщина');
        return;
      }
      if (!Number.isFinite(weight) || weight < 30 || weight > 300 || age < 14 || age > 100 || height < 120 || height > 230 || !Number.isFinite(waterGoalMl) || waterGoalMl < 800 || waterGoalMl > 8000) {
        toast('Проверьте данные профиля');
        return;
      }
      const salutation = gender === 'female' ? 'pani' : 'pan';
      state.profile = { name: $('#profileInputName').value.trim(), gender, salutation, age, height, weight, waterGoalMl, waterGoalAuto };
      state.goals = calculateGoals(weight, waterGoalMl);
      state.ui.profileComplete = true;
      const today = dateKey(new Date());
      const existing = state.weightHistory.find((item) => item.date === today);
      if (existing) existing.weight = weight;
      else state.weightHistory.push({ date: today, weight });
      persist(false);
      scheduleTelegramSync();
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

  function renderTelegramStatus() {
    const element = $('#telegramStatusText');
    if (!element) return;
    if (state.telegram.connected && state.telegram.enabled) element.textContent = 'Подключён и отправляет напоминания';
    else if (state.telegram.connected) element.textContent = 'Подключён, напоминания приостановлены';
    else if (state.telegram.authToken) element.textContent = 'Ожидает подтверждения в Telegram';
    else element.textContent = 'Бот ещё не подключён';
  }

  function mealPlanText(mealId) {
    const entries = getDay()[mealId] || [];
    if (!entries.length) return '';
    return entries.map((entry) => `${entry.name} — ${format(entry.grams)} г`).join(', ');
  }

  async function telegramApi(path, { method = 'GET', body = null } = {}) {
    const headers = { accept: 'application/json' };
    if (body) headers['content-type'] = 'application/json';
    if (state.telegram.authToken) headers.authorization = `Bearer ${state.telegram.authToken}`;
    const response = await fetch(path, { method, headers, body: body ? JSON.stringify(body) : undefined });
    const payload = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(payload.error || 'Telegram-сервис временно недоступен');
    return payload;
  }

  function telegramSettingsPayload(readForm = true) {
    const read = (id, fallback = '') => readForm && $(`#${id}`) ? $(`#${id}`).value.trim() : fallback;
    const autoMealSync = readForm && $('#telegramAutoMealSync') ? $('#telegramAutoMealSync').checked : state.telegram.autoMealSync !== false;
    const mealText = (mealId, fieldId, savedText) => autoMealSync ? mealPlanText(mealId) : read(fieldId, savedText || mealPlanText(mealId));
    const gender = state.profile.gender || (state.profile.salutation === 'pani' ? 'female' : state.profile.salutation === 'pan' ? 'male' : '');
    return {
      name: state.profile.name,
      gender,
      salutation: gender === 'female' ? 'pani' : gender === 'male' ? 'pan' : '',
      timezone: read('telegramTimezone', state.telegram.timezone || 'Europe/Kyiv'),
      waterGoalMl: Number(state.goals.water || state.profile.waterGoalMl),
      enabled: readForm && $('#telegramEnabled') ? $('#telegramEnabled').checked : state.telegram.enabled,
      autoMealSync,
      times: {
        breakfast: read('telegramBreakfastTime', state.telegram.breakfastTime || '08:00'),
        lunch: read('telegramLunchTime', state.telegram.lunchTime || '13:00'),
        dinner: read('telegramDinnerTime', state.telegram.dinnerTime || '19:00'),
        waterMorning: read('telegramWaterMorningTime', state.telegram.waterMorningTime || '10:30'),
        waterAfternoon: read('telegramWaterAfternoonTime', state.telegram.waterAfternoonTime || '16:00'),
        mental: read('telegramMentalTime', state.telegram.mentalTime || '21:00')
      },
      meals: {
        breakfast: mealText('breakfast', 'telegramBreakfastText', state.telegram.breakfastText),
        lunch: mealText('lunch', 'telegramLunchText', state.telegram.lunchText),
        dinner: mealText('dinner', 'telegramDinnerText', state.telegram.dinnerText)
      }
    };
  }

  function scheduleTelegramSync() {
    if (!state.telegram.authToken || !state.telegram.connected || state.telegram.enabled === false) return;
    clearTimeout(telegramSyncTimer);
    telegramSyncTimer = setTimeout(async () => {
      try {
        const payload = telegramSettingsPayload(false);
        const result = await telegramApi('/api/telegram/settings', { method: 'PUT', body: payload });
        applyTelegramSettings(payload, result);
      } catch (error) {
        console.warn('Telegram auto-sync failed', error);
      }
    }, 900);
  }

  function applyTelegramSettings(payload, server = {}) {
    state.telegram = {
      ...state.telegram,
      authToken: server.authToken || state.telegram.authToken,
      connected: Boolean(server.connected ?? state.telegram.connected),
      enabled: Boolean(payload.enabled),
      linkCode: server.linkCode || state.telegram.linkCode,
      botUsername: server.botUsername || state.telegram.botUsername,
      timezone: payload.timezone,
      breakfastTime: payload.times.breakfast,
      lunchTime: payload.times.lunch,
      dinnerTime: payload.times.dinner,
      waterMorningTime: payload.times.waterMorning,
      waterAfternoonTime: payload.times.waterAfternoon,
      mentalTime: payload.times.mental,
      breakfastText: payload.meals.breakfast,
      lunchText: payload.meals.lunch,
      dinnerText: payload.meals.dinner,
      autoMealSync: payload.autoMealSync !== false
    };
    persist(false);
    renderTelegramStatus();
  }

  async function refreshTelegramStatus({ quiet = false } = {}) {
    if (!state.telegram.authToken) return null;
    try {
      const status = await telegramApi('/api/telegram/status');
      state.telegram.connected = Boolean(status.connected);
      state.telegram.enabled = Boolean(status.enabled);
      state.telegram.linkCode = status.linkCode || state.telegram.linkCode;
      state.telegram.botUsername = status.botUsername || state.telegram.botUsername;
      persist(false);
      renderTelegramStatus();
      return status;
    } catch (error) {
      if (!quiet) toast(error.message);
      return null;
    }
  }

  function openTelegramReminders() {
    if (!state.profile.gender && !state.profile.salutation) {
      toast('Сначала укажите пол в профиле');
      openProfileModal();
      return;
    }
    const t = state.telegram;
    const breakfastText = t.breakfastText || mealPlanText('breakfast');
    const lunchText = t.lunchText || mealPlanText('lunch');
    const dinnerText = t.dinnerText || mealPlanText('dinner');
    const codeBlock = t.linkCode ? `<div class="telegram-code"><div><small>Код подключения</small><strong id="telegramLinkCode">${escapeHtml(t.linkCode)}</strong></div><button id="copyTelegramCode" type="button">Копировать</button></div>` : '';
    openModal(`<div class="sheet__handle"></div>
      <div class="sheet__header"><div><h2>Telegram-<em>нагадування</em></h2><p>Автономный бот без AI: утром, в обед и вечером отправляет рацион, отдельно напоминает о воде и мягкой паузе для ментального здоровья.</p></div><button class="sheet__close" type="button" data-close-modal>×</button></div>
      <div class="sheet__body">
        <div id="telegramStatusCard" class="telegram-status-card ${t.connected ? 'is-connected' : ''}"><i class="telegram-status-card__dot"></i><div><strong>${t.connected ? 'Telegram подключён' : 'Telegram ещё не подключён'}</strong><small>${t.connected ? 'Расписание работает автономно через Cloudflare Worker.' : 'Создайте код и отправьте его боту командой /start.'}</small></div></div>
        ${codeBlock}
        <div class="switch-row"><span>Отправлять напоминания</span><label class="switch"><input id="telegramEnabled" type="checkbox" ${t.enabled ? 'checked' : ''}><i></i></label></div>
        <div class="reminder-section"><h3>Часовой пояс и расписание</h3>
          <label class="field"><span>Часовой пояс</span><input id="telegramTimezone" value="${escapeHtml(t.timezone || 'Europe/Kyiv')}" placeholder="Europe/Kyiv"></label>
          <div class="reminder-time-grid">
            <label class="field"><span>Завтрак</span><input id="telegramBreakfastTime" type="time" step="300" value="${escapeHtml(t.breakfastTime || '08:00')}"></label>
            <label class="field"><span>Обед</span><input id="telegramLunchTime" type="time" step="300" value="${escapeHtml(t.lunchTime || '13:00')}"></label>
            <label class="field"><span>Ужин</span><input id="telegramDinnerTime" type="time" step="300" value="${escapeHtml(t.dinnerTime || '19:00')}"></label>
            <label class="field"><span>Ментальная пауза</span><input id="telegramMentalTime" type="time" step="300" value="${escapeHtml(t.mentalTime || '21:00')}"></label>
            <label class="field"><span>Вода утром</span><input id="telegramWaterMorningTime" type="time" step="300" value="${escapeHtml(t.waterMorningTime || '10:30')}"></label>
            <label class="field"><span>Вода днём</span><input id="telegramWaterAfternoonTime" type="time" step="300" value="${escapeHtml(t.waterAfternoonTime || '16:00')}"></label>
          </div>
        </div>
        <div class="reminder-section"><h3>Рацион</h3>
          <div class="switch-row"><span>Автоматически брать рацион из сегодняшнего дневника</span><label class="switch"><input id="telegramAutoMealSync" type="checkbox" ${t.autoMealSync !== false ? 'checked' : ''}><i></i></label></div>
          <label class="field"><span>Утренний рацион</span><textarea id="telegramBreakfastText" placeholder="Например: овсянка, яйца и яблоко">${escapeHtml(breakfastText)}</textarea></label>
          <label class="field"><span>Дневной рацион</span><textarea id="telegramLunchText" placeholder="Например: куриное филе, рис и овощи">${escapeHtml(lunchText)}</textarea></label>
          <label class="field"><span>Вечерний рацион</span><textarea id="telegramDinnerText" placeholder="Например: лосось и салат">${escapeHtml(dinnerText)}</textarea></label>
          <p class="reminder-note">При автосинхронизации изменения завтрака, обеда и ужина отправляются боту после сохранения дневника. Генеративный AI не используется: только ваш рацион и заранее написанные безопасные фразы.</p>
        </div>
        <div class="sheet__actions"><button id="refreshTelegramCode" class="secondary-button" type="button">${t.authToken ? 'Новый код' : 'Создать код'}</button><button id="saveTelegramSettings" class="primary-button" type="button">Сохранить</button></div>
        ${t.botUsername ? `<a class="secondary-button" style="display:flex;align-items:center;justify-content:center;text-decoration:none;margin-top:9px" href="https://t.me/${escapeHtml(t.botUsername)}" target="_blank" rel="noreferrer">Открыть @${escapeHtml(t.botUsername)}</a>` : ''}
      </div>`);

    const setMealFieldsState = () => {
      const automatic = $('#telegramAutoMealSync')?.checked !== false;
      const values = {
        telegramBreakfastText: mealPlanText('breakfast'),
        telegramLunchText: mealPlanText('lunch'),
        telegramDinnerText: mealPlanText('dinner')
      };
      for (const [id, value] of Object.entries(values)) {
        const field = $(`#${id}`);
        if (!field) continue;
        field.disabled = automatic;
        if (automatic) field.value = value;
      }
    };
    $('#telegramAutoMealSync')?.addEventListener('change', setMealFieldsState);
    setMealFieldsState();

    const copyCode = async () => {
      if (!state.telegram.linkCode) return;
      await navigator.clipboard?.writeText(state.telegram.linkCode).catch(() => {});
      toast('Код скопирован');
    };
    $('#copyTelegramCode')?.addEventListener('click', copyCode);

    const registerOrRefresh = async () => {
      const payload = telegramSettingsPayload(true);
      try {
        const endpoint = state.telegram.authToken ? '/api/telegram/link-code' : '/api/telegram/register';
        const result = await telegramApi(endpoint, { method: 'POST', body: payload });
        applyTelegramSettings(payload, result);
        closeModal();
        toast('Код подключения создан');
        setTimeout(openTelegramReminders, 180);
      } catch (error) {
        toast(error.message);
      }
    };
    $('#refreshTelegramCode').addEventListener('click', registerOrRefresh);
    $('#saveTelegramSettings').addEventListener('click', async () => {
      const payload = telegramSettingsPayload(true);
      try {
        if (!state.telegram.authToken) {
          const result = await telegramApi('/api/telegram/register', { method: 'POST', body: payload });
          applyTelegramSettings(payload, result);
          closeModal();
          toast('Настройки сохранены, подключите бота кодом');
          setTimeout(openTelegramReminders, 180);
          return;
        }
        const result = await telegramApi('/api/telegram/settings', { method: 'PUT', body: payload });
        applyTelegramSettings(payload, result);
        closeModal();
        toast('Расписание Telegram сохранено');
      } catch (error) {
        toast(error.message);
      }
    });
    refreshTelegramStatus({ quiet: true }).then((status) => {
      if (!status || !$('#telegramStatusCard')) return;
      const card = $('#telegramStatusCard');
      card.classList.toggle('is-connected', status.connected);
      card.querySelector('strong').textContent = status.connected ? 'Telegram подключён' : 'Telegram ещё не подключён';
      card.querySelector('small').textContent = status.connected ? 'Расписание работает автономно через Cloudflare Worker.' : 'Отправьте боту команду /start с кодом подключения.';
    });
  }

  function openMentalSupport() {
    const current = getDay().mentalMood || '';
    openModal(`<div class="sheet__handle"></div>
      <div class="sheet__header"><div><h2>Мягкая <em>пауза</em></h2><p>Это не AI и не медицинская диагностика — только короткое напоминание остановиться и проверить своё состояние.</p></div><button class="sheet__close" type="button" data-close-modal>×</button></div>
      <div class="sheet__body"><div class="mental-card"><h3>Как вы сейчас?</h3><p>Опустите плечи, сделайте три спокойных вдоха и выдоха, выпейте немного воды. Выберите состояние — оно сохранится только на устройстве.</p><div class="mental-actions"><button data-mood="calm" type="button">Спокойно</button><button data-mood="tense" type="button">Напряжённо</button><button data-mood="pause" type="button">Нужна пауза</button></div></div><p class="reminder-note">Если вам плохо, тревога сильная или состояние угрожает безопасности, обратитесь к близкому человеку или профильному специалисту.</p></div>`);
    $$('[data-mood]').forEach((button) => {
      if (button.dataset.mood === current) button.style.borderColor = 'rgba(183,208,160,.55)';
      button.addEventListener('click', () => {
        getDay().mentalMood = button.dataset.mood;
        getDay().mentalCheckedAt = new Date().toISOString();
        persist(false);
        closeModal();
        toast('Состояние отмечено');
      });
    });
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
        const fallback = defaultState();
        const profile = { ...fallback.profile, ...(imported.profile || {}) };
        if (!profile.gender && profile.salutation) profile.gender = profile.salutation === 'pani' ? 'female' : 'male';
        if (!profile.salutation && profile.gender) profile.salutation = profile.gender === 'female' ? 'pani' : 'pan';
        if (!Number(profile.waterGoalMl)) profile.waterGoalMl = calculateWaterGoal(profile.weight);
        state = {
          ...fallback,
          ...imported,
          profile,
          goals: { ...calculateGoals(profile.weight, profile.waterGoalMl), ...(imported.goals || {}), water: Number(imported.goals?.water) || profile.waterGoalMl },
          telegram: { ...fallback.telegram, ...(imported.telegram || {}) },
          ui: { ...fallback.ui, ...(imported.ui || {}) }
        };
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
      LEGACY_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
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
    $$('[data-water-add]').forEach((button) => button.addEventListener('click', () => addWater(Number(button.dataset.waterAdd))));
    $('#customWater').addEventListener('click', openCustomWaterModal);
    $('#undoWater').addEventListener('click', undoWater);
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
    $('#telegramReminders').addEventListener('click', openTelegramReminders);
    $('#mentalSupport').addEventListener('click', openMentalSupport);
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
    if (state.telegram.authToken) refreshTelegramStatus({ quiet: true });
    if (!state.ui.onboardingComplete) setTimeout(openOnboardingModal, 180);
    else if (!state.ui.profileComplete) setTimeout(() => openProfileModal({ firstRun: true }), 180);
  }

  start();
})();
