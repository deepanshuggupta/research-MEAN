
var categoryconvertor  = function (c) {
	var count =0;
	var field = '';
	var category =[];
	var cat = String(c);
	for (var i=0;i< cat.length;i++){
		if(cat.charAt(i)==',' || i== cat.length-1){
			if(i==cat.length-1){
				field+= cat.charAt(i);
			}
			category[count] = field;
	      	count++;
	      	field ='';
		}
	  else{
	  	field+= cat.charAt(i);
	  }
	}
	return category;
}

module.exports = categoryconvertor;

/*var cat = 'deepu, gupta, deepanshu';
var category = categoryconvertor(cat);
console.log(category);*/