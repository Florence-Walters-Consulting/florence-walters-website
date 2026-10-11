# Putting the website on a server

This guide takes the new website from your computer to a live server at **florencewaltersconsulting.com**.
You do not need to know servers: copy each command exactly. Allow 2 to 3 hours the first time.

**What you will pay for:** only the server (a small rented computer, roughly $5 to $10 a month depending on the provider).
HTTPS certificates, the database and the web server software are free.

> **Status:** these files were written and syntax-checked but have **not yet been run on a real server**. Expect to fix small things on the first run, and tell me what you see.

---

## 0. What is where

| Part | Where it lives on the server |
|---|---|
| The website program | `/var/www/fwc/web` |
| Settings and secrets | `/etc/fwc/web.env` (never in the project, never in chat) |
| The database (MySQL) | on the same server, not reachable from the internet |
| Uploaded images | `/var/lib/fwc/site_img` (kept safe when you update the site) |
| Nightly backups | `/var/backups/fwc` (14 days) |

## 1. Create the server

At the provider you choose (any one that offers Ubuntu will do; your old host HostAfrica also sells servers):

- **Operating system:** Ubuntu **24.04 LTS**
- **Size:** at least **2 GB memory**, 1 CPU, 25 GB disk
- **Login:** choose **SSH key** if offered (safer than a password). If the provider only gives a password, that works too.
- Write down the server's **IP address** (four numbers like `203.0.113.10`).

**If you use Namecheap's VPS** (same account as your domain): choose the **Pulsar** plan (2 GB memory), pick **Ubuntu** as the operating system (24.04 if offered, otherwise the newest Ubuntu LTS), and choose the plain/unmanaged server **without** cPanel or any control panel. Look at the price shown at checkout: the first-year price is lower than the renewal price. After it is created, Namecheap gives you the server's IP address and the `root` login details in your account.

Check after creating it: the provider should allow **outgoing mail connections on port 587**. Test it right away on the server with `nc -zv smtp.office365.com 587` (it should say "succeeded"). Some providers block them by default and ask you to request access. The website sends its contact-form emails through Microsoft 365 on port 587.

## 2. Log in and run the setup

On your computer, open **Terminal** and log in (replace the address):

```
ssh root@203.0.113.10
```

Copy the `deploy` folder to the server. In a **second** Terminal window on your computer, from the project folder:

```
rsync -az deploy/ root@203.0.113.10:/root/deploy/
```

Back in the server window:

```
cd /root/deploy
sudo bash setup-server.sh
```

It installs everything and prints "Server setup finished". It can be run again safely.

## 3. Fill in the settings

On the server:

```
sudo nano /etc/fwc/web.env
```

Replace every `CHANGE_ME`. Meaning of each setting is in the file. Save with `Ctrl+O`, `Enter`, leave with `Ctrl+X`.
Type these secrets **only on the server**. Do not paste them in chat or email.

- `RECAPTCHA_SECRET_KEY` and `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`: the **site key** and the **legacy secret key** of the key you created in Google Cloud. (The names in this file are the ones the website reads. A line called `GOOGLE_RECAPTCHA_SITE_KEY` does nothing.)
- `SMTP_PASSWORD`: the password of `info@florencewaltersconsulting.com`.

## 4. Send the content and the website

On your **computer**, from the project folder (the one containing `florencewalters.sql` and `site_img`):

```
./deploy/first-data-load.sh root@203.0.113.10
./deploy/deploy.sh root@203.0.113.10
```

- The first command loads the database and the images. It refuses to run if the server already has data.
- The second builds and starts the website (a few minutes). It prints `site answers locally: HTTP 200` when it works. **Run it again any time you change the website.**

Then set the admin password. The old password is disabled for security. On the server:

```
cd /var/www/fwc/web
sudo -u fwc -H bash -c 'set -a; . /etc/fwc/web.env; set +a; npm run admin:set-password -- superadmin'
```

Type a new password twice (nothing shows while you type). Use a long, unique one (at least 10 characters).

## 5. Test it before the domain moves

Nobody sees the site yet. Test it using the server's address. On your computer:

```
curl -s -o /dev/null -w "%{http_code}\n" -H "Host: florencewaltersconsulting.com" http://203.0.113.10/
```

It should print `200`. For a full look in your browser, temporarily add this line to your computer's hosts file (Mac: `sudo nano /etc/hosts`):

```
203.0.113.10  florencewaltersconsulting.com www.florencewaltersconsulting.com
```

Open `http://florencewaltersconsulting.com`, click through the pages, and try `/admin`. **Remove that line when you are done.**
(Forms and the admin need HTTPS to behave fully, so a final check comes after step 7.)

## 6. DNS: point the domain at the server

**Important:** the domain is *registered* at Namecheap, but its DNS is currently *served by HostAfrica's name servers* (`nsc.go54.com`, `nsd.go54.com`), the old hosting. The DNS panel in Namecheap does nothing until the name servers are moved. You have two options.

### Option A (recommended): move DNS to Namecheap
This removes the dependence on the old hosting account.

1. Before starting, open the **HostAfrica DNS zone** if you still can, or keep this list. These are all the records I found for the domain:

   | Type | Host | Value |
   |---|---|---|
   | MX | `@` | `florencewaltersconsulting-com.mail.protection.outlook.com`, priority `0` |
   | TXT | `@` | `MS=ms88343786` |
   | TXT | `@` | `v=spf1 include:spf.protection.outlook.com -all` |
   | CNAME | `autodiscover` | `autodiscover.outlook.com` |
   | A | `@` | the new server IP |
   | CNAME | `www` | `florencewaltersconsulting.com` |

   There are currently **two** SPF records (one is the old host's). Two SPF records are invalid and can make your emails land in spam, so the list above has only the Microsoft 365 one.
2. In Namecheap: **Domain List → Manage → Nameservers → Namecheap BasicDNS → save.**
3. **Advanced DNS** tab: delete any default records, then add **exactly** the six records above. Do this straight away, because email depends on these records.
4. Wait. Changes take from minutes to a few hours.

### Option B: keep HostAfrica's DNS
Only if you can still log in to HostAfrica: edit the `A` record for `@` and the `www` record to point at the new server IP. Leave everything else untouched. The risk of this option is that DNS (and therefore your email) stops working if that account is ever closed.

**Email safety check afterwards:** send yourself a test email from outside, and check that `info@` still receives mail.

## 7. Turn on HTTPS

When `florencewaltersconsulting.com` and `www.` both show your server's IP (check with `dig +short florencewaltersconsulting.com`), run on the server:

```
cd /root/deploy
sudo bash enable-https.sh your-email@example.com
```

The email receives certificate warnings only. Renewal is automatic. Then open **https://florencewaltersconsulting.com**.

Final checks:
- the home page, About, Services, Blog and a blog article load
- submit the **contact form** (a real email should arrive at `info@`)
- sign in at **/admin**, edit something small, and upload an image
- the footer sign-up form says "Thank you for subscribing"

## 8. Everyday use

- **Update the website:** change the code, then `./deploy/deploy.sh root@<server-ip>`.
- **Backups:** automatic every night at 03:15 in `/var/backups/fwc`. They live on the same server, so **also copy them somewhere else** (for example your provider's snapshot feature, or `scp` them to your computer now and then). A backup on the server alone does not protect you if the server is lost.
- **Restore the database** from a backup: `gunzip -c /var/backups/fwc/db-YYYYMMDD-HHMMSS.sql.gz | sudo mysql florencewalters`
- **See what the site is doing:** `sudo journalctl -u fwc -n 100 --no-pager`
- **Restart:** `sudo systemctl restart fwc`
- **Security updates** install automatically.

## 9. Things to do soon

- **Change the mailbox password.** It was typed into a chat while preparing this, so treat it as exposed. Use a long unique one (and update `SMTP_PASSWORD`, then `sudo systemctl restart fwc`).
- **Microsoft 365 sign-in method.** Microsoft is switching off password-based SMTP for existing tenants at the end of **December 2026** unless an administrator turns it back on. If the contact form emails stop, this is the first thing to check. I can switch the site to a different sending method if needed.
- **Email authentication (recommended):** in the Microsoft 365 Defender portal enable **DKIM** for the domain (it gives you two CNAME records to add) and add a `_dmarc` TXT record, for example `v=DMARC1; p=none; rua=mailto:info@florencewaltersconsulting.com`. This helps the site's emails reach inboxes.
- **Lock down SSH** once things work: use SSH keys and turn off password login.
- **Rate limits** are counted in memory (one server), so they reset when the site restarts. That is fine for one server.

## 10. If something goes wrong

| Symptom | Check |
|---|---|
| `deploy.sh` stops with an error | read the last lines it printed; run it again after fixing |
| `npm ci` says the lock file is "not in sync" | the server's npm (version 10) is stricter than the one on your Mac. In the `web` folder run `npx npm@10 install --package-lock-only`, then run `deploy.sh` again (the script now checks this before it starts) |
| Public pages show an old value after you changed the database by hand | the site keeps a copy for up to an hour. Changes made in the admin appear at once; only direct database edits wait. |
| rsync says "cannot delete non-empty directory: web" | a stray copy exists at `/var/www/fwc/web/web`. Look first: `ls -la /var/www/fwc/web`. If a folder named `web` is inside, it can be removed; it is not used |
| Site shows 502 Bad Gateway | `sudo systemctl status fwc` and `sudo journalctl -u fwc -n 100 --no-pager` |
| Images missing | `ls /var/lib/fwc/site_img` should list folders; re-run `first-data-load.sh` only on an empty database, otherwise copy files with `rsync` |
| Contact form says "Message could not be sent" | wrong mailbox password, SMTP sending off for the mailbox, or the provider blocks port 587 (`journalctl` shows the reason) |
| Forms say the captcha failed | check both reCAPTCHA keys, and that `RECAPTCHA_ALLOWED_HOSTNAMES` lists your domain |
| Admin login always fails | you must run the `admin:set-password` step; the old password is disabled |
| Certificate step says DNS does not match | DNS has not finished changing; wait and retry |
