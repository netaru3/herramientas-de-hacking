import mongoose from 'mongoose'
import dotenv from 'dotenv'
dotenv.config()
await mongoose.connect(process.env.MONGO)


let esquema= new mongoose.Schema({ip_real: String, ip_registrada: String, fecha: Date})



export let ip=mongoose.model('ip',esquema)

