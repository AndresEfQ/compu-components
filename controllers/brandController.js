const express = require('express');
const path = require('path');
const asyncHandler = require('express-async-handler');
const { check, body, validationResult } = require('express-validator');

// multer file handling middleware
const multer = require('multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/uploads/')
  },

  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix);
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const allowedExt = ['.png', '.jpg', '.gif', '.jpeg'];
    if (!allowedExt.includes(ext)) {
      cb(null, false);
      return;
    }
    cb(null, true);
  },
});

// models
const Brand = require('../models/brand');
const Component = require('../models/component');

// Create brand GET
exports.brand_create_get = (req, res, next) => {
  res.render('create-update-form', {formTitle: "CREATE BRAND"});
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
      imgUrl: req.file ? "/images/uploads/" + req.file.filename : "",
    });    
    
    if (!errors.isEmpty()) {
      res.render('create-update-form', { 
        formTitle: 'CREATE BRAND',
        errors: errors.array(),
        data: brand,
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
  res.render('create-update-form', {formTitle: `UPDATE ${brand.name}`, data: brand});
});

// Update brand POST
exports.brand_update_post = [

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

    const brand = await Brand.findById(req.params.id);

    const newBrand = new Brand({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.file ? "/images/uploads/" + req.file.filename : brand.imgUrl,
    });

    if (!errors.isEmpty()) {
      res.render('create-update-form', { 
        formTitle: `UPDATE ${newBrand.name}`,
        errors: errors.array(),
        data: newBrand,
      });
      return;

    } else {

      const updatedBrand = await Brand.findByIdAndUpdate(req.params.id, newBrand, {});
      res.redirect(updatedBrand.url);
    }
  }),
];

// Delete brand GET
exports.brand_delete_get = asyncHandler(async(req, res, next) => {

  const [brand, allComponentsOfBrand] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Component.find({brand: req.params.id}).exec(),
  ])

  res.render('delete-brand-form', {
    formTitle: `DELETE ${brand.name.toUpperCase()}`,
    brand,
    allComponentsOfBrand,
  });
});

// Delete brand POST
exports.brand_delete_post = [

  body('password')
    .custom((value, {req}) => {
      if (req.body.password === 'CRUD') {
        return true;
      } else {
        return false;
      }
    })
    .withMessage('Incorrect password'),

  asyncHandler(async(req, res, next) => {

    const errors = validationResult(req);
    const [brand, allComponentsOfBrand] = await Promise.all([
      Brand.findById(req.params.id).exec(),
      Component.find({brand: req.params.id}).exec(),
    ]);

    if (allComponentsOfBrand.length > 0) {
      res.render('delete-brand-form', {
        formTitle: `DELETE ${brand.name.toUpperCase()}`,
        brand,
        allComponentsOfBrand,
      })
    } else if (!errors.isEmpty()) {
      res.render('delete-brand-form', {
        formTitle: `DELETE ${brand.name.toUpperCase()}`,
        brand,
        allComponentsOfBrand,
        errors: errors.array(),
      })
    } else {
      await Brand.findByIdAndDelete(req.params.id);
      res.redirect('/catalog/brands');
    }
  }),
]

// Brand detail
exports.brand_detail = asyncHandler(async(req, res, next) => {
  const [brand, brandComponents] = await Promise.all([
    Brand.findById(req.params.id).exec(),
    Component.find({brand: req.params.id}).exec(),
  ])
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
