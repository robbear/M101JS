var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/weather', function(err, db) {
    if (err) throw err;

    var prevState = "";
    var updateArray = [];

    var query = { };
    var projection = { 'State' : 1, 'Temperature' : 1 };
    var options = {'sort' : [['State', 1], ['Temperature', -1]] };

    var cursor = db.collection('data').find(query, projection, options);
    cursor.each(function(err, doc) {
	if (err) throw err;
	if (doc == null) {
	    console.log("Here are the saved items to update:");
	    for (var i = 0; i < updateArray.length; i++) {
		console.dir(updateArray[i]);
	    }

	    // Now update the database
	    for (var i = 0; i < updateArray.length; i++) {
		var query = { '_id' : updateArray[i]._id };
		var operator = { '$set' : { 'month_high' : true } };
		console.log("Updating for query= " + JSON.stringify(query) + " and operator= " + JSON.stringify(operator));
		db.collection('data').update(query, operator, function(err, doc) {
		    if(err) throw err;
		    console.log("Successfully updated:");
		    console.dir(doc);
		});
	    }

	    return db.close();
	}

	if (prevState !== doc.State) {
	    console.log("New state: " + doc.State + " with high temperature of " + doc.Temperature);
	    prevState = doc.State;

	    updateArray.push({ "_id" : doc._id, "State" : doc.State, "Temperature" : doc.Temperature});
        }
    });
});
