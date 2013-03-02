'use strict';

var spawn = require('child_process').spawn;

module.exports = function (task) {
    task
    .id('run')
    .name('Run')
    .description('Run command just like it was run from the command line.')
    .author('Indigo United')

    .option('cmd', 'The command you want to execute.')
    .option('cwd', 'Current working directory of the child process.', process.cwd())

    .do(function (opt, ctx, next) {
        var child,
            output = '',
            onData;

        if (process.platform === 'win32') {
            child = spawn('cmd', ['/s', '/c', opt.cmd], { cwd: opt.cwd });
        } else {
            child = spawn('sh', ['-c', opt.cmd], { cwd: opt.cwd });
        }

        ctx.log.writeln('Running: '.green + opt.cmd + '\n');

        onData = function (data) {
            // Buffer the response until we find a new line
            output += data.toString();

            var pos = output.lastIndexOf('\n');
            if (pos !== -1) {
                // If there is a new line in the buffer, output it
                ctx.log.writeln(output.substr(0, pos));
                output = output.substr(pos + 1);
            }
        };

        child.stdout.on('data', onData);
        child.stderr.on('data', onData);

        child.on('exit', function (code) {
            // Log the remaining buffer
            if (output) {
                ctx.log.writeln(output);
            }

            if (code === 0) {
                return next();
            }

            next(new Error('Error running command: ' + opt.cmd));
        });
    });
};