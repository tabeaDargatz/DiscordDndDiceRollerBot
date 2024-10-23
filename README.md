##Setup Bot On A Server
1. Go to https://discord.com/developers/applications
2. Navigate to the OAuth2 tab of your bot
3. Use the url generator to generate the link that is needed to invite the bot to a server:
    - select "bot" from the first part of the generator
    - select "send messages", "read message history" and "view channels"
    - copy generated link
4. After inviting your bot, copy the servers guild id by right clicking on the server icon
5. In replit, go to the secrets tab and replace the current guild id with the server guild id
6. Run node deploy-commands.js in the shell
