esta es una herramienta de fuerza bruta usando rotación de ip (concretamente la que brinda la red tor), solo compatible con linux o git bash.

esto NUNCA va a remplazar a un servicio de pago de rotación automática (hay muchos proxies que ofrecen lo mismo que este código pero 30 veces más rápido), esta es solo una opción gratuita que programé, tengan en cuenta eso

Pasos para usar esta herramienta

1: Descargue el paquete usando npm install -g tornet y descargue tor si no lo tienen ya instalado

2: ponga en la consola:

crear_tor

iniciar_tor

3: Una vez haya inicializado tor, solo tiene que usar el comando "tornet", use las flags "--url" para indicar la url, "-n" para indicar el número de peticiones a hacer antes del rate-limit, "--wordlist" para especificar la wordlist que quieres usar, "--body" para indicar el body de la respuesta (cómo string), "--error" para especificar el mensaje de error y "--header" para especificar el header de la respuesta.

¿Cómo debe ser el body?

El body debe tener la variable "contraseña" en el segundo lugar y ser un objeto json tipado como string, por ejemplo el comando: tornet --body '{"username":"usuarioreal123","contraseña":"PASSWD"}'

¿cómo debe ser el header?

en el header solo se tiene que especificar el tipo, por ejemplo: tornet --header "application/json"

aviso: La velocidad promedio de esta herramienta es de 2 peticiones por segundo (bastante lento la verdad), si desea aumentar la velocidad le recomiendo dos opciones, o usar un servicio de proxies con rotación de ip automática (de paga), o use esta herramienta en varias computadoras (inevitablemente tendrá que manipular el código, suerte)
