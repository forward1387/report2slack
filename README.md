# report2slack

```
report2slack <cmd> --file <path to *.json report file> --slack <slack incoming hook>

Commands:
  report2slack cucumber-html-reporter  Sends cucumber html reporter results to
                                       slack channel

Options:
  --version     Show version number                                    [boolean]
  --file, -f    path to the cucumber-html-reporter *.json file
                                                             [string] [required]
  --slack, -s   slack incoming hook                          [string] [required]
  --passed      send passed tests                     [boolean] [default: false]
  --failed      send failed tests                     [boolean] [default: false]
  --skipped     send skipped tests                    [boolean] [default: false]
  --title, -t   title of slack message
                                   [string] [default: "Test-Automation Results"]
  --report, -r  url link to detail test reports                         [string]
  --env, -e     Test environment information as json object: {"url":
                "https://test.env"}                                     [string]
  --help        Show help                                              [boolean]
```