const http = require("http")

const hostname = '0.0.0.0';
const port = 10000

const server = http.createServer((req,res) => {
     res.statusCode = 200;
     res.setHeader('Content-Type', 'text/plain');
     res.end('Bot is running')
});

function keepAlive() {
  server.listen(port, () => {
    console.log('Server running')
  });
}

module.exports = keepAlive