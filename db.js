var mongoose = require( 'mongoose' );

var customerSchema = mongoose.Schema({
	name: String,
	email: String,
	phone: String,
	picture: String
});

var activitySchema = mongoose.Schema({
	_id: mongoose.Schema.Types.ObjectId,
	name: String,
	address: String,
	phone: String,
	email: String,
	timecompleted: mongoose.Schema.Types.ObjectId
});

var categorySchema = mongoose.Schema({
	name: String,
	activities: [activitySchema]
});

var badgeSchema = mongoose.Schema({
	name: String,
	asset: String
});

var userSchema = mongoose.Schema({
	name: String,
	email: String,
	password: String,
	friends: [ mongoose.Schema.Types.ObjectId ],
	badges: [badgeSchema],
	score: {type:Number,default:0},
	activitiesCompleted: [activitySchema],
	reviews: [{ text: String, activityId: mongoose.Schema.Types.ObjectId }]
});


mongoose.model( 'Customer', customerSchema );
mongoose.model( 'User', userSchema );
mongoose.model( 'Activity', activitySchema );
mongoose.model( 'Badge', badgeSchema );
mongoose.model( 'Category', categorySchema );

mongoose.connect( 'mongodb://localhost/test' );

