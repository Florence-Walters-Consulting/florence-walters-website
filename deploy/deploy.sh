#!/usr/bin/env bash
# Publishes the website to the server. Run on YOUR computer, from the project folder:
#   ./deploy/deploy.sh <user>@<server-ip>
# The server user needs sudo. Safe to run any number of times (this is also how you update).
set -euo pipefail
TARGET="${1:-}"
[ -n "$TARGET" ] || { echo "Usage: ./deploy/deploy.sh <user>@<server-ip>"; exit 1; }
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# One connection is opened and reused, so a password (if you use one) is asked only once.
SSH_OPTS=(-o ControlMaster=auto -o ControlPath="/tmp/fwc-ssh-%C" -o ControlPersist=300)
ssh() { command ssh "${SSH_OPTS[@]}" "$@"; }

echo "==> Checking the code before sending it"
( cd web && npx tsc --noEmit && npm run lint )
# The server uses npm 10 (it comes with Node 22), which is stricter than newer versions about the
# package-lock.json file. Catch a lock file it would refuse BEFORE touching the server.
( cd web && npx -y npm@10 ci --dry-run >/dev/null ) || {
  echo "package-lock.json would be rejected by the server's npm. Fix: in the web folder run"
  echo "  npx npm@10 install --package-lock-only"
  exit 1
}

echo "==> Copying the code to the server"
ssh "$TARGET" "sudo mkdir -p /var/www/fwc/web && sudo chown -R \$(id -un) /var/www/fwc/web"
rsync -az --delete -e "ssh ${SSH_OPTS[*]}" \
  --exclude node_modules --exclude .next --exclude '.env*' --exclude public/site_img --exclude '*.log' \
  web/ "$TARGET":/var/www/fwc/web/

echo "==> Installing and building on the server (takes a few minutes)"
ssh "$TARGET" 'set -e
sudo chown -R fwc:fwc /var/www/fwc
sudo -u fwc -H bash -c "cd /var/www/fwc/web && set -a && . /etc/fwc/web.env && set +a && npm ci && npm run build"
sudo systemctl restart fwc
sleep 4
systemctl is-active fwc
curl -fsS -o /dev/null -w "site answers locally: HTTP %{http_code}\n" http://127.0.0.1:3000/'
echo "==> Done."
