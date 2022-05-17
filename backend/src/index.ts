import Webserver from "./webserver/Webserver";
import {SETTING_MONGO_URL, SETTING_PID_FILE} from "./settings";
import user_endpoint from "./webserver/api/user_endpoint";
import fs from "fs";
import {sleep} from "./_utils";
import UserModel from "./database/models/User.model";
import storage_endpoint from "./webserver/api/storage_endpoint";
import Database from "./database/wrapper/Database";
import settings_endpoint from "./webserver/api/settings_endpoint";
import order_endpoint from "./webserver/api/order_endpoint";
import OrderManager from "./webserver/OrderManager";


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

    OrderManager.getInstance(1)

    await Database.connect(SETTING_MONGO_URL);

    //checking for root
    const root_user = await UserModel.findOne({permissions: "root"}) as UserModel
    if(!root_user && process.env.NO_ROOT !== "true"){
        console.warn("Cannot find any root usr... to prevent root usr creation use env NO_ROOT=true")
        const root_psw = Math.random().toString(26).substr(2)

        await new UserModel("root", root_psw, ["root"]).save()

        fs.writeFileSync("root_credentials", Buffer.from("root : " + root_psw))
        console.warn("Root usr credentials sored in current working directory under ./root_credentials")
        console.warn("copy them in a safe place and delete the file")
    }
    const webserver = new Webserver()
        .add(settings_endpoint)
        .add(user_endpoint)
        .add(storage_endpoint)
        .add(order_endpoint)

    process.on('SIGINT', () => {
        webserver.close()
        Database.disconnect().then(() => {
            process.exit(0)
        })
    });
    await webserver.exec()
})()