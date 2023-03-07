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
        const notesCollection = client.db("noteKeeper").collection("notes");
        console.log('MongoDB Connected Yes Yes')

        // Notes API's
        // Get All Note
        app.get('/notes', async (req, res) => {
            const notes = await notesCollection.find().toArray();
            res.send(notes)
        });

        // Post A Note
        app.post('/notes', async (req, res) => {
            const note = req.body;
            const result = await notesCollection.insertOne(note);
            res.send(result)
        });

        // Find One Note
        app.get('/note/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const note = await notesCollection.findOne(query);
            res.send(note);
        });

        // Update Note
        app.put('/note/:id', async (req, res) => {
            const id = req.params.id;
            const updatedNote = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set:
                    updatedNote
            };
            const result = await notesCollection.updateOne(filter, updatedDoc, options);
            res.send(result)
        });

        // Delete A Note
        app.delete('/note/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) };
            const result = await notesCollection.deleteOne(query);
            res.send(result)
        });

        // Delete All Deleted Notes
        app.delete('/empty_trash', async (req, res) => {
            const filter = { isDeleted: true };
            const result = await notesCollection.deleteMany(filter);
            res.send(result)
        });


        // Task API's
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

        // DELETE A TASK
        app.delete('/task/:id', async (req, res) => {
            const id = req.params;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        });

        // DELETE All TASK
        app.delete('/tasks', async (req, res) => {
            const result = await taskCollection.deleteMany();
            res.send(result)
        });

        // UPDATE A TASK
        app.put('/task/:id', async (req, res) => {
            const id = req.params.id;
            const updatedProduct = req.body;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updatedDoc = {
                $set: {
                    status: updatedProduct.status,
                    task: updatedProduct.task,
                }
            };
            const result = await taskCollection.updateOne(filter, updatedDoc, options);
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