# Dev environment on Vercel (for CEO review)

A private copy of the new website that the CEO can open any time, separate from the live site. Pushing to the
`website-revamp` branch updates it automatically.

## How it fits together

| Piece | Where it lives | Why |
|---|---|---|
| Website and admin | **Vercel** project `fwc-dev` (Root Directory `web`) | Builds from GitHub on every push |
| Database | **Aiven for MySQL** (free plan) | Vercel has no MySQL of its own; the app needs MySQL 8 |
| Uploaded images (blog, logos, work highlights...) | **Vercel Blob** (public store) | Vercel has no persistent disk, so `site_img/` cannot live beside the app |
| Access control | **Vercel Deployment Protection** | Nobody without permission can open it, including `/admin` |

Not the same as production: the real launch should go to a separate project or to the Ubuntu server in `deploy/`.

## What you need before starting

- Access to the GitHub repository, and a Vercel account (a Pro team is the normal choice for company work, because Hobby is meant for personal,
  non-commercial use; check Vercel's current terms).
- An Aiven account (no card needed for the free plan).
- The CEO's email address (to give her access).
- On your computer: Node 22+, `mysql` and `mysqldump` command-line tools, and this repository.

---

## Part 1: Create the database (Aiven)

1. Sign up at aiven.io, create a **MySQL** service, choose the **Free** plan and a region near your visitors.
2. Wait until it shows **Running**. Open the service and note: **Host, Port, User, Password, Database name** (usually `defaultdb`).
3. Download the **CA certificate** (Overview tab, "CA certificate") and keep the file `ca.pem`.
4. **Allow connections from anywhere.** Vercel's servers do not have fixed addresses, so under *Allowed IP addresses* use `0.0.0.0/0`.
   This is safe only because the connection is encrypted and the password is long and random (use the generated one).
5. Free plans are small (about 1 GB) and not meant for production. Check Aiven's current free-plan terms, including whether an idle service is powered off.

## Part 2: Put the data in it

Run these in the `web` folder of the repository.

1. Create a private settings file (it is ignored by git because it ends in `.local`):

   ```
   # web/.env.dev.local
   DATABASE_URL=mysql://USER:PASSWORD@HOST:PORT/DATABASE
   DATABASE_SSL=true
   DATABASE_SSL_CA="-----BEGIN CERTIFICATE-----\nPASTE-THE-CA-ON-ONE-LINE-WITH-\n-SEPARATORS-----END CERTIFICATE-----"
   ```
   To make the CA one line: `awk 'NF {printf "%s\\n", $0}' ca.pem` and paste the output between the quotes.

2. Copy your current local content (it already has all migrations, work highlights, regulator logos...):

   ```
   mysqldump --single-transaction --no-tablespaces --set-gtid-purged=OFF -u root florencewalters_next > /tmp/fwc-dev.sql
   mysql -h HOST -P PORT -u USER -p --ssl-ca=ca.pem DATABASE < /tmp/fwc-dev.sql
   ```

3. Check and finish the migrations (does nothing if everything is applied):

   ```
   ENV_FILE=.env.dev.local npm run db:migrate -- --status
   ENV_FILE=.env.dev.local npm run db:migrate
   ```

4. **Set a password for the admin.** The copied account still has the old plain-text password, which the login rejects:

   ```
   ENV_FILE=.env.dev.local npm run admin:set-password -- superadmin
   ```
   (You are asked for the password on a hidden prompt.) Add the CEO as an Editor or Admin later from **Admin → Users**.

5. Delete the dump: `rm /tmp/fwc-dev.sql`.

## Part 3: Create the image storage (Vercel Blob)

1. In Vercel: **Storage → Create → Blob**. Name it `fwc-dev-images`, choose a nearby region, and choose **Public**
   (the access mode cannot be changed later).
2. Open the store's `.env.local` tab and copy `BLOB_READ_WRITE_TOKEN`. Add it to `web/.env.dev.local`:

   ```
   BLOB_READ_WRITE_TOKEN=vercel_blob_rw_...
   ```
3. Upload the existing pictures (about 10 MB, one time; safe to run again):

   ```
   ENV_FILE=.env.dev.local npm run storage:upload
   ```
   The last line prints `NEXT_PUBLIC_IMAGE_BASE_URL=https://xxxxxxxx.public.blob.vercel-storage.com`. Keep it for Part 4.

## Part 4: Create the Vercel project

1. **Add New → Project**, import the GitHub repository.
2. **Root Directory: `web`**. Framework: Next.js (detected). Leave the install command as the default.
3. **Production Branch:** *Settings → Environments → Production → Branch*: `website-revamp`. This gives one stable address that always shows the
   latest work. (When this branch is merged to `master` for launch, use a separate production project.)
4. **Build command** (Settings → Build and Deployment → override): `npm run db:migrate && npm run build`.
   This applies any new database migration on each deploy; it does nothing when the database is up to date.
5. **Environment variables** (Settings → Environment Variables; tick Production and Preview):

   | Name | Value |
   |---|---|
   | `DATABASE_URL`, `DATABASE_SSL`, `DATABASE_SSL_CA` | the same three as in `.env.dev.local` |
   | `DB_POOL_SIZE` | `2` (many small server instances share a small database) |
   | `SESSION_SECRET` | a long random value: `openssl rand -base64 48` |
   | `STORAGE_DRIVER` | `vercel-blob` |
   | `NEXT_PUBLIC_IMAGE_BASE_URL` | the URL printed in Part 3 (no trailing slash) |
   | `SITE_NOINDEX` | `true` (tells search engines never to list this site) |
   | `NEXT_PUBLIC_COMPANY_NAME`, `_PHONE`, `_EMAIL`, `_ADDRESS`, `NEXT_PUBLIC_DISCOVERY_CALL_URL` | same as your `.env.local` |
   | `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `RECAPTCHA_SECRET_KEY`, `RECAPTCHA_ALLOWED_HOSTNAMES` | see below |
   | `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `MAIL_FROM`, `MAIL_TO` | **leave out on the dev site**, or point `MAIL_TO` at a test mailbox. Enquiries are still saved in **Admin → Inbox** either way. |

   `BLOB_READ_WRITE_TOKEN` is added automatically when you connect the Blob store to the project (Storage → your store → Projects → Connect).
   Variables starting with `NEXT_PUBLIC_` are baked in at build time: change one, then redeploy.

   **reCAPTCHA on the dev site:** the quickest option is Google's public test pair: site key `6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI`,
   secret `6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe`, allowed hostnames `testkey.google.com`. It always passes and shows a red "testing only"
   notice on the form. For a clean look, create a real key pair and add the Vercel domain to it, then use `RECAPTCHA_ALLOWED_HOSTNAMES=your-project.vercel.app`.
6. Click **Deploy**. The first build needs the database from Part 2, because pages are prepared during the build.

## Part 5: Lock it and give the CEO access

1. *Settings → Deployment Protection*: set the scope to **All Deployments** and the method to **Vercel Authentication**.
   Do not leave the default "Standard Protection": it leaves the production address (including `/admin`) open to the public.
2. Give the CEO access, either:
   - **Invite her to the Vercel team** (*Team Settings → Members*). She signs in with her email and opens the link. Free for the protection feature itself.
   - Or **Password Protection** (Pro plan, extra monthly cost per protected project per Vercel's pricing page): she just types a password, no account.
3. Send her the project address (`https://your-project.vercel.app`). She can use it any time.

## Part 6: Check it works

- [ ] Open the address signed out: you are asked to log in to Vercel (protection works).
- [ ] Home, Services, Work, Blog and About show with all pictures and the hero video.
- [ ] Send a contact enquiry: it appears in **Admin → Inbox**.
- [ ] Sign in at `/admin/login` as `superadmin`.
- [ ] In the admin, upload a picture (for example on a Work highlight): it saves and shows on the site. This proves Blob works.
- [ ] Add a blog draft and use **Preview**.

## Day to day

- **Update the site:** commit and push to `website-revamp`. Vercel rebuilds in a few minutes.
- **New database migration:** it runs automatically on deploy (Part 4, step 4). To run by hand: `ENV_FILE=.env.dev.local npm run db:migrate`.
- **Change a setting:** edit it in Vercel, then *Deployments → ⋯ → Redeploy*.
- **Reset the dev data** to match your computer: repeat Part 2 (drop the tables first, or use a fresh database).

## Things that behave differently on Vercel

- **Rate limits** (contact and form spam protection) count per server instance, so they slow bots down but are not a hard global limit.
- **The 90-day clean-up** of old enquiries is a scheduled job on the Ubuntu server and does not run here. Not needed for a review site; if wanted later, a Vercel Cron can call it.
- **Email** is not sent unless you set the SMTP variables.
- **Files:** every upload goes to Blob; deleting in the admin deletes from Blob. Blob has free allowances and then charges for storage and downloads (see Vercel's Blob pricing).
- **Not for the real launch.** For the public site, either deploy with `deploy/deploy.sh` to the Ubuntu server, or create a separate production Vercel project with a paid MySQL, SMTP and real reCAPTCHA keys.
