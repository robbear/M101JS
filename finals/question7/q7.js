var conn = new Mongo();
db = conn.getDB("test");

var cursor = db.images.find({});

var arrayOrphanedImages = [];

while (cursor.hasNext()) {
    var imageId = cursor.next()._id;

    var cursorAlbum = db.albums.find({"images" : imageId});
    if (!cursorAlbum.hasNext()) {
	arrayOrphanedImages.push(imageId);
    }
}

print("Ready to remove " + arrayOrphanedImages.length + " images");
db.images.remove({"_id" : {"$in" : arrayOrphanedImages}});

print("Done!");
