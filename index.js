const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

app.use(express.json())
app.use(cors())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.usnai.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        client.connect();
        const selectorsCollection = client.db("assessment").collection("selectors")
        const usersCollection = client.db("assessment").collection("users")

        app.get('/sectors', async (req, res) => {
            const result = await selectorsCollection.find({}).toArray();
            res.send(result)
        })

        app.post('/users', async (req, res) => {
            const data = req.body;
            // console.log(data);
            try {
                const result = await usersCollection.insertOne(data)
                res.send(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })

        app.get('/users', async (req, res) => {
            try {
                const result = await usersCollection.find({}).toArray();
                res.send(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })

        app.patch('/user/:id', async (req, res) => {
            const { id } = req.params;
            const data = req.body;
            console.log(data);
            try {
                const result = await usersCollection.updateOne({ _id: ObjectId(id) }, { $set: { name: data.name, selectors: data.selectors } })
                res.send(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })

        app.delete('/user/:id', async (req, res) => {
            const { id } = req.params;
            try {
                const result = await minionCollection.deleteOne({ _id: ObjectId(id) })
                res.send(result)
            } catch (err) {
                res.status(400).json(err)
            }
        })

    } finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('app is running')
})

app.listen(port, () => {
    console.log('app is running with ' + port);
})