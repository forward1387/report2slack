'use strict';
const _ = require('underscore');

exports.buildBddSlackMessage = (argv, data) => {

    let message = {
        attachments: [
            {
                color: data.failed.count === 0 ? '#36a64f' : '#FF0000',
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
                    },
                    {
                        type: 'section',
                        text: {
                            type: 'mrkdwn',
                            text: `*Test Status:* \n\tPassed: ${data.passed.count}, Failed: ${data.failed.count}, Skipped: ${data.skipped.count}`
                        }
                    }
                ]
            }
        ]
    };

    if(data.failed.count > 0 && argv.failed) {
        message.attachments[0].blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*Failed Tests:*\n\t${_.map(_.keys(data.failed.features), (feature, index) => {
                    return `${index + 1}. ${feature}\n\t\t • ${data.failed.features[feature].join('\n\t\t • ')}`;
                })}`
            }
        });
    }

    if(data.passed.count > 0 && argv.passed) {
        message.attachments[0].blocks.push({
            type: 'section',
            text: {
                type: 'mrkdwn',
                text: `*Passed Tests:*\n\t${_.map(_.keys(data.passed.features), (feature, index) => {
                    return `${index + 1}. ${feature}\n\t\t • ${data.passed.features[feature].join('\n\t\t • ')}`;
                })}`
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

    if(argv.env && JSON.parse(argv.env)) {
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

    console.log(JSON.stringify(message));
    return message;
};