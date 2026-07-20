v131 emergency tiny mood block on stable v128 base.

# PRESETS_KV already connected

This build already includes the Workers KV binding:

```json
"kv_namespaces": [
  {
    "binding": "PRESETS_KV",
    "id": "31636d7d6b7444a1a7f2f22e0a2fa251"
  }
]
```

Deploy normally:

```bash
npm install
npx wrangler deploy
```

Server preset creation and deletion still require an active Telegram login on the site.


## v142 second KV

This build adds a separate admin settings KV:

```json
{
  "binding": "ADMIN_CONFIG_KV",
  "id": "a8e571e7d52e48939bd30b9780839dda"
}
```

Namespace name provided by user: `for-my-love-girl_v2`.

## v143 third KV

Added separate design KV namespace:

```json
{
  "binding": "DESIGNS_KV",
  "id": "4fb55f3e69fd4740b18aeece572cbf37"
}
```

Namespace name provided by user: `for-my-love-girl_v3`.


## v144 note

`DESIGNS_KV` was removed from `wrangler.jsonc` because the provided namespace id was not found in the Cloudflare account during deploy. Add it back only after copying the real Namespace ID from the same Cloudflare account.
