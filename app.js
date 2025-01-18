const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const userRouter = require("./routes/userRoutes");
const AppError = require("./Utils/APPErrors");

const globalErrorHandler = require("./controllers/errorController");
const ExpressMongoSanitize = require("express-mongo-sanitize");

const app = express();

dotenv.config({ path: "./config.env" });

//Set Security HTTP headers
app.use(helmet());

// 1)Middlewears
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
// console.log(process.env.NODE_ENV);

//Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

//Data sanitization against XSS
app.use(xss());
// git remote add origin https://github.com/Arya-Lingayat/To-let-Globe-Authentication.git
// git branch -M main
// git push -u origin main
app.use((req, res, next) => {
  console.log(`Hello from the middlewear`);
  next();
});

//Test middlewear
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// app.use("/", (req, res) => {
//   res.status(200).json({
//     message: "Hello from the server side!",
//     requestedAt: req.requestTime,
//   });
// });

app.use("/api/v1/users", userRouter);

app.all("*", (req, res, next) => {
  // res.status(404).json({
  //   status: 'fail',
  //   message: `Can't find ${req.originalUrl} on this server`,
  // });

  // const err = new Error(`Can't find ${req.originalUrl} on this server`);
  // err.status = 'fail';
  // err.statusCode = 404;
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

const DB = process.env.MONGODB_URL.replace(
  "<PASSWORD>",
  process.env.MONGODB_PASSWORD
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log(`DB Connection is successful`);
  });

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
