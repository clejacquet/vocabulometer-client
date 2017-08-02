const express = require('express');
const router = express.Router();
const fs = require('fs');

module.exports = (passport) => {
	router.get('/', passport.isLoggedIn, (req, res, next) => {
		req.models.texts.find({}, ['text'], {
			sort: {
				'text.title': 1
			}
		}, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json({
				texts: result
			});
		})
	});

	router.get('/:id', passport.isLoggedIn, (req, res, next) => {
		req.models.texts.findOne({ _id: req.params.id }, (err, result) => {
			if (err) {
				return next(err);
			}

			if (!result) {
				return next(new Error('Not Found'));
			}

			res.status(200);
			res.json({
				text: result.text
			});
		});
	});

	router.put('/:id/text', passport.isLoggedIn, (req, res, next) => {
		req.models.texts.loadAndModifyText(req.params.id, req.body.text, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json(result);
		})
	});

	router.put('/:id/title', passport.isLoggedIn, (req, res, next) => {
		req.models.texts.modifyTitle(req.params.id, req.body.title, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json(result);
		})
	});

	router.delete('/:id', passport.isLoggedIn, (req, res, next) => {
		req.models.texts.deleteOne({ _id: req.params.id }, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json(result);
		});
	});

	router.post('/', (req, res, next) => {
		req.models.texts.loadAndCreateText(req.body.title, req.body.text, (err, results) => {
			if (err) {
				return next(err);
			}
			res.json({
				result: results.map(paragraph => paragraph.map(token => token.value)),
				text: results
			});
		});
	});

	return router;
};