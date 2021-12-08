#!/bin/bash

declare -a clients=("DEF" "BAR")
declare -a systems=("FE" "BE")

while test $# -gt 0; do
  case "$1" in
    -c)
      shift
      if test $# -gt 0; then
        if [[ ! " ${clients[*]} " =~ " $1 " ]]; then
          echo "Unrecognized client $1"
          exit 0
        else
          declare -a clients=("$1")
        fi
      else
        echo "No client specified"
        exit 1
      fi
      shift
      ;;
    -s)
      shift
      if test $# -gt 0; then
        if [[ ! " ${systems[*]} " =~ " $1 " ]]; then
          echo "Unrecognized system $1"
          exit 0
        else
          declare -a systems=("$1")
        fi
      else
        echo "No system specified"
        exit 1
      fi
      shift
      ;;
    *)
      break
      ;;
  esac
done

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
  if [[ " ${systems[*]} " =~ " FE " ]]; then
    echo "[34mRemoving previous build files...[0m"
    if [ -d "$distDir/*" ]; then
      rm -R "$distDir/*"
    fi
    echo ""

    if [ "$client" == "DEF" ]; then
      href="/"
    else
      href="/${client,,}/"
    fi

    echo "[34mReplacing config files for client $client...[0m"
    cp "$clientConfigsDir"/variables.scss ~/gestionale/gestionale_angular/front-end/src/app/base/style/variables.scss
    cp "$clientConfigsDir"/environment.prod.ts ~/gestionale/gestionale_angular/front-end/src/environments/environment.prod.ts
    echo ""

    echo "[34mBuilding for client $client...[0m"
    ng build --prod --base-href "$href"

    echo "[34mRemoving files for client $client...[0m"
    if [ -d "$clientRootDir/*" ]; then
      rm -R "$clientRootDir/*"
    fi
    echo ""

    echo "[34mCoping front-end files for client $client...[0m"
    mkdir -p "$frontendDir"
    cp -r "$distDir"/gestionale_angular/* "$frontendDir"/
    cp "$clientConfigsDir"/FE.json "$frontendDir"/assets/config.json
    echo ""
  fi

  if [[ " ${systems[*]} " =~ " BE " ]]; then
    echo "[34mCoping back-end files for client $client...[0m"

    if [ -f "$clientConfigsDir/order" ]; then
      rm "$clientConfigsDir/order"
    fi
    if [ -f "$clientConfigsDir/pid" ]; then
      rm "$clientConfigsDir/pid"
    fi
    if [ -f "$clientConfigsDir/root_credentials" ]; then
      rm "$clientConfigsDir/root_credentials"
    fi

    if [ -d "$backendDir" ]; then
      cp "$backendDir"/order "$clientConfigsDir"/order
      cp "$backendDir"/pid "$clientConfigsDir"/pid
      cp "$backendDir"/root_credentials "$clientConfigsDir"/root_credentials
      rm -R "$clientRootDir"/back-end
    else
      echo "0" > "$clientConfigsDir"/order
      touch "$clientConfigsDir"/pid
      touch "$clientConfigsDir"/root_credentials
    fi

    mkdir "$backendDir"
    cp -r ~/gestionale/gestionale_angular/backend/* "$backendDir"/
    cp "$clientConfigsDir"/BE.ts "$backendDir"/src/settings.ts
    cp "$clientConfigsDir"/order "$backendDir"/order
    cp "$clientConfigsDir"/pid "$backendDir"/pid
    cp "$clientConfigsDir"/root_credentials "$backendDir"/root_credentials
    echo ""

    echo "[34mRestarting $client back-end...[0m"
    # Riavviandosi il processo prova a killare il precedente
    bash ~/gestionale/startBackend.sh "$client"
    echo ""
  fi
done
