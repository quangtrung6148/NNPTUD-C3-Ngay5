var express = require('express');
var router = express.Router();
let userModel = require('../schemas/users');

// GET all users
router.get('/', async function (req, res, next) {
    try {
        let result = await userModel.find({
            isDeleted: false
        }).populate('role');
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET user by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await userModel.findOne({
            isDeleted: false,
            _id: id
        }).populate('role');
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// POST - create new user
router.post('/', async function (req, res, next) {
    try {
        let newUser = new userModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            fullName: req.body.fullName,
            avatarUrl: req.body.avatarUrl,
            role: req.body.role
        });
        await newUser.save();
        res.send(newUser)
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE user
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await userModel.findByIdAndUpdate(id, req.body, {
            new: true
        }).populate('role');
        res.send(updatedItem)
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// DELETE (soft delete) user
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await userModel.findByIdAndUpdate(id, {
            isDeleted: true
        }, {
            new: true
        });
        res.send(updatedItem)
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// POST /enable - enable user (set status to true)
router.post('/enable', async function (req, res, next) {
    try {
        let email = req.body.email;
        let username = req.body.username;
        console.log(email, username);
        let user = await userModel.findOne({
            isDeleted: false,
            email: email,
            username: username
        });

        if (!user) {
            return res.status(404).send({ message: "USER NOT FOUND" });
        }

        user.status = true;
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// POST /disable - disable user (set status to false)
router.post('/disable', async function (req, res, next) {
    try {
        let email = req.body.email;
        let username = req.body.username;

        let user = await userModel.findOne({
            isDeleted: false,
            email: email,
            username: username
        });

        if (!user) {
            return res.status(404).send({ message: "USER NOT FOUND" });
        }

        user.status = false;
        await user.save();
        res.send(user);
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

module.exports = router;
