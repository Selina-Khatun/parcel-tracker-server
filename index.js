const express = require('express');
const app = express();
require('dotenv').config()
const cors = require('cors');
const port = process.env.PORT || 5000;
// middleware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.BD_USER}:${process.env.BD_PASS}@cluster0.ihxtrhm.mongodb.net/?retryWrites=true&w=majority`;

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
        const userCollection = client.db("parcelDb").collection('users');
        const reviewsCollection = client.db("parcelDb").collection('reviews');

        app.post('/users', async (req, res) => {
            const user = req.body;
            const query = { email: user.email,name:user.name,photo:user.photo }
            const existingUser = await userCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: "user already exists", insertedId: null })
            }
            const result = await userCollection.insertOne(user);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('parcel-tracker is running')
})
app.listen(port, () => {
    console.log(`parcel-tracker is running on port${port}`)
})