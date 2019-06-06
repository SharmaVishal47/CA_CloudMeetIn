const app = require('./backend/app');
const http = require('http');
const port = process.env.port || 50000;
const server = http.createServer(app);
const onError = error =>{
  // console.log(error);
};
const onListening =()=>{
  const addr = server.address();
  const bind = typeof addr=== 'string' ? 'Pipe'+addr : 'Port'+port;
  // console.log('Bind....... ',bind);
};
server.on('error',onError);
server.on('listening',onListening);
server.listen(port);
