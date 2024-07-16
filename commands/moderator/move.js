const { SlashCommandBuilder, AttachmentBuilder, CommandInteraction } = require('discord.js');
const axios = require('axios');

const DEBUG = false;

async function moveCommand(interaction = new CommandInteraction()) {

	let output = '';

	try {

		if (DEBUG) console.log('Deferred reply to interaction.');

		const targetChannel = interaction.options.getChannel('channel');
		const startId = interaction.options.getString('start');
		const endId = interaction.options.getString('end') || startId;

		const userIds = interaction.options.getString('users')
			? interaction.options.getString('users').split(' ').map(id => id.trim())
			: [];
		const ignoreIds = interaction.options.getString('ignore')
			? interaction.options.getString('ignore').split(' ').map(id => id.trim())
			: [];

		if (DEBUG) { console.log(`Ignore IDs: ${ignoreIds}`); }

		let messagesToMove;

		try {
			const startMessage = await interaction.channel.messages.fetch(startId);
			const endMessage = endId ? await interaction.channel.messages.fetch(endId) : startMessage;

			if (!userIds.includes(startMessage.author.id)) {
				userIds.push(startMessage.author.id);
			}
			if (endMessage && !userIds.includes(endMessage.author.id)) {
				userIds.push(endMessage.author.id);
			}

			if (startId === endId || !endId) {
				messagesToMove = new Map();
				messagesToMove.set(startId, startMessage);
			}
			else {
				const fetchedMessages = await interaction.channel.messages.fetch({ after: startId, before: endId });

				messagesToMove = fetchedMessages.filter(message => {
					return userIds.includes(message.author.id) && message.id >= startId && (!endId || message.id <= endId) && !ignoreIds.includes(message.id);
				});

				messagesToMove.set(startId, startMessage);
				if (endMessage) {
					messagesToMove.set(endId, endMessage);
				}
			}


			if (DEBUG) console.log(`Fetched ${messagesToMove.size} messages to move.`);
		}
		catch (error) {
			console.log(error);
		}

		const sortedMessages = [...messagesToMove.values()].sort((a, b) => a.createdTimestamp - b.createdTimestamp);

		let lastAuthorId = null;
		let lastAuthorIdLog = null;

		const messageWord = sortedMessages.length === 1 ? 'message' : 'messages';
		const infoMessage = await targetChannel.send(`${interaction.user.toString()} moved ${sortedMessages.length} ${messageWord} from ${interaction.channel.toString()}:`);

		for (const message of sortedMessages) {

			const timestamp = message.createdAt;
			let hours = timestamp.getHours();
			let minutes = timestamp.getMinutes();
			const ampm = hours >= 12 ? 'PM' : 'AM';
			hours = hours % 12;
			hours = hours ? hours : 12;
			minutes = minutes < 10 ? '0' + minutes : minutes;
			const formattedTime = `${hours}:${minutes} ${ampm}`;

			if (message.author.bot) continue;

			console.log(`Moving message with ID: ${message.id}`);

			console.log('author', message.author.username);
			if (message.author.id !== lastAuthorId) {
				await targetChannel.send(`${message.author.toString()} at ${formattedTime}:`);
				lastAuthorId = message.author.id;
			}

			const attachments = message.attachments.map(async attachment => {
				const response = await axios.get(attachment.url, { responseType: 'arraybuffer' });
				const buffer = Buffer.from(response.data, 'binary');
				return new AttachmentBuilder(buffer, attachment.name);
			});

			await targetChannel.send({
				content: message.content,
				files: await Promise.all(attachments),
			});


			if (DEBUG) console.log(`Deleting message ${message.id} from original channel...`);

			await message.delete();
			if (message.author.id !== lastAuthorIdLog) {
				output += `${message.author.username}`;
				output += ` ${formattedTime}\n`;
				lastAuthorIdLog = message.author.id;
				console.log('move output', message.author.username, output);
			}
			output += `${message.content}\n`;
		}
		if (DEBUG) console.log('Moved messages.');


		const messageCount = sortedMessages.length;
		const messageLink = `https://discord.com/channels/${interaction.guild.id}/${targetChannel.id}/${infoMessage.id}`;

		await interaction.editReply({ content: `<@${interaction.user.id}> moved ${messageCount} ${messageWord} to ${messageLink}`, fetchReply: true });
		return;

	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('move')
		.setDescription('Moves messages from one channel to another.')
		.addChannelOption(option =>
			option.setName('channel')
				.setDescription('The channel to move messages to')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('start')
				.setDescription('ID of the first message to move')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('end')
				.setDescription('ID of the last message to move')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('users')
				.setDescription('Add additional users by ID')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('ignore')
				.setDescription('Ignore Message IDs')
				.setRequired(false)),
	execute: moveCommand,
	command: true,
	defer: true,
	moderator: true,
	maintenance: false,
	ephemeral: false,
	trace: true,
};