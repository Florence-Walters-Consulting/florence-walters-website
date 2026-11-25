#!/usr/bin/env bash
# Converts source media (repo-root images/ and video/) into web-ready files in public/media.
#   images -> WebP, downscaled to max 2000px wide (never upscaled), quality 78
#   videos -> WebM (VP9), max 1920px wide, no audio, plus a WebP poster frame
# Only files listed in scripts/media-keep.txt are converted, so unused media never lands in the repo.
# Usage: scripts/optimize-media.sh   (skips files that are already converted)
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$ROOT/web/public/media"
mkdir -p "$OUT/images" "$OUT/video"

keep() { grep -qxF "$1" "$ROOT/web/scripts/media-keep.txt"; }
slug() { basename "$1" | sed -E 's/\.[^.]+$//; s/ 1$//; s/[ _]+/-/g' | tr 'A-Z' 'a-z'; }

shopt -s nullglob
for src in "$ROOT"/images/*.{jpg,jpeg,png}; do
  keep "$(slug "$src")" || continue
  dst="$OUT/images/$(slug "$src").webp"
  [ -f "$dst" ] && continue
  width="$(sips -g pixelWidth "$src" | awk '/pixelWidth/{print $2}')"
  resize=(); [ "$width" -gt 2000 ] && resize=(-resize 2000 0)   # downscale only, never upscale
  cwebp -quiet -q 78 -m 6 ${resize[@]+"${resize[@]}"} -metadata none "$src" -o "$dst"
done

for src in "$ROOT"/video/*.mp4; do
  name="$(slug "$src")"
  keep "$name" || continue
  dst="$OUT/video/$name.webm"
  if [ ! -f "$dst" ]; then
    ffmpeg -v error -y -i "$src" -an -vf "scale='min(1920,iw)':-2,fps=30" \
      -c:v libvpx-vp9 -crf 35 -b:v 0 -row-mt 1 -cpu-used 2 -pix_fmt yuv420p "$dst"
  fi
  if [ ! -f "$OUT/video/$name.webp" ]; then
    tmp="$(mktemp -d)"
    ffmpeg -v error -y -ss 1 -i "$src" -frames:v 1 -vf "scale='min(1920,iw)':-2" "$tmp/poster.png"
    cwebp -quiet -q 70 "$tmp/poster.png" -o "$OUT/video/$name.webp"; rm -rf "$tmp"
  fi
done
# Still frames pulled from the source videos for banners: "output-name  video-file-prefix  second"
while read -r name prefix second; do
  [ -z "$name" ] || [[ "$name" == \#* ]] && continue
  dst="$OUT/images/$name.webp"
  [ -f "$dst" ] && continue
  src="$(ls "$ROOT"/video/"$prefix"*.mp4 | head -1)"
  tmp="$(mktemp -d)"
  ffmpeg -v error -y -ss "$second" -i "$src" -frames:v 1 -vf "scale='min(2560,iw)':-2" "$tmp/still.png"
  cwebp -quiet -q 76 -m 6 "$tmp/still.png" -o "$dst"; rm -rf "$tmp"
done < "$ROOT/web/scripts/media-stills.txt"

echo "done"; du -sh "$OUT/images" "$OUT/video"
