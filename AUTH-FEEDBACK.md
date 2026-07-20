# Telegram authorization feedback

Version 1.5 adds visible confirmation for every authorization path.

## PWA

After a link code is created, the status changes to “Waiting for confirmation” and the PWA polls the Worker every 2.5 seconds for up to two minutes. When `/start CODE` is accepted, the PWA displays a success sheet with:

- a green confirmation state;
- the shared session identifier;
- confirmation that PWA and Telegram Mini App use one diary;
- a button to open the exact Telegram session.

The check also runs when the PWA returns to the foreground.

## Telegram Mini App

The Mini App first shows a blocking synchronization state. After Telegram `initData` has been verified and the cloud snapshot has loaded, it displays an explicit authorization success screen before opening the diary.

## Bot

The bot replies with a clear “Authorization successfully confirmed” message, the short shared-session identifier, and a button that opens the exact linked session.
