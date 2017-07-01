var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var applicationSchema = new Schema(
	{
		authorEmail: {
        	type: String
    	},
        pubEmail: {
            type: String
        },
        title: {
            type: String
        },
        department: {
            type: String
        },
    	name: {
    		type: String
    	},
    	appEmail: {
    		type: String
    		
    	},
    	phone: {
	        type: String
	    },
        correspondingAuthor: {
            type: Boolean
        },
        manTitle: {
            type: String
        },
        manAbstract:{
            type: String

        },
        pubAbout:{
            type: String
        },
        status:{
            type: String
        },
        pubAbout:{
            type: String
        },
        docUrl:{
            type: String
        }
        
	}
	
);
var Applications = mongoose.model('application', applicationSchema);
module.exports = Applications;
