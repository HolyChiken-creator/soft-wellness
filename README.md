# Soft Wellness 1.5


Mobile-first PWA для харчування, води та м’якої турботи про себе. Проєкт розгортається як Cloudflare Worker зі Static Assets без `package.json` і без автоматичного `npm install`.

## Що працює

- щоденник харчування, вода, вага, звіти й локальна позначка стану;
- PWA та офлайн-кеш;
- камера-сканер штрихкодів;
- резервне сканування зі знімка;
- пошук продуктів через Open Food Facts;
- Telegram-нагадування без AI;
- звертання `пане` або `пані` за вибором у профілі;
- одна синхронізована сесія для PWA та Telegram Mini App.

## Виправлення сканера

`BarcodeDetector` більше не є єдиним способом розпізнавання. Логіка така:

1. використовується нативний `BarcodeDetector`, якщо браузер підтримує потрібні формати;
2. на iPhone, Safari й інших браузерах використовується ZXing Browser;
3. якщо WebView не дозволяє живу камеру, доступний режим `Сфотографировать штрихкод`;
4. сканер підтримує EAN-13, EAN-8, UPC-A, UPC-E та Code 128.

Для камери потрібен опублікований HTTPS-домен. Після першого успішного завантаження ZXing кешується Service Worker.

## Спільна сесія PWA та Telegram Mini App

Safari PWA і Telegram WebView мають окремі сховища браузера, тому прямий обмін `localStorage` неможливий. У версії 1.4 стан синхронізується через існуючий Cloudflare Durable Object:

- PWA завантажує зашифровано авторизований стан після змін;
- після `/start КОД` бот надсилає кнопку `Відкрити Soft Wellness`;
- Mini App передає серверу підписаний `Telegram.WebApp.initData`;
- Worker перевіряє підпис Telegram і видає окремий токен цієї ж сесії;
- Mini App завантажує той самий профіль, щоденник, воду, вагу й налаштування;
- зміни з обох оболонок синхронізуються за принципом останнього збереження.

Секретний Telegram init data перевіряється тільки на Worker. `TELEGRAM_BOT_TOKEN` не потрапляє в клієнтський код.

## Підключення

1. Відкрити `Профіль → Telegram-нагадування`.
2. Створити код.
3. Надіслати боту `/start КОД`.
4. Натиснути у повідомленні бота `🌿 Відкрити Soft Wellness`.
5. Відкриється Mini App із тією ж сесією, що й PWA.

Для постійної кнопки `Launch app` додатково вкажіть URL Worker як Main Mini App у BotFather.

## Cloudflare variables and secrets

Обов’язкові секрети:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`

Звичайна variable:

- `TELEGRAM_BOT_USERNAME`

Додаткові GitHub Actions secrets, якщо деплой запускається workflow:

- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_API_TOKEN`
- `TELEGRAM_BOT_TOKEN`

## Деплой без npm

У Cloudflare Workers Builds:

```text
Build command: порожньо
Deploy command: npx --yes wrangler@4.112.0 deploy --keep-vars
Root directory: /
```

У репозиторії не повинно бути `package.json` або `package-lock.json`, інакше Cloudflare знову запустить автоматичний `npm clean-install`.

## Приватність

Без Telegram дані залишаються тільки на пристрої. Після підключення Telegram створюється серверна копія стану для спільної сесії PWA/Mini App. Доступ до неї захищений випадковими токенами, а Telegram Mini App авторизується через перевірений `initData`.

Формули харчування й води є орієнтирами, а не медичними призначеннями. Нагадування про ментальний стан не є діагностикою.


## Синхронизация PWA и Telegram Mini App

Версия 1.4 использует явное соответствие `Telegram user id → PWA session id` в Durable Object. После `/start КОД` предыдущая тестовая привязка этого Telegram-пользователя отключается, создаётся короткоживущий непрозрачный билет запуска, а кнопка бота открывает именно связанную PWA-сессию.

Mini App сначала получает и применяет облачный снимок состояния, а уже затем показывает интерфейс. Поэтому отдельный `localStorage` Telegram WebView больше не отображается как другая сессия.


## Authorization feedback

After linking Telegram, both the PWA and Mini App show a visible success screen with the shared session ID. The PWA automatically polls for the `/start CODE` confirmation.
