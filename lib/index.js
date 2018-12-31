const request = require('request');
const chalk = require('chalk');

module.exports = function (username, network, callback) {
    let results = {};
    if (typeof network['regexCheck'] !== 'undefined') {
        let re = new RegExp(network['regexCheck'], 'g');
        if (!re.test(username)) {
            console.error(`[${chalk.red('!')}] ${chalk.redBright(`illegal username format for`)} ${chalk.cyan(network['urlMain'])}`);
            results['exists'] = 'illegal';
        }
    }

    let urlToCheck = network['url'].replace(/{}/g, username);
    results['url_user'] = urlToCheck;
    let errorType = network['errorType'];
    if (typeof results['exists'] !== 'undefined') {
        return callback(null, results);
    }

    requestPage(urlToCheck, function (error, response, body) {
        if (error) {
            return callback(`internal error ${error}`);
        }

        let exists = 'yes';
        switch (errorType) {
            case 'message':
                let errorMessage = network['errorMsg'];
                if (body.includes(errorMessage)) {
                    exists = 'no';
                }

                break;
            case 'status_code':
                if (response.statusCode === 404) {
                    exists = 'no';
                }
                break;
            case 'response_url':
                let errorUrl = network['errorUrl'];
                let redirectedUrl = response['request']['uri']['href'];
                if (redirectedUrl.includes(errorUrl)) {
                    exists = 'no';
                }

                break;
            default:
                exists = 'error';
                break;
        }

        results['exists'] = exists;
        results['http_status'] = response.statusCode;
        results['response_text'] = body;
        return callback(null, results);
    });
}

function requestPage(url, callback) {
    const options = {
        url,
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36'
        }
    };

    return request(options, callback);
}