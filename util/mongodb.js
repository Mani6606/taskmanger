import { MongoClient } from "mongodb";
const uri = process.env.MONOGO_URI;
let CachedClient = null;
async function ConnectToDatabase() {
  if (CachedClient) return CachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  try {
    CachedClient = client;
    console.log("database connected file-mondobd.js");
    return client;
  } catch (error) {
    throw new Error("Unable to conect to database");
  }
}

export { ConnectToDatabase };
