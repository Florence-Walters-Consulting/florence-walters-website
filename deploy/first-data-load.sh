#!/usr/bin/env bash
# Loads the existing content (database dump + uploaded images) onto a NEW server.
# Run on YOUR computer, from the project folder, once:
#   ./deploy/first-data-load.sh <user>@<server-ip>
# It refuses to run if the server database already has tables, so it cannot overwrite live data.
set -euo pipefail
TARGET="${1:-}"
[ -n "$TARGET" ] || { echo "Usage: ./deploy/first-data-load.sh <user>@<server-ip>"; exit 1; }
cd "$(dirname "${BASH_SOURCE[0]}")/.."

# One connection is opened and reused, so a password (if you use one) is asked only once.
SSH_OPTS=(-o ControlMaster=auto -o ControlPath="/tmp/fwc-ssh-%C" -o ControlPersist=300)
ssh() { command ssh "${SSH_OPTS[@]}" "$@"; }
[ -f florencewalters.sql ] && [ -f web/db/migrations/001_cleanup.sql ] && [ -d site_img ] || { echo "Run from the project folder (needs florencewalters.sql, web/db/migrations, site_img)."; exit 1; }

echo "==> Sending the files"
ssh "$TARGET" 'rm -rf ~/fwc-load && mkdir -p ~/fwc-load'
rsync -az -e "ssh ${SSH_OPTS[*]}" florencewalters.sql web/db/migrations/001_cleanup.sql "$TARGET":fwc-load/
rsync -az -e "ssh ${SSH_OPTS[*]}" site_img/ "$TARGET":fwc-load/site_img/

echo "==> Importing on the server"
ssh "$TARGET" 'set -e
TABLES=$(sudo mysql -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\"florencewalters\"")
if [ "$TABLES" != "0" ]; then echo "The database already has $TABLES tables. Stopping so nothing is overwritten."; exit 1; fi
sudo mysql florencewalters < ~/fwc-load/florencewalters.sql
sudo mysql florencewalters < ~/fwc-load/001_cleanup.sql
# The old dump stores the admin password in plain text. Disable it right away; you set a new one next.
sudo mysql florencewalters -e "UPDATE admin SET password=\"!disabled\""
sudo rsync -a ~/fwc-load/site_img/ /var/lib/fwc/site_img/
sudo chown -R fwc:fwc /var/lib/fwc/site_img
rm -rf ~/fwc-load
echo "Imported. Tables: $(sudo mysql -N -e "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema=\"florencewalters\"")"'
echo
echo "Next: deploy the site, then set the admin password ON THE SERVER:"
echo "  ssh $TARGET"
echo "  cd /var/www/fwc/web && sudo -u fwc -H bash -c 'set -a; . /etc/fwc/web.env; set +a; npm run admin:set-password -- superadmin'"
