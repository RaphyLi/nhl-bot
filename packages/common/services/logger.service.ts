import { Injectable } from '../../core/metadata/injectable.decorator';
import { clc, yellow } from '../util/cli-color';
import { isPlainObject } from '../util/shared';

export interface ILogger {
  log(message: any, context?: string);
  error(message: any, trace?: string, context?: string);
  warn(message: any, context?: string);
  debug?(message: any, context?: string);
  verbose?(message: any, context?: string);
}

@Injectable()
export class Logger implements ILogger {
  constructor(private readonly context?: string) {}

  public log(message: any, context?: string) {
    this.printMessage(message, clc.green, context || this.context);
  }

  public error(message: any, trace: string = '', context?: string) {
    this.printMessage(message, clc.red, context || this.context, 'stderr');
    this.printStackTrace(trace);
  }

  public warn(message: any, context?: string) {
    this.printMessage(message, clc.yellow, context || this.context);
  }

  public debug?(message: any, context?: string) {
    this.printMessage(message, clc.magentaBright, context || this.context);
  }

  public verbose?(message: any, context?: string) {
    this.printMessage(message, clc.cyanBright, context || this.context);
  }

  private printMessage(
    message: any,
    color: (message: string) => string,
    context = '',
    writeStreamType?: 'stdout' | 'stderr'
  ) {
    const contextMessage = context ? yellow(`[${context}] `) : '';
    const output = isPlainObject(message)
      ? `${color(`Object:`)}\n${JSON.stringify(message, null, 2)}\n`
      : color(message);
    const computedMessage = `${color(`[NHL] -`)} ${contextMessage}${output}\n`;

    process[writeStreamType ?? 'stdout'].write(computedMessage);
  }

  private printStackTrace(trace: string) {
    if (!trace) {
      return;
    }
    process.stderr.write(`${trace}\n`);
  }
}
