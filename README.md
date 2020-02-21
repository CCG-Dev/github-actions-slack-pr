# Slack PR Notification Github Action

This action sends a notification to Slack incoming webhook provided when there are pull requests with reviews requested.

## Inputs

### `webhook-url`

**Required** The Webhook URL

## Example usage

```
name: Slack

on: pull_request

jobs:
  slack:
    runs-on: ubuntu-latest
    steps:
      - uses: ccg-dev/github-actions-slack-pr@master
        with:
          webhook-url: https://webhookurl.here.com
```
