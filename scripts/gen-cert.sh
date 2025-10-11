#!/usr/bin/env sh
# Generate self-signed certs: server.key (private key) and server.cert (certificate)
# Usage: ./scripts/gen-cert.sh [CN] [DAYS]
# Defaults: CN=localhost, DAYS=365
set -e
CN=${1:-localhost}
DAYS=${2:-365}
OUT_DIR=$(dirname "$0")/..
cd "$OUT_DIR"
if [ -f server.key ] || [ -f server.cert ]; then
  echo "Existing server.key/server.cert found. Remove them first if you want to regenerate." >&2
  exit 1
fi
openssl req -x509 -nodes -newkey rsa:2048 \
  -keyout server.key -out server.cert \
  -days "$DAYS" \
  -subj "/C=US/ST=Local/L=Local/O=Dev/OU=Dev/CN=$CN"
chmod 600 server.key
echo "Generated server.key and server.cert for CN=$CN valid $DAYS days."
