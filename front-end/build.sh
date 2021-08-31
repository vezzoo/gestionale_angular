#!/bin/sh

echo "[34mRemoving files...[0m"
rm -R ~/gestionale/gestionale_angular/front-end/dist/*
rm /var/www/gestionale_angular/html/*
echo ""

echo "[34mPull from git...[0m"
git pull origin main
echo ""

echo "[34mInstall dependecies...[0m"
npm i

echo "[34mBuilding...[0m"
ng build --prod

echo "[34mCoping files...[0m"
cp -r ~/gestionale/gestionale_angular/front-end/dist/gestionale_angular/* /var/www/gestionale_angular/html/
echo ""

echo "[34mRestart nginx...[0m"
sudo systemctl restart nginx
sudo systemctl status nginx
echo ""
