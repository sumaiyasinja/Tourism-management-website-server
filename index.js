const express = require('express')
const app = express()
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// Middleware
app.use(express.json());
app.use(cors());

// Replace the uri string with your MongoDB deployment's connection string.
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctrkbrk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
 const client = new MongoClient(uri);

async function run() {
  try {
    
    // databse collections
    const database = client.db("TouristSpotManagement");
    const userCollection = database.collection("users");
    const spotCollection = database.collection("spots");

    // Users API 
      app.get("/users", async (req, res) => {
        const result = await userCollection.find().toArray();
        res.send(result);
      });

      app.get("/users/:id", async (req, res) => {
        const id = req.params.id;
        const query = {
          _id: new ObjectId(id),
        };
        const result = await userCollection.findOne(query);
        console.log(result);
        res.send(result);
      });

      app.post("/users", async(req,res)=>{
        const user = req.body
        const query = { email : user.email}
        const existingUser = await userCollection.findOne(query)
        if(existingUser){
            res.send({ message: "user already exists", insertedId: null });
            return
        }
        try{
            const result = await userCollection.insertOne(user);
            res.send(result)
        }catch(error){
            res.status(500).send({ message: "Error inserting user to database", error: error.message });
        }
      })

      // Turist Spots API
      app.get("/spots", async(req,res)=>{
        const result = await spotCollection.find().toArray()
        res.send(result)       
      })
      app.post("/spots", async (req,res)=>{
        const spot = req.body;
        const result = await spotCollection.insertOne(spot);
        res.send(result)
      })
      app.get("/spots/:id", async (req, res) => {
        const id = req.params.id;
        const query = {
          _id: new ObjectId(id),
        };
        const result = await spotCollection.findOne(query);
        res.send(result);
      })



    
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello Tourist!')
})



app.listen(port, () => {
  console.log(`Server listening on port ${port}`)
})