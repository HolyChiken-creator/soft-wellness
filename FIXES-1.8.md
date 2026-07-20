# Soft Wellness 1.8 fixes

- Connected PWA can create a one-time code for an additional device.
- First welcome and profile dialogs can be dismissed and completed later.
- Telegram webhook, commands and menu button are configured automatically from the deployed Worker origin when the app loads.
- `TELEGRAM_WEBHOOK_SECRET` is optional; when absent the Worker derives a stable secret from the bot token and origin.
- Bot readiness and setup errors are shown inside the PWA.
