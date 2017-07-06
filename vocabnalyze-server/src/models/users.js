const stopwords = require('./stopwords');

module.exports = (mongoose, models) => {
	const userSchema = mongoose.Schema({
		name: String,
		words: [{
			word: String,
			time: { type: Date, default: Date.now }
		}]
	});

	const model = mongoose.model('User', userSchema);

	model.addWord = (word, userId, cb) => {
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

	model.getSimilarTexts = (userId, cb) => {
		try {
			models.users.aggregate([
				{
					$unwind: '$words'
				},
				{
					$group: {
						_id: '$words.word',
						count: { $sum: 1 },
						last_time: {
							$max: '$words.time'
						}
					}
				},
				{
					$sort: {
						count: -1
					}
				},
				{
					$group: {
						_id: 0,
						values: { $push: "$_id" }
					}
				}
			]).cursor({ batchSize: 1000 }).exec().next().then(values => {
				models.texts.aggregate([
					{
						$unwind: "$text.body"
					},
					{
						$project: {
							"text.body": {
								$let: {
									vars: {
										stopWords: stopwords
									},
									in: {
										$filter: {
											input: "$text.body",
											as: "pair",
											cond: {
												$and: [
													{ $eq: [ "$$pair.token", "WORD" ] },
													{ $not: { $in: [ { $toLower: "$$pair.value" },  "$$stopWords"] } }
												]
											}
										}
									}
								}
							}
						}
					},
					{
						$unwind: "$text.body"
					},
					{
						$group: {
							_id: "$_id",
							words: { $addToSet: { $toLower: "$text.body.value" } }
						}
					},
					{
						$project: {
							score: {
								$let: {
									vars: {
										userWords: values
									},
									in: { $divide: [ { $size: { $setIntersection: [ "$words", "$$userWords.values" ] } }, { $size: { $setUnion: [ "$words", "$$userWords.values" ] } } ] }
								}
							}
						}
					},
					{
						$sort: {
							score: -1
						}
					}
				], (err, result) => {
					if (err) {
						return cb(err);
					}
					return cb(null, result);
				});
			});

		} catch( err ){
			console.error(err);
		}
	};

	return model;
};

