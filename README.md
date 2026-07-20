v131 emergency tiny mood block on stable v128 base.

# v167 Photo share restored

- Restores the `Поширити фото` button inside the photo focus modal on top of v166.
- Keeps visible `MEDIA STATE / AUDIO STATE` removed from the Media block.
- Keeps OS region badge and useful EVENT LOG tracking.
- Adds `photo shared` and `photo downloaded` to the useful event whitelist.

# v63 Telegram Unicode session fix

Fixes Telegram Login callback crashes for names containing Cyrillic or other Unicode characters.

Changes:
- Keeps Telegram HMAC `dataCheckString` joined with a real newline (`"\\n"`).
- Encodes the Telegram session cookie using UTF-8-safe Base64URL instead of plain `btoa(JSON.stringify(...))`.
- Returns a readable HTTP 500 response if session encoding fails instead of throwing an unhandled Worker exception.
- Keeps fresh Skrill SID generation on every `/api/skrill/checkout` request.


## v64 Telegram session UI logout

- Reads the signed HttpOnly Telegram session through `/api/auth/telegram/session`.
- Hides the Telegram login widget while a valid session is active.
- Shows Telegram profile and `Вийти з Telegram` button.
- Clears the session through `/api/auth/telegram/logout`.


## v67 checkout fallbacks restored
Payment redirects use Cloudflare Secrets when configured and embedded fallback URLs otherwise. Skrill still creates a fresh SID on every click.

## v70 Paysafecard fresh Skrill session
The Paysafecard button now calls `/api/payment-redirect/paysafecard`.
The Worker creates a fresh Skrill Quick Checkout SID on every click and requests `payment_methods=PSC`.
Optional secret: `SKRILL_PAY_FROM_EMAIL` for straight-through redirect support.

## v71 Stripe Express Checkout inline QA section

- Adds a `Stripe тестові платіжки` card directly to the main Worker page.
- Uses Stripe Express Checkout Element for eligible Link, Google Pay, Klarna, Amazon Pay and other sandbox buttons.
- Includes a fallback Stripe Payment Element form.
- Creates a new USD 1.00 PaymentIntent through `/api/stripe/create-payment-intent`.
- Exposes the test publishable key through `/api/stripe/config`.
- Rejects Stripe live keys: only `pk_test_...` and `sk_test_...` values are accepted.

Configure Stripe test keys before testing:

```bash
npx wrangler secret put STRIPE_PUBLISHABLE_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler deploy
```



## v72 Stripe preview + live mode
- Shows Stripe Docs-style preview buttons immediately, even before Stripe keys are configured.
- Real Express Checkout replaces the preview after `pk_test_` / `sk_test_` are configured and Stripe reports availability.
- Preview buttons are explicitly non-functional and only demonstrate layout.


## v73 Stripe real sandbox only

The Stripe section renders only the real Stripe Express Checkout Element. Fake preview buttons were removed.

```bash
npx wrangler secret put STRIPE_PUBLISHABLE_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler deploy
```

Use Stripe Sandbox keys only: `pk_test_...` and `sk_test_...`. Register the Worker domain in Stripe Dashboard → Payment method domains for the sandbox.


## v75 cleanup
- Removed Stripe fallback Payment Element card form.
- Removed Paysafecard and Bank Transfer buttons from Cashier Desk.
- Kept real Stripe Express Checkout sandbox integration.


## v76 Stripe buttons-only mode
- Stripe section shows only the real Express Checkout field.
- Removed controls, statuses, setup text and fallback card form.
- Accepts matching `pk_test_` + `sk_test_` or `pk_live_` + `sk_live_` keys from Cloudflare Secrets.
- Live mode can create real charges. Keep keys in Cloudflare Secrets only.

## v77 minimal UI cleanup
Removed the hero panel and explanatory text blocks below Payments, Support Chat and Offers. Functional buttons and Stripe Express Checkout remain unchanged.

## v78 Stable Beta 2.0 badge
- Replaces the technical header build label with `Stable "Beta 2.0"`.
- Animates the `Beta 2.0` text with a pulsing moving gradient.


## v79 Temporary mail (Mail.gw)

Adds a full-width `Тимчасова пошта` UI block. The Worker proxies the documented Mail.gw API and supports:

- create a temporary mailbox;
- copy its address;
- replace or delete the mailbox;
- refresh inbox messages;
- open a message as sanitized plain text;
- show verification codes returned by Mail.gw.

Mailbox bearer tokens are stored only in browser `sessionStorage` for the current tab. The frontend polls at most once per 15 seconds while visible. Use only for authorized QA testing.


## v80 Temporary mail fix

- Replaced failing Mail.gw Worker proxy flow with direct browser requests to the documented Mail.tm API.
- Mailbox token remains only in sessionStorage for the current browser tab.
- Added visible `Powered by mail.tm` attribution link as required by Mail.tm terms.
- No Cloudflare secret is required for temporary email.


## v81 Collapsible temporary mail block

The `Тимчасова пошта` section is now collapsed by default and expands when the section header is clicked. All existing Mail.tm actions remain unchanged.


## v82 temporary mail domain fallback
- Prefer a Mail.tm domain with `isActive === true`.
- If Mail.tm returns domains without an active flag, use the first valid returned domain.
- Retry `/domains?page=1`, `/domains?page=2`, `/domains?page=3`, then `/domains`.


## v83 temp mail saved mailboxes
- Removed persistent active-address and inbox-count text under the mailbox toolbar.
- Keeps Mail.tm attribution as a subtle visible footer link to comply with the Mail.tm API terms.
- Adds browser-local saved mailboxes with Save, Open, and Delete actions.
- Saves generated credentials only in localStorage on the current browser so a mailbox can be reopened later.

## v84 Calm temp-mail inbox

- Adds a nested collapsible `Вхідні листи` section inside `Тимчасова пошта`.
- Reduces auto-refresh polling from 15 seconds to 30 seconds.
- Auto-refresh runs only while the outer temporary-mail panel and the nested inbox panel are both open and the page is visible.
- Avoids repainting the inbox list when message IDs and metadata have not changed.
- Keeps manual `Оновити листи` available and shows the last successful check time or API error.
- Fixes the initial refresh after creating a mailbox so it is not skipped while the create flow is marked busy.



## v85 temp mail token refresh
- Renews Mail.tm bearer token on load and once after HTTP 401.
- Keeps saved mailbox password locally for token re-authentication.
- Removes stale mailbox rows locally even when Mail.tm cannot confirm remote delete.


## v86 temp mail domain rotation
- Rotates through active Mail.tm domains instead of always selecting the first one.
- After repeated empty inbox checks, suggests replacing the address to try the next domain.
- Keeps token refresh and calm inbox rendering from v85.


## Fixed Mail.tm inbox proxy

The UI includes a button `Підключити готову пошту`. Store the account credentials as Cloudflare Secrets:

```bash
npx wrangler secret put TEMP_MAIL_FIXED_ADDRESS
npx wrangler secret put TEMP_MAIL_FIXED_PASSWORD
```

The password remains server-side and is not sent to browser JavaScript. Telegram login is required before reading the fixed inbox.


## v91 Short generated mail and hidden fixed mailbox toggle
- Generated Mail.tm addresses now use a short local part such as `qa-ab12@domain`.
- Removed the visible fixed-mail connection button.
- Triple-click `Beta 2.0` to connect the embedded fixed mailbox; triple-click again to hide it locally.


## v92
Added per-message deletion for both generated Mail.tm inboxes and the hidden fixed inbox. Each message row and opened message view now has a delete button.


## v101 Edit icon, standard layout and optional server presets

- A separate subtle pencil icon in the header toggles layout editing without opening the presets modal.
- Triple-click `HYM` opens the presets dialog only.
- Restores the preferred compact desktop baseline layout.
- Local labels, layout and visibility settings stay browser-local.
- Optional shared server presets use the `PRESETS_KV` Workers KV binding.
- Creating and deleting server presets requires an active Telegram login.

See `PRESETS_KV_SETUP.md` for one-time Cloudflare KV setup.


## v103 KV presets and touch editor fix

- PRESETS_KV binding is included in `wrangler.jsonc`.
- Triple click `HYM` toggles the hidden editor.
- Tap an inner item to select it, drag to move it, and use the visible `↘` marker to resize it on desktop or mobile.
- The `✎` button opens presets only.


## v105 mobile editor toolbar
- Mobile edit mode uses a bottom control panel instead of free-form dragging as the primary interaction.
- Desktop drag and resize remain available.


## v108 mobile Stripe fix
Stripe Express Checkout uses one column on mobile and is constrained to the card width.


## v111 hidden HYM admin panel

Adds a server-side protected hidden admin panel, lightweight anonymous traffic analytics and public HYM template selection.

### Required Cloudflare secret

```bash
npx wrangler secret put ADMIN_SECRET_KEY
```

Open the admin panel after deployment using the secret only in the path:

```text
https://<your-worker-domain>/hym-admin/<ADMIN_SECRET_KEY>
```

The panel removes the secret from the visible browser address after successful loading and uses it only for admin API requests in that browser tab. The server still validates the key for every admin operation.

### Admin functions

- active users online during the last 150 seconds;
- unique browser visitors for the current Kyiv calendar day;
- select the public HYM server preset for mobile devices;
- select the public HYM server preset for Windows desktop;
- clear an assigned template to fall back to the built-in standard layout.

Analytics uses an anonymous random browser identifier. The existing `PRESETS_KV` namespace is reused, so no additional Cloudflare binding is required.


## v112 standard template wording

- The admin selections are explicitly named `Стандартний шаблон телефону` and `Стандартний шаблон Windows`.
- Choosing a server HYM preset makes it the standard public template for the selected device group.
- The built-in baseline remains available as `вбудований стандартний шаблон`.


## v113 hidden HYM presets trigger

- The public `HYM presets` button is hidden by default.
- Triple-tap or triple-click the `HYM` word in the header to enable layout editing.
- The `HYM presets` button appears in the header only while editing mode is enabled.
- Click the visible `HYM presets` button to open presets.
- Triple-tap `HYM` again to leave editing mode; the button disappears and any open presets modal closes.


## v114 Test - Cokies🍪

- Adds a HYM-styled `Test - Cokies🍪` QA card to the dashboard.
- `Випадковий` creates a random first-party test cookie for the current domain with `Path=/`, `SameSite=Lax`, and a one-day lifetime. HTTPS deployments also use `Secure`.
- `Отримати список` displays cookies visible to browser JavaScript for the current domain and path.
- `Видалити` expires visible cookies across common path and current-domain variants.
- Browser JavaScript cannot display or delete `HttpOnly` cookies; the card states this when the visible list is empty.
- The card participates in HYM layouts and presets like the existing dashboard cards.


## v115 Cookies test-only cleanup

- The `Test - Cokies🍪` card no longer exposes unrelated site cookies such as payment or Google session cookies.
- `Отримати список` now shows only HYM test cookies created by this block (`hym_test_*`).
- The raw cookie values are no longer displayed. Only test-cookie names are shown.
- The visible status line under the card was removed.
- `Видалити` now removes only HYM test cookies created through this QA block.


## v116 Collapsible Test - Cokies🍪

- Converts the `Test - Cokies🍪` card into a collapsible `<details>` section.
- The section is collapsed by default and opens by clicking its title.
- The HYM-styled `[+]` / `[-]` indicator matches the temporary-mail panel behavior.
- All v115 privacy cleanup remains unchanged: only `hym_test_*` names are shown and only HYM test cookies are deleted.


## v117 Cookie list sync

- Fixes the `Випадковий` action in `Test - Cokies🍪`: after a new test cookie is created, the interface immediately keeps the existing visible HYM test cookies and adds the new one.
- Re-synchronizes the list from `document.cookie` after a short delay for browsers that expose a newly written cookie one tick later.
- Resets the list scroll position to the beginning after refresh.


## v118 Full-width opened Test - Cokies🍪

- Keeps `Test - Cokies🍪` compact while collapsed.
- When expanded, the cookie QA section stretches across the complete dashboard grid width, matching the opened temporary-mail section.
- Uses `!important` for the opened state so a saved HYM layout preset cannot force the expanded cookie section back into a narrow column.


## v119 Separate collapsed / expanded cookie layouts

- Removes the forced full-width CSS override from `Test - Cokies🍪`; the section returns to its base compact size.
- Adds independent HYM editor layouts for the collapsed `[+]` and expanded `[-]` states of the cookie section.
- Each state stores its own card width, grid span, height, alignment, and dashboard order.
- Switching the cookie section between collapsed and expanded states automatically loads the matching saved layout.
- Existing older HYM presets remain compatible through a legacy fallback.


## v120 Independent cookie state sizing with shared board position

- Keeps separate sizes for the collapsed `[+]` and expanded `[-]` states of `Test - Cokies🍪`.
- Uses one shared dashboard order for both states: moving the cookie block while expanded also places it in the same board position while collapsed.
- Toggling the cookie block applies only that block's saved size. It no longer reapplies or rearranges neighboring dashboard cards.
- Resizing one card stores that card's parameters without introducing separate board orders for the other columns.
- Preserves compatibility with v119 profiles by importing the previous order when an older `orders` map is encountered.


## v121 Single-cookie preview after random generation

- `Випадковий` now shows only the newly created `hym_test_*` cookie name in the output field.
- Previously created HYM test cookies stay stored but remain hidden until `Отримати список` is pressed.
- `Отримати список` shows all stored HYM test-cookie names.
- The full list uses a browser-local creation order so the newest generated cookie appears first.
- `Видалити` clears all HYM test cookies and resets the browser-local ordering list.


## v122 Temporary-mail modal inbox

- Removes the inline inbox list from the expanded temporary-mail dashboard card.
- Adds a dedicated `Вхідні листи` button to the temporary-mail actions.
- Opens the inbox list in a HYM-styled modal above the dashboard.
- Opens an individual message in a second modal above the inbox modal.
- Adds modal close buttons, backdrop close behavior, and layered `Escape` handling.
- Keeps manual refresh in the main temporary-mail card and adds a refresh button inside the inbox modal.
- Continues 30-second silent polling only while the inbox modal is visible.


## v123 Adaptive main page

- Adds a viewport-aware responsive main-page layer for desktop, tablet, and phone widths.
- Preserves the dashboard content order and existing functionality while fitting the visible UI inside the active screen width.
- Keeps the approved desktop dashboard arrangement at full desktop widths.
- Uses a denser but still readable desktop mode for narrower notebook windows.
- Uses two fitted columns on tablet-sized screens and a single fitted column on phone-sized screens.
- Prevents inline widths saved by the HYM editor from pushing cards beyond the screen edge on tablet and phone layouts. Saved desktop dimensions remain stored and return when the viewport becomes wider again.
- Makes buttons, inputs, text areas, media elements, and temporary-mail modals fit the available viewport.
- Adds `data-hym-viewport="desktop|tablet|phone"` to the root HTML element for future device-size refinements.


## v124 Independent tablet template

- Adds an independent `tablet` presentation mode for Android tablets and iPad-class devices.
- Keeps three separate browser-local HYM editor profiles: `desktop`, `tablet`, and `phone`.
- Adds a third admin-panel selector: `Стандартний шаблон планшета`.
- Public tablet visits request `/api/hym-active-template?platform=tablet`; phone visits continue to use `mobile`, and Windows desktop continues to use `windows`.
- Detects common Android-tablet user agents and touch devices with a tablet-sized short screen side.
- Keeps a fitted two-column tablet base layout, including landscape tablet screens wider than the original 1000px responsive breakpoint.
- Tablet editing remains independent: tuning a tablet profile does not overwrite the phone or desktop profile.
- Applying local or server presets from the HYM presets menu now saves into the currently active device profile instead of always writing into the desktop profile.


## v125 Visible tablet selector verification

- Keeps the independent tablet template support introduced in v124.
- Adds a visible `v125` marker to the hidden admin-panel header so the deployed Worker version can be verified immediately.
- Highlights the `Стандартний шаблон планшета` selector with a `TABLET` badge.
- The admin panel now clearly lists phone, tablet, and Windows standard templates.


## v126 Strict device routing for public templates

- Routes public templates by physical device class instead of browser-window width.
- iPad, iPad desktop-mode Safari, Android tablets, and tablet-sized touch devices always use the `tablet` template bucket.
- Phones use the `mobile` template bucket.
- Computers and notebooks remain in the desktop flow; Windows computers use the `windows` template bucket.
- Viewport width is now used only for visual fit and density. Resizing a browser window cannot switch the selected HYM template category.
- Adds `data-hym-device`, `data-hym-viewport`, and `data-hym-fit` attributes for diagnostics.
- HYM presets modal title now shows the detected bucket and physical screen dimensions, for example `HYM presets · tablet · 1024×1366`.


## v127 Preserve individually configured object sizes

- Fixes tablet HYM presets restoring card order but visually losing manually configured card dimensions.
- Root cause: the adaptive tablet layer used `width:auto!important` and `grid-column:auto!important`, overriding the stored inline sizes.
- Adds a per-card `data-hym-sized="1"` marker only after that specific card has been manually resized or aligned.
- Untouched cards continue to use the automatic fitted tablet layout.
- Individually tuned cards restore their own width, height, and alignment while remaining clamped to the screen width.
- Resizing one card does not alter neighboring cards.
- The same preservation rule is applied to narrow phone layouts so phone presets keep their manually configured sizes as well.


## v131 HYM presets button fit fix

- Fixes the `HYM presets` editor button on narrow screens.
- Removes the old forced `26px` width that clipped the full label.
- Keeps the button compact while allowing its width to fit the entire `HYM PRESETS` text.
- Adds `min-width:max-content` and prevents flex shrinking so the label stays inside the border.
- Does not change dashboard card sizes or saved HYM presets.


## v129 Stripe tablet fit and resize handle

- Fixes the Stripe Express Checkout card feeling clipped on tablet and touch devices.
- Removes the old `overflow:hidden` containment that could cut off the lower wallet button.
- Stops forcing a manually tuned Stripe card back to `width:100%` after it receives `data-hym-sized="1"`.
- Keeps untouched Stripe cards full-width by default on phone and touch layouts.
- Adds a hidden editor-only `Stripe wallets · resize` handle above the external Stripe iframe. Triple-tap `HYM`, then tap or drag this strip to select the Stripe card and use the lower W/H editor controls.
- Overrides the global media iframe aspect ratio for Stripe's external iframe only.
- Gives physical tablets a dedicated Stripe Express Checkout layout: two columns and up to three rows.
- Phones continue using one column; desktop keeps four columns.


## v130 Clean local QR scanner

- Adds a movable HYM dashboard card: `QR scanner`.
- The launcher opens a local Worker route: `/qr-scanner`.
- The scanner page is intentionally minimal: camera area, `Додати фото`, status text, and a plain-text decoded result field.
- The page does not embed `webqr.com`, display advertising, expose unrelated navigation, or automatically open decoded URLs.
- Requests the rear-facing camera where supported and automatically starts scanning after load.
- Tapping the camera area retries permission or starts another scan.
- Supports uploaded QR screenshots and camera photos through the same `Додати фото` input.
- Uses the browser `BarcodeDetector` API when available and falls back to pinned `jsQR@1.4.0` from jsDelivr.
- Serves the page with `Permissions-Policy: camera=(self)`.


## v131 External webqr.com redirect

- Changes the `QR scanner` dashboard block from a local Worker scanner page to a real external redirect.
- The `Відкрити webqr.com` button navigates the current browser tab to `https://webqr.com/`.
- This preserves the QA scenario where the page leaves the Worker origin and loads an external main page, allowing stuck-page or substitution bugs to be reproduced.
- Removes the local `/qr-scanner` Worker route and the local scanner source file.
- External `webqr.com` content cannot be stripped or restyled by this Worker because it is served from another origin.


## v132 Wild Beach Party official demo launcher

- Adds a movable HYM dashboard card for `Wild Beach Party™`.
- The visible card is intentionally minimal: only a shimmering slot-style tile with fruit visuals, the slot name, and a small `DEMO · 18+` marker.
- Clicking the tile navigates the current browser tab to the official Pragmatic Play Wild Beach Party page.
- Uses a true external-domain redirect so redirect, stuck-page, and main-page substitution QA scenarios remain reproducible.
- Does not embed, proxy, copy, or strip the provider page.
- The tile participates in phone, tablet, and desktop HYM presets like the other dashboard cards.
- Includes a reduced-motion fallback.


## v133 Free-position HYM canvas editor

- Replaces grid-only block rearrangement with an unrestricted absolute-position canvas after HYM edit mode is enabled.
- Triple-tap `HYM` to convert the current visible layout into free coordinates without visually rearranging the cards.
- Cards can be dragged into any empty area, overlapped, or packed tightly without reserving grid rows below neighboring cards.
- Desktop: drag a card header or the selected overlay label. Resize with the overlay `↘` handle.
- Phone / tablet: select a card, use the lower arrows for pixel movement and W/H controls for independent dimensions. Card headers also support direct drag.
- Saves absolute `x/y` coordinates plus each card's width and height in local and server HYM presets.
- Keeps phone, tablet, and desktop profiles independent.
- Older grid presets remain compatible: their current rendered arrangement is converted into free coordinates the first time edit mode is opened.
- Cookie collapsed / expanded dimensions remain independent while the cookie block position remains shared.


## v134 Editable Android top navigation list

- Adds HYM editing support for the horizontal quick-navigation list displayed above the dashboard on Android / phone layouts.
- Triple-tap `HYM`, then tap a top-menu item to select it.
- Phone / tablet lower-toolbar controls:
  - `←` or `↑`: move the selected item one position left;
  - `→` or `↓`: move it one position right;
  - `Назва`: rename the visible label;
  - `Сховати`: hide the selected item;
  - `Скинути`: restore that item's default label and visibility;
  - `Блок`: select the linked dashboard card.
- Supports direct drag-reordering of top-menu items while edit mode is active.
- Adds an `Android top menu` section inside `HYM presets` with visibility toggles, reorder arrows, and rename buttons. Hidden items can be restored there.
- Saves top-menu order, hidden state, and captions inside each phone / tablet / desktop HYM preset independently.
- Does not change the linked anchor targets, so quick-navigation functionality remains intact.


## v135 Smart AUTO PACK + precise FREE snap

- Adds an adaptive `AUTO PACK` mode that tightly fills the dashboard canvas using a masonry-style skyline algorithm.
- `AUTO PACK` adapts automatically when the viewport width changes or the device rotates.
- Uses device-aware column counts:
  - phone: 1 column;
  - tablet: 2 or 3 columns depending on available width;
  - desktop: 2, 3, or 4 columns.
- Keeps wide functional sections sensible: temporary mail spans the full canvas; expanded cookies span full width; Stripe and Cashier Desk use wider spans where space allows.
- Adds an `AUTO PACK` button inside `HYM presets` and an `AUTO` button to the phone / tablet lower editor toolbar.
- Manual movement or resize switches the active layout to `FREE`.
- FREE mode snaps card coordinates and dimensions to a 4 px precision grid.
- Cards also snap to neighboring card edges with a consistent 8 px gap, removing visually irritating 2–3 px inaccuracies.
- FREE layouts remain independent for phone, tablet, and desktop profiles.
- Existing v134 manual presets stay compatible: saved `free:true` layouts continue loading as FREE; older grid profiles now default to adaptive AUTO PACK.
- Hidden cards are excluded before AUTO PACK runs, so they no longer leave empty holes.


## v136 Premium Offers glow

- Upgrades the `Оффери` card with a premium neon animated shell inspired by the Wild Beach Party launcher.
- Removes the plain static appearance and gives the whole Offers block a clean shimmering glow without extra clumsy framing.
- Keeps the existing Offers functionality and buttons intact.
- Restyles offer buttons inside the block with a dark glossy surface, subtle sweep highlight, and stronger neon hover state.
- Does not change HYM layout logic, presets, or linked targets.


## v151 Text + Photo focus preview modal
- Removed the inline photo preview from the Text + Photo card so uploaded images no longer resize or overlap dashboard blocks.
- After selecting a photo, a focus modal opens above the dashboard.
- The collapsed card keeps only a compact clickable filename row.
- Clicking the filename reopens the photo preview.
- The delete action now lives inside the photo preview modal.


## v152 Header EVENT LOG focus modal

- Adds a compact EVENT LOG icon directly after `HYM // WWG QA Team` in the header.
- Shows the latest recorded event as one compact inline status after the icon.
- Opens the full local session event journal in a focus modal.
- Includes `COPY`, `EXPORT`, and `CLEAR` controls inside the modal.
- Records page restore/ready state, visibility changes, payment redirect clicks, external offer launches, photo actions, media actions, and existing QA callbacks.
- Stores the journal only in browser `sessionStorage`; the list is capped to the most recent 180 events.


## v153 Text + Photo compact pulsing PHOTO button

- Removes the native filename row and the extra filename preview row from the Text + Photo card.
- Keeps a fixed-height compact `Додати фото` + `PHOTO` control row so photo selection cannot push content over neighboring blocks.
- Stops opening the photo modal automatically after file selection.
- Activates a pulsing `PHOTO` button only while an uploaded photo exists.
- Opens the focus preview exclusively after pressing `PHOTO`; deletion remains inside the photo modal.


## v154 EVENT LOG startup-noise cleanup

- Stops writing `Google Pay · Google Pay ready.`, `Google Sign-In · ready`, and normal `page ready` initialization rows into EVENT LOG.
- Keeps visible readiness text inside the related dashboard cards.
- Keeps user actions, real errors, visibility transitions, and bfcache `page restored` events in the logger.


## v155 EVENT LOG media and cookie coverage

- Adds YouTube iframe API tracking for real playback actions: play, pause, end, player error, and a throttled iframe-focus fallback.
- Adds audio `ended` tracking alongside existing play, pause, and error events.
- Tracks opening and closing the `Test - Cokies` panel.
- Tracks random test-cookie creation, list refresh with item count, and visible test-cookie deletion with item count.
- Keeps startup readiness noise suppressed.


## v156 EVENT LOG visibility-noise cleanup

- Removes automatic `visibilitychange · hidden` and `visibilitychange · visible` rows from EVENT LOG.
- Keeps the underlying visibility listeners used by heartbeat, viewport normalization, and device-info refresh.
- Keeps meaningful user actions, media events, cookie QA actions, errors, and bfcache `page restored` rows.


## v157 EVENT LOG mobile keyboard coverage

- Adds filtered mobile virtual-keyboard tracking through `visualViewport` resize signals.
- Records `Keyboard · opened` and `Keyboard · closed` once per real open/close transition.
- Requires an active editable field plus a keyboard-sized viewport height reduction before logging an open event.
- Ignores ordinary scrolling, tab visibility changes, desktop resizes, and small browser-toolbar viewport shifts.


## v158 useful-only EVENT LOG and MEDIA STATE

- Resets the browser-local event journal to a useful-only v2 format so older noisy startup entries disappear.
- Keeps only meaningful QA transitions: Wild Beach open/close, external redirects, return to dashboard, keyboard, media, fullscreen, photo, cookie, Google login result, and screen rotation.
- Adds a compact MEDIA STATE panel for audio, YouTube video, fullscreen, and autoplay status.
- Adds a second compact AUDIO STATE panel with paused/started state, muted flag, volume, and loop flag.
- Tracks Wild Beach return through sessionStorage and records `Wild Beach closed` followed by `returned to dashboard`.
- Simplifies Google Sign-In events to `logined · account` or `canceled login`.


## v159 safe mobile landscape mode

- Adds a dedicated phone-landscape responsive layer without modifying desktop or portrait presentation.
- Uses a compact two-column standard grid in phone landscape.
- Makes AUTO PACK use two columns in phone landscape when the viewport is at least 560 px wide.
- Keeps Payments, Stripe, temporary mail, and an expanded cookie panel full-width for stability.
- Tightens the header, navigation, controls, media card, offer buttons, and Wild Beach launcher only in landscape.
- Keeps focus overlays and dialogs within the visible landscape viewport.
- Leaves FREE manual layouts intact instead of rewriting user-saved coordinates.


## v160 Telegram EVENT LOG + Google logout

- Logs a successful Telegram callback as `Telegram logined · <account>`.
- Logs the Telegram logout action as `Telegram logout`.
- Adds a `Вийти з Google` button inside the signed-in Google profile.
- Google logout clears the local profile UI, disables Google auto-select for the browser session and records `Google logout` without revoking account consent.


## v161 app versus market fallback orientation

- Adds a best-effort mobile deep-link probe for PhonePe UPI, Paytm UPI and app redirect buttons.
- Records `app likely opened · <label>` when the page is backgrounded before the fallback timer fires.
- Records `market fallback opened · <label>` when the site opens a Play Store or App Store search fallback after 1450 ms.
- Records `returned to dashboard · from <label>` after returning from the opened app or market.
- Keeps direct cashier checkout redirects unchanged.
- This is an orientation aid for QA: browsers do not expose an authoritative OS callback confirming which external app handled a custom URL scheme.


## v164 centered portrait canvas in mobile landscape

- Replaces the experimental two-column phone landscape presentation with a safe centered portrait-style canvas.
- Keeps the familiar single-column phone composition after rotation instead of rebuilding card placement across the wider viewport.
- Centers the phone dashboard at up to 430 px wide with calm side gutters in landscape.
- Forces phone AUTO PACK to remain one column in every orientation, while leaving tablet, desktop and saved FREE layouts untouched.
- Keeps focus overlays constrained to the centered phone canvas so dialogs remain usable in horizontal orientation.

## v165 OS badge region
- Adds the Cloudflare request country code next to the detected runtime OS in the header.
- Header format: `ANDROID | UA`, `IOS | PL`, `WINDOWS | DE`; fallback is `--` when the region is unavailable.
- Country code is injected by the Worker from Cloudflare request metadata without delaying page rendering.

## v166 remove regressed visible media state
- Removes the accidentally restored visible `MEDIA STATE` and `AUDIO STATE` boxes from the media card.
- Keeps internal audio, YouTube and fullscreen EVENT LOG tracking.
- Keeps the requested edge-volume EVENT LOG entries: `audio volume · 0%` and `audio volume · 100%`.
- Preserves the v165 Cloudflare region badge in the header.



## v168 Capability Snapshot IP

- Adds Cloudflare client IP to the top Capability Snapshot line inside Device Info.
- Adds the same IP as a copyable row inside Device Info details.
- Keeps media status blocks hidden and keeps photo share restored.

## v169 KV saver for layout presets

- Preset editor now works local-first: moving blocks, AUTO PACK, personal profile updates and local presets write only to browser localStorage.
- Server presets are no longer loaded automatically every time the presets dialog opens. Use `LOAD SERVER` when you need to read from KV.
- `SAVE TO SERVER` is the only path that writes layout data to PRESETS_KV.
- Added duplicate-profile protection: if the captured layout hash is unchanged, server save is skipped and KV write is not used.
- Added a 90 second server-save cooldown to protect the daily KV write limit.
- Added a small KV saver status in the presets dialog: LOCAL-FIRST, cooldown, saved writes counter, last server save and cache time.
- Server storage for layout presets now uses a single KV index key (`hym:presets:index:v2`) instead of one KV key per preset. Legacy `hym:preset:*` records can still be read as a fallback.


## v170 Selective random button hover FX

- Added selective hover animations to a stable subset of dashboard buttons.
- Effects are intentionally not applied to every button to keep the UI clean.
- Variants include subtle scan, pulse, glitch and lift motion.
- Touch devices and reduced-motion users do not get noisy hover animation.


## v171 visible button hover/tap FX
- Reworked selective random button effects so they are clearly visible.
- Fixed the v170 effect initializer placement so it runs on the main dashboard, not inside temp-mail iframe preview HTML.
- Added tap feedback for touch devices while keeping effects selective, not on every button.


## v131 Restore support chat card
- Returned the public `Чат супортів` card and its one-button endpoint.
- Kept admin asset selector fixes and tidy admin UI from v126/v127.


## v132 module deploy fix
- Restored the Worker ES Modules `export default { fetch() }` handler.
- Fixes Cloudflare `wrangler versions upload` error 10216: Service Worker syntax script is not supported by Versions API.
- Keeps v131 tiny Mood status and restored Support Chat block.


## v133 client-js-repair
- Fixed broken client JS caused by accidental Mood CSS injection inside temp-mail iframe srcdoc.
- Keeps ES Module Worker deploy fix, tiny Mood block and support chat restored.


## v142 ADMIN_CONFIG_KV

Added a second KV namespace binding `ADMIN_CONFIG_KV` for admin server settings. `PRESETS_KV` remains for saved designs/layout presets. Active mobile/tablet/windows template selection now writes to `ADMIN_CONFIG_KV` when available and falls back to `PRESETS_KV` only if the new binding is missing.


## v143 DESIGNS_KV

Added a third KV namespace binding `DESIGNS_KV` for future separate design storage. `PRESETS_KV` stays for existing presets/layouts; `ADMIN_CONFIG_KV` stays for admin settings.


## v144 safe deploy

Removed the invalid `DESIGNS_KV` binding because Cloudflare returned code 10041: namespace not found. `ADMIN_CONFIG_KV` remains connected and is used for admin server settings.
