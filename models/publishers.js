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
    	
        pubApplyBy: {
            type: String

        },
        pubTitle:{
            type: String

        },
        pubAbout:{
            type: String
        },
        categories: [String],
	    subCategories: [String]
	}
	
);
var Publishers = mongoose.model('publisher', publisherSchema);
module.exports = Publishers;
