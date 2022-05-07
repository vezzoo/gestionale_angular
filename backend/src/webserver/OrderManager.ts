import fs from "fs";
import {SETTING_ORDER_FILE} from "../settings";
import {sleep} from "../_utils";
import {start} from "repl";

export default class OrderManager{
    private current_order_number: number;
    private static instance: OrderManager | null = null;

    private constructor(start_number=0) {

        if (fs.existsSync(SETTING_ORDER_FILE)) {
            console.info(`Loading order number...`)
            this.current_order_number = parseInt(fs.readFileSync(SETTING_ORDER_FILE, {encoding: "utf8"}))
            if(isNaN(this.current_order_number))
                console.warn("Cannot load order number from file, invalid format")
            else
                return
        }

        this.current_order_number = start_number
        this.saveStatus()
    }

    private saveStatus(): Promise<void>{
        return new Promise(resolve => {
            fs.writeFile(SETTING_ORDER_FILE, Buffer.from("" + this.current_order_number), {encoding: "utf8"}, () => {
                resolve()
            })
        })
    }

    public static getInstance(start_number=0){
        if(this.instance === null) this.instance = new OrderManager(start_number)
        return this.instance
    }

    public async reset(value: number){
        this.current_order_number = value
        await this.saveStatus()
    }

    public getOrderNumber(){
        this.current_order_number += 1
        this.saveStatus()
        return this.current_order_number
    }
}