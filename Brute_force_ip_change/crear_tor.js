#!/usr/bin/env node



import fs from 'fs'



//declaración de variables

let i=0

let port=9052



//codigo ejecutable

while(i<=4){

    fs.writeFileSync(`/tmp/tor${i}rc`,`SOCKSPort ${port}

ControlPort ${port +1}

DataDirectory /tmp/tor${i}`); ++i; port=port+2

}
