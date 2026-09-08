#!/usr/bin/env node



 //-------------importaciones--------------


import { SocksProxyAgent } from 'socks-proxy-agent'

import net from 'net'




    

//-------------declaración de variables--------------------







//-----------codigo-------------

console.log("se está ejecutando blue tornet")


    let ID1= setInterval(() => {
        
            const socket= net.connect(9053,"127.0.0.1")

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
    , 15000);

       
