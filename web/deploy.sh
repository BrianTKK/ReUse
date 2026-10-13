#!/usr/bin/env bash
# Publica a pasta web/ no servidor e reconstrói o container.
# Uso: DEPLOY_HOST=usuario@servidor ./deploy.sh
# Envia os arquivos versionados e os novos não ignorados (o .env local nunca vai);
# o .env do servidor não é tocado.
set -euo pipefail

HOST="${DEPLOY_HOST:?Defina DEPLOY_HOST, por exemplo DEPLOY_HOST=root@1.2.3.4}"
DIR="${DEPLOY_DIR:-/var/www/reuse}"
PORT="${APP_PORT:-3020}"

cd "$(dirname "$0")"

echo "Publicando $(git rev-parse --short HEAD) em $HOST:$DIR"
git ls-files -z -co --exclude-standard | tar --null -T - -cf - | ssh "$HOST" "mkdir -p $DIR && tar -xf - -C $DIR"
ssh "$HOST" "cd $DIR && docker compose up -d --build app && docker image prune -f >/dev/null"

for _ in $(seq 1 24); do
  if ssh "$HOST" "curl -fsS -o /dev/null http://127.0.0.1:$PORT/"; then
    echo "OK: no ar"
    exit 0
  fi
  sleep 5
done

echo "ERRO: a aplicação não respondeu após o deploy" >&2
ssh "$HOST" "cd $DIR && docker compose logs --tail=40 app" >&2
exit 1
