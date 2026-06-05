Pasos para usar esta herramienta

1: Descargue los archivos en npm: https://www.npmjs.com/package/tornet

2: ponga en la consola: 

node crear_tor.ts

chmod +x /iniciar_tor.sh

./iniciar_tor.sh

3: Una vez haya inicializado tor, solo tiene que usar el comando "node rotar_ip3.ts", use las flags "--url" y "--usuario" para indicar la url y el usuario al que se hará la fuerza bruta, y "-n" para indicar el número de peticiones a hacer antes del rate-limit


aviso: La velocidad promedio de esta herramienta es de 2 peticiones por segundo (bastante lento la verdad), si desea aumentar la velocidad le recomiendo dos opciones, o usar un servicio de proxies con rotación de ip automática (de paga), o use
esta herramienta en varias computadoras (inevitablemente tendrá que manipular el código, suerte)
