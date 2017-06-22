const express = require('express');
const router = express.Router();
const fs = require('fs');

router.get('/:id', (req, res, next) => {
	req.models.texts.findOne({ id: parseInt(req.params.id) }, (err, result) => {
		if (err) {
			return next(err);
		}

		if (!result) {
			res.status(404);
			return res.json({
				error: 'Not Found'
			});
		}

		res.status(200);
		res.json({
			text: result.text
		});
	});
});

module.exports = router;