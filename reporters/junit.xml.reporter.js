'use strict';
const _ = require('underscore');
const fs = require('fs');
const parser = require('xml2json');

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
    let jUnitXmlStr = fs.readFileSync(fPath, 'utf-8');
    const results = parser.toJson(jUnitXmlStr, {
        object: true,
        arrayNotation: true
    });

    let update = (status, fname, sname) => {
        summary[status].count += 1;
        summary[status].features[fname] || (summary[status].features[fname] = []);
        summary[status].features[fname].push(sname);
        return true;
    };

    _.each(results.testsuites[0].testsuite, ts => {
        if (Number(ts.tests) > 0) {
            _.each(ts.testcase, tc => {
                console.log(tc.name);
                if(tc.failure) update('failed', ts.name, tc.name);
                else if(tc.skipped) update('skipped', ts.name, tc.name);
                else update('passed', ts.name, tc.name);
            });
        }
    });

    return summary;
};