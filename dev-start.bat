@echo off

git pull

cd .\client
start npm run start

cd ..\server
start npm run dev-start