#!/usr/bin/env bash
# Build the bundled distribution using Bun
cd "$(dirname "$0")/packages/diffhtml"
bun build lib/index.js --outfile ../../dist-bun.js --minify --banner "/* Bundled by Bun from packages/diffhtml/lib/index.js */"
