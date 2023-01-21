const express = require('express')
const app = express();
require('dotenv').config();
const cors = require('cors');
const port = process.env.PORT || 5000
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


// middle ware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.k4nyt.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db("todo").collection("tasks");
        console.log('Mongo Connected')

        // GET ALL TASK
        app.get('/tasks', async (req, res) => {
            const tasks = await taskCollection.find().toArray();
            res.send(tasks)
        });
        // POST A TASK
        app.post('/tasks', async (req, res) => {
            const task = req.body;
            const result = await taskCollection.insertOne(task);
            res.send(result)
        });
        // FIND ONE TASK
        app.get('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const task = await taskCollection.findOne(query);
            res.send(task);
        });

        // Update task

        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: updatedProduct.status,
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
            res.send(result)

        })

        // FIND USERS ALL TASK
        // app.get('/myTask', async (req, res) => {
        //     const email = req.query.email;
        //     const decodedEmail = req.decoded.email;
        //     if (email === decodedEmail) {
        //         const query = { email: email };
        //         const myTasks = await purchaseCollection.find(query).toArray();
        //         return res.send(myTasks);
        //     }
        //     else {
        //         return res.status(403).send({ message: 'Forbidden access' })
        //     }
        // });


        // DELETE A TASK
        app.delete('/task/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        });

        // DELETE A TASK
        app.delete('/tasks', async (req, res) => {
            const result = await taskCollection.deleteMany();
            res.send(result)
        });


    } finally {
        // await client.close();
    }
}

run().catch(console.dir)

app.get('/', (req, res) => {
    res.send('Hello ToDo App')
})

app.listen(port, () => {
    console.log(`Todo app listening on port ${port}`)
})