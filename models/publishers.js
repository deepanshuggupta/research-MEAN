var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var subCategoriesSchema = new Schema(
    {
        subCategoryName:{
            type: String
        }
    }   

);


var categorySchema = new Schema(
    {
        categoryName:{
            type: String
        },
        subCategories: [subCategoriesSchema]
    }
);


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
        categories: [categorySchema]
	    
	}
	
);
var Publishers = mongoose.model('publisher', publisherSchema);
module.exports = Publishers;
