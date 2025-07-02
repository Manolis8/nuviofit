import express from "express";

const app = express();
const port = 8080;

app.use(express.json());

app.post("/api/backendOpenai", (req, res) => {
  // Your backend logic here
  console.log("Received from frontend:", req.body);
  res.json({ reply: "Hello from backendOpenai!" });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
