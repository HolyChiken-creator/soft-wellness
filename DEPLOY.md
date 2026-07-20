name: Deploy Soft Wellness

on:
  push:
    branches: [main]
  workflow_dispatch:

concurrency:
  group: soft-wellness-production
  cancel-in-progress: true

jobs:
  deploy:
    runs-on: ubuntu-latest
    timeout-minutes: 20
    permissions:
      contents: read
    env:
      CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
      CLOUDFLARE_ACCOUNT_ID: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
      TELEGRAM_BOT_TOKEN: ${{ secrets.TELEGRAM_BOT_TOKEN }}

    steps:
      - name: Checkout repository
        uses: actions/checkout@v6

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Validate source
        run: |
          node --check public/app.js
          node --check public/sw.js
          node --check src/worker.js

      - name: Validate required secrets
        shell: bash
        run: |
          missing=0
          for name in CLOUDFLARE_API_TOKEN CLOUDFLARE_ACCOUNT_ID TELEGRAM_BOT_TOKEN; do
            if [ -z "${!name}" ]; then
              echo "::error title=Missing GitHub secret::$name is not configured."
              missing=1
            fi
          done
          exit "$missing"

      - name: Prepare Telegram secrets
        shell: bash
        run: |
          BOT_INFO="$(curl --fail-with-body --silent --show-error \
            "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe")"
          BOT_USERNAME="$(BOT_INFO="$BOT_INFO" node --input-type=module -e \
            'const d=JSON.parse(process.env.BOT_INFO); if(!d.ok || !d.result?.username) process.exit(2); process.stdout.write(d.result.username)')"
          WEBHOOK_SECRET="$(openssl rand -hex 32)"
          echo "::add-mask::$WEBHOOK_SECRET"
          echo "TELEGRAM_BOT_USERNAME=$BOT_USERNAME" >> "$GITHUB_ENV"
          echo "TELEGRAM_WEBHOOK_SECRET=$WEBHOOK_SECRET" >> "$GITHUB_ENV"

      - name: Deploy Worker and encrypted secrets
        id: deploy
        uses: cloudflare/wrangler-action@v3
        with:
          apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
          accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
          wranglerVersion: "4.112.0"
          command: deploy --keep-vars
          secrets: |
            TELEGRAM_BOT_TOKEN
            TELEGRAM_WEBHOOK_SECRET
            TELEGRAM_BOT_USERNAME

      - name: Configure Telegram webhook and Mini App menu
        shell: bash
        env:
          DEPLOYMENT_URL: ${{ steps.deploy.outputs.deployment-url }}
        run: |
          WORKER_URL="$(printf '%s\n' "$DEPLOYMENT_URL" | grep -Eo 'https://[^[:space:]]+' | head -n 1 || true)"
          test -n "$WORKER_URL"

          curl --fail-with-body --silent --show-error \
            "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook" \
            --data-urlencode "url=${WORKER_URL%/}/api/telegram/webhook" \
            --data-urlencode "secret_token=${TELEGRAM_WEBHOOK_SECRET}" \
            --data-urlencode 'allowed_updates=["message"]'

          MENU_JSON="{\"type\":\"web_app\",\"text\":\"Soft Wellness\",\"web_app\":{\"url\":\"${WORKER_URL%/}/?telegram=1\"}}"
          curl --fail-with-body --silent --show-error \
            "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setChatMenuButton" \
            --data-urlencode "menu_button=${MENU_JSON}"

          curl --fail-with-body --silent --show-error \
            "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setMyCommands" \
            --data-urlencode 'commands=[{"command":"code","description":"Підключити ще одну PWA"},{"command":"devices","description":"Мої підключені PWA"},{"command":"water","description":"Скільки води записано сьогодні"},{"command":"status","description":"Статус і розклад нагадувань"},{"command":"pause","description":"Призупинити нагадування"},{"command":"resume","description":"Відновити нагадування"},{"command":"help","description":"Що вміє бот"}]'

          curl --fail-with-body --silent --show-error "${WORKER_URL%/}/api/health"
