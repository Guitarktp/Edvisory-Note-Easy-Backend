import app from "./app.js";

const PORT = process.env.PORT ;


// start the Express server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT} `);
});


