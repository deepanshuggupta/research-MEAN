var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var authorSchema = new Schema(
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

var Authors = mongoose.model('Author', authorSchema);
module.exports = Authors;