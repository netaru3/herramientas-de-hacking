//-------------importaciones--------------
import fetch from 'node-fetch'
import yargs from 'yargs'
import {hideBin} from 'yargs/helpers'
import { HttpProxyAgent } from 'http-proxy-agent';
import fs from 'fs'
//-------------declaración de variables--------------------
//const agent=new SocksProxyAgent("socks5://127.0.0.1:9050")
const yarg= yargs(hideBin(process.argv)).option("url",{demandOption:false,type:"string"}).option("n",{type:"number",demandOption:false}).option("header",{type:"string"})
.option("body",{type:"string"}).option("method",{type:"string"}).option("wordlist",{type:"string",default:"/usr/share/seclists/Discovery/Web-Content/common.txt"}).parseSync()
let contador=0

let wordlist_de_proxies:any=await fetch("https://cdn.jsdelivr.net/gh/proxifly/free-proxy-list@main/proxies/protocols/http/data.json").then(function(data){return data.json()})
let wordlist_passwords= fs.readFileSync(yarg.wordlist!).toString().split("\n")
let peticiones=0
let i=0
let primer_proxie=0
let url= yarg.url || "http://api.ipify.org?format=json"
let numero_de_peticiones_por_ip= yarg.n || 1

console.log("num:",numero_de_peticiones_por_ip)

let workers=[]
let header= yarg.header || "application/json"
let body:object={}

if(yarg.body){body=JSON.parse(yarg.body)}
let method= yarg.method || "GET"
let proxies_en_uso:any=[]

let array_ips:any=[]

//---------------declaración de funciones------------------

async function bruteForce(agent:any){let a=0
    while(a<numero_de_peticiones_por_ip){
       await fetch(url,{method:method,headers:{"Content-Type":header},agent:agent, signal: AbortSignal.timeout(20000) }).then(function(data){return data.json()}).then(function(data:any){ 
        console.log("tu ip::",data); ++peticiones;
         console.log("peticiones:",peticiones);
         return}).catch(function(){console.log("error")})
       ++a
}}

async function bruteForcebody(agent:any){let a=0
    while(a<numero_de_peticiones_por_ip){
       await fetch(url,{method:method,headers:{"Content-Type":header},body:JSON.stringify(body),agent:agent, signal: AbortSignal.timeout(20000) }).then(function(data){return data.json()}).then(function(data:any){ 
        console.log("tu ip::",data); ++peticiones;
         console.log("peticiones:",peticiones);
         return}).catch(function(){console.log("error")})
       ++a
}}


//--------------codigo--------------------

while(i<=49){
    

 workers.push((async function worker(){let indice=0
  
        for(let proxy of wordlist_de_proxies){
            let indice_real=indice;
            let agent= new HttpProxyAgent(  proxy.proxy );
            let primer_proxie_real=primer_proxie;
             
             if(indice_real>=primer_proxie_real && !proxies_en_uso.includes(proxy.proxy)){

            try{
                proxies_en_uso.push(proxy.proxy);  ++primer_proxie

         if(method==="GET"){   await bruteForce(agent)} else{await bruteForcebody(agent)}

            }catch{console.log("error fuera del then")}
      
        }
         ++indice;
   
    }})())
            ++i; 
  
}




//-----------------código----------------------

await Promise.all(workers)

console.log("fin");

process.exit()
