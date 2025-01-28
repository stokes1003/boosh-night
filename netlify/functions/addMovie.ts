import { Handler } from "@netlify/functions";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";
dotenv.config();
// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

const handler: Handler = async (event) => {
  try {
    await client.connect();
    const movie = event.body ? JSON.parse(event.body) : null;
    movie.hasWatched = false;
    movie.watchedDate = "";
    await client.db("Movie-Night").collection("movies").insertOne(movie);
    const updatedMovies = await client
      .db("Movie-Night")
      .collection("movies")
      .find({ hasWatched: false })
      .toArray();
    return { statusCode: 200, body: JSON.stringify(updatedMovies) };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Error connecting to db" }),
    };
  }
};

export { handler };
