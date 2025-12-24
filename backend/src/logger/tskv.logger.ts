import { Injectable, LoggerService } from '@nestjs/common';

type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class TskvLogger implements LoggerService {
  private formatMessage(
    level: LogLevel,
    message: unknown,
    optionalParams: unknown[],
  ): string {
    const parts: string[] = [];

    parts.push(`level=${level}`);
    parts.push(`message=${this.toString(message)}`);

    if (optionalParams.length > 0) {
      parts.push(`params=${this.toString(optionalParams)}`);
    }

    parts.push(`timestamp=${new Date().toISOString()}`);

    return parts.join('\t');
  }

  private toString(value: unknown): string {
    if (typeof value === 'string') {
      return value;
    }

    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
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
