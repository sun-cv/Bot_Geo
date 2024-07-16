const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder, ButtonBuilder } = require('discord.js');
const { templates } = require('../../functions/textMaps');
const { db } = require('../../../../database/database');
const { delay } = require('../../../../utilities/functions/time/delay');
const { addOptionsToMenu } = require('../../functions/account/addOptionsToMenu');
const { Embed } = require('../../functions/account/embed');


const optionsMap = new Map();

async function mercyBackgroundOptions(interaction, account) {

	try {

		let templateSelection = '';
		let templateRandom = '';
		let templateType = '';

		if (account) optionsMap.set(interaction.member.user.id, account);

		account = optionsMap.get(interaction.member.user.id);

		await handleOptionResponses(interaction, account);

		for (const selection of account.template.selection) {
			templateSelection = templateSelection + `${selection} \n`;
		}
		templateSelection = account.template.selection.join(', ');
		templateRandom = account.template.random === true ? 'enabled' : 'disabled';
		templateType = account.template.type;

		const mercyBackgroundEmbed = new EmbedBuilder()
			.setColor('#ED8223')
			.setTitle(`${Embed.truncate({ string: 'Mercy Background Options:', limit: 53, pad: true, alignment: 'center', add: '⠀ ' })}${Embed.divider({ start: '⌬', main: '═', end: '⌬', length: 32 })}`)
			.addFields(
				{ name: ' ', value: '```Selected Static``````Single background for a consistent backdrop.```', inline: true },
				{ name: ' ', value: '```Selected Random``````Select multiple backgrounds, switch randomly```', inline: true },
				{ name: ' ', value: '```All Random``````Switch between all selected template style backgrounds```', inline: false },
				{ name: ' ', value: `${Embed.divider({ start: '⌬', main: '═', end: '⌬', length: 37 })}` },
				{ name: ' ', value: ' ' },
				{ name: ' ', value: `${Embed.truncate({ string: `Template:   ${templateType}`, limit: 20, pad: true, alignment: 'center', style: ['block_code'] })}`, inline: true },
				{ name: ' ', value: `${Embed.truncate({ string: `Random:   ${templateRandom}`, limit: 20, pad: true, alignment: 'center', style: ['block_code'] })}`, inline: true },
				{ name: ' ', value: `${Embed.truncate({ string: `Selection: ${templateSelection}`, limit: 200, pad: true, style: ['block_code'] })}`, inline: false },
				{ name: ' ', value: `${Embed.truncate({ string: 'Preview templates below', limit: 46, pad: true, alignment: 'center', style: ['block_code'] })}` },

			)
			.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1206638062214578306/EmbedLine.png?ex=66730744&is=6671b5c4&hm=db81a8aa7b04cc2a5bd069b68cb2a4a9271accf9ca63e5a48960ada14d231fe7&');

		const currentStyle = (account.template.type === 'fullArt') ? 'minimal' : 'fullArt';


		const optionsRow = new ActionRowBuilder()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('mercy-random')
					.setLabel('All Random')
					.setStyle('Primary'),
				new ButtonBuilder()
					.setCustomId('mercy-view-templates')
					.setLabel('Preview templates')
					.setStyle('Secondary'),
				new ButtonBuilder()
					.setCustomId('mercy-switch-type')
					.setLabel(`Switch to ${currentStyle}`)
					.setStyle('Secondary'),
			);

		const type = account.template.type;

		const mercyBackgroundOptionsMenu = new StringSelectMenuBuilder()
			.setCustomId('mercy-select-background')
			.setPlaceholder('Select your background/\'s')
			.setMinValues(1)
			.setMaxValues(templates[type].background.length);
		addOptionsToMenu(mercyBackgroundOptionsMenu, templates[type].background, 'array');
		const mercyBackgroundOptionsRow = new ActionRowBuilder().addComponents(mercyBackgroundOptionsMenu);

		if (interaction.isButton() && interaction.customId === 'mercy-view-templates') {

			for (const template of templates[type].background) {
				mercyBackgroundEmbed.setImage(templates[type].url[template]);
				mercyBackgroundEmbed.data.fields[8] = { name: ' ', value: `${Embed.truncate({ string: template, limit: 44, pad: true, style: ['block_code'], add: '⠀ ', alignment:'center' })}` };

				interaction.editReply({
					embeds: [mercyBackgroundEmbed],
					components: [mercyBackgroundOptionsRow, optionsRow],
					ephemeral: true,
				});
				await delay(3000);

			}
			mercyBackgroundEmbed.setImage('https://cdn.discordapp.com/attachments/1185256496322322472/1206638062214578306/EmbedLine.png?ex=66730744&is=6671b5c4&hm=db81a8aa7b04cc2a5bd069b68cb2a4a9271accf9ca63e5a48960ada14d231fe7&');
			mercyBackgroundEmbed.data.fields[8] = { name: ' ', value: `${Embed.truncate({ string: 'Preview templates below', limit: 46, pad: true, alignment: 'center', style: ['block_code'] })}` },
			interaction.editReply({
				embeds: [mercyBackgroundEmbed],
				components: [mercyBackgroundOptionsRow, optionsRow],
				ephemeral: true,
			});
		}

		await interaction.editReply({
			embeds: [mercyBackgroundEmbed],
			components: [mercyBackgroundOptionsRow, optionsRow],
			ephemeral: true,
		});
	}
	catch (error) {
		console.log(error);
	}
}

module.exports = {
	mercyBackgroundOptions,
};


async function handleOptionResponses(interaction, account) {
	try {

		if (interaction.isStringSelectMenu() && interaction.customId === 'mercy-select-background') {
			account.template.selection = interaction.values;
		}
		else if (interaction.isButton() && interaction.customId === 'mercy-random') {
			account.template.random = !account.template.random;
		}
		else if (interaction.isButton() && interaction.customId === 'mercy-switch-type') {
			account.template.type = (account.template.type === 'fullArt') ? 'minimal' : 'fullArt';
			if (account.template.type === 'minimal') {
				account.template.selection = ['grey'];
			}
			if (account.template.type === 'fullArt') {
				account.template.selection = ['alure'];
			}
		}
		else {
			return;
		}

		account.template = JSON.stringify(account.template);
		await db.run('UPDATE mercy_tracker_accounts SET template = ? WHERE id = ? AND name = ? ', [account.template, interaction.member.user.id, account.name]);
		account.template = JSON.parse(account.template);

	}
	catch (error) {
		console.log(error);
	}
}