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

BOT_PORT=3000
```

### start
Before you can run the app make sure you have a mongodb instance if you do not have one you can use 

```bash
docker compose up db -d
```

Start the project in development mode you can run

```bash
npm start
```

If you just want to run the bot without the webhook reciever run

```bash
npm run start:dev
```

To run just the webhook recever run 
```bash
npm run server:dev
```


## Docker
To deploy this app run to build all container

```bash
sh deploy.sh 
```

To re build just the app run 
```bash
sh deploy.sh app
```
