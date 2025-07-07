const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sunucu')
        .setDescription('Sunucu hakkında bilgi verir.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(interaction.guild.name)
            .setThumbnail(interaction.guild.iconURL())
            .addFields(
                { name: 'Üye Sayısı', value: `${interaction.guild.memberCount}`, inline: true },
                { name: 'Kuruluş Tarihi', value: `<t:${parseInt(interaction.guild.createdTimestamp / 1000)}:D>`, inline: true }
            )
            .setTimestamp();
        
        await interaction.reply({ embeds: [embed] });
    },
};