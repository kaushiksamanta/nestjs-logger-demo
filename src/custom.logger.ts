import * as clc from 'cli-color';
import { Injectable, Optional, LoggerService } from '@nestjs/common';
import { isObject } from 'util';

declare const process: any;
const yellow = clc.xterm(3);

export type LogLevel = 'log' | 'error' | 'warn' | 'debug' | 'verbose';

@Injectable()
export class CustomLogger implements LoggerService {
    private static logLevels: LogLevel[] = [
        'log',
        'error',
        'warn',
        'debug',
        'verbose',
    ];
    private static lastTimestamp?: number;
    private static instance?: typeof CustomLogger | LoggerService = CustomLogger;
    private static prefix: string;

    constructor(
        @Optional() private readonly context?: string,
        @Optional() private readonly isTimestampEnabled = true,
    ) {
    }

    error(message: any, trace = '', context?: string) {
        const instance = this.getInstance();
        if (!this.isLogLevelEnabled('error')) {
            return;
        }
        // tslint:disable-next-line: no-unused-expression
        instance &&
            instance.error.call(instance, message, trace, context || this.context);
    }

    log(message: any, context?: string) {
        this.callFunction('log', message, context);
    }

    warn(message: any, context?: string) {
        this.callFunction('warn', message, context);
    }

    debug(message: any, context?: string) {
        this.callFunction('debug', message, context);
    }

    verbose(message: any, context?: string) {
        this.callFunction('verbose', message, context);
    }

    static setGlobalPrefix(prefix: string) {
        CustomLogger.prefix = prefix;
    }

    static overrideLogger(logger: LoggerService | LogLevel[] | boolean) {
        if (Array.isArray(logger)) {
            this.logLevels = logger;
            return;
        }
        this.instance = isObject(logger) ? (logger as LoggerService) : undefined;
    }

    static log(message: any, context = '', isTimeDiffEnabled = true) {
        this.printMessage('log', message, clc.green, context, isTimeDiffEnabled);
    }

    static error(
        message: any,
        trace = '',
        context = '',
        isTimeDiffEnabled = true,
    ) {
        this.printMessage('error', message, clc.red, context, isTimeDiffEnabled);
        this.printStackTrace(trace);
    }

    static warn(message: any, context = '', isTimeDiffEnabled = true) {
        this.printMessage('warn', message, clc.yellow, context, isTimeDiffEnabled);
    }

    static debug(message: any, context = '', isTimeDiffEnabled = true) {
        this.printMessage('debug', message, clc.magentaBright, context, isTimeDiffEnabled);
    }

    static verbose(message: any, context = '', isTimeDiffEnabled = true) {
        this.printMessage('verbose', message, clc.cyanBright, context, isTimeDiffEnabled);
    }

    private callFunction(
        name: LogLevel,
        message: any,
        context?: string,
    ) {
        if (!this.isLogLevelEnabled(name)) {
            return;
        }
        const instance = this.getInstance();
        const func = instance && (instance as typeof CustomLogger)[name];
        // tslint:disable-next-line: no-unused-expression
        func &&
            func.call(
                instance,
                message,
                context || this.context,
                this.isTimestampEnabled,
            );
    }

    private getInstance(): typeof CustomLogger | LoggerService {
        const { instance } = CustomLogger;
        return instance === this ? CustomLogger : instance;
    }

    private isLogLevelEnabled(level: LogLevel): boolean {
        return CustomLogger.logLevels.includes(level);
    }

    private static printMessage(
        name: LogLevel,
        message: any,
        color: (message: string) => string,
        context: string = '',
        isTimeDiffEnabled?: boolean,
    ) {
        const output = isObject(message)
            ? `${color('Object:')}\n${JSON.stringify(message, null, 2)}\n`
            : color(message);

        const localeStringOptions = {
            year: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            day: '2-digit',
            month: '2-digit',
        };
        const timestamp = new Date(Date.now()).toLocaleString(
            undefined,
            localeStringOptions,
        );
        process.stdout.write(color(`[${this.prefix || 'Nest'}] [${name}] ${process.pid}   - `));
        process.stdout.write(`${timestamp}   `);

        // tslint:disable-next-line: no-unused-expression
        context && process.stdout.write(yellow(`[${context}] `));
        process.stdout.write(output);

        this.printTimestamp(isTimeDiffEnabled);
        process.stdout.write(`\n`);
    }

    private static printTimestamp(isTimeDiffEnabled?: boolean) {
        const includeTimestamp = CustomLogger.lastTimestamp && isTimeDiffEnabled;
        if (includeTimestamp) {
            process.stdout.write(yellow(` +${Date.now() - CustomLogger.lastTimestamp}ms`));
        }
        CustomLogger.lastTimestamp = Date.now();
    }

    private static printStackTrace(trace: string) {
        if (!trace) {
            return;
        }
        process.stdout.write(trace);
        process.stdout.write(`\n`);
    }
}
