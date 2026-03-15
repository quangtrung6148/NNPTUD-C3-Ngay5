var express = require('express');
var router = express.Router();
let productModel = require('../schemas/products');
const { default: slugify } = require('slugify');

// GET all products
router.get('/', async function(req, res, next) {
  try {
    let result = await productModel.find({
      isDeleted: false
    }).populate('category');
    res.send(result);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

// GET product by id
router.get('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let result = await productModel.findOne({
      isDeleted: false,
      _id: id
    }).populate('category');
    if (result) {
      res.send(result);
    } else {
      res.status(404).send({ message: "ID NOT FOUND" });
    }
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// POST - create new product
router.post('/', async function(req, res, next) {
  try {
    let newProduct = new productModel({
      title: req.body.title,
      slug: slugify(req.body.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      }),
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      category: req.body.category
    });
    await newProduct.save();
    res.send(newProduct);
  } catch (error) {
    res.status(400).send({ message: error.message });
  }
});

// UPDATE product
router.put('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let updateData = req.body;
    
    // Nếu update title, tự động tạo slug mới
    if (req.body.title) {
      updateData.slug = slugify(req.body.title, {
        replacement: '-',
        remove: undefined,
        lower: true,
        strict: false,
      });
    }
    
    let updatedItem = await productModel.findByIdAndUpdate(id, updateData, {
      new: true
    }).populate('category');
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

// DELETE (soft delete) product
router.delete('/:id', async function(req, res, next) {
  try {
    let id = req.params.id;
    let updatedItem = await productModel.findByIdAndUpdate(id, {
      isDeleted: true
    }, {
      new: true
    });
    res.send(updatedItem);
  } catch (error) {
    res.status(404).send({ message: error.message });
  }
});

module.exports = router;
