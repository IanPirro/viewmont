var util = require('util'),
	fs = require('fs'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Category = mongoose.model('Category'),
	Activity = mongoose.model('Activity'),
	timeago = require('timeago');

exports.index = function(req, res){

	var category = req.params.category,
	model = {};
	model.category = category.slice(0,1).toUpperCase() + category.slice(1);

	if (category === 'food') {

		Category.find({name: { $in: ['Beer', 'Cheese', 'Farm Stands'] }}, function( err, cats ){

				User.findById(req.session.userid, function (err, usr) {

				model.cats = cats;
				model.title = 'Activities';
				model.user_name = req.session.name;
				model.completed = usr.activitiesCompleted;
				model.gLink = req.session.gravLink;

				console.log(model);
				res.render('activities/index', model);

			});
		});
	} else if (category === 'outdoors') {

		Category.find({name: { $in: ['Skiing', 'Fishing', 'Camping', "Hiking"] }}, function( err, cats ){

			User.findById(req.session.userid, function (err, usr) {

				model.cats = cats;
				model.title = 'Activities';
				model.user_name = req.session.name;
				model.completed = usr.activitiesCompleted;
				model.gLink = req.session.gravLink;

				console.log(model);
				res.render('activities/index', model);

			});
		});
	} else if (category === 'attractions') {

		Category.find({name: { $in: ['Museums'] }}, function( err, cats ){

				User.findById(req.session.userid, function (err, usr) {

				model.cats = cats;
				model.title = 'Activities';
				model.user_name = req.session.name;
				model.completed = usr.activitiesCompleted;
				model.gLink = req.session.gravLink;

				console.log(model);
				res.render('activities/index', model);

			});
		});
	}

};


exports.details = function(req, res){ 

	var id = req.params.id;

	Category.find( {'activities._id': id}, {activities: { $elemMatch: { _id: id } } } ,function( err, cats ){

		var row = cats[0].activities[0];
		var model = {
			item: row
		};

		model.title = model.item.name;
		model.user_name = req.session.name;
		model.id = id;
		model.gLink = req.session.gravLink;

		User.find({'activitiesCompleted._id': id},function( err, users ){

			model.images = [];
			model.reviews = [];

			for (var u in users){
				model.images.push(users[u]._id+"_"+id);
			}

			for (var i=0; i<users.length; i++){
				for(var j=0; j< users[i].reviews.length; j++) {
					if(users[i].reviews[j].activityId.toString() === id)
						model.reviews.push({ text: users[i].reviews[j].text, name: users[i].name, time: timeago(users[i].reviews[j]._id.getTimestamp())  });
				}
			}

			model.reviews.reverse();
			res.render('activities/details', model);

		});
	});
};

exports.complete = function(req, res){ 

	var id = req.params.id;

	Category.find( {'activities._id': id}, {activities: { $elemMatch: { _id: id } } } ,function( err, cats ){

		var row = cats[0].activities[0];
		var model = {
			item: row
		};
		model.title = model.item.name +" - Complete";
		model.user_name = req.session.name;
		model.gLink = req.session.gravLink;
		
		res.render('activities/complete', model);

	});
};

exports.completeActivity = function(req, res){ 

	var id = req.params.id;
	var uid = req.session.userid;
	var text = req.body.comment;

	fs.readFile(req.files.displayImage.path, function (err, data) {

		var newPath = "/Users/uxdeveloper/Documents/node/apptwo/files/" + uid + '_' + id + ".jpg";

	 	fs.writeFile(newPath, data, function (err) {

	  		User.update( { _id: uid},{ $inc: { score: 1 } } ).exec();

			Category.find( {'activities._id': id}, {activities: { $elemMatch: { _id: id } } } ,function( err, cats ){


				User.findById(uid, function (err, usr){

					usr.activitiesCompleted.push(cats[0].activities[0]);
					usr.reviews.push({ text: text , activityId: cats[0].activities[0]._id });
					usr.save(function(){});
					res.redirect('/user/dashboard');

				}); // END user.find
			}); // END category.find
	  	});
	});
};

exports.photo = function (req, res) {

	var name = "/Users/uxdeveloper/Documents/node/apptwo/files/" + req.params.name + '.jpg';
	res.sendfile(name);

}






