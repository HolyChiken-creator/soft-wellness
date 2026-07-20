const JSON_HEADERS = {
  'content-type': 'application/json; charset=utf-8',
  'cache-control': 'no-store'
};

const json = (body, status = 200, headers = {}) => new Response(JSON.stringify(body), {
  status,
  headers: { ...JSON_HEADERS, ...headers }
});

const number = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const text = (value, max = 500) => String(value ?? '').trim().slice(0, max);
const validTime = (value, fallback) => /^([01]\d|2[0-3]):[0-5]\d$/.test(String(value)) ? String(value) : fallback;
const validTimezone = (value) => {
  const timezone = text(value, 64) || 'Europe/Kyiv';
  try {
    new Intl.DateTimeFormat('en', { timeZone: timezone }).format(new Date());
    return timezone;
  } catch {
    return 'Europe/Kyiv';
  }
};

const escapeHtml = (value) => String(value ?? '')
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;');

const randomText = (length = 32) => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const randomCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  return [...bytes].map((byte) => alphabet[byte % alphabet.length]).join('');
};

const sha256 = async (value) => {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
};

const hmacSha256 = async (keyBytes, value) => {
  const key = await crypto.subtle.importKey(
    'raw',
    keyBytes instanceof Uint8Array ? keyBytes : new TextEncoder().encode(String(keyBytes)),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(value))));
};

const bytesToHex = (bytes) => [...bytes].map((byte) => byte.toString(16).padStart(2, '0')).join('');

const timingSafeEqualHex = (left, right) => {
  if (!left || !right || left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
};

const verifyTelegramInitData = async (initData, botToken) => {
  if (!initData || !botToken) throw Object.assign(new Error('Telegram Mini App не настроен'), { status: 503 });
  const params = new URLSearchParams(String(initData));
  const receivedHash = params.get('hash') || '';
  params.delete('hash');
  const authDate = Number(params.get('auth_date') || 0);
  if (!authDate || Math.abs(Date.now() / 1000 - authDate) > 24 * 60 * 60) {
    throw Object.assign(new Error('Сессия Telegram устарела. Откройте Mini App заново.'), { status: 401 });
  }
  const dataCheckString = [...params.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  const secretKey = await hmacSha256(new TextEncoder().encode('WebAppData'), botToken);
  const expectedHash = bytesToHex(await hmacSha256(secretKey, dataCheckString));
  if (!timingSafeEqualHex(expectedHash, receivedHash)) {
    throw Object.assign(new Error('Не удалось подтвердить Telegram-сессию'), { status: 401 });
  }
  let user;
  try { user = JSON.parse(params.get('user') || 'null'); } catch { user = null; }
  if (!user?.id) throw Object.assign(new Error('Telegram не передал пользователя'), { status: 401 });
  return {
    user,
    startParam: params.get('start_param') || '',
    queryId: params.get('query_id') || ''
  };
};

const validAppUrl = (value) => {
  try {
    const url = new URL(text(value, 300));
    if (url.protocol !== 'https:') return '';
    return url.origin;
  } catch {
    return '';
  }
};

const sanitizeAppState = (input) => {
  if (!input || typeof input !== 'object') throw Object.assign(new Error('Некорректное состояние приложения'), { status: 400 });
  const cloned = JSON.parse(JSON.stringify(input));
  cloned.telegram = {
    ...(cloned.telegram || {}),
    authToken: '',
    sessionId: '',
    linkCode: '',
    botUsername: '',
    connected: false
  };
  return cloned;
};

const localClock = (date, timezone) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23'
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  return {
    date: `${parts.year}-${parts.month}-${parts.day}`,
    time: `${parts.hour}:${parts.minute}`
  };
};

const settingsFromPayload = (payload = {}) => {
  const times = payload.times || {};
  const meals = payload.meals || {};
  const gender = payload.gender === 'female' ? 'female' : payload.gender === 'male' ? 'male' : payload.salutation === 'pani' ? 'female' : payload.salutation === 'pan' ? 'male' : '';
  return {
    name: text(payload.name, 60),
    appUrl: validAppUrl(payload.appUrl),
    gender,
    salutation: gender === 'female' ? 'pani' : gender === 'male' ? 'pan' : '',
    timezone: validTimezone(payload.timezone),
    waterGoalMl: Math.min(8000, Math.max(800, Math.round(number(payload.waterGoalMl) || 2000))),
    enabled: payload.enabled !== false,
    times: {
      breakfast: validTime(times.breakfast, '08:00'),
      lunch: validTime(times.lunch, '13:00'),
      dinner: validTime(times.dinner, '19:00'),
      waterMorning: validTime(times.waterMorning, '10:30'),
      waterAfternoon: validTime(times.waterAfternoon, '16:00'),
      mental: validTime(times.mental, '21:00')
    },
    meals: {
      breakfast: text(meals.breakfast, 900),
      lunch: text(meals.lunch, 900),
      dinner: text(meals.dinner, 900)
    }
  };
};

const telegramCall = async (env, method, body) => {
  if (!env.TELEGRAM_BOT_TOKEN) throw new Error('TELEGRAM_BOT_TOKEN is not configured');
  const response = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/${method}`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body)
  });
  const result = await response.json().catch(() => ({}));
  if (!response.ok || result.ok === false) {
    const error = new Error(result.description || `Telegram API error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return result.result;
};

const greeting = (user) => (user.gender === 'female' || user.salutation === 'pani') ? 'пані' : 'пане';
const daySeed = (date, type) => [...`${date}:${type}`].reduce((sum, char) => sum + char.charCodeAt(0), 0);
const variant = (items, date, type) => items[daySeed(date, type) % items.length];

const messageFor = (user, type, localDate) => {
  const title = greeting(user);
  const meal = user.meals || {};
  const water = Math.round(user.waterGoalMl || 2000);
  const opening = `<b>${variant([
    `Доброго дня, ${title}.`,
    `${title[0].toUpperCase()}${title.slice(1)}, час подбати про себе.`,
    `Нагадування для вас, ${title}.`
  ], localDate, type)}</b>`;

  if (type === 'breakfast') {
    return `🌅 ${opening}\n\n<b>Ранковий раціон:</b>\n${escapeHtml(meal.breakfast || 'Відкрийте Soft Wellness і перевірте запланований сніданок.')}\n\n💧 Денна ціль води: <b>${water} мл</b>. Почніть день зі склянки води.`;
  }
  if (type === 'lunch') {
    return `☀️ ${opening}\n\n<b>Раціон на обід:</b>\n${escapeHtml(meal.lunch || 'Відкрийте Soft Wellness і перевірте запланований обід.')}\n\n💧 Зробіть кілька ковтків води перед їжею.`;
  }
  if (type === 'dinner') {
    return `🌙 ${opening}\n\n<b>Вечірній раціон:</b>\n${escapeHtml(meal.dinner || 'Відкрийте Soft Wellness і перевірте заплановану вечерю.')}\n\n🌿 Їжте без поспіху й без самокритики.`;
  }
  if (type === 'waterMorning') {
    return `💧 ${opening}\n\nНагадуємо про воду. Ваша орієнтовна денна ціль — <b>${water} мл</b>. Випийте комфортну порцію, не змушуючи себе пити надмірно.`;
  }
  if (type === 'waterAfternoon') {
    return `💧 ${opening}\n\nПеревірте, скільки води вже випито сьогодні. Додайте склянку в Soft Wellness, якщо щойно попили.`;
  }
  return `🫶 ${opening}\n\nЗробіть паузу на дві хвилини: опустіть плечі, повільно вдихніть і видихніть тричі, запитайте себе «що мені зараз потрібно?».\n\nЦе турботливе нагадування, а не медична оцінка.`;
};

export class TelegramState {
  constructor(state, env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request) {
    const url = new URL(request.url);
    try {
      if (url.pathname === '/register' && request.method === 'POST') return this.register(await request.json());
      if (url.pathname === '/settings' && request.method === 'PUT') return this.updateSettings(request, await request.json());
      if (url.pathname === '/status' && request.method === 'GET') return this.status(request);
      if (url.pathname === '/link-code' && request.method === 'POST') return this.refreshLinkCode(request, await request.json().catch(() => ({})));
      if (url.pathname === '/launch-ticket' && request.method === 'POST') return this.launchTicket(request);
      if (url.pathname === '/session' && request.method === 'POST') return this.telegramSession(await request.json());
      if (url.pathname === '/sync-state' && request.method === 'GET') return this.getSyncState(request);
      if (url.pathname === '/sync-state' && request.method === 'PUT') return this.putSyncState(request, await request.json());
      if (url.pathname === '/webhook' && request.method === 'POST') return this.webhook(await request.json());
      if (url.pathname === '/dispatch' && request.method === 'POST') return this.dispatch();
      return json({ error: 'Not found' }, 404);
    } catch (error) {
      console.error(error);
      return json({ error: error.message || 'Internal error' }, error.status || 500);
    }
  }

  async register(payload) {
    const settings = settingsFromPayload(payload);
    if (!settings.gender) return json({ error: 'Выберите пол: мужчина или женщина' }, 400);
    const clientId = crypto.randomUUID();
    const secret = randomText(24);
    const tokenHash = await sha256(secret);
    const linkCode = await this.uniqueLinkCode();
    const now = Date.now();
    const user = {
      id: clientId,
      tokenHash,
      tokenHashes: [tokenHash],
      chatId: null,
      linkCode,
      linkExpiresAt: now + 24 * 60 * 60 * 1000,
      connectedAt: null,
      createdAt: new Date(now).toISOString(),
      updatedAt: new Date(now).toISOString(),
      ...settings
    };
    await this.state.storage.put(`user:${clientId}`, user);
    await this.state.storage.put(`link:${linkCode}`, clientId);
    return json({
      authToken: `${clientId}.${secret}`,
      sessionId: clientId,
      linkCode,
      connected: false,
      enabled: user.enabled,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || ''
    });
  }

  async authorize(request) {
    const authorization = request.headers.get('authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const separator = token.indexOf('.');
    if (separator < 1) return null;
    const clientId = token.slice(0, separator);
    const secret = token.slice(separator + 1);
    const user = await this.state.storage.get(`user:${clientId}`);
    if (!user) return null;
    const candidateHash = await sha256(secret);
    const hashes = Array.isArray(user.tokenHashes) && user.tokenHashes.length
      ? user.tokenHashes
      : user.tokenHash ? [user.tokenHash] : [];
    if (!hashes.includes(candidateHash)) return null;
    return user;
  }

  async issueAuthToken(user) {
    const secret = randomText(24);
    const tokenHash = await sha256(secret);
    const existing = Array.isArray(user.tokenHashes) ? user.tokenHashes : user.tokenHash ? [user.tokenHash] : [];
    user.tokenHashes = [...new Set([...existing, tokenHash])].slice(-6);
    user.updatedAt = new Date().toISOString();
    await this.state.storage.put(`user:${user.id}`, user);
    return `${user.id}.${secret}`;
  }

  async telegramSession(payload) {
    const verified = await verifyTelegramInitData(payload?.initData, this.env.TELEGRAM_BOT_TOKEN);
    const telegramUserId = String(verified.user.id);
    const requestedCode = String(payload?.startParam || verified.startParam || '')
      .replace(/^sw[_-]?/i, '')
      .replace(/^link[_-]?/i, '')
      .toUpperCase();
    const sessionTicket = text(payload?.sessionTicket, 120) || requestedCode;

    let user = null;

    // A launch ticket is generated only after the PWA session is linked to this Telegram account.
    // It guarantees that the Mini App opens the exact PWA session, even if this chat was linked
    // to an older test session in a previous deployment.
    if (sessionTicket) {
      const ticket = await this.state.storage.get(`launch:${sessionTicket}`);
      const activeUserId = await this.state.storage.get(`chat:${telegramUserId}`);
      if (
        ticket
        && Number(ticket.expiresAt) > Date.now()
        && String(ticket.chatId) === telegramUserId
        && String(activeUserId || '') === String(ticket.userId)
      ) {
        user = await this.state.storage.get(`user:${ticket.userId}`);
      }
    }

    // Main Mini App / menu button launches do not always carry a start parameter.
    // Use the explicit chat -> PWA session mapping in that case.
    if (!user) user = await this.userByChat(telegramUserId);

    // Backward-compatible linking through a PWA code passed as start_param.
    if (!user && /^[A-Z0-9]{6,12}$/.test(requestedCode)) {
      const clientId = await this.state.storage.get(`link:${requestedCode}`);
      const candidate = clientId ? await this.state.storage.get(`user:${clientId}`) : null;
      if (candidate && Number(candidate.linkExpiresAt) > Date.now()) {
        user = await this.linkUserToChat(candidate, telegramUserId);
        await this.state.storage.delete(`link:${requestedCode}`);
      }
    }

    if (!user) {
      return json({
        error: 'Эта Telegram-сессия ещё не связана с PWA. Создайте новый код в PWA и отправьте боту /start КОД.'
      }, 404);
    }

    // Repair mappings created by older versions and make this user the only active session for the chat.
    user = await this.linkUserToChat(user, telegramUserId, { preserveEnabled: true });
    const authToken = await this.issueAuthToken(user);
    const synced = await this.state.storage.get(`app:${user.id}`);
    return json({
      authToken,
      sessionId: user.id,
      connected: true,
      enabled: user.enabled !== false,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || '',
      revision: Number(synced?.revision || 0),
      updatedAt: synced?.updatedAt || '',
      state: synced?.state || null
    });
  }

  async getSyncState(request) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ общей сессии' }, 401);
    const record = await this.state.storage.get(`app:${user.id}`);
    return json({
      state: record?.state || null,
      sessionId: user.id,
      revision: Number(record?.revision || 0),
      updatedAt: record?.updatedAt || '',
      source: record?.source || '',
      connected: Boolean(user.chatId),
      enabled: user.enabled !== false,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || ''
    });
  }

  async putSyncState(request, payload) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ общей сессии' }, 401);
    const appState = sanitizeAppState(payload?.state);
    const serialized = JSON.stringify(appState);
    if (serialized.length > 900_000) return json({ error: 'Дневник слишком большой для синхронизации' }, 413);
    const current = await this.state.storage.get(`app:${user.id}`);
    const revision = Number(current?.revision || 0) + 1;
    const updatedAt = new Date().toISOString();
    const record = {
      state: appState,
      revision,
      updatedAt,
      source: text(payload?.source, 40) || 'unknown'
    };
    await this.state.storage.put(`app:${user.id}`, record);
    return json({ revision, updatedAt });
  }

  async updateSettings(request, payload) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ подключения' }, 401);
    const settings = settingsFromPayload(payload);
    if (!settings.gender) return json({ error: 'Выберите пол: мужчина или женщина' }, 400);
    const updated = { ...user, ...settings, updatedAt: new Date().toISOString() };
    await this.state.storage.put(`user:${user.id}`, updated);
    return json({
      sessionId: updated.id,
      connected: Boolean(updated.chatId),
      enabled: updated.enabled,
      linkCode: updated.linkCode || '',
      botUsername: this.env.TELEGRAM_BOT_USERNAME || ''
    });
  }

  async status(request) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ подключения' }, 401);
    const codeValid = user.linkCode && Number(user.linkExpiresAt) > Date.now();
    return json({
      sessionId: user.id,
      connected: Boolean(user.chatId),
      enabled: Boolean(user.enabled),
      linkCode: codeValid ? user.linkCode : '',
      botUsername: this.env.TELEGRAM_BOT_USERNAME || '',
      timezone: user.timezone,
      updatedAt: user.updatedAt
    });
  }

  async refreshLinkCode(request, payload) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ подключения' }, 401);
    if (user.linkCode) await this.state.storage.delete(`link:${user.linkCode}`);
    const settings = settingsFromPayload(payload);
    const linkCode = await this.uniqueLinkCode();
    const updated = {
      ...user,
      ...settings,
      linkCode,
      linkExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
      updatedAt: new Date().toISOString()
    };
    await this.state.storage.put(`user:${user.id}`, updated);
    await this.state.storage.put(`link:${linkCode}`, user.id);
    return json({
      linkCode,
      sessionId: updated.id,
      connected: Boolean(updated.chatId),
      enabled: updated.enabled,
      botUsername: this.env.TELEGRAM_BOT_USERNAME || ''
    });
  }

  async launchTicket(request) {
    const user = await this.authorize(request);
    if (!user) return json({ error: 'Недействительный ключ общей сессии' }, 401);
    if (!user.chatId) return json({ error: 'Сначала подключите Telegram кодом из PWA' }, 409);
    const ticket = await this.createLaunchTicket(user);
    const username = text(this.env.TELEGRAM_BOT_USERNAME, 80).replace(/^@/, '');
    return json({
      ticket,
      sessionId: user.id,
      url: username ? `https://t.me/${username}?startapp=sw_${ticket}` : `${user.appUrl}/?telegram=1&sw_session=${encodeURIComponent(ticket)}`
    });
  }

  async uniqueLinkCode() {
    for (let attempt = 0; attempt < 10; attempt += 1) {
      const code = randomCode();
      if (!await this.state.storage.get(`link:${code}`)) return code;
    }
    throw new Error('Не удалось создать код подключения');
  }

  async userByChat(chatId) {
    const normalizedChatId = String(chatId);
    const mappedUserId = await this.state.storage.get(`chat:${normalizedChatId}`);
    if (mappedUserId) {
      const mappedUser = await this.state.storage.get(`user:${mappedUserId}`);
      if (mappedUser && String(mappedUser.chatId || '') === normalizedChatId) return mappedUser;
      await this.state.storage.delete(`chat:${normalizedChatId}`);
    }

    // Migration path for users linked by versions that did not create chat:<id> mappings.
    const users = await this.state.storage.list({ prefix: 'user:' });
    const matches = [...users.values()].filter((user) => String(user.chatId || '') === normalizedChatId);
    if (!matches.length) return null;
    matches.sort((left, right) => {
      const leftTime = Date.parse(left.connectedAt || left.updatedAt || left.createdAt || 0) || 0;
      const rightTime = Date.parse(right.connectedAt || right.updatedAt || right.createdAt || 0) || 0;
      return rightTime - leftTime;
    });
    const selected = matches[0];
    await this.state.storage.put(`chat:${normalizedChatId}`, selected.id);
    return selected;
  }

  async linkUserToChat(user, chatId, { preserveEnabled = false } = {}) {
    const normalizedChatId = String(chatId);
    const now = new Date().toISOString();
    const mappedUserId = await this.state.storage.get(`chat:${normalizedChatId}`);

    // Detach any older PWA session from the same Telegram user. This was the main reason
    // Telegram could open a different diary after repeated testing/linking.
    if (mappedUserId && mappedUserId !== user.id) {
      const previous = await this.state.storage.get(`user:${mappedUserId}`);
      if (previous) {
        previous.chatId = null;
        previous.enabled = false;
        previous.updatedAt = now;
        await this.state.storage.put(`user:${previous.id}`, previous);
      }
    }

    // Also clean legacy duplicates that existed before the chat mapping was introduced.
    const users = await this.state.storage.list({ prefix: 'user:' });
    for (const candidate of users.values()) {
      if (candidate.id !== user.id && String(candidate.chatId || '') === normalizedChatId) {
        candidate.chatId = null;
        candidate.enabled = false;
        candidate.updatedAt = now;
        await this.state.storage.put(`user:${candidate.id}`, candidate);
      }
    }

    const updated = {
      ...user,
      chatId: normalizedChatId,
      enabled: preserveEnabled ? user.enabled !== false : true,
      connectedAt: user.connectedAt || now,
      linkCode: '',
      linkExpiresAt: 0,
      updatedAt: now
    };
    await this.state.storage.put(`user:${updated.id}`, updated);
    await this.state.storage.put(`chat:${normalizedChatId}`, updated.id);
    return updated;
  }

  async unlinkUserFromChat(user) {
    const chatId = String(user.chatId || '');
    if (chatId) {
      const mappedUserId = await this.state.storage.get(`chat:${chatId}`);
      if (mappedUserId === user.id) await this.state.storage.delete(`chat:${chatId}`);
    }
    const updated = { ...user, chatId: null, enabled: false, updatedAt: new Date().toISOString() };
    await this.state.storage.put(`user:${updated.id}`, updated);
    return updated;
  }

  async createLaunchTicket(user, ttlMs = 60 * 60 * 1000) {
    const ticket = randomText(16).toUpperCase();
    await this.state.storage.put(`launch:${ticket}`, {
      userId: user.id,
      chatId: String(user.chatId),
      expiresAt: Date.now() + ttlMs
    });
    return ticket;
  }

  miniAppButton(user, ticket) {
    // Inline Web App buttons work without a separately configured Main Mini App.
    // The opaque ticket points to one exact PWA session and is also checked against
    // the verified Telegram user id on the server.
    return {
      text: '🌿 Відкрити ту саму сесію',
      web_app: { url: `${user.appUrl}/?telegram=1${ticket ? `&sw_session=${encodeURIComponent(ticket)}` : ''}` }
    };
  }

  async webhook(update) {
    const message = update?.message;
    const chatId = message?.chat?.id;
    const command = text(message?.text, 200);
    if (!chatId || !command) return json({ ok: true });

    const startMatch = command.match(/^\/start(?:\s+([A-Z0-9]{6,12}))?/i);
    if (startMatch) {
      const code = String(startMatch[1] || '').toUpperCase();
      if (!code) {
        const existing = await this.userByChat(chatId);
        if (existing?.appUrl) {
          const ticket = await this.createLaunchTicket(existing);
          await telegramCall(this.env, 'sendMessage', {
            chat_id: chatId,
            text: 'Soft Wellness уже підключено. Кнопка нижче відкриє саме ту PWA-сесію, яка зараз прив’язана до цього Telegram.',
            reply_markup: {
              inline_keyboard: [[this.miniAppButton(existing, ticket)]]
            }
          });
        } else {
          await telegramCall(this.env, 'sendMessage', { chat_id: chatId, text: 'Відкрийте Soft Wellness, створіть код у розділі Telegram-нагадувань і надішліть /start КОД.' });
        }
        return json({ ok: true });
      }
      const clientId = await this.state.storage.get(`link:${code}`);
      const user = clientId ? await this.state.storage.get(`user:${clientId}`) : null;
      if (!user || Number(user.linkExpiresAt) < Date.now()) {
        await telegramCall(this.env, 'sendMessage', { chat_id: chatId, text: 'Код не знайдено або він уже прострочений. Створіть новий код у застосунку.' });
        return json({ ok: true });
      }
      const updated = await this.linkUserToChat(user, chatId);
      await this.state.storage.delete(`link:${code}`);
      const ticket = await this.createLaunchTicket(updated);
      await telegramCall(this.env, 'sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `✅ <b>Soft Wellness підключено.</b>

Бот працює автономно без AI та звертатиметься до вас як «${greeting(updated)}». PWA і Telegram Mini App тепер використовують одну синхронізовану сесію.

Команди: /status, /pause, /resume, /unlink.`,
        reply_markup: updated.appUrl ? {
          inline_keyboard: [[this.miniAppButton(updated, ticket)]]
        } : undefined
      });
      return json({ ok: true });
    }

    const user = await this.userByChat(chatId);
    if (!user) {
      await telegramCall(this.env, 'sendMessage', { chat_id: chatId, text: 'Спочатку підключіть бота через код у Soft Wellness.' });
      return json({ ok: true });
    }

    if (/^\/pause\b/i.test(command)) {
      user.enabled = false;
      user.updatedAt = new Date().toISOString();
      await this.state.storage.put(`user:${user.id}`, user);
      await telegramCall(this.env, 'sendMessage', { chat_id: chatId, text: '⏸ Нагадування призупинено. Для відновлення надішліть /resume.' });
    } else if (/^\/resume\b/i.test(command)) {
      user.enabled = true;
      user.updatedAt = new Date().toISOString();
      await this.state.storage.put(`user:${user.id}`, user);
      await telegramCall(this.env, 'sendMessage', { chat_id: chatId, text: '▶️ Нагадування відновлено.' });
    } else if (/^\/unlink\b/i.test(command)) {
      await this.unlinkUserFromChat(user);
      await telegramCall(this.env, 'sendMessage', { chat_id: chatId, text: 'Зв’язок із Soft Wellness видалено.' });
    } else if (/^\/status\b/i.test(command)) {
      await telegramCall(this.env, 'sendMessage', {
        chat_id: chatId,
        parse_mode: 'HTML',
        text: `Soft Wellness: <b>${user.enabled ? 'нагадування активні' : 'нагадування призупинені'}</b>.\nЧасовий пояс: ${escapeHtml(user.timezone)}.\nЦіль води: ${Math.round(user.waterGoalMl)} мл.`
      });
    } else {
      await telegramCall(this.env, 'sendMessage', { chat_id: chatId, text: 'Команди: /status, /pause, /resume, /unlink.' });
    }
    return json({ ok: true });
  }

  async dispatch() {
    const users = await this.state.storage.list({ prefix: 'user:' });
    const now = new Date();
    let sent = 0;
    for (const user of users.values()) {
      if (!user.enabled || !user.chatId) continue;
      let local;
      try { local = localClock(now, user.timezone || 'Europe/Kyiv'); } catch { local = localClock(now, 'Europe/Kyiv'); }
      const schedule = {
        breakfast: user.times?.breakfast,
        lunch: user.times?.lunch,
        dinner: user.times?.dinner,
        waterMorning: user.times?.waterMorning,
        waterAfternoon: user.times?.waterAfternoon,
        mental: user.times?.mental
      };
      for (const [type, time] of Object.entries(schedule)) {
        if (time !== local.time) continue;
        const sentKey = `sent:${user.id}:${local.date}:${type}`;
        if (await this.state.storage.get(sentKey)) continue;
        try {
          await telegramCall(this.env, 'sendMessage', {
            chat_id: user.chatId,
            parse_mode: 'HTML',
            disable_web_page_preview: true,
            text: messageFor(user, type, local.date)
          });
          await this.state.storage.put(sentKey, now.toISOString());
          sent += 1;
        } catch (error) {
          console.error('Telegram send failed', user.id, type, error.message);
          if (error.status === 403) {
            user.enabled = false;
            user.lastError = 'Bot blocked or chat unavailable';
            user.updatedAt = new Date().toISOString();
            await this.state.storage.put(`user:${user.id}`, user);
          }
        }
      }
    }
    await this.cleanupSentKeys(now);
    return json({ ok: true, sent });
  }

  async cleanupSentKeys(now) {
    const records = await this.state.storage.list({ prefix: 'sent:' });
    const cutoff = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    const removals = [];
    for (const key of records.keys()) {
      const match = key.match(/^sent:[^:]+:(\d{4}-\d{2}-\d{2}):/);
      if (match && match[1] < cutoff) removals.push(key);
    }
    if (removals.length) await this.state.storage.delete(removals);
  }
}

const stateStub = (env) => env.TELEGRAM_STATE.get(env.TELEGRAM_STATE.idFromName('global'));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/health') {
      return json({
        ok: true,
        app: 'soft-wellness',
        telegramConfigured: Boolean(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_WEBHOOK_SECRET),
        time: new Date().toISOString()
      });
    }

    if (url.pathname === '/api/telegram/webhook') {
      if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);
      if (!env.TELEGRAM_WEBHOOK_SECRET) return json({ error: 'Telegram webhook is not configured' }, 503);
      const secret = request.headers.get('x-telegram-bot-api-secret-token');
      if (secret !== env.TELEGRAM_WEBHOOK_SECRET) return json({ error: 'Unauthorized' }, 401);
      return stateStub(env).fetch('https://telegram-state/webhook', { method: 'POST', body: await request.text() });
    }

    const telegramRoutes = {
      '/api/telegram/register': ['/register', 'POST'],
      '/api/telegram/settings': ['/settings', 'PUT'],
      '/api/telegram/status': ['/status', 'GET'],
      '/api/telegram/link-code': ['/link-code', 'POST'],
      '/api/telegram/launch-ticket': ['/launch-ticket', 'POST'],
      '/api/telegram/session': ['/session', 'POST']
    };
    if (url.pathname === '/api/sync/state') {
      if (!['GET', 'PUT'].includes(request.method)) return json({ error: 'Method not allowed' }, 405);
      const headers = new Headers();
      const authorization = request.headers.get('authorization');
      if (authorization) headers.set('authorization', authorization);
      if (request.headers.get('content-type')) headers.set('content-type', request.headers.get('content-type'));
      return stateStub(env).fetch('https://telegram-state/sync-state', {
        method: request.method,
        headers,
        body: request.method === 'PUT' ? await request.text() : undefined
      });
    }

    const telegramRoute = telegramRoutes[url.pathname];
    if (telegramRoute) {
      const [path, method] = telegramRoute;
      if (request.method !== method) return json({ error: 'Method not allowed' }, 405);
      const headers = new Headers();
      const authorization = request.headers.get('authorization');
      if (authorization) headers.set('authorization', authorization);
      if (request.headers.get('content-type')) headers.set('content-type', request.headers.get('content-type'));
      return stateStub(env).fetch(`https://telegram-state${path}`, { method, headers, body: ['POST', 'PUT'].includes(method) ? await request.text() : undefined });
    }

    const barcodeMatch = url.pathname.match(/^\/api\/food\/(\d{8,18})$/);
    if (barcodeMatch) {
      const barcode = barcodeMatch[1];
      try {
        const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`, {
          headers: {
            'user-agent': 'SoftWellness/2.0 (Cloudflare Worker; contact via project repository)',
            accept: 'application/json'
          },
          cf: { cacheTtl: 3600, cacheEverything: true }
        });

        if (!response.ok) return json({ found: false, error: 'Сервис продуктов временно недоступен' }, 502);
        const payload = await response.json();
        if (!payload?.product) return json({ found: false, error: 'Продукт не найден' }, 404);

        const product = payload.product;
        const nutrients = product.nutriments || {};
        const name = product.product_name_ru || product.product_name_uk || product.product_name || product.generic_name || `Продукт ${barcode}`;
        const calories = number(nutrients['energy-kcal_100g']) || number(nutrients.energy_100g) / 4.184;

        return json({
          found: true,
          barcode,
          product: {
            name,
            brand: product.brands || '',
            image: product.image_front_small_url || product.image_small_url || '',
            calories,
            protein: number(nutrients.proteins_100g),
            fat: number(nutrients.fat_100g),
            carbs: number(nutrients.carbohydrates_100g)
          },
          source: 'Open Food Facts'
        }, 200, { 'cache-control': 'public, max-age=3600' });
      } catch {
        return json({ found: false, error: 'Не удалось связаться с базой продуктов' }, 502);
      }
    }

    return env.ASSETS.fetch(request);
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(stateStub(env).fetch('https://telegram-state/dispatch', { method: 'POST' }));
  }
};
