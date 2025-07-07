const { Events } = require('discord.js');

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot || !message.guild || !message.content.startsWith(client.config.prefix)) return;

        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        
        const command = client.prefixCommands.get(commandName) || client.prefixCommands.get(client.prefixAliases.get(commandName));
        if (!command) return;

        try {
            await command.execute(message, args, client);
        } catch (error) {
            console.error(`Prefix komutu hatası: ${commandName}`, error);
            message.reply('Bu komutu çalıştırırken bir hata oluştu!');
        }
    },
};