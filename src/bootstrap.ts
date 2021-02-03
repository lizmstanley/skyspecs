const express = require('express');
(() => {
    startServer();
})();

function startServer() {
    const server = express();
    server.listen(3000);
}