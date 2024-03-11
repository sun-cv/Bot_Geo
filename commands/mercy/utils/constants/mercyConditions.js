const mercyConditions = {
	'ancient': { 'start': 200, 'base': 0.5, 'increase': 5 },
	'void': { 'start': 200, 'base': 0.5, 'increase': 5 },
	'primal': {
		'legendary': { 'start': 75, 'base': 1, 'increase': 1 },
		'mythical': { 'start': 200, 'base': 0.5, 'increase': 10 },
	},
	'sacred': { 'start': 12, 'base': 6, 'increase': 2 },
};

module.exports = {
	mercyConditions,
};