module.exports = (mongoose) => {
	const userSchema = mongoose.Schema({
		name: String,
		words: [{
			word: String,
			time: { type: Date, default: Date.now }
		}]
	});

	const model = mongoose.model('User', userSchema);

	model.addWord = (word, userId, cb) => {
		// mongoose.connection.db.eval('AddWord(\'' + word + '\', ObjectId(\'' + userId + '\'));', (err, result) => {
		// 	cb(err, result);
		// });

		try {
			model.findOne({ _id: userId }, (err, doc) => {
				if (!doc) {
					return cb(null, null);
				}

				doc.words.push({ word: word });
				doc.save((err) => {
					cb(err, doc);
				});
			});
		} catch( err ){
			console.error(err);
		}

	};

	return model;
};

