#!/bin/bash

declare -a clients=("DEF" "BAR")

echo "[34mPull from git...[0m"
git pull origin main
echo ""

for client in "${clients[@]}" ; do
  echo "[34mRemoving previous build files...[0m"
  distDir=~/gestionale/gestionale_angular/front-end/dist/*
  if [ -d "$distDir" ]; then
    rm -R "$distDir"
  fi
  echo ""

  if [ "$client" == "DEF" ]; then
    href="/"
  else
    href="/${client,,}/"
  fi

  echo "[34mBuilding for client $client...[0m"
  ng build --prod --base-href "$href"

  echo "[34mRemoving nginx files for client $client...[0m"
  nginxClientDir=/var/www/gestionale_angular/"$client"/*
  if [ -d "$nginxClientDir" ]; then
    rm -R "$nginxClientDir"
  fi
  echo ""

  echo "[34mCoping front-end files for client $client...[0m"
  mkdir -p /var/www/gestionale_angular/"$client"/front-end
  cp -r ~/gestionale/gestionale_angular/front-end/dist/gestionale_angular/* /var/www/gestionale_angular/"$client"/front-end/
  cp ~/gestionale/configs/"$client"/FE.json /var/www/gestionale_angular/"$client"/front-end/assets/config.json

  echo ""
done

echo "[34mCleaning /var/www/gestionale_angular...[0m"
for dir in /var/www/gestionale_angular/*/ ; do
  cleanedDir="${dir::-1}"
  d="${cleanedDir##*/}"
  if [[ ! "${clients[*]}" =~ "$d" ]]; then
    echo "[34mFound '$d' directory. Removing it...[0m"
    rm -R "$dir"
    echo ""
  fi
done
echo ""
