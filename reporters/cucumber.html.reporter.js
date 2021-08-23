'use strict';
const _ = require('underscore');

let summary = {
    passed: {
        count: 0,
        features: {}
    },
    failed: {
        count: 0,
        features: {}
    },
    skipped: {
        count: 0,
        features: {}
    },
    exceptions: []
};

module.exports = (fPath) => {

    let data = {};
    try {
        data = require(fPath);
    } catch(e) {
        summary.exceptions.push(e.message);
    }

    let update = (status, fname, sname) => {
        summary[status].count += 1;
        summary[status].features[fname] || (summary[status].features[fname] = []);
        summary[status].features[fname].push(sname);
        return true;
    }; 

    _.forEach(data, feature => {
        _.forEach(feature.elements, scenario => {
            let isFailed = (_.filter(scenario.steps, step => step.result.status === 'failed')).length > 0;
            let isSkipped = (_.filter(scenario.steps, step => step.result.status === 'skipped')).length > 0;

            (isFailed && update('failed', feature.name, scenario.name)) 
                || (isSkipped && update('skipped', feature.name, scenario.name)) 
                || update('passed', feature.name, scenario.name);
        });
    });

    return summary;
};