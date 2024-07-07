const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

async function manageTasks(interaction = new CommandInteraction(), log) {

	await log.initiateCommand({ name: 'manageTasks', category: 'utility' });

	if (!log.member.id === '271841393725407242') {
		interaction.followUp({ content: 'You do not have permission to use this command.', ephemeral: true });
		return;
	}

	const { taskManager } = interaction.client;

	const functionType = interaction.options.getString('queue');
	const clearTask = interaction.options.getString('name');

	const databaseTask = interaction.options.getString('database');
	const communityTask = interaction.options.getString('community');
	const logTask = interaction.options.getString('logs');

	const manualTask = databaseTask || communityTask || logTask;

	let taskOutput = '';

	try {
		switch (functionType) {
		case 'check': {
			if (taskManager.failedTasksQueue.length === 0) {
				await interaction.followUp({ content: 'No tasks in queue', ephemeral: true });
				return;
			}
			else {
				taskManager.failedTasksQueue.forEach(task => {
					taskOutput += task.name + '\n';
				});

				await interaction.followUp({ content: `List of failed tasks:\n${taskOutput}`, ephemeral: true });
			}
			break;
		}
		case 'clear': {
			if (!clearTask) {
				await interaction.followUp({ content: 'Please specify a task to clear.', ephemeral: true });
				return;
			}

			const taskIndex = taskManager.failedTasksQueue.findIndex(task => task.name === clearTask);

			if (taskIndex === -1) {
				await interaction.followUp({ content: 'The task you’re trying to clear does not exist in the failed tasks queue.', ephemeral: true });
				return;
			}
			else {
				taskManager.failedTasksQueue.splice(taskIndex, 1);
				interaction.followUp({ content: `Task ${clearTask} has been cleared from the failed tasks queue.`, ephemeral: true });
			}
			break;
		}
		case 'cycle': {

			if (taskManager.failedTasksQueue.length === 0) {
				await interaction.followUp({ content:'no failed tasks to re-attempt', ephemeral: true });
			}

			await taskManager.runFailedTasks();
			await interaction.followUp({ content:'All failed tasks have been rerun', ephemeral: true });
		}
		}

		if (manualTask) {
			await taskManager.loadTasks(manualTask);
			await interaction.followUp({ content: `Attempted to run ${manualTask}`, ephemeral: true });
		}
	}

	catch (error) {
		log.errorHandling(error);
	}
	finally {
		log.finalizeCommand();
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('manage-tasks')
		.setDescription('manage tasks.')
		.addStringOption(option =>
			option.setName('queue')
				.setDescription('cycle, check, clear')
				.setRequired(false)
				.addChoices(
					{ name: 'cycle', value: 'cycle' },
					{ name: 'check', value: 'check' },
					{ name: 'clear', value: 'clear' },
				))
		.addStringOption(option =>
			option.setName('name')
				.setDescription('task to clear')
				.setRequired(false))
		.addStringOption(option =>
			option.setName('database')
				.setDescription('run database task')
				.setRequired(false)
				.addChoices(
					{ name: 'daily', value: 'daily' },
					{ name: 'weekly', value: 'weekly' },
					{ name: 'monthly', value: 'monthly' },
					{ name: 'delete daily', value: 'delete daily' },
					{ name: 'deleteweekly', value: 'delete weekly' },
					{ name: 'deletemonthly', value: 'delete monthly' },
				))
		.addStringOption(option =>
			option.setName('logs')
				.setDescription('clean logs')
				.setRequired(false)
				.addChoices(
					{ name: 'cleanLogs', value: 'cleanLogs' },
				))
		.addStringOption(option =>
			option.setName('community')
				.setDescription('run community task')
				.setRequired(false)
				.addChoices(
					{ name: 'goldenKappa', value: 'goldenKappa' })),

	execute: manageTasks,
	command: true,
	defer: true,
	moderator: true,
	maintenance: false,
	ephemeral: true,
	trace: true,

};