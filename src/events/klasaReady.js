const { Event } = require("klasa");
const { MessageEmbed } = require('discord.js');
const TABLES = ['members', 'guilds', 'users', 'clientStorage'];

module.exports = class extends Event {
	constructor(...args) {
		super(...args, {
			enabled: true,
			once: true
		});
	}

	async run() {
		if (process.argv.includes("--migrate")) {
			for (const table of TABLES) {
				const docs = await this.client.providers.default.getAll(table);
				for (const doc of docs) {
					const newID = doc.id.split("-").join(".");
					await this.client.providers.default.delete(table, doc.id).catch(() => null);
					doc.id = newID;
					await this.client.providers.default.create(table, newID, doc);
				}
			}
			this.client.console.warn("Migration Done. Process will now exit. Remove the `--migrate` flag");
			process.exit(0);
		}
		if (process.argv.includes("--migrate-rethink")) {
			const jsonProvider = this.client.providers.get("json");
			for (const table of TABLES) {
				const docs = await jsonProvider.getAll(table);
				for (const doc of docs) {
					const newID = doc.id.split("-").join(".");
					await jsonProvider.delete(table, doc.id).catch(() => null);
					doc.id = newID;
					await this.client.providers.default.create(table, newID, doc);
				}
			}
			this.client.console.warn("Migration to RethinkDB Done. Process will now exit. Remove the `--migrate` flag");
			process.exit(0);
		}

		this.client.setMaxListeners(Infinity); // change the clients event listener max amount

		this.client.user.setPresence({
			activity: {
				name: `${this.client.options.prefix}help | www.lenoxbot.com`,
				type: 0
			},
			status: 'online'
		}).then(() => {
			console.log('Successfully updated the bots presence.');
		}).catch(console.error);
	}
};