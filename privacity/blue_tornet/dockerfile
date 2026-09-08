FROM node:22-bookworm


RUN apt-get update && \
    apt-get install -y tor sudo && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN npm install tornet@1.0.9 -g



WORKDIR /app
COPY blue_tornet.js crear_tor.js package.json ./
RUN npm install





# Copiar el resto del proyecto
EXPOSE 9052

CMD ["sh", "-c", "sudo node crear_tor.js && iniciar_tor 1 && node blue_tornet.js"]
