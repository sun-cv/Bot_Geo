async function test(task) {

	try {


		console.log('testing');


	}
	catch (error) {
		task.errorHandling(error);
	}
}

module.exports = {
	test,
	task: true };