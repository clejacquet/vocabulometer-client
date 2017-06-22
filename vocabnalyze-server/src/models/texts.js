module.exports = (mongoose) => {
	const textSchema = mongoose.Schema({
		id: Number,
		text: String
	});

	return mongoose.model('Text', textSchema);
};

