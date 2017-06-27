const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const app = express();

module.exports = (cb) => {
	// HTTP UTILS MIDDLEWARES LOADING

	const publicDirectory = '../../vocabnalyze-client/dist';

	app.use(favicon(path.join(__dirname, publicDirectory, 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, publicDirectory)));


  // MODELS LOADING

	require('./models')((models) => {
		app.use((req, res, next) => {
			req.models = models;
			next();
		});


    // ROUTES LOADING

		const router = express.Router();

		const users = require('./routes/users');
		const texts = require('./routes/texts');

		router.use('/users', users);
		router.use('/texts', texts);
		app.use('/api/', router);


    // ERROR MIDDLEWARE LOADING

    // catch 404 and forward to error handler
		app.use((req, res, next) => {
			const err = new Error('Not Found');
			err.status = 404;
			next(err);
		});

    // error handler
		app.use((err, req, res, next) => {
			// set locals, only providing error in development
			res.locals.message = err.message;
			res.locals.error = req.app.get('env') === 'development' ? err : {};

			// render the error page
			res.status(err.status || 500);
			res.json({error: err});
		});

		cb(app);
	});
};
