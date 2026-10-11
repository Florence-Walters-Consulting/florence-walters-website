#!/usr/bin/env bash
# Turns on HTTPS with a free Let's Encrypt certificate. Run on the server as root, AFTER the
# domain's DNS points at this server:
#   sudo bash enable-https.sh you@example.com
# The email address receives certificate expiry warnings. Renewal is automatic.
set -euo pipefail
DOMAIN="florencewaltersconsulting.com"
EMAIL="${1:-}"
[ "$(id -u)" -eq 0 ] || { echo "Run as root (sudo bash enable-https.sh you@example.com)"; exit 1; }
[ -n "$EMAIL" ] || { echo "Usage: sudo bash enable-https.sh you@example.com"; exit 1; }

MY_IP="$(curl -4 -fsS https://api.ipify.org)"
for host in "$DOMAIN" "www.$DOMAIN"; do
  RESOLVED="$(getent ahostsv4 "$host" | awk 'NR==1{print $1}')"
  if [ "$RESOLVED" != "$MY_IP" ]; then
    echo "$host points to '${RESOLVED:-nothing}', but this server is $MY_IP."
    echo "Wait for the DNS change to take effect (can take up to a few hours), then run this again."
    exit 1
  fi
done

certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --redirect --agree-tos --no-eff-email -m "$EMAIL" --non-interactive
nginx -t && systemctl reload nginx
echo "HTTPS is on. Test: https://$DOMAIN"
