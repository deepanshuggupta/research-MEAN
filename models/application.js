var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var applicationSchema = new Schema(
	{
		authorEmail: {
        	type: String
    	},
        pubId: {
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
        status:{
            type: String
        },
        docUrl:{
            type: String
        },
        rating:{
            type: String
        },
        comment:{
            type: String
        }
        
	}
	
);
var Applications = mongoose.model('application', applicationSchema);
module.exports = Applications;
