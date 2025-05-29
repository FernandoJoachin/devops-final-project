import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';
import { ElasticsearchTransport } from 'winston-elasticsearch';

const env = process.env.NODE_ENV || 'development';

const transports: winston.transport[] = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
];

if (env !== 'test') {
  const esTransport = new ElasticsearchTransport({
    level: env === 'development' ? 'debug' : 'info',
    clientOpts: {
      node: process.env.ELASTIC_URL || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTIC_USER || '',
        password: process.env.ELASTIC_PASS || '',
      },
    },
    indexPrefix: 'nestjs-logs',
  });

  esTransport.on('error', (err) => {
    console.error('❌ Error en ElasticsearchTransport:', err);
  });

  transports.push(esTransport);
}

export const winstonLogger = winston.createLogger({
  level: env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json() 
  ),
  transports,
});