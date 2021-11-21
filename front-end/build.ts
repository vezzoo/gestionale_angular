const chalk = require('chalk');
import * as pt from 'path';
import * as fs from 'fs';
const { exec } = require('child_process');

async function main() {
  const file = readFile(pt.join(__dirname, 'src', 'assets', 'config.json'));
  let client = JSON.parse(file)?.client;
  if (client) {
    debug(`Found client`, chalk.green(client));
  } else {
    client = 'DEF';
    debug(`No client found! Set default client (` + chalk.green(client) + `).`);
  }

  const configsPath =
    process.argv[2] || /*TODO remove*/ 'C:\\Users\\Luca\\Desktop\\tmp_configs';
  if (!configsPath) {
    throw Error(`No config path provided!`);
  } else if (!readDir(pt.join(configsPath))) {
    throw Error(`The provided path doesn't exists!`);
  } else if (!readDir(pt.join(configsPath, client))) {
    throw Error(`No config folder found!`);
  }

  debug('Removing files...');
  execCmd(`rm -R ~/gestionale/gestionale_angular/front-end/dist/*`);
  execCmd(`rm /var/www/gestionale_angular/*`);

  debug('Pull from git...');
  execCmd('git pull origin main');

  debug('Install dependecies...');
  execCmd('npm i');

  debug('Building...');
  execCmd('ng build --prod');

  debug('Coping files...');
  readDir(pt.join(configsPath)).forEach((folder) => {
    execCmd(
      `cp -r ~/gestionale/gestionale_angular/front-end/dist/gestionale_angular/* /var/www/gestionale_angular/${folder}/html/`
    );
    execCmd(
      `cp ${configsPath}/${client}/FE.json /var/www/gestionale_angular/${folder}/html/assets/config.json`
    );
    // TODO BE
    // execCmd(
    //   `cp ${configsPath}/${client}/FE.json /var/www/gestionale_angular/${folder}/html/assets/config.json`
    // );
  });

  debug('Restart nginx...');
  execCmd('sudo systemctl restart nginx');
  execCmd('sudo systemctl status nginx');
}

main().catch((err) => {
  console.log(chalk.bgRed(chalk.black(`[ERR]`)), err);
});

function debug(...params: string[]) {
  console.log(chalk.bgCyan(chalk.black(`[DBG]`)), ...params);
}

function readDir(path: string): string[] {
  if (fs.existsSync(path)) {
    return fs.readdirSync(path);
  } else {
    return undefined;
  }
}

function readFile(path: string): string {
  if (fs.existsSync(path)) {
    return fs.readFileSync(path).toString();
  } else {
    return undefined;
  }
}

function execCmd(cmd: string) {
  exec(cmd, (err: string, stdout: string, stderr: string) => {
    if (err) throw Error(err);

    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
  });
}
