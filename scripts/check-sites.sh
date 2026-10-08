#!/usr/bin/env bash
# Checks the two public addresses from outside. Exit code 1 if anything fails.
# Run by hand, or from cron/launchd on a machine that stays awake.
set -u
SITE=${SITE_URL:-https://portfolio.e271aa.blog}
DEMO=${DEMO_URL:-https://demo.e271aa.blog/casa}
fail=0

check() { # name, url, expected status
  code=$(curl -s -o /dev/null -m 15 -w '%{http_code}' "$2")
  if [ "$code" = "$3" ]; then echo "ok    $1 ($code)"; else echo "FAIL  $1 (got $code, wanted $3)"; fail=1; fi
}

check "site"            "$SITE/"                         200
check "site CV PT"      "$SITE/Ruben_Martins_CV_PT.pdf"  200
check "site CV EN"      "$SITE/Ruben_Martins_CV_EN.pdf"  200
check "site 404"        "$SITE/nada"                     404
check "demo"            "$DEMO"                          200

# The demo needs its WebSocket, not just the page.
ws=$(curl -s --http1.1 -m 5 -i -o - -H 'Connection: Upgrade' -H 'Upgrade: websocket' \
  -H 'Sec-WebSocket-Version: 13' -H 'Sec-WebSocket-Key: dGhlIHNhbXBsZSBub25jZQ==' \
  "${DEMO%/casa}/api/websocket" 2>/dev/null | head -1)
case "$ws" in *101*) echo "ok    demo websocket (101)";; *) echo "FAIL  demo websocket ($ws)"; fail=1;; esac

exit $fail
