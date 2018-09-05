const Discord = require('discord.js');
exports.run = async(client, msg, args, lang) => {
	const guild = client.guilds.get('352896116812939264').roles.find(r => r.name.toLowerCase() === 'moderator').id;
	if (!msg.member.roles.get(guild)) return msg.reply(lang.botownercommands_error);

	const botconfs = client.botconfs.get('blackbanlist');
	const blacklist = [];

	if (botconfs.blacklist.length === 0) return msg.reply('No Discord users have been added to the blacklist!');

	const embed = new Discord.RichEmbed()
		.setTitle("Banned Discord users:")
		.setFooter(`To ban/unban a discord user, use ?blacklistadd/?blacklistremove`);

	if (botconfs.blacklist.length < 1) return msg.channel.send('There are no banned Discord users!');
	for (var i = 0; i < botconfs.blacklist.length; i++) {
		blacklist.push(botconfs.blacklist[i]);
	}
	blacklist.forEach(r => embed.addField(`${r.userID}`, `Moderator: ${client.users.get(r.moderator) ? client.users.get(r.moderator).tag : r.moderator} \nReason: ${r.reason}`));

	await msg.channel.send({
		embed
	});
};

exports.conf = {
	enabled: true,
	guildOnly: true,
	shortDescription: "Blacklist",
	aliases: [],
	userpermissions: [],
	dashboardsettings: true
};
exports.help = {
	name: 'blacklist',
	description: 'Shows you the blacklist',
	usage: 'blacklist',
	example: ['blacklist'],
	category: 'staff',
	botpermissions: ['SEND_MESSAGES']
};
