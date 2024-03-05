const express = require('express');
const { MongoClient } = require('mongodb');

let db;
async function connectToDb() {
	const url = 'mongodb://localhost/Marvel';
	const client = new MongoClient(url, { useNewUrlParser: true });
	await client.connect();
	console.log('Connected to MongoDB at', url);
	db = client.db();
	console.log(await db.collection('characters').find({}).toArray());
}

const app = express();

app.use(express.static('public'));

(async function () {
await connectToDb();	
app.listen(3000, function () {
	  console.log('App start on port 3000 successfully');
});

})
