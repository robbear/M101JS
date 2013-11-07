var MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/school', function(err, db) {
    if (err) throw err;

    var query = { };

    var cursor = db.collection('students').find(query);
    cursor.each(function(err, doc) {
	if (err) throw err;
	
	if (doc == null) {
	    console.log("All done");
	    return db.close();
	}

	var scoresArray = doc.scores;
	var minHomework = 100;
	var removalIndex = -1;

	for (var i = 0; i < scoresArray.length; i++) {
	    var assignment = scoresArray[i].type;
	    var score = scoresArray[i].score;

	    if (assignment === "homework" && score < minHomework) {
		minHomework = score;
		removalIndex = i;
	    }
	}

	scoresArray.splice(removalIndex, 1);
	doc.scores = scoresArray;

	db.collection('students').update({ "_id" : doc._id }, doc, function(err, updated) {
	    if (err) throw err;
	});
    });
});
