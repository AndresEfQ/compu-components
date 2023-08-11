const express = require('express');
const fs = require('fs');
const asyncHandler = require('express-async-handler');
const { check, body, validationResult } = require('express-validator');

// multer file handling middleware
const multer = require('multer');
const storage = multer.diskStorage({

  destination: (req, file, cb) => {
    cb(null, 'public/images/tmp/')
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  }
});

const upload = multer({ storage: storage });

// models
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

  check('imgUrl')
    .custom((value, {req}) => {
      if (req.file.mimetype.split('/')[0] === "image") {
        return "image";
      } else {
        return false;
      }
    })
    .withMessage('Please upload an image file'),

  asyncHandler(async (req, res, next) => {

    const errors = validationResult(req);

    const brand = new Brand({
      name: req.body.name,
      description: req.body.description,
      imgUrl: "/images/tmp/" + req.file.filename,
    });
    
    console.log(brand);
    
    if (!errors.isEmpty()) {
      console.log(errors)
      res.render('create-update-form', { 
        formTitle: 'CREATE BRAND',
        errors: errors.array(),
        data: brand,
      });
      return;

    } else {

      /* fs.rename("/" + req.file.path, "/public/images/upload/" + req.file.filename, (err) => {
        if (err) {
          next(err);
        }
      }); */

      brand.imgUrl = "/images/upload/" + req.file.filename;
      console.log(brand);
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
