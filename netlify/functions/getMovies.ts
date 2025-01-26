import { builder, Handler } from '@netlify/functions'
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

const myHandler: Handler = async (event, context) => {

  try {
    await client.connect();
    const movies = await client
      .db('Movie-Night')
      .collection('movies')
      .find()
      .toArray();
    return {
        statusCode: 200,
        body: JSON.stringify({
         movies
        })
      }
  } catch (error) {
    console.error(error);
    return {
        statusCode: 200,
        body: JSON.stringify({
        message: "Error connecting to db"
        })
      }
  }
}

const handler = builder(myHandler)

export { handler }
