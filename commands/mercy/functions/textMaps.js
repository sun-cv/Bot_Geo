const shardTypes = ['ancient', 'void', 'primal.legendary', 'primal.mythical', 'sacred'];

const shardMercyConditions = {
	'ancient': { 'start': 200, 'base': 0.5, 'increase': 5 },
	'void': { 'start': 200, 'base': 0.5, 'increase': 5 },
	'primal.legendary': { 'start': 75, 'base': 1, 'increase': 1 },
	'primal.mythical': { 'start': 200, 'base': 0.5, 'increase': 10 },
	'sacred': { 'start': 12, 'base': 6, 'increase': 2 },
};

const shardEmojis = {
	'ancient': '<:Ancient:1184573482684661950>',
	'void': '<:Void:1184573509037477999>',
	'primal': '<:Primal:1184573522958364762>',
	'primal.legendary': '<:Primal:1184573522958364762>',
	'primal.mythical': '<:Primal:1184573522958364762>',
	'sacred': '<:Sacred:1184573533037273258>',
};
const shardNameLengths = {
	'ancient': ' ancient ',
	'void': '  voids  ',
	'primal.legendary': 'legendary',
	'primal.mythical': 'mythicals',
	'sacred': ' sacreds ',
};
const templates = {
	format: {
		font: '60px impact',
		fillStyle: 'white',
		textAlign: 'right',
		textBaseline: 'middle',
		shadowColor: 'black',
		shadowBlur: 10,
		shadowOffsetX: 6,
		shadowOffsetY: 6,
		offset: 20,
	},
	minimal: {
		size: { width: 1090, height: 850 },
		zones:[
			{ x: 65, width: 216, value: 'count', skip: [], exception: { shard: { value: 'primal.legendary', font: '40px impact' } } },
			{ x: 286, width: 216, value: 'chance', skip: [], exception: { shard: { value: 'primal.legendary', font: '40px impact' } } },
			{ x: 509, width: 208, value: 'lastAdded', skip: ['primal.legendary'], exception: { shard:{} } },
			{ x: 722, width: 103, value: 'lastPulled', skip: ['primal.legendary'], exception: { font: '40px impact', offset: 5 } },
			{ x: 1096, width: 754, value: 'lastChampion', skip: ['all'], exception: { x: 65, width: 652, y: 719, height: 80, font: '55px impact', textAlign: 'center', offset: 15 } },
			{ x: 874, width: 216, value: 'lastReset', skip: ['all'], exception: { x: 723, width: 103, y: 719, height: 80, font: '40px impact', offset: 5, textAlign: 'right' } },
			{ x: 831, width: 209, value: 'totalCount', skip: ['primal.legendary'], exception: { shard:{} } },
			{ x: 723, width: 209, value: 'lastCount', skip: [], exception: { x: 663, width: 318, y: 719, height: 80, offset: 20, font: '60px impact', textAlign: 'right' } },
			{ x: 44, y: 19, width: 1016, height: 120, value: 'header', skip: ['all'], exception: { font:'70px impact', textAlign: 'center' } },
		],
		shardOverlay: { dx: 940, dy: 675, dw: 145, dh: 177 },
		height: {
			'ancient': { y: 260, height: 80 },
			'void': { y: 380, height: 80 },
			'primal.mythical': { y: 500, height: 80 },
			'primal.legendary': { y: 580, height: 40 },
			'sacred': { y: 620, height: 80 },
		},
		background:['bluefade', 'fire', 'grey', 'ice', 'magic', 'nature', 'red', 'redmist', 'warm'],
		url: {
			bluefade: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253922640452915330/bluefade.png?ex=66779df6&is=66764c76&hm=2fb5fd5f99c3081bdc908ef295cb89645e3b696b9f68b8138f60a2076a4709e6&',
			fire: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253926217741238282/fire.png?ex=6677a14b&is=66764fcb&hm=0f00a54f8f7a7f0bc16f36220ebffa7c06378e7335ebd908e6cd72de97b31700&',
			grey: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253926506879647766/grey.png?ex=6677a190&is=66765010&hm=84d44890f9aa4a2bf716c70bfea9a9834841e4c70ef2ddf9571862ba23fcddd6&',
			ice: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253924627231670392/ice.png?ex=66779fcf&is=66764e4f&hm=f5a7ad901bae514b72cfc41f0a5c75407446a61d1f5d399af9d31e7039f860f9&',
			magic: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253924233235533874/magic.png?ex=66779f71&is=66764df1&hm=3b50ca2c4b5dce616926488bf39c6798506283d0c33f06898e51c7f10343901e&',
			nature: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253923554756399167/nature.png?ex=66779ed0&is=66764d50&hm=0fec45e276305bfe8381d2dfba7f5342d317f19259ebcaa5aeb6e67020ff1e63&',
			red: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253925283560689705/red.png?ex=6677a06c&is=66764eec&hm=fc1358a197d1e28db7272f0550a2056e0f84a6be091e0817ad0a36e7f45d9261&',
			redmist: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253921873855516672/redmist.png?ex=66779d3f&is=66764bbf&hm=e80ddc0343c1cae9ad9d5b6bf71922947a8b44cb949554c0cb292bc1016adcfc&',
			warm: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253923288187666484/warm.png?ex=66779e90&is=66764d10&hm=3fcad94871fad9c407827bd53038a27b4b334b502f966276e274e7e6bab1d855&',
		},
	},
	fullArt: {
		size: { width: 1920, height: 1080 },
		zones: [
			{ x: 874, width: 216, value: 'count', skip: [], exception: { shard: { value: 'primal.legendary', font: '40px impact' } } },
			{ x: 1096, width: 216, value: 'chance', skip: [], exception: { shard: { value: 'primal.legendary', font: '40px impact' } } },
			{ x: 1318, width: 208, value: 'lastAdded', skip: ['primal.legendary'], exception: { shard:{} } },
			{ x: 1532, width: 103, value: 'lastPulled', skip: ['primal.legendary'], exception: { font: '40px impact', offset: 5 } },
			{ x: 1096, width: 754, value: 'lastChampion', skip: ['all'], exception: { x: 875, width: 652, y: 840, height: 80, font: '55px impact', topextAlign: 'center', offset: 20 } },
			{ x: 874, width: 216, value: 'lastReset', skip: ['all'], exception: { x: 1532, width: 103, y: 840, height: 80, font: '40px impact', offset: 5, textAlign: 'right' } },
			{ x: 1641, width: 209, value: 'totalCount', skip: ['primal.legendary'], exception: { shard:{} } },
			{ x: 1641, width: 209, value: 'lastCount', skip: [], exception: { x: 1575, width: 209, y: 840, height: 80, offset: 20, font: '60px impact', textAlign: 'right' } },
			{ x: 854, y: 140, width: 1016, height: 120, value: 'header', skip: ['all'], exception: { font:'70px impact', textAlign: 'center' } },
		],
		shardOverlay: { dx: 1750, dy: 800, dw: 145, dh: 177 },
		height: {
			'ancient': { y: 380, height: 80 },
			'void': { y: 500, height: 80 },
			'primal.mythical': { y: 620, height: 80 },
			'primal.legendary': { y: 700, height: 40 },
			'sacred': { y: 740, height: 80 },
		},
		background:['alure', 'cardiel', 'fahrakin', 'fayne', 'icegolem', 'lifetaker', 'mythicbattle', 'scyl', 'siphi', 'tormin', 'wukong', 'wythir', 'yumekobattle'],
		url: {
			alure: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762978722385942/alure.png?ex=667365f1&is=66721471&hm=e371aa22e1b32c92804761eab54b0621cca81fb85d43d927f9327a58f00dc2da&',
			cardiel: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762979414573138/cardiel.png?ex=667365f1&is=66721471&hm=22ca8517fbf676132438847743fbb3a9ad67f9b1c527b502ce75721407769170&',
			fahrakin: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253920822087647333/fahrakin.png?ex=66779c44&is=66764ac4&hm=5c36d81f652a8fcecbbb0c7223ba022e9d7940d68621d8d65f5356e9dacf906d&',
			fayne: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762980018294836/fayne.png?ex=667365f1&is=66721471&hm=a81a9c01c9ac3b1ddbb9014c88b8dcf85960cd0f2b2c059a4aa325f0b9f3601a&',
			icegolem: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762980681252874/icegolem.png?ex=667365f1&is=66721471&hm=00d07143cf897620e07ae3cd77dca3a2289df6ebb94bf06c292148f63de84b0e&',
			lifetaker: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762981457072189/lifetaker.png?ex=667365f1&is=66721471&hm=1f893ab7f78820131f959fc7d7327886397b61bb69dd72d1d79e71f898163e32&',
			mythicbattle: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762982174162985/mythicbattle.png?ex=667365f2&is=66721472&hm=9e3a4f0d259ee2ffd35364139d5507eab18a1b8877f0a5329d36ddf5aed4ad76&',
			scyl: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253920479392170085/scyl.png?ex=66779bf3&is=66764a73&hm=1d9e38ee5ebf6774911237e591834f70547033d0867d8c550f5806cd85e56054&',
			siphi: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762982924947506/siphi.png?ex=667365f2&is=66721472&hm=08c5924da49f62916cbbb43765b9520d0cacedf6fda10d9fd322059c61c8905a&',
			tormin: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762983612944486/tormin.png?ex=667365f2&is=66721472&hm=32a7185206c64ed833f3dfab04ca7fda5b69827fb5238fc1c57599793d5639c9&',
			wukong: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252872107269034094/wukong.png?ex=6673cb93&is=66727a13&hm=1e932b141d854990c915cd1e0866857b20d62261fb5d48898c4c3fbd0dd37bf8&',
			wythir: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252762984921436313/wythir.png?ex=667365f2&is=66721472&hm=3b6779593e1f0dfbd275f6577235bdc884c71088d92083cc09da37551c31481b&',
			yumekobattle: 'https://cdn.discordapp.com/attachments/1185256496322322472/1252763000109269013/yumekobattle.png?ex=667365f6&is=66721476&hm=07b7605a3d1f7ee70785222f532b37249bd7f9b9d59c6e3f42474dc104f48ca4&',
			cleanDefault: 'https://cdn.discordapp.com/attachments/1185256496322322472/1253227482883035206/cleanDefault.png?ex=6675168b&is=6673c50b&hm=efe514caa29938eb0a0550361ea87acb3a43aab6ddff1251d4cd03442a3ed366&',
		},
	},
};


module.exports = {
	shardTypes,
	shardMercyConditions,
	shardEmojis,
	shardNameLengths,
	templates,
};