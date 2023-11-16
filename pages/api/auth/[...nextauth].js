import CredentialsProvider from "next-auth/providers/credentials";
// import { connectToDB } from "../../util/mongodb";
import NextAuth from "next-auth";
import { MongoClient } from "mongodb";
const uri =
  "mongodb+srv://user1:user123@cluster0.6gjnvof.mongodb.net/?retryWrites=true&w=majority";
const dbName = "my-site";
let cachedClient = null;

async function connectToDB() {
  if (cachedClient) {
    return cachedClient;
  } else {
    const client = new MongoClient(uri);
    await client.connect();
    cachedClient = client;
    return client;
  }
}

const authOptions = {
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      async authorize(credentials) {
        const cl = await connectToDB();
        const client = await cl.connect();
        const db = client.db("my-site");
        const userCollection = db.collection("userInfo");
        const user = await userCollection.findOne({ Email: credentials.Email });
        console.log("credentaials", user);
        if (!user) {
          throw new Error("User not found");
        }
        console.log("passwordcheck ", credentials.Password, user.Password);
        if (!(credentials.Password === user.Password)) {
          throw new Error("Invalid password please enter correct password");
          return;
        }
        client.close();
        return { email: credentials.Email };
      },
    }),
  ],
};
export default NextAuth(authOptions);
