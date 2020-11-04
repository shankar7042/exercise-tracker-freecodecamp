const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const User = require("./models/User");

mongoose.connect(process.env.MLAB_URI || "mongodb://localhost/exercise-track", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

app.post("/api/exercise/new-user", async (req, res, next) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user) {
      next({ message: "Username already taken" });
    }
    const newUser = new User({ username });

    await newUser.save();

    return res.json({
      _id: newUser._id,
      username: newUser.username,
    });
  } catch (error) {
    next(error);
  }
});

app.post("/api/exercise/add", async (req, res, next) => {
  let { userId, description, duration, date } = req.body;
  try {
    const user = await User.findById(userId);
    if (!user) {
      next({ message: "userId is incorrect" });
    }
    if (!date) {
      date = new Date().toDateString();
    } else {
      date = new Date(date);
    }
    user.log.push({
      description,
      duration,
      date,
    });

    await user.save();

    const createdLog = user.log[user.log.length - 1];

    return res.json({
      _id: user._id,
      username: user.username,
      date: createdLog.date,
      duration: createdLog.duration,
      description: createdLog.description,
    });
  } catch (error) {
    next(error);
  }
});

// Not found middleware
app.use((req, res, next) => {
  return next({ status: 404, message: "not found" });
});

// Error Handling middleware
app.use((err, req, res, next) => {
  let errCode, errMessage;

  if (err.errors) {
    // mongoose validation error
    errCode = 400; // bad request
    const keys = Object.keys(err.errors);
    // report the first validation error
    errMessage = err.errors[keys[0]].message;
  } else {
    // generic or custom error
    errCode = err.status || 500;
    errMessage = err.message || "Internal Server Error";
  }
  res.status(errCode).type("txt").send(errMessage);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
