const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
require('dotenv').config();

// Client'ı tüm gerekli intent'lerle oluştur
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent, // Prefix için zorunlu
    ],
});

// Ayarları ve Koleksiyonları Yükle
client.config = require('./config.json');
client.slashCommands = new Collection();
client.prefixCommands = new Collection();
client.prefixAliases = new Collection(); // Prefix komut takma adları için

// --- SLASH KOMUT YÜKLEYİCİ ---
const slashCommandsPath = path.join(__dirname, 'slashCommands');
const slashCommandFiles = fs.readdirSync(slashCommandsPath).filter(file => file.endsWith('.js'));
for (const file of slashCommandFiles) {
    const command = require(path.join(slashCommandsPath, file));
    client.slashCommands.set(command.data.name, command);
}
console.log(`[BİLGİ] ${client.slashCommands.size} adet slash (/) komutu yüklendi.`);

// --- PREFIX KOMUT YÜKLEYİCİ ---
const prefixCommandsPath = path.join(__dirname, 'prefixCommands');
const prefixCommandFiles = fs.readdirSync(prefixCommandsPath).filter(file => file.endsWith('.js'));
for (const file of prefixCommandFiles) {
    const command = require(path.join(prefixCommandsPath, file));
    client.prefixCommands.set(command.name, command);
    if (command.aliases && Array.isArray(command.aliases)) {
        command.aliases.forEach(alias => {
            client.prefixAliases.set(alias, command.name);
        });
    }
}
console.log(`[BİLGİ] ${client.prefixCommands.size} adet prefix (!) komutu yüklendi.`);


// --- EVENT YÜKLEYİCİ ---
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
}

// Botu Discord'a bağla
client.login(process.env.TOKEN);