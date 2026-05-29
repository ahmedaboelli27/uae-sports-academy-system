#!/usr/bin/env bash
set -euo pipefail

OUTPUT="project-files-map.txt"
ROOT="$(pwd)"
GENERATED_AT="$(date '+%Y-%m-%d %H:%M:%S')"

EXCLUDED_PATHS=(
  "./.git"
  "./node_modules"
  "./dist"
  "./build"
  "./.next"
  "./out"
  "./coverage"
  "./.turbo"
  "./.cache"
  "./target"
  "./vendor"
  "./.venv"
  "./venv"
  "./__pycache__"
)

build_prune_args() {
  local args=()
  for path in "${EXCLUDED_PATHS[@]}"; do
    args+=( -path "$path" -o )
  done

  unset 'args[${#args[@]}-1]'
  printf '%s\n' "${args[@]}"
}

{
  echo "PROJECT FILES MAP"
  echo "Generated At: $GENERATED_AT"
  echo "Project Root: $ROOT"
  echo
  echo "This file contains all visible project directories and files, including frontend and backend files."
  echo "Excluded heavy/cache folders: .git, node_modules, dist, build, .next, coverage, .turbo, .cache, vendor, venv"
  echo

  echo "============================================================"
  echo "DIRECTORIES"
  echo "============================================================"
  find . \
    \( $(build_prune_args) \) -prune -o \
    -type d -print \
    | sort \
    | sed 's#^\./##'
  echo

  echo "============================================================"
  echo "FILES WITH EXTENSIONS"
  echo "============================================================"
  find . \
    \( $(build_prune_args) \) -prune -o \
    -type f -print \
    | sort \
    | sed 's#^\./##' \
    | while IFS= read -r file; do
        filename="${file##*/}"

        if [[ "$filename" == *.* ]]; then
          extension=".${filename##*.}"
        else
          extension="[no extension]"
        fi

        printf "%s | %s\n" "$file" "$extension"
      done
  echo

  echo "============================================================"
  echo "EXTENSION SUMMARY"
  echo "============================================================"
  find . \
    \( $(build_prune_args) \) -prune -o \
    -type f -print \
    | sed 's#^\./##' \
    | while IFS= read -r file; do
        filename="${file##*/}"

        if [[ "$filename" == *.* ]]; then
          echo ".${filename##*.}"
        else
          echo "[no extension]"
        fi
      done \
    | sort \
    | uniq -c \
    | sort -nr
  echo

  echo "============================================================"
  echo "IMPORTANT PROJECT FILES"
  echo "============================================================"
  find . \
    \( $(build_prune_args) \) -prune -o \
    -type f \( \
      -name "package.json" -o \
      -name "tsconfig.json" -o \
      -name "vite.config.*" -o \
      -name "next.config.*" -o \
      -name "tailwind.config.*" -o \
      -name "postcss.config.*" -o \
      -name "eslint.config.*" -o \
      -name ".env*" -o \
      -name "prisma.schema" -o \
      -name "schema.prisma" -o \
      -name "docker-compose.yml" -o \
      -name "Dockerfile" -o \
      -name "README.md" \
    \) -print \
    | sort \
    | sed 's#^\./##'
} > "$OUTPUT"

echo "Done."
echo "Created file: $OUTPUT"
echo
wc -l "$OUTPUT"
