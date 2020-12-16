const express = require('express');
const url = require('url');
const mongoose = require('mongoose');
const Book = require('./models/book');
const Comment = require('./models/comment');
const User = require('./models/user');


const router = express.Router();

function validComments(comment) {
    return typeof comment.comment == 'string'
        && typeof comment.score == 'number';
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

router.post('/api/v1/books/:id/comments', async (req, res) => {

    if (!validComments(req.body)) {
        res.sendStatus(400);
    } else {
        const bookId = req.params.id;

        const comment = new Comment({
            comment: req.body.comment,
            score: req.body.score,
            book: bookId
        });

        await comment.save();
        const bookById = await Book.findById(bookId);

        bookById.comments.push(comment);
        await bookById.save();

        res.location(fullUrl(req) + comment.id);
        res.json(toResponse(comment));
    }
});

router.get('/api/v1/comments', async (req, res) => {
    const allComments = await Comment.find().exec();
    res.json(toResponse(allComments));
});

router.get('/api/v1/comments/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const comment = await Comment.findById(id);
    if (!comment) {
        res.sendStatus(404);
    } else {
        res.json(toResponse(comment));
    }
});

router.delete('/api/v1/comments/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const comment = await Comment.findById(id);
    if (!comment) {
        res.sendStatus(404);
    } else {
        await Comment.findByIdAndDelete(id);
        res.json(toResponse(comment));
    }
});

module.exports = { router }