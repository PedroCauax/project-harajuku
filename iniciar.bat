@echo off
title Gestao de usuarios - iniciando
cd /d "%~dp0"

where javac >nul 2>nul
if errorlevel 1 (
  echo [ERRO] JDK nao encontrado ^(o javac nao foi achado; voce pode ter so o JRE^).
  echo Instale o JDK 25 ^(ex.: Eclipse Temurin em adoptium.net^), marque a opcao
  echo "Set JAVA_HOME" e "Add to PATH", feche esta janela e rode de novo.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo [ERRO] Node.js nao encontrado. Instale o Node.js LTS e rode de novo.
  pause
  exit /b 1
)

echo Iniciando o back-end (Spring Boot)...
start "Back-end - Spring Boot" /d "%~dp0." cmd /k mvnw.cmd spring-boot:run

echo Iniciando o front-end (React)...
start "Front-end - React" /d "%~dp0frontend" cmd /k "npm install && npm run dev"

echo Aguardando os servidores subirem...
timeout /t 15 /nobreak >nul
start http://localhost:5173

echo.
echo Pronto! Para encerrar, feche as duas janelas que foram abertas.
timeout /t 5 >nul
