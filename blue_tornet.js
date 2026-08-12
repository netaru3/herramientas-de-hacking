#!/usr/bin/env node



 //-------------importaciones--------------


import { SocksProxyAgent } from 'socks-proxy-agent'

import net from 'net'




    

//-------------declaración de variables--------------------

let control_ports=["9053","9055","9057","9059","9061"]


const agent = new SocksProxyAgent('socks5://127.0.0.1:16379')




//-----------codigo-------------

console.log("se está ejecutando blue tornet")


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

       
