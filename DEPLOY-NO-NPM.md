# Cloudflare deployment without npm install

This project intentionally has no package.json and no package-lock.json.
The frontend and Worker are plain JavaScript and require no build step.

Cloudflare Worker settings:

- Root directory: `/`
- Build command: leave empty
- Deploy command: `npx --yes wrangler@4.112.0 deploy --keep-vars`
- Non-production deploy command: `npx --yes wrangler@4.112.0 versions upload --keep-vars`

Before retrying, delete these old files from the repository if they still exist:

- package.json
- package-lock.json
- .npmrc
- .node-version

Then clear the Cloudflare build cache and retry.
