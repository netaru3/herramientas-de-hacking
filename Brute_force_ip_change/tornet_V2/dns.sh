#!/bin/bash

DOMAIN=$1

# Verificar si el dominio ya está en /etc/hosts
if ! grep -q "$DOMAIN" /etc/hosts; then
    echo "🔍 El dominio $DOMAIN no está en /etc/hosts. Agregando..."
    
    # Resolver DNS
    IP=$(dig +short "$DOMAIN" | head -1)
    
    if [ -n "$IP" ]; then
        echo "$IP $DOMAIN" | sudo tee -a /etc/hosts > /dev/null
        echo "✅ $DOMAIN agregado a /etc/hosts con IP $IP"
    else
        echo "❌ No se pudo resolver el dominio $DOMAIN"
    fi
else
    echo "✅ El dominio $DOMAIN ya está en /etc/hosts"
fi