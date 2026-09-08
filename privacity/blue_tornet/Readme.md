This tool provides anonymity whit circuits isolate in tor, rotating their IP addresses every 15 seconds.


To install it, download the Docker container:

docker pull netaru3/blue_tornet

and to start it, run:


docker run -p YOUR_PORT:9052 netaru3/blue_tornet



If you want all your web traffic to go through the proxy, just go to Settings, then Network Settings, click Manual proxy configuration, click Socks Host, enter 127.0.0.1 in the first row, and the port you set in Docker in the second row.

