# Notice

Soft Wellness is an original implementation.

Product-thinking inspiration was taken from the publicly documented ideas of Aerko_ by SrPakura / PakuraDev, especially local-first privacy, thumb-friendly mobile flows, reusable meal configuration, and rapid nutrition logging. No Aerko_ source code, trademarks, logos, fonts, or branded visual assets are included in this project.

Aerko_ repository: https://github.com/PakuraDev/Hosting_Aerko_PWA

Food barcode data is retrieved from Open Food Facts when the user requests it.

Barcode decoding fallback uses `@zxing/browser` version 0.2.1 from the official ZXing for JS project under the MIT License. The library is loaded from a pinned CDN URL and cached by the Service Worker after first successful access.

ZXing Browser repository: https://github.com/zxing-js/browser
