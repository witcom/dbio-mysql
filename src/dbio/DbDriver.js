/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const {Events} = require("./constant");

class DbDriver {
    constructor(){

    }

    get Events(){
        return Events;
    }

    getConnection(){
        console.warn('Driver getConnection not implement.');
    }

    on(eventName,callback){

    }

    un(key){

    }

    release(){

    }
}

module.exports = DbDriver;