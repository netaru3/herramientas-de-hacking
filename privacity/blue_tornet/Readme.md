Esta es una herramienta que brinda anonimato haciendo que todo el tráfico pase por 5 instancias de tor, rotando sus IPs cada 15 segundos.

Con esta herramienta todo tu tráfico se dividirá en 5, haciéndote prácticamente irrastreable.

Para instalarlo, descarga el contenedor de docker:

docker pull netaru3/blue_tornet

y para iniciarlo haz:


docker run -p TU_PUERTO:16379 netaru3/blue_tornet



Si quieres que todo tu tráfico web pase por el navegador, solo ve a settings, después a Network settings, dale click a Manual proxy configuration, dale click a Socks Host, en la primera fila pon: 127.0.0.1, y en la segunda el puerto que pusiste en docker


