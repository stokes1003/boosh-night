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

    const body = event.body ? JSON.parse(event.body) : null;
    const ids = body?.data?.ids;
    console.log(ids);

    if (!Array.isArray(ids) || ids.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid or missing 'ids' in request body",
        }),
      };
    }
    await client
      .db("Movie-Night")
      .collection("movies")
      .updateMany({ id: { $in: ids } }, { $set: { hasWatched: true } });
    const updatedMovies = await client
      .db("Movie-Night")
      .collection("movies")
      .find()
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
