const {MongoClient} = require("mongodb")

const url = "mongodb+srv://kartikey349:gLvL0uWEJDaVpMYX@namastenode.6d8emxm.mongodb.net/";

const client = new MongoClient(url);

const dbName = "userInfo";

async function main(){
    await client.connect();
    console.log("connected successfully to server");
    const db = client.db(dbName);
    const collection = db.collection("User");

    const data = {
        firstname: 'Sarvan',
        Lastname: 'Banjara',
        Age: '22',
        country: 'India'
    }

    const insertData = await collection.insertMany([data]);
    console.log("inserted data => ", insertData)

    const findResult = await collection.find({}).toArray();
    console.log("found documents =>", findResult);


    return "done";
}

main().then(console.log)
.catch(console.error)
.finally(() => {client.close});