import express from "express";
import cors from "cors";
import storageRouter from "./routes/storage.js";
import zkRouter from "./routes/zkProof.js";
const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

app.use(`/storage`, storageRouter);
app.use(`/zk`, zkRouter);

app.get("/", (req, res) => {
  res.status(200).json({ message: "You are connected to the server" });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});
