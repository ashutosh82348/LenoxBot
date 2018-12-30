const LenoxCommand = require('../LenoxCommand.js');

module.exports = class prefixCommand extends LenoxCommand {
	constructor(client) {
		super(client, {
			name: 'prefix',
			group: 'administration',
			memberName: 'prefix',
			description: 'Changes the prefix of the server or shows you the current prefix if you just use ?prefix',
			format: 'prefix {new prefix}',
			aliases: [],
			examples: ['prefix !=!'],
			clientPermissions: ['SEND_MESSAGES'],
			userPermissions: ['ADMINISTRATOR'],
			shortDescription: 'General',
			dashboardsettings: true
		});
	}

	async run(msg) {
		const langSet = msg.client.provider.getGuild(msg.message.guild.id, 'language');
		const lang = require(`../../languages/${langSet}.json`);
		const prefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');
		const args = msg.content.split(' ').slice(1);

		const newprefix = args.slice();

		const currentprefix = lang.prefix_currentprefix.replace('%prefix', prefix);

		if (newprefix.length === 0) return msg.channel.send(currentprefix);
		if (newprefix.length > 1) return msg.channel.send(lang.prefix_error);

		let currentPrefix = msg.client.provider.getGuild(msg.message.guild.id, 'prefix');
		currentPrefix = newprefix.join(' ');
		await msg.client.provider.setGuild(msg.message.guild.id, 'prefix', currentPrefix);

		msg.guild._commandPrefix = newprefix.join(' ');

		const newprefixset = lang.prefix_newprefixset.replace('%newprefix', newprefix);
		return msg.channel.send(newprefixset);
	}
};