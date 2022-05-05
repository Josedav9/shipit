# Slack bot with github integration

Slack bot with github integrations is a slack bot that allow organizations to handle deployments and validate functionality before deploy to prodution enviroments.


NOTE: There are no test for this app. It onlñy requires a production enviroment

## Env variables needed
```
SLACK_BOT_TOKEN=xoxb-xxxxxxx-xxxxxxxxx-xxxxxxxx
SLACK_SIGNING_SECRET=ffafafafafafafafaf
SLACK_APP_TOKEN=xapp-2-asdasdasdasd-231231c2-123123123dasdasdqsxxxx

GITHUB_ACCESS_TOKEN=ghp_sdasdasdasdasdasdasdasd

MONGODB_HOSTNAME=127.0.0.1
MONGODB_PORT=27017
MONGODB_USERNAME=root
MONGODB_PASSWORD=newPassword
MONGODB_DATABASE=slack-bot-dev
```
### start

Start the project in development mode

```bash
npm start
```

## Docker

To deploy this app run
```bash
    docker compose up -d
```

