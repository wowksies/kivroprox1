import express from 'express';
import http from 'node:http';
import { createBareServer } from '@tomphttp/bare-server-node';
import cors from 'cors';
import path from "path";
import { hostname } from "node:os";

const server = http.createServer();
const app = express(server);
const __dirname = process.cwd();
const bareServer = createBareServer('/b/');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Route specific requests for files inside public/uv
app.use('/uv', express.static(path.join(__dirname, 'public/uv')));

server.on('request', (req, res) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeRequest(req, res);
    } else {
        app(req, res);
    }
});

server.on('upgrade', (req, socket, head) => {
    if (bareServer.shouldRoute(req)) {
        bareServer.routeUpgrade(req, socket, head);
    } else {
        socket.end();
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// Catch-all for other routes to handle client-side routing if needed
app.get('*', (req, res) => {
    // Only send index.html if it's not a bare request or API call
    if (!req.url.startsWith('/b/') && !req.url.startsWith('/uv/')) {
       res.sendFile(path.join(__dirname, 'public/index.html'));
    }
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    const address = server.address();
    console.log(`Kivro Proxy Running on port ${PORT}`);
});

function shutdown() {
    console.log("SIGTERM signal received: closing HTTP server");
    server.close();
    bareServer.close();
    process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
