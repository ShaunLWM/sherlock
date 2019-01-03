const fs = require('fs');
const async = require('async');
const chalk = require('chalk');
const meow = require('meow');
const sherlock = require('./lib/');

const networks = {};
fs.readdirSync('./lib/plugins/').forEach(file => {
    let name = file.replace(/\.js/g, '');
    networks[name] = require(`./lib/plugins/${file}`);
});

let ignored = ['9gag', 'instagram'];
_.filter(users, function(o) { return !o.active; });