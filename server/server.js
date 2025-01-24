import express from 'express';
import { client } from './db.js';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT

app.use(cors());
app.use(express.json());

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

app.get('/get-movies', async (req, res) => {
  try {
    const movies = await client
      .db('Movie-Night')
      .collection('movies')
      .find()
      .toArray();
    res.status(200).json(movies);
  } catch (error) {
    console.error(error);
    res.json({ message: 'Error connecting to db' });
  }
});

app.post('/add-movie', async (req, res) => {
  try {
    const movie = req.body;
    await client.db('Movie-Night').collection('movies').insertOne(movie);
    const updatedMovies = await client
      .db('Movie-Night')
      .collection('movies')
      .find()
      .toArray();
    res.status(200).json(updatedMovies);
  } catch (error) {
    console.error(error);
    res.json({ message: 'Error connecting to db' });
  }
});

app.delete('/delete-movie', async (req, res) => {
  try {
    const { ids } = req.body;
    await client
      .db('Movie-Night')
      .collection('movies')
      .deleteMany({ id: { $in: ids } });
    const updatedMovies = await client
      .db('Movie-Night')
      .collection('movies')
      .find()
      .toArray();
    res.status(200).json(updatedMovies);
  } catch (error) {
    console.error(error);
    res.json({ message: 'Error connecting to db' });
  }
});

connectToDatabase().then(() => {
  app.listen(port, () => {
    console.log(`Movie app listening on port ${port}`);
  });
});
