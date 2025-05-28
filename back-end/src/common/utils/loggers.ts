import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import * as winston from 'winston';

const env = process.env.NODE_ENV || 'development';

export const winstonLogger = winston.createLogger({
   level: env === 'development' ? 'debug' : 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [new winston.transports.Console()],
});