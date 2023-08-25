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
      cb(new Error('Only images are allowed'))
    }
    cb(null, true)
  },
});

// models
const Category = require('../models/category');
const Component = require('../models/component');

// Create category GET
exports.category_create_get = (req, res, next) => {
  res.render('create-update-form', {formTitle: "CREATE CATEGORY"});
};

// Create category POST
exports.category_create_post = [

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

    const category = new Category({
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.file ? "/images/uploads/" + req.file.filename : "",
    });    
    
    console.log(category);
    
    if (!errors.isEmpty()) {
      console.log(errors)
      res.render('create-update-form', { 
        formTitle: 'CREATE CATEGORY',
        errors: errors.array(),
        data: category,
      });
      return;

    } else {

      await category.save();
      res.redirect(category.url);
    }
  }),
];

// Update category GET
exports.category_update_get = asyncHandler(async(req, res, next) => {
  const category = await Category.findById(req.params.id);
  res.render('create-update-form', {formTitle: `UPDATE ${category.name}`, data: category, action: `/catalog/category/${req.params.id}/update`});
});

// Update category POST
exports.category_update_post = [ 

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

    const category = new Category({
      _id: req.params.id,
      name: req.body.name,
      description: req.body.description,
      imgUrl: req.file ? "/images/uploads/" + req.file.filename : "",
    });

    if (!errors.isEmpty()) {
      console.log(errors);
      res.render('create-update-form', { 
        formTitle: `UPDATE ${category.name}`,
        errors: errors.array(),
        data: category,
      });
      return;

    } else {

      const updatedCategory = await Category.findByIdAndUpdate(req.params.id, category, {});
      res.redirect(updatedCategory.url);
    }
  }),
];

// Delete category GET
exports.category_delete_get = asyncHandler(async(req, res, next) => {

  const [category, allComponentsOfCategory] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Component.find({category: req.params.id}).exec(),
  ])

  res.render('delete-category-form', {
    formTitle: `DELETE ${category.name.toUpperCase()}`,
    category,
    allComponentsOfCategory,
  });
});

// Delete category POST
exports.category_delete_post = [
  
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
    const [category, allComponentsOfCategory] = await Promise.all([
      Category.findById(req.params.id).exec(),
      Component.find({category: req.params.id}).exec(),
    ]);

    if (allComponentsOfCategory.length > 0) {
      console.log("this category isn't empty");
      res.render('delete-category-form', {
        formTitle: `DELETE ${category.name.toUpperCase()}`,
        category,
        allComponentsOfCategory,
      })
    } else if (!errors.isEmpty()){
      res.render('delete-category-form', {
        formTitle: `DELETE ${category.name.toUpperCase()}`,
        category,
        allComponentsOfCategory,
        errors: errors.array(),
      });
    } else {
      fs.unlink('./public' + category.imgUrl);
      await Category.findByIdAndDelete(req.params.id);
      res.redirect('/catalog/categories');
    }
  }),
];

// Category detail
exports.category_detail = asyncHandler(async(req, res, next) => {
  const [category, categoryComponents] = await Promise.all([
    Category.findById(req.params.id).exec(),
    Component.find({category: req.params.id}).exec(),
  ])
  const wrappedCategories = categoryComponents.map((e) => {
    return {element: e};
  });
  res.render('lists', {title: category.name, list: wrappedCategories, singleTitle: "Component"});
});

// Categories list
exports.category_list = asyncHandler(async(req, res, next) => {
  const allCategories = await Category.find().exec();
  const count = await Promise.all(allCategories.map(async(category) => {
    const num = await Component.countDocuments({category: category.id})
    return num;
  }));
  const countedCategories = [];
  for (let i = 0; i < allCategories.length; i++) {
    countedCategories.push({
      element: allCategories[i], 
      quantity: count[i],
    })
  }
  console.log(countedCategories);
  res.render('lists', {title: 'CATEGORIES', list: countedCategories, singleTitle: "Category", url: "category"});
});
