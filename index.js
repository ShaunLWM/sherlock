const fs = require('fs');
const async = require('async');
const chalk = require('chalk');
const meow = require('meow');

const networks = {};
fs.readdirSync('./lib/plugins/').forEach(file => {
    let name = file.replace(/\.js/g, '');
    networks[name] = require(`./lib/plugins/${file}`);
});

const sherlock = require('./lib/');
const cli = meow(`
    Usage
        $ node index.js [--file] [--username] [--parallel]

    Options
        --file, -f  parse username from file (each name on a newline)
        --username, -u sherlock a single username
        --parallel, -p number of concurrent sites to check (default: 5)

    Examples
        $ node index.js --username natgeo
        $ node index.js --file "C:\\usernames.txt"

    Note
        either "--file" or "--username" has to be used.
`, {
        flags: {
            file: {
                type: 'string',
                alias: 'f'
            },
            username: {
                type: 'string',
                alias: 'u'
            },
            parallel: {
                type: 'integer',
                alias: 'p'
            }
        }
    });

if (Object.keys(cli['flags']).length < 1) {
    return console.log(cli['help']);
}

let usernames = [];
let limits = 5;
if (typeof cli['flags']['u'] !== 'undefined') {
    usernames = [cli['flags']['u']];
} else if (typeof cli['flags']['f'] !== 'undefined') {
    try {
        let f = fs.readFileSync(cli['flags']['f'], 'utf8');
        usernames = f.split(/\r?\n/);
    } catch (error) {
        console.log(error);
        return console.log('[!] no such file exist.');
    }
} else {
    return console.log(cli['help']);
}

if (typeof cli['flags']['p'] !== 'undefined') {
    limits = parseInt(cli['flags']['p']);
}

if (usernames.length < 1) {
    return console.log(cli['help']);
}

console.log(`[${chalk.green('@')}] ${chalk.green(`${usernames.length} username(s) to check.`)}: ${chalk.red(usernames)}`);
async.eachSeries(usernames, function (username, callback) {
    console.log(`[${chalk.green('*')}] ${chalk.green('Checking username')}: ${chalk.cyan(username)}`);
    async.eachOfLimit(networks, limits, function (value, key, cb) {
        sherlock(username, value, function (error, results) {
            if (results['exists'] === 'yes') {
                console.log(`[${chalk.green('*')}] ${chalk.green(key)} ${results['url_user']}`);
            } else {
                console.log(`[${chalk.red('*')}] ${chalk.red(key)} ${chalk.yellow('Not Found!')} ${results['url_user']}`);
            }

            return cb();
        });
    }, function (err) {
        return callback();
    });
}, function (err) {
    console.log(`[${chalk.green('@')}] ${chalk.green('Done!')}`);
});