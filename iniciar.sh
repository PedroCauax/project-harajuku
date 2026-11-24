#!/usr/bin/env bash
# Mac / Linux: ./iniciar.sh   (Ctrl+C encerra os dois servidores)
cd "$(dirname "$0")" || exit 1

command -v javac >/dev/null || { echo "[ERRO] JDK nao encontrado (javac ausente; pode ser so o JRE). Instale o JDK 25."; exit 1; }
command -v npm  >/dev/null || { echo "[ERRO] Node.js nao encontrado. Instale o Node.js LTS."; exit 1; }

chmod +x mvnw
./mvnw spring-boot:run & BACK=$!
(cd frontend && npm install && npm run dev) & FRONT=$!
trap 'kill $BACK $FRONT 2>/dev/null' EXIT INT TERM

sleep 15
(command -v xdg-open >/dev/null && xdg-open http://localhost:5173) || open http://localhost:5173 2>/dev/null
wait
