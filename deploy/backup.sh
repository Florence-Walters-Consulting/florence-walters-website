#!/usr/bin/env bash
# Nightly backup of the database and the uploaded images. Installed as /usr/local/bin/fwc-backup
# and run by cron at 03:15. Keeps 14 days. Runs as root (reads MySQL through the local socket).
set -euo pipefail
DEST=/var/backups/fwc
STAMP="$(date +%Y%m%d-%H%M%S)"
umask 077
mkdir -p "$DEST"

mysqldump --single-transaction --routines florencewalters | gzip > "$DEST/db-$STAMP.sql.gz"
tar -czf "$DEST/site_img-$STAMP.tar.gz" -C /var/lib/fwc site_img

# keep the last 14 days
find "$DEST" -type f \( -name 'db-*.sql.gz' -o -name 'site_img-*.tar.gz' \) -mtime +14 -delete
echo "$(date -Is) backup ok: db-$STAMP.sql.gz, site_img-$STAMP.tar.gz"
