import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();
// Replace the uri string with your connection string.
const uri = process.env.MONGO_URI;
export const client = new MongoClient(uri);
