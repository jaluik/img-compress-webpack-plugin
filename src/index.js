const fs = require("fs")
const https = require("https")
const url = require("url")
const chalk = require("chalk")
const figures = require("figures")
const {randomHeader} = require("../util/setting")
const { threeEighths } = require("figures")

module.exports = class ImgCompressPlugin {
    constructor(opts){
        this.opts = opts
    }

    apply(compiler){}
    async compressImg(assets, path){
        try{
            const file = assets[path].source()
            const obj = await this.uploadImg(file)


        }catch(err){
            const msg = `${figures.cross} Compressed [${chalk.yellowBright(path)}] failed: ${chalk.redBright(err)}`
            return Promise.resolve(msg)
        }
    }
    uploadImg(file){
        const opts = randomHeader()
        return new Promise((resolve, reject) => {
            const req = https.request(opts, res => {
                res.on("data", (data) => {
                    const obj = JSON.stringify(data.toString())
                    obj.error ? reject(obj.message) : resolve(obj)
                })
            })
            req.write(file, "binary")
            req.on("error", err=> {
                reject(err)
            })
            req.end()
        })
    }
    downloadImg(address){
        const opts = new url.URL(address)
        return new Promise((resolve, reject) => {
            const req = https.request(opts, res => {
                let file=""
                res.setEncoding("binary");
                res.on("data", chunk => file += chunk)
                res.on("end", () => resolve(file))
            })
            req.on("error", (error) => reject("error"))
            req.end()
        })
    }
}