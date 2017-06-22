const express = require('express');
const router = express.Router();

router.post('/:uid/word', (req, res, next) => {
	const word = req.body.word.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();

	req.models.users.addWord(word, req.params.uid, (err, result) => {
		if (err) {
			return next(err);
		}

		if (!result) {
			res.status(404);
			return res.json({
				error: 'No user with provided id exists (id: \'' + req.params.uid + '\')'
			});
		}

		res.status(201);
		res.json({
			status: 'success'
		});
	});
});

router.post('/', (req, res, next) => {
	req.models.users.create({ name: req.body.name }, (err, result) => {
		if (err) {
			return next(err);
		}

		res.status(201);
		res.json({
			user: result
		});
	});
});

module.exports = router;