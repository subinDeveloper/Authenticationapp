import express from "express"
import authRotes from "./routes/authRotes.js"
// import crypto from "crypto"
import cookieParser from "cookie-parser"
import path from "path"
import { fileURLToPath } from "url"

const __fileName = fileURLToPath(import .meta.url)
const __dirname = path.dirName(__fileName)

const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname,"../client/build")))

//routes
app.use("/api/v1/auth",authRotes)

//secret key 
// const key = crypto.randomBytes(64).toString("hex")
// console.log(key);


app.use("*",function(req,res){

res.sendFile(path.json(__dirname,"../client/build/index.html"))
})

export default app