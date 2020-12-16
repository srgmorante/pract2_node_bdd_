const express = require('express');
const mongoose = require('mongoose');
const booksRouter = require('./books.js').router;
//const usersRouter = require('./users.js').router;
const commentsRouter = require('./comments.js').router;
const booksInit = require('./books.js').init;
//const usersInit = require('./users.js').init;
const commentsInit = require('./comments.js').init;
const mongoUrl = "mongodb://localhost:27017/books";

const app = express();

//Convert json bodies to JavaScript object
app.use(express.json());

app.use(booksRouter);
//app.use(usersRouter);
app.use(commentsRouter);

async function main() {

    await mongoose.connect(mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    });

    app.listen(3000, () => {
        console.log('Example app listening on port 3000!');
    });
}

main();