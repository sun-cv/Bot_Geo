function getRandomEmoji(emojis) {

	const randomIndex = Math.floor(Math.random() * emojis.length);

	return emojis[randomIndex];
}

module.exports = {
	getRandomEmoji,
};