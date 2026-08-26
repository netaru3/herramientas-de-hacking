This tool provides anonymity by routing all traffic through 5 Tor instances, rotating their IP addresses every 15 seconds.

With this tool, all your traffic will be split into 5 streams, making you virtually untraceable.

To install it, download the Docker container:

docker pull netaru3/blue_tornet

and to start it, run:


docker run -p YOUR_PORT:16379 netaru3/blue_tornet



If you want all your web traffic to go through the proxy, just go to Settings, then Network Settings, click Manual proxy configuration, click Socks Host, enter 127.0.0.1 in the first row, and the port you set in Docker in the second row.

Translated with DeepL.com (free version)
