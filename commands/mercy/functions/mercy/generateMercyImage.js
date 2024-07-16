const { createCanvas, registerFont, loadImage } = require('canvas');
const { templates, shardTypes } = require('../textMaps');
const path = require('path');

async function generateMercyImage(account) {
	try {

		const templateBackground = getTemplateBackground(account);
		const lastChampionData = getLastChampionData(account);

		const { canvas, ctx } = await generateCanvas(account, lastChampionData, templateBackground);

		generateCanvasText(account, lastChampionData, ctx);

		const attachment = canvas.toBuffer();
		return attachment;
	}
	catch (error) {
		console.log(error);
	}
}
module.exports = {
	generateMercyImage,
};


function getTemplateBackground(account) {
	try {

		let template;

		const templateLength = account.template.random ? templates[account.template.type].background.length : account.template.selection.length;
		const randomIndex = Math.floor(Math.random() * templateLength);

		if (account.template.random) {
			template = templates[account.template.type].background[randomIndex];
		}
		else if (account.template.selection.length > 1) {
			template = account.template.selection[randomIndex];
		}
		else {
			template = account.template.selection[0];
		}
		const templateBackground = path.join(__dirname, '..', '..', 'templates', `${template}.png`);
		return templateBackground;

	}
	catch (error) {
		console.log(error);
	}
}

function getLastChampionData(account) {
	try {

		const lastChampionData = { all: [], primal: {} };

		for (const shard of shardTypes) {
			let shardData;

			if (shard.startsWith('primal.')) {
				const [primal, type] = shard.split('.');
				shardData = account.mercy[primal][type];
				lastChampionData[primal][type] = shardData.lastChampion[0];
				if (shardData.lastChampion[0]) lastChampionData.all.push(shardData.lastChampion[0]);
			}
			else {
				shardData = account.mercy[shard];
				lastChampionData[shard] = shardData.lastChampion[0];
				if (shardData.lastChampion[0]) lastChampionData.all.push(shardData.lastChampion[0]);
			}

		}
		lastChampionData.all.sort((a, b) => b.timestamp - a.timestamp);

		return lastChampionData;

	}
	catch (error) {
		console.log(error);
	}
}

async function generateCanvas(account, lastChampionData, templateBackground) {
	try {

		const canvas = {};
		const templateImage = await loadImage(templateBackground);
		canvas.canvas = createCanvas(templates[account.template.type].size.width, templates[account.template.type].size.height);
		canvas.ctx = canvas.canvas.getContext('2d');
		canvas.ctx.drawImage(templateImage, 0, 0, templates[account.template.type].size.width, templates[account.template.type].size.height);


		if (lastChampionData.all.length > 0) {

			if (lastChampionData.all[0].shard === 'primal.legendary' || lastChampionData.all[0].shard === 'primal.mythical') lastChampionData.all[0].shard = 'primal';

			const shardPath = path.join(__dirname, '..', '..', 'templates', 'shards', `${lastChampionData.all[0].shard}.png`);
			const overlayValue = templates[account.template.type].shardOverlay;

			const shardOverlay = await loadImage(shardPath);
			canvas.ctx.drawImage(shardOverlay, overlayValue.dx, overlayValue.dy, overlayValue.dw, overlayValue.dh);

		}
		return canvas;

	}
	catch (error) {
		console.log(error);
	}
}

function generateCanvasText(account, lastChampionData, ctx) {
	try {

		registerFont(path.join(__dirname, '..', '..', 'templates', 'fonts', 'impact.ttf'), { family: 'impact' });

		for (const shard of shardTypes) {

			let shardData;

			const zones = templates[account.template.type].zones;

			if (shard.startsWith('primal.')) {
				const [primal, type] = shard.split('.');
				shardData = account.mercy[primal][type];
			}
			else {
				shardData = account.mercy[shard];
			}

			for (const zone of zones) {

				if (zone.skip.some(element => element === shard || element === 'all')) continue;

				let text = shardData[zone.value];
				ctx.font = (zone.exception.shard?.value === shard) ? zone.exception.shard.font || zone.exception.font || templates.format.font : zone.exception.font || templates.format.font;
				ctx.fillStyle = (zone.exception.shard?.value === shard) ? zone.exception.shard.fillStyle || zone.exception.fillStyle || templates.format.fillStyle : zone.exception.fillStyle || templates.format.fillStyle;
				ctx.textAlign = (zone.exception.shard?.value === shard) ? zone.exception.shard.textAlign || zone.exception.textAlign || templates.format.textAlign : zone.exception.textAlign || templates.format.textAlign;
				ctx.textBaseline = (zone.exception.shard?.value === shard) ? zone.exception.shard.textBaseline || zone.exception.textBaseline || templates.format.textBaseline : zone.exception.textBaseline || templates.format.textBaseline;
				ctx.shadowColor = (zone.exception.shard?.value === shard) ? zone.exception.shard.shadowColor || zone.exception.shadowColor || templates.format.shadowColor : zone.exception.shadowColor || templates.format.shadowColor;
				ctx.shadowBlur = (zone.exception.shard?.value === shard) ? zone.exception.shard.shadowBlur || zone.exception.shadowBlur || templates.format.shadowBlur : zone.exception.shadowBlur || templates.format.shadowBlur;
				ctx.shadowOffsetX = (zone.exception.shard?.value === shard) ? zone.exception.shard.shadowOffsetX || zone.exception.shadowOffsetX || templates.format.shadowOffsetX : zone.exception.shadowOffsetX || templates.format.shadowOffsetX;
				ctx.shadowOffsetY = (zone.exception.shard?.value === shard) ? zone.exception.shard.shadowOffsetY || zone.exception.shadowOffsetY || templates.format.shadowOffsetY : zone.exception.shadowOffsetY || templates.format.shadowOffsetY;
				const offset = (zone.exception.shard?.value === shard) ? zone.exception.shard.offset || zone.exception.offset || templates.format.offset : zone.exception.offset || templates.format.offset;

				const zoneX = zone.exception.x || zone.x;
				const zoneWidth = zone.exception.width || zone.width;
				const zoneY = zone.exception.y || templates[account.template.type].height[shard].y;
				const zoneHeight = zone.exception.height || templates[account.template.type].height[shard].height;

				const centerX = zoneX + zoneWidth - offset;
				const centerY = zoneY + zoneHeight / 2;

				if (text === 0 || text === undefined) text = '';
				ctx.fillText(text, centerX, centerY);

			}
		}
		const header = templates[account.template.type].zones.find(zone => zone.value === 'header');
		const displayName = (account.name === 'main') ? account.member : account.name;

		ctx.font = header.exception.font;
		ctx.textAlign = header.exception.textAlign;
		ctx.fillText(`${displayName}'s Mercy:`, (header.x + header.width / 2), (header.y + header.height / 2));

		const lastChampion = templates[account.template.type].zones.find(zone => zone.value === 'lastChampion');
		if (lastChampionData.all.length > 0) {

			ctx.font = lastChampion.exception.font;
			ctx.textAlign = lastChampion.exception.textAlign;
			ctx.fillText(lastChampionData.all[0].champion, (lastChampion.exception.x + lastChampion.exception.width / 2) + lastChampion.exception.offset, (lastChampion.exception.y + lastChampion.exception.height / 2));

			const lastReset = templates[account.template.type].zones.find(zone => zone.value === 'lastReset');

			ctx.font = lastReset.exception.font;
			ctx.textAlign = lastReset.exception.textAlign;
			ctx.fillText(lastChampionData.all[0].monthDay, (lastReset.exception.x + lastReset.exception.width) - lastReset.exception.offset, (lastReset.exception.y + lastReset.exception.height / 2));

			const lastCount = templates[account.template.type].zones.find(zone => zone.value === 'lastCount');

			ctx.font = lastCount.exception.font;
			ctx.textAlign = lastCount.exception.textAlign;
			ctx.fillText(lastChampionData.all[0].lastCount, (lastCount.exception.x + lastCount.exception.width) - lastCount.exception.offset, (lastCount.exception.y + lastCount.exception.height / 2));
		}
	}
	catch (error) {
		console.log(error);
	}


}