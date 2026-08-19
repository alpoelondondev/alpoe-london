#!/usr/bin/env bash
#
# Uploads the built render library to an S3-compatible bucket.
#
# Written against rclone rather than the AWS CLI because this is 32,115 small
# files: rclone's `--transfers` genuinely parallelises object creation, where
# `aws s3 sync` serialises far more than you would hope and turns a twenty
# minute upload into a multi-hour one.
#
#   brew install rclone
#   rclone config          # n) new remote -> s3 -> Cloudflare R2
#
# Then:
#   ./scripts/upload-ring-renders.sh r2:alpoe-ring-renders
#
# ── The headers matter more than the upload ──
#
# Every render is immutable: its path encodes the exact configuration, so the
# bytes at a given URL never change. That earns the strongest cache header
# there is, and it is the difference between a returning customer re-fetching
# the library and re-fetching nothing at all.
#
Content-Type is left to rclone, which maps .webp correctly from its own MIME
# table for S3 backends. Forcing it with --header-upload as well can conflict
# with the header rclone already sets, and the failure mode is a bucket full of
# objects served as application/octet-stream, which no <img> tag will render.
# It is checked at the end instead, which is the honest way round.
#
# --s3-no-check-bucket matters on R2 specifically: rclone otherwise makes a
# HeadBucket call before the first upload, and an API token scoped to a single
# bucket — which is the right way to scope it — is not permitted to make that
# call. Without the flag the whole upload fails on its first request with a
# 403 that looks like bad credentials.
set -euo pipefail

SRC="${SRC:-$HOME/Desktop/Rings-Web}"
DEST="${1:-}"

if [ -z "$DEST" ]; then
  echo "usage: $0 <rclone-remote:bucket>   e.g. r2:alpoe-ring-renders" >&2
  exit 1
fi
if [ ! -d "$SRC" ]; then
  echo "no built library at $SRC — run: python3 scripts/build-ring-renders.py" >&2
  exit 1
fi

COUNT=$(find "$SRC" -name '*.webp' | wc -l | tr -d ' ')
BYTES=$(du -sh "$SRC" | cut -f1)
echo "uploading $COUNT renders ($BYTES) to $DEST"

rclone copy "$SRC" "$DEST" \
  --header-upload "Cache-Control: public, max-age=31536000, immutable" \
  --s3-no-check-bucket \
  --transfers 32 \
  --checkers 32 \
  --fast-list \
  --progress

UPLOADED=$(rclone size "$DEST" --json --s3-no-check-bucket 2>/dev/null || echo '{}')
echo
echo "uploaded: $UPLOADED"
echo
echo "Next:"
echo "  1. Set NEXT_PUBLIC_RING_RENDERS_URL to your public bucket URL"
echo "     (Cloudflare R2 -> bucket -> Settings -> Public Development URL)"
echo "  2. Redeploy — NEXT_PUBLIC_* is baked in at build time"
echo
echo "Check one object is public and correctly typed:"
echo "  curl -sI <public-url>/solitaire/round-diamond/6-prong-nouveau/platinum/solitaire_round-diamond_6-prong-nouveau_platinum_angled.webp"
echo "Expect: HTTP/2 200, content-type: image/webp, cache-control: public, max-age=31536000, immutable"
