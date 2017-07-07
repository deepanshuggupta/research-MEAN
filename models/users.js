var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema(
	{
		userEmail: {
        	type: String,
        	required: true,
        	unique: true
    	},

	    role: {
	        type: String,
	        required: true
	    },
	    userPassword:{
	    	type: String,
	    	required: true
	    }
	}, 
	{
    	timestamps: true
	}
);





var Users = mongoose.model('User', userSchema);




module.exports = Users;

