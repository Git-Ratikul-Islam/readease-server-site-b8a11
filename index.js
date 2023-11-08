const express = require('express');
const cors = require('cors');
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors({ origin: ["http://localhost:5178", "https://readease-95b8a.firebaseapp.com"] }));
app.use(express.json());


console.log(process.env.DB_USER);



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.brfqf5n.mongodb.net/?retryWrites=true&w=majority`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
      serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
      }
});

async function run() {
      try {
            // Connect the client to the server	(optional starting in v4.7)
            await client.connect();

            const booksCollection = client.db('booksDB').collection('book');



            app.get('/book', async (req, res) => {
                  const cursor = booksCollection.find();
                  const result = await cursor.toArray();
                  res.send(result);
            });

            app.get('/book/:id', async (req, res) => {
                  const id = req.params.id;
                  const query = { _id: new ObjectId(id) };
                  const result = await booksCollection.findOne(query);
                  res.send(result);

            });


            app.post('/book', async (req, res) => {
                  const newBook = req.body;
                  console.log(newBook);
                  const result = await booksCollection.insertOne(newBook);
                  res.send(result);
            });

            app.put('/book/:id', async (req, res) => {
                  const id = req.params.id;
                  const filter = { _id: new ObjectId(id) };
                  const options = { upsert: true };
                  const updatedBook = req.body;
                  const book = {
                        $set: {
                              image: updatedBook.image,
                              name: updatedBook.name,
                              author: updatedBook.author,
                              category: updatedBook.category,
                              rating: updatedBook.rating,
                              quantity: updatedBook.quantity,
                              description: updatedBook.description
                        }
                  };

                  const result = await booksCollection.updateOne(filter, book, options);
                  res.send(result);
            });





            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log("Pinged your deployment. You successfully connected to MongoDB!");
      } finally {
            // Ensures that the client will close when you finish/error
            //     await client.close();
      }
}
run().catch(console.dir);




app.get('/', (req, res) => {
      res.send("Library Server Is Running");
});

app.listen(port, () => {
      console.log(`Library server is running:${port}`);
});
