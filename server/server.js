const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  dob: { type: Date, required: true },
});

const userData = mongoose.model("userData", userSchema);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("DB connected"))
  .catch((error) => console.log("connection error:", error));

app.post("/api/submit", async (req, res) => {
  const { name, email, dob } = req.body.formData;
  const newUser = new userData({
    name,
    email,
    dob,
  });
  await newUser.save();
  res.json(newUser);
});

app.get("/api/users", async (req, res) => {
  const users = await userData.find();
  res.json(users);
});

app.delete("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await userData.findByIdAndDelete(id);
    res.json({ message: "user deleted" });
  } catch (error) {
    res.status(500).json({ message: "error deleting user", error });
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, dob } = req.body.formData;
    const updatedUser = await userData.findByIdAndUpdate(
      id,
      { name, email, dob },
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "error updtaing user", error });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
