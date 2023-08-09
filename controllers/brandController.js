const express = require('express');
const asyncHandler = require('express-async-handler');
const expressValidator = require('express-validator');
const { body, validationResult } = require('express-validator');

// multer file handling middleware
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/')
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").at(-1);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + ext);
  }
});
const upload = multer({ storage: storage });

const Brand = require('../models/brand');
const Component = require('../models/component');

// Create brand GET
exports.brand_create_get = (req, res, next) => {
  res.render('create-update-form', {formTitle: "CREATE BRAND", action: "/catalog/brand/create"});
};

// Create brand POST
exports.brand_create_post = [

  upload.single('imgUrl'),
  
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Name must be specified'),

  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Description must be specified'),

  /* body('imgUrl')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Must have an image'), */

  asyncHandler(async (req, res, next) => {

    console.log(req.file);

    const errors = validationResult(req);

    const brand = new Brand({
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.body.imgUrl,
    });

    if (!errors.isEmpty()) {
      console.log("errors")
      console.log(req.body);
      res.render('create-update-form', { 
        formTitle: 'CREATE BRAND',
        errors: errors.array(),
        brand,
      });
      return;
    } else {

      await brand.save();
      res.redirect(brand.url);
    }
  }),
];

// Update brand GET
exports.brand_update_get = asyncHandler(async(req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  res.render('create-update-form', {formTitle: `UPDATE ${brand.name}`, data: brand, action: `/catalog/brand/${req.params.id}/update`});
});

// Update brand POST
exports.brand_update_post = [ 
  
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Name must be specified'),

  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Description must be specified'),

  body('imgUrl')
    .trim()
    .escape(),

  asyncHandler(async (req, res, next) => {
    console.log(body().name);
    const errors = validationResult(req);

    const brand = new Brand({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.body.imgUrl,
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('create-update-form', { 
        formTitle: `UPDATE ${brand.name}`,
        errors: errors.array(),
        brand,
      });
      return;
    } else {

      const updatedBrand = await brand.findByIdAndUpdate(req.params.id, brand, {});
      res.redirect(updatedBrand.url);
    }
  }),
];

// Delete brand GET
exports.brand_delete_get = (req, res, next) => {
  res.send(`Delete brand not implemented on GET for ${req.params.id}`);
};

// Delete brand POST
exports.brand_delete_post = (req, res, next) => {
  res.send( `Delete brand not implemented on POST for id ${req.params.id}`);
};

// Brand detail
exports.brand_detail = asyncHandler(async(req, res, next) => {
  const brand = await Brand.findById(req.params.id).exec();
  const brandComponents = await Component.find({brand: req.params.id}).exec();
  const wrappedComponents = brandComponents.map(e => {
    return {element: e}
  });
  res.render('lists', {title: brand.name.toUpperCase(), list: wrappedComponents, singleTitle: "Component"});
});

// Brands list
exports.brand_list = asyncHandler(async(req, res, next) => {
  const allBrands = await Brand.find().exec();
  const count = await Promise.all(allBrands.map(async(brand) => {
    const num = await Component.countDocuments({brand: brand.id})
    return num;
  }));
  const countedBrands = [];
  for (let i = 0; i < allBrands.length; i++) {
    countedBrands.push({
      element: allBrands[i], 
      quantity: count[i],
    })
  }
  res.render('lists', {title: 'BRANDS', list: countedBrands, singleTitle: "Brand", url: "brand"});
});
