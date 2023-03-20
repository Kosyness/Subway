import mongoose from 'mongoose';

let connection: mongoose.Connection;

export async function getMongoConnection() {
  if (connection) {
    return connection;
  }

  const uri = process.env.MONGO_URI;

  if (!uri) {
    throw new Error('MONGO_URI is not defined');
  }

  const client = await mongoose.connect(uri, {});

  connection = client.connection;

  return connection;
}