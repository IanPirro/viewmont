var util = require('util'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Category = mongoose.model('Category'),
	Activity = mongoose.model('Activity'),
	timeago = require('timeago'),
	crypto = require('crypto');


// Private functions -------------------------------------------------------------------------

function getGravatar(email) {
	return 'http://www.gravatar.com/avatar/' + crypto.createHash('md5').update(email).digest('hex');	
}


// Exports -----------------------------------------------------------------------------------

exports.login = function(req, res){

    User.find({ email: req.body.username }, function(err, user) {

		if (user.length > 0 && user[0]) {
			req.session.userid = user[0]._id;
			req.session.name = user[0].name;
			req.session.score = user[0].score;
			req.session.gravLink = getGravatar(user[0].email);
			res.redirect('/user/dashboard');
		} else {

			res.redirect('/login');
		}

	});
};

exports.dashboard = function(req, res){

	User.findById(req.session.userid,function(err,usr){

		for (var x = 0; x < usr.activitiesCompleted.length; x++){
			usr.activitiesCompleted[x].time = timeago(usr.activitiesCompleted[x].timecompleted ? usr.activitiesCompleted[x].timecompleted.getTimestamp(): usr.activitiesCompleted[x]._id.getTimestamp());
		}

		var model = {
			activities:  usr.activitiesCompleted.reverse().slice(0,10)
		};

		model.title = 'Dashboard';
		model.user_name = req.session.name;
		model.user = usr;
		model.gLink = req.session.gravLink;
		model.ghashes = [];

		User.find().sort({score: -1}).limit(10).exec(function(err,usrs){

			model.leaders = usrs.slice(0);

			for (var i in model.leaders) {	
				model.ghashes.push(getGravatar(model.leaders[i].email));
			}

			res.render('user/dashboard', model);

		});
	});

};

