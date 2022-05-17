import * as fs from "fs";
import {SETTING_PID_FILE, SETTING_PRINTERS} from "./settings";
import {sleep} from "./_utils";
import Webserver from "./webserver/Webserver";
import Printer from "./webserver/printers/Printer";
import status_endpoint from "./webserver/api/status_endpoint";


(async function (){
    process.env.TZ = 'Europe/Rome'
    const d = new Date();
    const day = `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    const time = `${d.getHours()}:${d.getMinutes()}.${d.getSeconds()}`;

    console.info(`Start date: ${day} ${time}`);

    //create pid file
    if (fs.existsSync(SETTING_PID_FILE) && process.env.NO_STOP_PID !== "true") {
        console.info(`Trying to stop previously running instance (pid)... use env NO_STOP_PID=true to disable`)
        const pid = parseInt(fs.readFileSync(SETTING_PID_FILE, {encoding: "utf8"}))
        console.info(`Sending kill signal to ${pid}`)
        try{ process.kill(pid, "SIGINT") } catch (e){}
        await sleep(1000)
    }
    fs.writeFileSync(SETTING_PID_FILE, Buffer.from("" + process.pid))

    const webserver = new Webserver().add(status_endpoint)
    SETTING_PRINTERS.forEach((e: any) => webserver.add(Printer(e.name, e.printer, e.title)))

    process.on('SIGINT', () => {
        webserver.close()
    });

    await webserver.exec()
})()