# Деплой Soft Wellness через GitHub Actions і Wrangler

## Обов’язкові GitHub Secrets

Відкрийте репозиторій:

`Settings → Secrets and variables → Actions → New repository secret`

Створіть рівно три секрети:

1. `CLOUDFLARE_ACCOUNT_ID`
2. `CLOUDFLARE_API_TOKEN`
3. `TELEGRAM_BOT_TOKEN`

`TELEGRAM_BOT_TOKEN` — токен від `@BotFather`. Не вставляйте його в `wrangler.jsonc`, `app.js`, коміти або звичайні GitHub Variables.

Workflow автоматично:

- перевіряє наявність усіх трьох секретів;
- отримує ім’я Telegram-бота через `getMe`;
- генерує новий `TELEGRAM_WEBHOOK_SECRET`;
- передає `TELEGRAM_BOT_TOKEN`, `TELEGRAM_WEBHOOK_SECRET` і `TELEGRAM_BOT_USERNAME` у Cloudflare як encrypted Worker secrets;
- виконує `wrangler deploy`;
- бере URL щойно розгорнутого Worker;
- реєструє Telegram webhook і команди бота;
- перевіряє `/api/health`.

Тобто окремо створювати `WORKER_URL`, `TELEGRAM_WEBHOOK_SECRET` або `TELEGRAM_BOT_USERNAME` у GitHub більше не потрібно.

## Cloudflare API token

Для токена Cloudflare використовуйте мінімальні дозволи, достатні для редагування Workers у потрібному акаунті. Обмежте токен лише цим Cloudflare account.

## Перший запуск

1. Завантажте вміст ZIP у корінь репозиторію.
2. Додайте три GitHub Secrets вище.
3. Відкрийте `Actions → Deploy Soft Wellness → Run workflow`.
4. Після успішного запуску URL застосунку буде у `Summary` workflow.

## Якщо деплой знову не пройшов

Workflow тепер показує окрему зрозумілу помилку для кожного відсутнього секрету.

Інші часті причини:

- для Cloudflare account ще не активований домен `workers.dev`;
- API token створений для іншого акаунта;
- API token не має права редагувати Workers;
- токен Telegram неправильний або був перевипущений у BotFather;
- у репозиторії файли знаходяться не в корені, а в додатковій вкладеній папці.

У ZIP коренем проєкту є папка `soft-wellness-wrangler`. У GitHub у корені мають бути безпосередньо `package.json`, `wrangler.jsonc`, `public/`, `src/` і `.github/`.

## Ручний деплой

```bash
npm ci
npm run check
npx wrangler secret put TELEGRAM_BOT_TOKEN
npx wrangler secret put TELEGRAM_WEBHOOK_SECRET
npx wrangler secret put TELEGRAM_BOT_USERNAME
npm run deploy
```
