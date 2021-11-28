#!/bin/bash

declare -a clients=("DEF" "BAR")

echo "[34mPull from git...[0m"
git pull origin main
echo ""

for client in "${clients[@]}" ; do
  # variables declarations
  distDir=~/gestionale/gestionale_angular/front-end/dist
  clientRootDir=/var/www/gestionale_angular/"$client"
  frontendDir=/var/www/gestionale_angular/"$client"/front-end
  backendDir=/var/www/gestionale_angular/"$client"/back-end
  clientConfigsDir=~/gestionale/configs/"$client"

  # build process
  echo "[34mRemoving previous build files...[0m"
  if [ -d "$distDir"/* ]; then
    rm -R "$distDir"/*
  fi
  echo ""

  if [ "$client" == "DEF" ]; then
    href="/"
  else
    href="/${client,,}/"
  fi

  echo "[34mBuilding for client $client...[0m"
  ng build --prod --base-href "$href"

  echo "[34mRemoving files for client $client...[0m"
  if [ -d "$clientRootDir"/* ]; then
    rm -R "$clientRootDir"/*
  fi
  echo ""

  echo "[34mCoping front-end files for client $client...[0m"
  mkdir -p "$frontendDir"
  cp -r "$distDir"/gestionale_angular/* "$frontendDir"/
  cp "$clientConfigsDir"/FE.json "$frontendDir"/assets/config.json

  echo "[34mCoping back-end files for client $client...[0m"
  if [ -d "$backendDir" ]; then
    cp "$backendDir"/order "$clientConfigsDir"/order
    cp "$backendDir"/pid "$clientConfigsDir"/pid
    rm -R "$clientRootDir"/back-end
  else
    echo "0" > "$clientConfigsDir"/order
    touch "$clientConfigsDir"/pid
  fi

  mkdir "$backendDir"
  cp -r ~/gestionale/gestionale_angular/backend/* "$backendDir"/
  cp "$clientConfigsDir"/BE.ts "$backendDir"/src/settings.ts
  cp "$clientConfigsDir"/order "$backendDir"/order
  cp "$clientConfigsDir"/pid "$backendDir"/pid
  echo ""

  echo "[34mRestarting $client back-end...[0m"
  # Riavviandosi il processo prova a killare il precedente
  ~/gestionale/startBackend.sh "$client"
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
