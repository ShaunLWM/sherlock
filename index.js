const fs = require('fs');
const async = require('async');
const chalk = require('chalk');

const networks = JSON.parse(fs.readFileSync('./lib/data.json'));
const sherlock = require('./lib/');

let usernames = ['natgeo', 'someonethatdoesntexist', '50me!illeg@lN@m3'];
async.eachSeries(usernames, function (username, callback) {
    console.log(`[${chalk.green('*')}] ${chalk.green('checking username')}: ${chalk.cyan(username)}`);
    async.eachOfLimit(networks, 5, function (value, key, cb) {
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

});