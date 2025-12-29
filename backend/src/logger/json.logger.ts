import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class JsonLogger implements LoggerService {
  private formatMessage(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ) {
    return JSON.stringify({
      level,
      message,
      optionalParams,
      timestamp: new Date().toISOString(),
    });
  }

  log(message: unknown, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  error(message: unknown, ...optionalParams: unknown[]) {
    console.error(this.formatMessage('error', message, optionalParams));
  }

  warn(message: unknown, ...optionalParams: unknown[]) {
    console.warn(this.formatMessage('warn', message, optionalParams));
  }

  debug(message: unknown, ...optionalParams: unknown[]) {
    console.debug(this.formatMessage('debug', message, optionalParams));
  }

  verbose(message: unknown, ...optionalParams: unknown[]) {
    console.info(this.formatMessage('verbose', message, optionalParams));
  }
}
