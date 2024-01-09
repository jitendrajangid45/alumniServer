
import server from './socket/socket';
import logger from './logger';

const hostname: string = process.env.HOSTNAME || 'localhost';
if (!hostname) throw new Error(`port is ${hostname}`);

const port: number = parseInt(process.env.PORT as string, 10) || 3000;
if (!port) throw new Error(`port is ${port}`);

//important line(setting headers in client)
server.prependListener('request', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
});

server.listen(port, () => {
  logger.info(`Express server is started at http://${hostname}:${port}`);
});

