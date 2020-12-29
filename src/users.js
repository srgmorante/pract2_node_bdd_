const express = require('express');
const url = require('url');
const mongoose = require('mongoose');
const User = require('./models/user');


const router = express.Router();

function validUser(user) {
    return typeof user.nick == 'string'
        && typeof user.mail == 'string';
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

router.post('/api/v1/users', async (req, res) => {

    if (!validUser(req.body)) {
        res.sendStatus(400);
    } else {
        const { nick, mail } = req.body;
        const user = new User({
            nick,
            mail
        });

        await user.save();

        res.location(fullUrl(req) + user.id);
        res.json(toResponse(user));
    }
});

router.get('/api/v1/users', async (req, res) => {
    const allUsers = await User.find().exec();
    res.json(toResponse(allUsers));
});

router.get('/api/v1/users/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const user = await User.findById(id);
    if (!user) {
        res.sendStatus(404);
    } else {
        res.json(toResponse(user));
    }
});

router.delete('/api/v1/users/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const user = await User.findById(id);
    if (!user) {
        res.sendStatus(404);
    } else {
        await User.findByIdAndDelete(id);
        res.json(toResponse(user));
    }
});

router.put('/api/v1/users/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const user = await User.findById(id);
    if (!user) {
        res.sendStatus(404);
    } else {
        if (!validUser(req.body)) {
            res.sendStatus(400);
        } else {

            user.nick = req.body.nick;
            user.mail = req.body.mail;

            await user.save();

            res.json(toResponse(user));
        }
    }
});

module.exports = { router }