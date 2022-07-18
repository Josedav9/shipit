import mongoose from "mongoose";

export class MongooseBootstrap {
  host = process.env.MONGODB_HOSTNAME;
  port = process.env.MONGODB_PORT;
  user = process.env.MONGODB_USERNAME;
  password = process.env.MONGODB_PASSWORD;
  db = process.env.MONGODB_DATABASE;
  declare uri: string;

  constructor() {
    this.uri = `mongodb://${this.host}:${this.port}`;

    mongoose.connection.on("connected", () => {
      console.info(`Mongoose connected to ${this.uri}`);
    });

    mongoose.connection.on("error", (err: string) => {
      console.info("Mongoose default connection error: " + err);
    });

    mongoose.connection.on("disconnected", function () {
      console.info("Mongoose default connection disconnected");
    });
  }

  connect() {
    return mongoose.connect(
      `mongodb://${this.user}:${this.password}@${this.host}:${this.port}/${this.db}`
    );
  }
}
