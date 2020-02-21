const core = require('@actions/core');
const github = require('@actions/github');
const IncomingWebhook = require('@slack/webhook').IncomingWebhook;

const url = core.getInput('webhook-url');

const webhook = new IncomingWebhook(url);

const run = async () => {
	try {
		const pullRequest = github.context.payload.pull_request;

		if (!pullRequest) {
			return;
		}

		if (/(ready_for_review|review_requested)/i.test(pullRequest.action)) {
			const reviewers = pullRequest.requested_reviewers.reduce((acc, i) => {
				if (acc) {
					return `${acc}, ${i.login}`;
				}
				return `${i.login}`;
			});
			await webhook.send({
				"blocks": [
					{
						"type": "section",
						"text": {
							"type": "mrkdwn",
							"text": `New Pull Request review requested:\n*<${pullRequest.url}|${pullRequest.number} - ${pullRequest.title}>*`
						}
					},
					{
						"type": "section",
						"fields": [
							{
								"type": "mrkdwn",
								"text": `*Repo:*\n${pullRequest.repo}`
							},
							{
								"type": "mrkdwn",
								"text": `*Branch:*\n${pullRequest.head.ref}`
							},
							{
								"type": "mrkdwn",
								"text": `*Author:*\n${pullRequest.user.login}`
							},
							{
								"type": "mrkdwn",
								"text": `*Reviewers:*\n${reviewers}`
							}
						]
					}
				]
			});
		}
	} catch (err) {
		core.setFailed(err.message ? err.message : 'Error sending Slack notification.');
	}
};

run();
