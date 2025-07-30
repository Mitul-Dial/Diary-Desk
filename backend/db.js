const mongoose = require("mongoose");
const mongoUri = "mongodb://localhost:27017/";

const connectToMongo = async () => {
  await mongoose.connect(mongoUri, {
    dbName: "inotebook",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("Connected to MongoDB Successfully");
};

module.exports = connectToMongo;
