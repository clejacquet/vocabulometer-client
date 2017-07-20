const express = require('express');
const router = express.Router();

module.exports = (passport) => {
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

	router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));

	router.get('/auth/google/callback',
		passport.authenticate('google', { failureRedirect: '/login' }),
		(req, res) => {
			res.redirect('/');
		});


	router.post('/auth/local',
		passport.authenticate('local'),
		(req, res) => {
			res.json({
				user: req.user
			});
		});

	router.all('/auth/logout', (req, res) => {
		req.session.destroy();
		res.status(200).end();
	});

	router.get('/current',
		passport.isLoggedIn,
		(req, res) => {
			res.json({
				user: req.user
			});
		});

	router.get('/current/stats/words_read',
		passport.isLoggedIn,
		(req, res, next) => {
			req.models.users.getWordsPerDay(req.user._id, 7, (err, result) => {
				if (err) {
					return next(err);
				}

				res.status(200);
				res.json({
					days: result
				});
			});
	});

	router.get('/current/stats/new_words_read',
		passport.isLoggedIn,
		(req, res, next) => {
			req.models.users.getNewWordsPerDay(req.user._id, 7, (err, result) => {
				if (err) {
					return next(err);
				}

				res.status(200);
				res.json({
					days: result
				});
			});
	});

	router.get('/current/stats/new_recent_words_read',
		passport.isLoggedIn,
		(req, res, next) => {
			req.models.users.getRecentNewWords(req.user._id, 10, (err, result) => {
				if (err) {
					return next(err);
				}

				res.status(200);
				res.json({
					words: result
				});
			});
		});

	router.get('/current/stats/hard_texts',
		passport.isLoggedIn,
		(req, res, next) => {
			req.models.users.getHardTexts(req.user._id, 5, (err, result) => {
				if (err) {
					return next(err);
				}

				res.status(200);
				res.json({
					texts: result
				});
			});
		});

	router.get('/current/stats/easy_texts',
		passport.isLoggedIn,
		(req, res, next) => {
			req.models.users.getEasyTexts(req.user._id, 5, (err, result) => {
				if (err) {
					return next(err);
				}

				res.status(200);
				res.json({
					texts: result
				});
			});
		});

	router.get('/:uid/similartexts', (req, res, next) => {
		req.models.users.getSimilarTexts(req.models.toObjectID(req.params.uid), (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json({
				texts: result
			});
		});
	});

	router.get('/:uid/stats/words_read', (req, res, next) => {
		req.models.users.getWordsPerDay(req.models.toObjectID(req.params.uid), 7, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json({
				days: result
			});
		});
	});

	router.get('/:uid/stats/new_words_read', (req, res, next) => {
		req.models.users.getNewWordsPerDay(req.models.toObjectID(req.params.uid), 7, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json({
				words: result
			});
		});
	});

	router.get('/:uid/stats/new_recent_words_read', (req, res, next) => {
		req.models.users.getRecentNewWords(req.models.toObjectID(req.params.uid), 10, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json({
				words: result
			});
		});
	});

	router.get('/:uid/stats/hard_texts', (req, res, next) => {
		req.models.users.getHardTexts(req.models.toObjectID(req.params.uid), 5, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json({
				texts: result
			});
		});
	});

	router.get('/:uid/stats/easy_texts', (req, res, next) => {
		req.models.users.getEasyTexts(req.models.toObjectID(req.params.uid), 5, (err, result) => {
			if (err) {
				return next(err);
			}

			res.status(200);
			res.json({
				texts: result
			});
		});
	});


	return router;
};