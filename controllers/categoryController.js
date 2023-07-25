const express = require('express');
const asyncHandler = require('express-async-handler');
const expressValidator = require('express-validator');

const Category = require('../models/category');
const Component = require('../models/component');

// Create category GET
exports.category_create_get = (req, res, next) => {
  res.send('Create category not implemented on GET');
};

// Create category POST
exports.category_create_post = (req, res, next) => {
  res.send('Create category not implemented on POST');
};

// Update category GET
exports.category_update_get = (req, res, next) => {
  res.send(`Update category not implemented on GET for ${req.params.id}`);
};

// Update category POST
exports.category_update_post = (req, res, next) => {
  res.send(`Update category not implemented on POST for ${req.params.id}`);
};

// Delete category GET
exports.category_delete_get = (req, res, next) => {
  res.send(`Delete category not implemented on GET for ${req.params.id}`);
};

// Delete category POST
exports.category_delete_post = (req, res, next) => {
  res.send( `Delete category not implemented on POST for id ${req.params.id}`);
};

// Category detail
exports.category_detail = (req, res, next) => {
  res.send(`Category detail not implemented for ${req.params.id}`);
};

// Categories list

exports.category_list = asyncHandler(async(req, res, next) => {
  const allCategories = await Category.find().exec();
  console.log(allCategories);
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
  res.render('lists', {title: 'CATEGORIES', list: countedCategories, singleTitle: "Category"});
});
