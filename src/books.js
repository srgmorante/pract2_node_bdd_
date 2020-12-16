const express = require('express');
const url = require('url');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Comment = require('./models/comment');
const User = require('./models/user');

const router = express.Router();

function validBook(book) {
    return typeof book.title == 'string'
        && typeof book.summary == 'string'
        && typeof book.author == 'string'
        && typeof book.publisher == 'string'
        && typeof book.publicationYear == 'number';
}

function toResponse(document) {

    if (document instanceof Array) {
        return document.map(elem => toResponse(elem));
    } else {
        let response = document.toObject({ versionKey: false });
        response.id = response._id.toString();
        delete response._id;
        return response;
    }
}

function fullUrl(req) {
    const fullUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });

    return fullUrl + (fullUrl.endsWith('/') ? '' : '/');
}

router.post('/api/v1/books', async (req, res) => {

    if (!validBook(req.body)) {
        res.sendStatus(400);
    } else {

        const book = new Book({
            title : req.body.title,
            summary : req.body.summary,
            author : req.body.author,
            publisher : req.body.publisher,
            publicationYear : req.body.publicationYear
        });

        await book.save();

        res.location(fullUrl(req) + book.id);
        res.json(toResponse(book));
    }
});

router.get('/api/v1/books', async (req, res) => {
    const allBooks = await Book.find().populate('comments');
    res.json(toResponse(allBooks));
});

router.get('/api/v1/books/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const book = await Book.findById(id);
    if (!book) {
        res.sendStatus(404);
    } else {
        res.json(toResponse(book));
    }
});

router.delete('/api/v1/books/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const book = await Book.findById(id);
    if (!book) {
        res.sendStatus(404);
    } else {
        await Book.findByIdAndDelete(id);
        res.json(toResponse(book));
    }
});

router.put('/api/v1/books/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const book = await Book.findById(id);
    if (!book) {
        res.sendStatus(404);
    } else {
        if (!validBook(req.body)) {
            res.sendStatus(400);
        } else {

            book.title = req.body.title,
            book.summary = req.body.summary,
            book.author = req.body.author,
            book.publisher = req.body.publisher,
            book.publicationYear = req.body.publicationYear

            await book.save();

            res.json(toResponse(book));
        }
    }
});

module.exports = { router }