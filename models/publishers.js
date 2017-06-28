var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var publisherSchema = new Schema(
	{
		userEmail: {
        	type: String,
        	required: true,
    	},
    	firstName: {
    		type: String,
    		required: true,
    	},
    	lastName: {
    		type: String
    		
    	},
    	userPassword: {
	        type: String,
	        required: true
	    }
	    
	}
	
);
var Publishers = mongoose.model('publisher', publisherSchema);
module.exports = Publishers;
