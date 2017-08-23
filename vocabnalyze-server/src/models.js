const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

module.exports = (cb) => {
	const connectionString = 'mongodb://localhost/vocabnalyze';
	mongoose.connect(connectionString);

	const db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));

	db.once('open', () => {
		const models = {};

		models.toObjectID = id => mongoose.Types.ObjectId(id);

		models.texts = require('./models/texts')(mongoose, models);
		models.users = require('./models/users')(mongoose, models);

		cb(models);
	});
};