const express = require('express');
const mongoose = require('mongoose');
const booksRouter = require('./books.js').router;
const usersRouter = require('./users.js').router;
const commentsRouter = require('./comments.js').router;
const neighborhoodRouter = require('./routers/neighborhoodRouter.js').router;
const booksInit = require('./books.js').init;
//const usersInit = require('./users.js').init;
const commentsInit = require('./comments.js').init;
const mongoUrl = 'mongodb+srv://admin:<password>@cluster0.ti0hu.mongodb.net/<dbname>?retryWrites=true&w=majority';

const app = express();

//Convert json bodies to JavaScript object
app.use(express.json());

app.use(booksRouter);
app.use(usersRouter);
app.use(commentsRouter);
app.use(neighborhoodRouter);

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