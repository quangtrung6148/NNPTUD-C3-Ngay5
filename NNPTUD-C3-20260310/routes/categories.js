var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/categories');
const { default: slugify } = require('slugify');

// GET all categories
router.get('/', async function (req, res, next) {
  try {
    let result = await categoryModel.find({
      isDeleted: false
    })
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET category by id
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await categoryModel.findOne({
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

// POST - create new category
router.post('/', async function (req, res, next) {
  try {
    let newCate = new categoryModel({
      name: req.body.name,
      slug: slugify(req.body.name, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      }),
      description: req.body.description,
      image: req.body.image
    });
    await newCate.save();
    res.send(newCate)
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// UPDATE category
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updateData = req.body;
    
    // Nếu update name, tự động tạo slug mới
    if (req.body.name) {
      updateData.slug = slugify(req.body.name, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      });
    }
    
    let updatedItem = await categoryModel.findByIdAndUpdate(id, updateData, {
      new: true
    });
    res.send(updatedItem)
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// DELETE (soft delete) category
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await categoryModel.findByIdAndUpdate(id, {
      isDeleted: true
    }, {
      new: true
    });
    res.send(updatedItem)
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
