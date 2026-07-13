import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error("MONGODB_URI is not defined in .env.local");
}

// Cache the MongoClient promise in the global scope so it survives hot reloads
// in development AND persists across invocations in production Node.js processes.
// Without this, production builds create a new client on every module import.
const globalWithMongo = global as typeof global & { _mongoClientPromise?: Promise<MongoClient> };

if (!globalWithMongo._mongoClientPromise) {
  const client = new MongoClient(uri);
  globalWithMongo._mongoClientPromise = client.connect();
}

const clientPromise: Promise<MongoClient> = globalWithMongo._mongoClientPromise;

export default clientPromise;
