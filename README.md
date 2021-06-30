# marketplace-telegram-bot

Do you always miss the coolest items on online marketplaces like tori.fi? I often do. That's why I created this marketplace telegram bot which is convinient tool to be the first to know of the new items you want to search from online marketplaces. Marketplace telegram bot queries the desired pages within interval set by user (e.g. 10 minutes) and sends user a telegram message when new item is found!

One instance of this bot is designed to be used by only few users. Allowed chat ids are required to be set as environment variables.

## Getting started

### First things to do

Before you can do anything with the app, you need few things:

1. Telegram bot and access token for it ([https://core.telegram.org/bots#6-botfather](https://core.telegram.org/bots#6-botfather))
2. Get your chat id ([https://sean-bradley.medium.com/get-telegram-chat-id-80b575520659](https://sean-bradley.medium.com/get-telegram-chat-id-80b575520659))
3. Decide where to deploy your bot.

### Local development

1. `npm ci`
2. Add your environment variables to `.env` file.
3. `npm run develop`

## Deployment

This bot can be deployed pretty much anywhere you like since it's just a Node.js app but I have deployed mine to my Raspberry Pi 3 using Balena platform.

### Raspberry Pi / Balena

1. Check out Balena [https://www.balena.io/](https://www.balena.io/). Create new account if you don't have one.
2. Create new project with Raspberry Pi [https://www.balena.io/docs/learn/getting-started/raspberrypi3/nodejs/](https://www.balena.io/docs/learn/getting-started/raspberrypi3/nodejs/)
3. Add environment variables to your project.
4. Create release to your device by pushing the code to balena using [balena-cli](https://github.com/balena-io/balena-cli) for example.

## License

This project is [licensed under the MIT License](LICENSE).
