const express = require("express");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const cors = require("cors");
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
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port);
