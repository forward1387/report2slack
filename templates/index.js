'use strict';
const _ = require('underscore');

exports.buildBddSlackMessage = (argv, data) => {

    let message = {
        attachments: [
            {
                color: (data.failed.count === 0 && _.isEmpty(data.exceptions)) ? '#36a64f' : '#FF0000',
                blocks: [
                    {
                        type: 'header',
                        text: {
                            type: 'plain_text',
                            text: argv.title
                        }
                    },
                    {
                        type: 'divider'
                    }
                ]
            }
        ]
    };


    if (_.isEmpty(data.exceptions)) {
        message.attachments[0].blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*Test Status:* \n\tPassed: ${data.passed.count}, Failed: ${data.failed.count}, Skipped: ${data.skipped.count}`
            }
        });

        if (data.failed.count > 0 && argv.failed) {
            let scenarios = [];

            let index = 0;
            let total = 0;
            _.each(_.keys(data.failed.features), (feature) => {
                _.each(data.failed.features[feature], (scenario) => {
                    let description = `\t${index + 1}. Scenario: ${scenario}\n`;

                    total += description.length;

                    if (total < 9700) {
                        index += 1;
                        scenarios.push(description);
                    }
                });
            });

            message.attachments[0].blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Failed Scenarios:*\`\`\`\n${scenarios.join('')}\`\`\``
                }
            });
        }

        if (data.passed.count > 0 && argv.passed) {

            let scenarios = [];

            let index = 0;
            let total = 0;
            _.each(_.keys(data.passed.features), (feature) => {
                _.each(data.passed.features[feature], (scenario) => {
                    let description = `\t${index + 1}. Scenario: ${scenario}\n`;

                    total += description.length;

                    if (total < 9700) {
                        index += 1;
                        scenarios.push(description);
                    }
                });
            });


            message.attachments[0].blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Passed Scenarios:*\`\`\`\n${scenarios.join('')}\`\`\``
                }
            });
        }

        if (data.skipped.count > 0 && argv.skipped) {

            let scenarios = [];

            let index = 0;
            let total = 0;
            _.each(_.keys(data.skipped.features), (feature) => {
                _.each(data.skipped.features[feature], (scenario) => {
                    let description = `\t${index + 1}. Scenario: ${scenario}\n`;

                    total += description.length;

                    if (total < 9700) {
                        index += 1;
                        scenarios.push(description);
                    }
                });
            });


            message.attachments[0].blocks.push({
                type: 'section',
                text: {
                    type: 'mrkdwn',
                    text: `*Skipped Scenarios:*\`\`\`\n${scenarios.join('')}\`\`\``
                }
            });
        }

        if (argv.r) {
            message.attachments[0].blocks.push({
                type: 'section',
                fields: [
                    {
                        type: 'mrkdwn',
                        text: `*Report:* <${argv.r}|Link>`
                    }
                ]
            });
        }

        if (argv.env && JSON.parse(argv.env)) {
            let env = JSON.parse(argv.env);
            let fields = [
                {
                    type: 'mrkdwn',
                    text: '*Environment:*'
                },
                {
                    type: 'mrkdwn',
                    text: ' '
                }
            ];

            _.forEach(_.keys(env), key => {
                fields.push({
                    type: 'mrkdwn',
                    text: `${key}:`
                });

                fields.push({
                    type: 'mrkdwn',
                    text: env[key]
                });
            });

            message.attachments[0].blocks.push({
                type: 'section',
                fields: fields
            });
        }
    } else {
        message.attachments[0].blocks.push({
            type: 'section',
            fields: [{type: 'mrkdwn', text: 'Errors: '}, {type: 'mrkdwn', text: data.exceptions.join('\n')}]
        });
    }

    return message;
};