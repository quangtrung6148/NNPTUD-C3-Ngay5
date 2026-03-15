var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/roles');

// GET all roles
router.get('/', async function (req, res, next) {
    try {
        let result = await roleModel.find({
            isDeleted: false
        })
        res.send(result);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// GET role by id
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findOne({
            isDeleted: false,
            _id: id
        })
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ message: "ID NOT FOUND" });
        }
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// POST - create new role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.send(newRole)
    } catch (error) {
        res.status(400).send({ message: error.message });
    }
});

// UPDATE role
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(id, req.body, {
            new: true
        });
        res.send(updatedItem)
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// DELETE (soft delete) role
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let updatedItem = await roleModel.findByIdAndUpdate(id, {
            isDeleted: true
        }, {
            new: true
        });
        res.send(updatedItem)
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

// GET all users by role id
router.get('/:id/users', async function (req, res, next) {
    try {
        let userModel = require('../schemas/users');
        let roleId = req.params.id;
        
        // Check if role exists
        let role = await roleModel.findOne({
            isDeleted: false,
            _id: roleId
        });
        
        if (!role) {
            return res.status(404).send({ message: "ROLE NOT FOUND" });
        }
        
        let result = await userModel.find({
            isDeleted: false,
            role: roleId
        }).populate('role');
        
        res.send(result);
    } catch (error) {
        res.status(404).send({ message: error.message });
    }
});

module.exports = router;
