const os = require('os');
const http = require('http');

// Get the local IP address of the machine
const interfaces = os.networkInterfaces();
const addresses = [];

for (const key in interfaces) {
	for (const iface of interfaces[key]) {
		if (iface.family === 'IPv4' && !iface.internal) {
			addresses.push(iface.address);
		}
	}
}

console.log('Local IP Addresses:', addresses);

// Create a simple HTTP server and get the port it's listening on
const server = http.createServer((req, res) => {
	res.writeHead(200, { 'Content-Type': 'text/plain' });
	res.end('Hello, World!\n');
});

server.listen(0, () => {
	const { port } = server.address();
	console.log(`Server is listening on port ${port}`);
});
