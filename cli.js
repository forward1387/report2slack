#!/usr/bin/env node

const fs = require('fs'),
    path = require('path'),
    superagent = require('superagent');

require('yargs')
    .scriptName('report2slack')
    .usage('$0 <cmd> --file <path to report file> --slack <slack incoming hook>')
    .command('cucumber-html-reporter', 'Sends cucumber html reporter results to slack channel', (yargs) => yargs, (argv) => {
        let fullPath = path.isAbsolute(argv.f) ? argv.f : path.join(__dirname, argv.f);
        if(!fs.existsSync(fullPath)) throw new Error(`Report file '${fullPath}' does not exist.`);

        let message = require('./templates')
          .buildBddSlackMessage(argv, require('./reporters/cucumber.html.reporter')(fullPath));
        
        return superagent
            .post(argv.s)
            .send(message)
            .end((err, res) => {
                if(err) throw new Error(err.message)
                
                console.log(JSON.stringify(res.text)); 
            });
    })
    .option('file', {
        alias: 'f',
        describe: 'path to the cucumber-html-reporter *.json file',
        demandOption: true
    })
    .option('slack', {
        alias: 's',
        describe: 'slack incoming hook',
        demandOption: true
    }).option('passed', {
        describe: 'send passed tests',
        default: false
    }).option('failed', {
        describe: 'send failed tests',
        default: false
    }).option('skipped', {
        describe: 'send skipped tests',
        default: false
    }).option('title', {
        alias: 't',
        describe: 'title of slack message',
        default: 'Test-Automation Results'
    }).option('report', {
        alias: 'r',
        describe: 'url link to detail test reports'
    }).option('env', {
        alias: 'e',
        describe: 'Test environment information as json object: {"url": "https://test.env"}'
    }).boolean(['passed', 'failed', 'skipped'])
    .string(['file', 'slack', 'title', 'report', 'env'])
    .demandCommand(1, 'You need at least one command before moving on')
    .showHelpOnFail(true, 'Specify --help for available options')
    .help()
    .argv;