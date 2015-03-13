// exports method that returns the next method and redirects to '/'
module.exports = function ensureAuthenticated(req, res, next) {
	if (req.isAuthenticated()) { return next(); }
		res.redirect('/')
}