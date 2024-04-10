const sleepy = {
	oldTime: undefined,
	newTime: undefined,
	count: 0,
	check: 0,
};

async function sleepCheck() {

	sleepy.newTime = new Date();

	if (sleepy.toggle === undefined) {
		sleepy.oldTime = sleepy.newTime;
		sleepy.toggle = 1;
	}

	const timeDifference = Math.floor((sleepy.newTime - sleepy.oldTime) / (1000 * 60));
	console.log('time diff', timeDifference);

	if (timeDifference > 60) {
		console.log('Cycled sleepCheck');
		sleepy.oldTime = sleepy.newTime;
		sleepy.check += 1;
	}

	if (++sleepy.count === 12) {
		sleepy.check += 5;
		console.log(`${sleepy.check} min sleepCheck`);
	}

	if (sleepy.count === 24) {
		sleepy.count = 0;
		sleepy.check = 0;
		console.log('WAKE UP');
	}

	console.log('sleepy obj', sleepy);

}

module.exports = {
	sleepCheck,
	task: true,
};