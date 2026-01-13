#!/usr/bin/env bash
# Convert a source image (e.g., assets/capstone-source.jpg) into optimized sizes and WebP
# Usage: ./scripts/convert_images.sh assets/capstone-source.jpg

set -euo pipefail
SRC=${1:-}
if [ -z "$SRC" ]; then
  echo "Usage: $0 path/to/source-image.jpg" >&2
  exit 1
fi
OUT_DIR=$(dirname "$SRC")
BASENAME=$(basename "$SRC")
NAME="${BASENAME%.*}"

# Sizes to generate (widths)
SIZES=(1600 1200 800)

# Check for ImageMagick (magick or convert) and cwebp
if command -v magick >/dev/null 2>&1; then
  IM="magick"
elif command -v convert >/dev/null 2>&1; then
  IM="convert"
else
  echo "ImageMagick not found. Install it (brew install imagemagick) or use another tool." >&2
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp not found. Install it for WebP conversion (brew install webp)." >&2
  echo "The script will still produce JPEG sizes but won't generate WebP." >&2
  NO_WEBP=true
else
  NO_WEBP=false
fi

for W in "${SIZES[@]}"; do
  OUT_JPG="$OUT_DIR/${NAME}-${W}.jpg"
  echo "Generating $OUT_JPG"
  $IM "$SRC" -resize ${W}x -quality 82 "$OUT_JPG"
  if [ "$NO_WEBP" = false ]; then
    OUT_WEBP="$OUT_DIR/${NAME}-${W}.webp"
    echo "Generating $OUT_WEBP"
    cwebp -q 80 "$OUT_JPG" -o "$OUT_WEBP"
  fi
done

echo "Done. Generated sizes in $OUT_DIR"
