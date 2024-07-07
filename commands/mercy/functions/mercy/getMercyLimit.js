const { shardMercyConditions } = require('../textMaps');

function getMercyLimit(shard) {

	const conditions = (shard === 'primal') ? shardMercyConditions['primal.mythical'] : shardMercyConditions[shard];

	const start = conditions.start;
	const base = conditions.base / 100;
	const increase = conditions.increase / 100;

	const limit = start + Math.ceil((1 - base) / increase);

	return limit;

}

module.exports = {
	getMercyLimit,
	ignoreLoading: true,
};