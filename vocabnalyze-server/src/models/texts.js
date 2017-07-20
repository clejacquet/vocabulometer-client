module.exports = (mongoose, models) => {
	const textSchema = new mongoose.Schema({
		id: Number,
		text: {
			title: String,
			body: [mongoose.Schema.Types.Mixed]
		}
	});

	return mongoose.model('Text', textSchema);
};

