const express = require('express');
const { MongoClient } = require('mongodb');
const { ApolloServer } = require('apollo-server-express');
const fs = require('fs');

let db;
async function connectToDb() {
	const url = 'mongodb://localhost/Marvel';
	const client = new MongoClient(url, { useNewUrlParser: true });
	await client.connect();
	console.log('Connected to MongoDB at', url);
	db = client.db();//db is a global variable, indicating the database
	console.log(await db.collection('characters').find({}).toArray());
}

const app = express();

app.use(express.static('public'));

const resolvers = {
	Query: {
		getAllCharactersinfo,
		getCharacterinfo,
	},
	Mutation: {
		addCharacter
	}
};
async function addCharacter(_, args) {
	console.log(args)
	const newcharacter = { 'name': args.name, 'gender': args.gender }
	//console.log(newcharacter)
	result = await db.collection('characters').insertOne(newcharacter);
	return true
}
async function getCharacterinfo(_, args) {
	cname = args.name
	console.log(cname)
	result = await db.collection('characters').find({ name: cname }, { name: 1, gender: 1 }).toArray();
	console.log(result)
	return result[0]
}

async function getAllCharactersinfo() {
	result = await db.collection('characters').find({}, { name: 1, gender: 1 }).toArray();
	console.log(result)
	return result

}


//Create GQL
const server = new ApolloServer({
	typeDefs: fs.readFileSync('./server/schema.graphql', 'utf-8'),
	resolvers,
	formatError: error => {
		console.log(error);
		return error;
	},
});
server.applyMiddleware({ app, path: '/graphql' });


(async function () {// anonymous function
	await connectToDb();//dont know when it will be completed, so we use async to wait for it to complete
	app.listen(3000, function () {
		console.log('App start on port 3000 successfully');
	});

})();//the brackets at the end is to call the function immediately
