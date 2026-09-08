#!/usr/bin/env node



import fs from 'fs'




//declaración de variables

let i=0

let port=9052



//codigo ejecutable

while(i<=9){
    if(fs.existsSync(`/tmp/tor${i}rc`)){
    fs.unlinkSync(`/tmp/tor${i}rc`);}
    fs.writeFileSync(`/tmp/tor${i}rc`,`SOCKSPort 0.0.0.0:${port} IsolateDestAddr

ControlPort 127.0.0.1:${port +1}
CookieAuthentication 0
# /etc/tor/torrc - Configuración para MÚLTIPLES INSTANCIAS
# (NO la misma que para una sola instancia)

# --- CRÍTICO: Reduce drásticamente el uso de memoria
NumEntryGuards 1                      # ¡Solo 1 guardia por instancia!
MaxClientCircuitsPending 8            # Solo 8 circuitos pendientes
CircuitBuildTimeout 15                # Timeout agresivo

# --- Reduce cachés y buffers
MaxMemInQueues 64 MB                  # Límite de memoria por instancia
MaxCircuitDirtiness 60                # Circuitos duran menos (liberan RAM)


# --- Límites conservadores por instancia
ConnLimit 1024                        # Solo 1024 conexiones

DataDirectory /tmp/tor${i}`,{ mode: 0o666, flag: 'w' }); ++i; port=port+2

}



