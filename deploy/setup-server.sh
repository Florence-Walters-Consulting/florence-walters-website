#!/usr/bin/env bash
# One-time setup for a fresh Ubuntu 24.04 server. Run as root:
#   sudo bash setup-server.sh
# Safe to run again: it skips anything that already exists.
set -euo pipefail

DB_NAME="florencewalters"
DB_USER="fwc"
APP_USER="fwc"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

[ "$(id -u)" -eq 0 ] || { echo "Run this as root (use: sudo bash setup-server.sh)"; exit 1; }
. /etc/os-release
[ "${ID}" = "ubuntu" ] || { echo "This script is written for Ubuntu (found ${ID})."; exit 1; }

echo "==> Updating the system"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get upgrade -y

echo "==> Installing nginx, MySQL, certbot, firewall and security tools"
apt-get install -y nginx mysql-server certbot python3-certbot-nginx ufw fail2ban \
  unattended-upgrades rsync curl ca-certificates gnupg

echo "==> Installing Node.js 22 (the site needs Node 20.9 or newer)"
if ! command -v node >/dev/null 2>&1 || [ "$(node -p 'process.versions.node.split(".")[0]')" -lt 20 ]; then
  curl -fsSL https://deb.nodesource.com/setup_22.x | bash -
  apt-get install -y nodejs
fi
node --version

echo "==> Adding swap space if the server has little memory (building the site needs about 1.5 GB)"
if [ "$(free -m | awk '/^Mem:/{print $2}')" -lt 2500 ] && ! swapon --show | grep -q .; then
  fallocate -l 2G /swapfile
  chmod 600 /swapfile
  mkswap /swapfile
  swapon /swapfile
  grep -q '^/swapfile' /etc/fstab || echo '/swapfile none swap sw 0 0' >> /etc/fstab
fi

echo "==> Creating the service user and folders"
id -u "$APP_USER" >/dev/null 2>&1 || \
  useradd --system --create-home --home-dir /var/lib/fwc/home --shell /usr/sbin/nologin "$APP_USER"
mkdir -p /var/www/fwc/web /var/lib/fwc/site_img /etc/fwc /var/backups/fwc
chown -R "$APP_USER:$APP_USER" /var/www/fwc /var/lib/fwc
chmod 750 /var/backups/fwc

echo "==> Creating the database and its user (MySQL only listens on this server)"
if [ ! -f /etc/fwc/web.env ]; then
  DB_PASS="$(openssl rand -hex 24)"
  SESSION_SECRET="$(openssl rand -base64 48 | tr -d '\n')"
  mysql <<SQL
CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
ALTER USER '${DB_USER}'@'localhost' IDENTIFIED BY '${DB_PASS}';
GRANT ALL PRIVILEGES ON \`${DB_NAME}\`.* TO '${DB_USER}'@'localhost';
FLUSH PRIVILEGES;
SQL
  sed -e "s|^DATABASE_URL=.*|DATABASE_URL=mysql://${DB_USER}:${DB_PASS}@127.0.0.1:3306/${DB_NAME}|" \
      -e "s|^SESSION_SECRET=.*|SESSION_SECRET=${SESSION_SECRET}|" \
      "$HERE/web.env.example" > /etc/fwc/web.env
  chown root:"$APP_USER" /etc/fwc/web.env
  chmod 640 /etc/fwc/web.env
  echo "   Created /etc/fwc/web.env (database password and session secret generated)."
else
  echo "   /etc/fwc/web.env already exists: left unchanged."
fi

echo "==> Installing the website service and the nginx site"
install -m 644 "$HERE/fwc.service" /etc/systemd/system/fwc.service
systemctl daemon-reload
systemctl enable fwc >/dev/null
install -m 644 "$HERE/nginx-fwc.conf" /etc/nginx/sites-available/fwc
ln -sf /etc/nginx/sites-available/fwc /etc/nginx/sites-enabled/fwc
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Installing the nightly backup"
install -m 755 "$HERE/backup.sh" /usr/local/bin/fwc-backup
echo '15 3 * * * root /usr/local/bin/fwc-backup >> /var/log/fwc-backup.log 2>&1' > /etc/cron.d/fwc-backup

echo "==> Firewall: only SSH, HTTP and HTTPS are open"
ufw allow OpenSSH >/dev/null
ufw allow 'Nginx Full' >/dev/null
ufw --force enable

echo "==> Automatic security updates and brute-force protection"
dpkg-reconfigure -f noninteractive unattended-upgrades || true
systemctl enable --now fail2ban >/dev/null

cat <<MSG

Server setup finished.
Next steps (see deploy/README.md):
  1. Edit the settings:      sudo nano /etc/fwc/web.env   (replace every CHANGE_ME)
  2. From your computer:     ./deploy/first-data-load.sh <user>@<server-ip>
  3. From your computer:     ./deploy/deploy.sh <user>@<server-ip>
  4. After DNS points here:  sudo bash enable-https.sh you@example.com
MSG
