const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy = require('passport-local');

const GOOGLE_CONSUMER_KEY = '776219373924-g37o5k82bcjc2lac1tb0068kkeidv1hc.apps.googleusercontent.com';
const GOOGLE_CONSUMER_SECRET = 'k1MLbfGe70et6KIrrx5pgDpm';

module.exports = (models) => {
	passport.serializeUser(function(user, done) {
		done(null, {
			name: user.name
		});
	});

	passport.deserializeUser(function(user, done) {
		models.users
			.findOne({ name: user.name })
			.select({
				name: 1,
				_id: 1
			}).exec(done);
	});

	passport.use(new GoogleStrategy({
			clientID: GOOGLE_CONSUMER_KEY,
			clientSecret: GOOGLE_CONSUMER_SECRET,
			callbackURL: "http://localhost:4100/api/users/auth/google/callback"
		},
		function(token, tokenSecret, profile, done) {
			models.users.findOneOrCreate({ name: profile.displayName }, { name: profile.displayName }, function (err, user) {
				return done(err, user);
			});
		}
	));

	passport.use(new LocalStrategy((username, password, done) => {
		models.users.findOne({ name: username }, (err, user) => {
			if (err) { return done(err); }
			if (!user) {
				return models.users.storeUser(username, password, done);
			}
			user.validPassword(password, (err, valid) => {
				if (err) {
					return done(err);
				}
				if (!valid) {
					return done(null, false, { message: 'Incorrect password.' });
				}
				return done(null, {
					_id: user._id,
					name: user.name
				});
			});
		});
	}));

	passport.isLoggedIn = (req, res, next) => {
		// if user is authenticated in the session, carry on
		if (req.isAuthenticated())
			return next();
		// if they aren't redirect them to the home page
		res.status(401).json({
			error: 'Not logged'
		});
	};

	return passport;
};

