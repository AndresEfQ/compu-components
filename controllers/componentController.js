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

// Models

const Component = require('../models/component');
const Brand = require('../models/brand');
const Category = require('../models/category');

// Homepage
exports.index = (req, res, next) => {
  res.render('index.pug');
};

// Create component GET
exports.component_create_get = asyncHandler(async(req, res, next) => {
  const [brands, categories] = await Promise.all([
    Brand.find().exec(),
    Category.find().exec(),
  ]);
  res.render('create-update-component', {
    formTitle: "CREATE COMPONENT",
    categories,
    brands,
  });
});

// Create component POST
exports.component_create_post = [

  upload.single('imgUrl'),
  
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Name must be specified'),

  body('category')
    .notEmpty()
    .withMessage('Please choose a description'),

  body('brand')
    .notEmpty()
    .withMessage('Please choose a brand'),

  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Description must be specified'),

    body('price')
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage('The price must be a decimal number'),

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
    console.log(req.body);

    const component = new Component({
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      price: req.body.price,
      imgUrl: req.file ? "/images/uploads/" + req.file.filename : "",
    });    

    
    if (!errors.isEmpty()) {
      const [brands, categories] = await Promise.all([
        Brand.find().exec(),
        Category.find().exec(),
      ])
      res.render('create-update-component', { 
        formTitle: 'CREATE COMPONENT',
        errors: errors.array(),
        component,
        brands,
        categories,
      });

    } else {

      await component.save();
      res.redirect(component.url);
    }
  }),
];

// Update component GET
exports.component_update_get = asyncHandler(async(req, res, next) => {
  const [component, brands, categories] = await Promise.all([
    Component.findById(req.params.id).populate('category').populate('brand').exec(),
    Brand.find().exec(),
    Category.find().exec(),
  ])
  res.render('create-update-component', {
    formTitle: `UPDATE ${component.name.toUpperCase()}`,
    component,
    brands,
    categories
  });
});

// Update component POST
exports.component_update_post = [

  upload.single('imgUrl'),
  
  body('name')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Name must be specified'),

  body('category')
    .notEmpty()
    .withMessage('Please choose a description'),

  body('brand')
    .notEmpty()
    .withMessage('Please choose a brand'),

  body('description')
    .trim()
    .notEmpty()
    .escape()
    .withMessage('Description must be specified'),

    body('price')
    .trim()
    .notEmpty()
    .isNumeric()
    .withMessage('The price must be a decimal number'),

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
    console.log(req.body);

    const component = new Component({
      name: req.body.name,
      category: req.body.category,
      brand: req.body.brand,
      description: req.body.description,
      price: req.body.price,
      imgUrl: req.file ? "/images/uploads/" + req.file.filename : "",
      _id: req.params.id,
    });    

    
    if (!errors.isEmpty()) {
      const [brands, categories] = await Promise.all([
        Brand.find().exec(),
        Category.find().exec(),
      ]);
      res.render('create-update-component', { 
        formTitle: `UPDATE ${component.name.toUpperCase()}`,
        errors: errors.array(),
        component,
        brands,
        categories,
      });

    } else {

      const updatedComponent = await Component.findByIdAndUpdate(req.params.id, component, {});
      res.redirect(updatedComponent.url);
    }
  }),
];

// Delete component GET
exports.component_delete_get = (req, res, next) => {
  res.send(`Delete component not implemented on GET for ${req.params.id}`);
};

// Delete component POST
exports.component_delete_post = (req, res, next) => {
  res.send( `Delete component not implemented on POST for id ${req.params.id}`);
};

// Component detail
exports.component_detail = asyncHandler(async(req, res, next) => {
  const component = await Component.findById(req.params.id).populate('category').populate('brand').exec();
  res.render('component-detail', {component});
});

// Components list
// Must wrap the components in wrappedComponents to use the same view as brands and categories
exports.component_list = asyncHandler(async(req, res, next) => {
  const allComponents = await Component.find().exec();
  const wrappedComponents = allComponents.map(c => {
    return {element: c}});
  res.render('lists', {title: 'COMPONENTS', list: wrappedComponents, singleTitle: "Comp", url: "component"});
});
