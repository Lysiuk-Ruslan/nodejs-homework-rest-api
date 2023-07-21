const mongoose = require('mongoose');

const app = require('./app')

const DB_HOST = 'mongodb+srv://Ruslan:4AM4f6xCR6679Z4M@cluster0.szzjedb.mongodb.net/db-contacts?retryWrites=true&w=majority';

// mongoose.set('strictQuery', true)

mongoose.connect(DB_HOST)
  .then(() => {

    app.listen(3000, () => {
      console.log("Database connection successful")
    })
  })
  .catch(error => {
    console.log(error.message);
    process.exit(1);
  })


