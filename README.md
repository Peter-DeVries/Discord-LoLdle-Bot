# Discord LoLdle Bot
Discord Bot for playing LoLdle (League of Legends Wordle). You can either add my bot (which will be generally running 24/7 outside of bug fixes) or add your own. Here is a quick video of the bot in action.

https://user-images.githubusercontent.com/71617666/185721537-afe9c80a-98ca-4a0b-a669-943210c7d404.mp4

## How To Play

LoLdle utilizes slash commands in discord to function. Here are a few commands that you can use to play LoLdle.

* `/loldle`: Begins a LoLdle game for the user (others cannot interact with someone else's puzzle)
* `/guess <champion name>`: Make a guess for LoLdle, comes with autocompletion to help with spelling.
* `/giveup`: Ends the current LoLdle and reveals the answer
* `/help`: Get a list of all commands.
* `/credits`: Prints out LoLdle and Bot credits
* `/ping`: Prints out API Latency and Client Ping

## Setting Up The LoLdle Bot

To add my bot, you can add it to your own discord server using [this link](https://discord.com/api/oauth2/authorize?client_id=1009975930476835007&permissions=11264&scope=bot%20applications.commands). It's running on a server 24/7 and periodically will be reset in case things break.

## Setting Up From Codebase

You can also set up your own bot to run. Follow these steps for that:

1. Download the codebase and run ```npm install```
2. Create a discord bot [here](https://discord.com/developers/applications)
3. Give the bot the following OAuth2s:
```
Read Messages/View Channels
Send Messages
Manage Messages
```
4. Grab your bot's token and store it in a file called ```.env```.
  ```javascript
  token=<YOUR BOT TOKEN>
  ```
5. Run ```node .``` to start the bot
