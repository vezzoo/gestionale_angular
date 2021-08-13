import Database from "./database/database";
import Webserver from "./webserver/Webserver";
import {SETTING_PID_FILE} from "./settings";
import user_endpoint from "./webserver/api/user_endpoint";
import fs from "fs";
import {sleep} from "./_utils";
import UserModel from "./database/models/User.model";


(async function (){

    //create pid file
    if (fs.existsSync(SETTING_PID_FILE) && process.env.NO_STOP_PID !== "true") {
        console.info(`Trying to stop previously running instance (pid)... use env NO_STOP_PID=true to disable`)
        const pid = parseInt(fs.readFileSync(SETTING_PID_FILE, {encoding: "utf8"}))
        console.info(`Sending kill signal to ${pid}`)
        try{ process.kill(pid, "SIGINT") } catch (e){}
        await sleep(1000)
    }
    fs.writeFileSync(SETTING_PID_FILE, Buffer.from("" + process.pid))

    await Database.connect();

    //checking for root
    const root_user = await UserModel.findOne({permissions: "root"}).exec()
    if(!root_user && process.env.NO_ROOT !== "true"){
        console.warn("Cannot find any root user... to prevent root user creation use env NO_ROOT=true")
        const root_psw = Math.random().toString(26).substr(2)

        await new UserModel({username: "root", password: root_psw, permissions: ["root"]}).save()

        fs.writeFileSync("root_credentials", Buffer.from("root : " + root_psw))
        console.warn("Root user credentials sored in current working directory under ./root_credentials")
        console.warn("copy them in a safe place and delete the file")
    }

    const webserver = new Webserver()
        .add(user_endpoint)

    process.on('SIGINT', () => {
        webserver.close()
        Database.disconnect().then(() => {
            process.exit(0)
        })
    });

    await webserver.exec()
})()