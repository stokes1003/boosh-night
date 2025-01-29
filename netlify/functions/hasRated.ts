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
    const currentRating = body?.data?.hasRated;
    console.log(body);

    if (!Array.isArray(ids) || ids.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Invalid or missing 'ids' in request body",
        }),
      };
    }

    const id = ids[0];

    await client
      .db("Movie-Night")
      .collection("movies")
      .updateOne({ id: id }, { $push: { hasRated: currentRating } });
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
