import { Platform } from 'react-native';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogConfig {
    enabled: boolean;
    minLevel: LogLevel;
    includeTimestamp: boolean;
    includePlatform: boolean;
}

class Logger {
    private static instance: Logger;
    private config: LogConfig = {
        enabled: true,
        minLevel: 'debug',
        includeTimestamp: true,
        includePlatform: true,
    };

    private constructor() {}

    static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    configure(config: Partial<LogConfig>) {
        this.config = { ...this.config, ...config };
    }

    private shouldLog(level: LogLevel): boolean {
        if (!this.config.enabled) return false;

        const levels: Record<LogLevel, number> = {
            debug: 0,
            info: 1,
            warn: 2,
            error: 3,
        };

        return levels[level] >= levels[this.config.minLevel];
    }

    private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
        const parts: string[] = [];

        if (this.config.includeTimestamp) {
            parts.push(`[${new Date().toISOString()}]`);
        }

        if (this.config.includePlatform) {
            parts.push(`[${Platform.OS}]`);
        }

        parts.push(`[${level.toUpperCase()}]`);
        parts.push(message);

        return parts.join(' ');
    }

    debug(message: string, ...args: any[]) {
        if (this.shouldLog('debug')) {
            console.debug(this.formatMessage('debug', message), ...args);
        }
    }

    info(message: string, ...args: any[]) {
        if (this.shouldLog('info')) {
            console.info(this.formatMessage('info', message), ...args);
        }
    }

    warn(message: string, ...args: any[]) {
        if (this.shouldLog('warn')) {
            console.warn(this.formatMessage('warn', message), ...args);
        }
    }

    error(message: string, ...args: any[]) {
        if (this.shouldLog('error')) {
            console.error(this.formatMessage('error', message), ...args);
        }
    }
}

export const logger = Logger.getInstance();

// Configure logger based on environment
if (__DEV__) {
    logger.configure({
        enabled: true,
        minLevel: 'debug',
        includeTimestamp: true,
        includePlatform: true,
    });
} else {
    logger.configure({
        enabled: false,
        minLevel: 'error',
        includeTimestamp: false,
        includePlatform: false,
    });
} 