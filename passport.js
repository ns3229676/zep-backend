const GoogleStrategy = require("passport-google-oauth20").Strategy;
const passport = require("passport");

passport.use(
	new GoogleStrategy(
		{
			clientID: '702527822788-806c2v9t9r12j2agt14gb4nltcb3o82v.apps.googleusercontent.com',
			clientSecret: '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',
			callbackURL: "/auth/google/callback",
			scope: ["profile", "email"],
		},
		function (accessToken, refreshToken, profile, callback) {
			callback(null, profile);
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});