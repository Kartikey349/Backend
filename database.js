const {MongoClient} = require("mongodb")
require('dotenv').config();


const url = process.env.DB_URL;

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


    //delete a document
    // const deletedData = await collection.deleteOne(data);
    // console.log("deleted data => ", deletedData);


    //insert a data
    // const insertData = await collection.insertMany([data]);
    // console.log("inserted data => ", insertData)


    //Updating a field or doc
    // const update = {$set: {firstname:"Shubh", address: "3 Nassau St"}}
    // const updated = await collection.updateOne(data, update)
    // console.log("updated => ", updated);

    const findResult = await collection.find({}).toArray();
    console.log("found documents =>", findResult);


    // const result = await collection.find({firstname: "Kartikey"}).count();
    // console.log("result => ", result)

    // const count = await collection.countDocuments({firstname: "Kartikey"});
    // console.log("count => ", count);


    return "done";
}

main().then(console.log)
.catch(console.error)
.finally(() => {client.close});