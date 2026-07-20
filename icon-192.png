# Виправлення деплою 1.2.1

Попередній `package-lock.json` був випадково згенерований у внутрішньому середовищі та містив приватні URL реєстру пакетів. Cloudflare не міг звернутися до них, тому `npm clean-install` зависав і завершувався помилкою `Exit handler never called!`.

У версії 1.2.1:

- усі `resolved` URL у `package-lock.json` замінено на `https://registry.npmjs.org/`;
- додано `.npmrc` з публічним npm registry;
- Wrangler зафіксовано на версії `4.112.0`;
- Node зафіксовано у `.node-version` як `22.16.0`.

Перед повторним запуском у Cloudflare відкрийте **Settings → Build → Build cache → Clear Cache**, щоб старий npm-кеш не відновився.

Для Workers Builds:

- Build command: залишити порожнім або `npm run check:js`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

Runtime secrets додаються у **Settings → Variables & Secrets**:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_WEBHOOK_SECRET`
- `TELEGRAM_BOT_USERNAME`
