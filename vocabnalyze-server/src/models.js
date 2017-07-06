const mongoose = require('mongoose');

module.exports = (cb) => {
	const connectionString = 'mongodb://localhost/vocabnalyze';
	mongoose.connect(connectionString);

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', () => {
		mongoose.connection.db.eval('db.loadServerScripts()');

		const models = {};
		models.texts = require('./models/texts')(mongoose, models);
		models.users = require('./models/users')(mongoose, models);

		cb(models);
	});
};