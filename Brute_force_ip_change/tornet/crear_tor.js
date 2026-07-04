#!/usr/bin/env node



import fs from 'fs'
import path from 'path'

import {execSync } from 'child_process';



//declaración de variables

let i=0

let port=9052



//codigo ejecutable

while(i<=9){
    if(fs.existsSync(`/tmp/tor${i}rc`)){
    fs.unlinkSync(`/tmp/tor${i}rc`);}
    fs.writeFileSync(`/tmp/tor${i}rc`,`SOCKSPort ${port}

ControlPort ${port +1}
# /etc/tor/torrc - Configuración para MÚLTIPLES INSTANCIAS
# (NO la misma que para una sola instancia)

# --- CRÍTICO: Reduce drásticamente el uso de memoria
NumEntryGuards 1                      # ¡Solo 1 guardia por instancia!
MaxClientCircuitsPending 8            # Solo 8 circuitos pendientes
CircuitBuildTimeout 15                # Timeout agresivo

# --- Reduce cachés y buffers
MaxMemInQueues 64 MB                  # Límite de memoria por instancia
MaxCircuitDirtiness 60                # Circuitos duran menos (liberan RAM)

# --- Reduce logs (menos I/O)
Log notice file /dev/null             # Sin logs (ahorra RAM/CPU)
SafeLogging 0

# --- Límites conservadores por instancia
ConnLimit 1024                        # Solo 1024 conexiones

DataDirectory /tmp/tor${i}`,{ mode: 0o666, flag: 'w' }); ++i; port=port+2

}
fs.unlinkSync(`/etc/haproxy/haproxy.cfg`);
fs.writeFileSync("/etc/haproxy/haproxy.cfg",`global
    log /dev/log local0
    log /dev/log local1 notice
    maxconn 4096
    user haproxy
    group haproxy

defaults
    log global
    mode tcp
    option tcplog
    option dontlognull
    timeout connect 5000ms
    timeout client 600000ms
    timeout server 600000ms

# Proxy TCP que escucha en el puerto 16379
frontend tor_proxy
    bind *:16379
    mode tcp
    default_backend tor_servers

# Distribuye las conexiones entre las 5 instancias de Tor
backend tor_servers
    mode tcp
    balance roundrobin
    server tor1 127.0.0.1:9052 check inter 5000 rise 2 fall 3
    server tor2 127.0.0.1:9054 check inter 5000 rise 2 fall 3
    server tor3 127.0.0.1:9056 check inter 5000 rise 2 fall 3
    server tor4 127.0.0.1:9058 check inter 5000 rise 2 fall 3
    server tor5 127.0.0.1:9060 check inter 5000 rise 2 fall 3
    server tor6 127.0.0.1:9062 check inter 5000 rise 2 fall 3
    server tor7 127.0.0.1:9064 check inter 5000 rise 2 fall 3
    server tor8 127.0.0.1:9066 check inter 5000 rise 2 fall 3
    server tor9 127.0.0.1:9068 check inter 5000 rise 2 fall 3
    server tor10 127.0.0.1:9070 check inter 5000 rise 2 fall 3
`)


execSync("sudo systemctl start haproxy")
