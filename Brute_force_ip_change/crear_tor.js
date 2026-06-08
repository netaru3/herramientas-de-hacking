#!/usr/bin/env node



import fs from 'fs'



//declaración de variables

let i=0

let port=9052



//codigo ejecutable

while(i<=4){

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

DataDirectory /tmp/tor${i}`); ++i; port=port+2

}
