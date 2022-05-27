const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000

const app = express()

//middleware
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.q3dit.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try{
         await client.connect();
        const inventoriesCollection = client.db('chemist-perfume').collection('inventories');
        
        app.get('/inventory', async (req, res) => {
            const limit = parseInt(req.query.limit) || 0;
            const query = {}
            const cursor = inventoriesCollection.find(query).limit(limit);

            const inventories = await cursor.toArray()
            res.send(inventories)
        })

        app.get('/inventory/:id', async (req,res) => {
            const id = req.params.id
            const query = {_id: ObjectId(id)}
            const inventory = await inventoriesCollection.findOne(query)
            res.send(inventory)
        })
    }

    finally{
        //
    }
}

run().catch(console.dir)


app.get('/', (req, res) => {
    res.send('Server is running')
})

app.listen(port, () => {
    console.log("Server is running on port", port);
})
