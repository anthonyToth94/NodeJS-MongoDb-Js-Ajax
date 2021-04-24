/*

View Engine => EJS Project

*/
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const ObjectId = require("mongodb").ObjectID;
require('dotenv').config();

//USE PUBLIC MAP
app.use(express.static("public"));

//SET VIEW ENGINE
app.set("view engine", "ejs");

function getClient() {
  const MongoClient = require("mongodb").MongoClient;
  const uri =
    `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.6x9nh.mongodb.net/<dbname>?retryWrites=true&w=majority`;
  return new MongoClient(uri, { useNewUrlParser: true });
}
//GET / DATA
app.get("/", (req, res) => {
  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("todo_app").collection("list");
    // perform actions on the collection object
    const list = await collection.find().toArray();
    res.render("index", { list: list });
    client.close();
  });
});

function getId(param) {
  try {
    return new ObjectId(param);
  } catch (err) {
    return "";
  }
}

//DELETE BY ID
app.delete("/list/:id", (req, res) => {
  const id = getId(req.params.id);
  if (!id) {
    res.status(404);
    res.send({ error: "Invalid ID!" });
    return;
  }

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("todo_app").collection("list");
    // perform actions on the collection object
    const item = await collection.deleteOne({ _id: id });
    if (!item.deletedCount) {
      res.status(404);
      res.send({ error: "You cant insert this product!" });
      return;
    }
    res.send({ id: req.params.id });
    client.close();
  });
});

//POST
app.post("/list", bodyParser.json(), (req, res) => {
  const newItem = {
    name: req.body.name,
  };

  const client = getClient();
  client.connect(async (err) => {
    const collection = client.db("todo_app").collection("list");
    // perform actions on the collection object
    const item = await collection.insertOne(newItem);
    if (!item.insertedCount) {
      res.status(404);
      res.send({ error: "You cant insert this product!" });
      return;
    }
    res.send(newItem);
    client.close();
  });
});

app.listen(4000);
