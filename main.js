import express, { Router } from 'express'
import cors from 'cors'
import fs from 'fs'

const http = new express()
const app = Router()

app.use(cors())
app.use(express.urlencoded({ extended: false }));
app.use(express.json())

const dataFileUrl = './bin/data.json'

http.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json")
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:6085");
    next()
})

//a config pkg
//set config
//get config

//get config
app.get("/load", (req, res) => {
    fs.readFile(dataFileUrl, "utf8", (err, files) => {
        if (err) { throw err }
        else {
            const datas = JSON.parse(files)
            console.log("[ea-overlay]: [config loaded]")
            res.json({"status": 200, "config": datas})
        }
    })
})



//set config
app.post("/store", (req, res) => {
    const newConfig = req.body
    fs.readFile(dataFileUrl, "utf8", (err, files) => {
        if (err) {
            throw err 
        } else {
            const oldConfig = JSON.parse(files)
            const config = {
                ...oldConfig, ...newConfig
            }

            const datas = JSON.stringify(config, null, 2)
            fs.writeFile(dataFileUrl, datas, "utf8", (err, _) => {
                if (err) {
                    throw err
                }
                console.log("[ea-overlay]: [config changed]")
                res.json({"status": 200, "message": "config changed"})
            })
        }
    })
})



const port = process.env.PORT || 9085

http.use("/api/", app)

http.listen(port, (err, _) => {
    if (err) {
        throw err
    }

    console.log(`[ea-overlay]: [bin running:${port}]`)
})