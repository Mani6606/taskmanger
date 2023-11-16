import { MongoClient } from "mongodb";
// import { connectToDB } from "../../util/mongodb";
const uri =
  "mongodb+srv://user1:user123@cluster0.6gjnvof.mongodb.net/?retryWrites=true&w=majority";
const dbName = "my-site";
let cachedClient = null;

export async function connectToDB() {
  if (cachedClient) {
    return cachedClient;
  } else {
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
  }
}

export default async function handler(req, res) {
  const dbName = "my-site";
  if (req.method === "POST") {
    const { email, password } = req.body;
    const client = await connectToDB();
    const db = client.db(dbName);
    const collection = db.collection("userInfo"); // Replace "users" with your actual collection name
    const user = await collection.findOne({ Email: email });
    if (!user) {
      const result = await collection.insertOne({
        Email: email,
        Password: password,
      });
      res.status(201).json({ msg: "created" });

    } else {
      res.status(500).json({ msg: "account alredy exsist" });
    }
  }
}
