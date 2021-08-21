const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require("mongodb").ObjectId;
const fileUpload = require("express-fileupload");

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7adfu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const port = 5000;
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static("serviceImg"));
app.use(fileUpload());

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const serviceCollection = client.db("photographysite").collection("service");
  const orderCollection = client.db("photographysite").collection("Orders");

  //addService for admin
  app.post("/addService", (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const description = req.body.description;
    const price = req.body.price;
    const newImg = file.data;
    const encImg = newImg.toString("base64");

    var addImage = {
      contentType: file.mimetype,
      size: file.size,
      img: Buffer.from(encImg, "base64"),
    };

    serviceCollection
      .insertOne({ title, description, price, addImage })
      .then((result) => {
        res.send(result.insertedCount > 0);
      });
  });

  //home page a service showing
  app.get("/getService", (req, res) => {
    serviceCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //orderForm
  app.post("/addOrder", (req, res) => {
    const order = req.body;
    orderCollection.insertOne(order).then((result) => {
      res.send(result.insertedCount > 0);
    });
  });
  //getOrder in the orderList
  app.get("/getOrder", (req, res) => {
    orderCollection.find({}).toArray((err, documents) => {
      res.send(documents);
    });
  });

  //for delete
  //delete korer jonno registerList theke
  app.delete("/delete/:id", (req, res) => {
    orderCollection
      .deleteOne({ _id: ObjectId(req.params.id) })
      .then((result) => {
        // console.log(result);
        result.deletedCount > 0;
      });
  });
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
