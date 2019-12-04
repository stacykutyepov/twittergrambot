const path = require('path');
const { createLogger, format, transports } = require('winston');
require('winston-daily-rotate-file');

const { combine, colorize, timestamp, simple } = format;

function getTransports(logsDir, level) {
    if (process.env.NODE_ENV === 'production') {
        return [
            new (transports.DailyRotateFile)({
                filename: `${logsDir}/%DATE%-${level}.log`,
                datePattern: 'YYYY-MM-DD-HH',
                zippedArchive: true,
                maxSize: '20m',
                maxFiles: '14d'
            })
        ]
    }
    return [new transports.Console()];
}

function getFormat() {
    return combine(
        colorize(),
        timestamp(),
        simple(),
    );
}

function getOptions(level, whoami) {
    return {
        level,
        format: getFormat(),
        defaultMeta: { service: path.relative(require.main.path, whoami) },
        transports: getTransports(path.resolve(`${require.main.path}/../logs`), level)
    }
}

function Logger(whoami) {
    const errorLogger = createLogger(getOptions('error', whoami));
    const infoLogger = createLogger(getOptions('info', whoami));
    return {
        info: infoLogger.info.bind(infoLogger),
        error: errorLogger.error.bind(errorLogger),
    }
}

module.exports = Logger;
