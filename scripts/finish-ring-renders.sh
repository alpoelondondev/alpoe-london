#!/usr/bin/env bash
#
# Converts whatever has landed locally, every few minutes, until nothing is
# left. Never reads a file that is still in iCloud.
#
# This exists because of how the library came down. Reading a placeholder file
# is what pulls it out of iCloud, and doing that 32,115 times got the machine
# rate-limited to a standstill. Afterwards the files still arrived — iCloud
# trickles them down in the background on its own schedule — but any process
# that reached for one directly just blocked.
#
# So: stop reaching. --local-only skips anything still in the cloud, so each
# pass converts what has arrived and ignores the rest. Run it on a timer and
# the job completes itself, at whatever rate iCloud feels like, without ever
# adding to the pressure that caused the throttle.
set -uo pipefail

TOTAL=32115
OUT="${OUT:-$HOME/Desktop/Rings-Web}"
INTERVAL="${INTERVAL:-300}"

while true; do
  python3 scripts/build-ring-renders.py --stream --local-only --jobs 8 >/dev/null 2>&1
  n=$(find "$OUT" -name '*.webp' | wc -l | tr -d ' ')
  echo "$(date +%H:%M) — $n / $TOTAL converted ($(( n * 100 / TOTAL ))%)"
  if [ "$n" -ge "$TOTAL" ]; then
    echo "COMPLETE — all $TOTAL renders converted"
    exit 0
  fi
  sleep "$INTERVAL"
done
