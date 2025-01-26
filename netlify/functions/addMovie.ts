import { builder, Handler } from '@netlify/functions'
import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI!;
export const client = new MongoClient(uri);

const myHandler: Handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({
                error: 'Method Not Allowed',
            }),
        };
    } 
    return {
        statusCode: 200,
        body: JSON.stringify({
        message: 'Hello World',
        }),
    }
}

const handler = builder(myHandler)

export { handler }


//   try {
//     await client.connect();
//     const movie = event.body ? JSON.parse(event.body) : null;
//     await client.db('Movie-Night').collection('movies').insertOne(movie);
//     const updatedMovies = await client
//       .db('Movie-Night')
//       .collection('movies')
//       .find()
//       .toArray();
//     return { statusCode: 200, body: JSON.stringify(updatedMovies) };
//   } catch (error) {
//     console.error(error);
//     return { statusCode: 200, body: JSON.stringify({ message: 'Error connecting to db' }) };
//   }
