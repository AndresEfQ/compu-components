const express = require('express');
const asyncHandler = require('express-async-handler')
const expressValidator = require('express-validator');

const Brand = require('../models/brand');
const Component = require('../models/component');
const brand = require('../models/brand');

// Create brand GET
exports.brand_create_get = (req, res, next) => {
  res.send('Create brand not implemented on GET');
};

// Create brand POST
exports.brand_create_post = (req, res, next) => {
  res.send('Create brand not implemented on POST');
};

// Update brand GET
exports.brand_update_get = (req, res, next) => {
  res.send(`Update brand not implemented on GET for ${req.params.id}`);
};

// Update brand POST
exports.brand_update_post = (req, res, next) => {
  res.send(`Update brand not implemented on POST for ${req.params.id}`);
};

// Delete brand GET
exports.brand_delete_get = (req, res, next) => {
  res.send(`Delete brand not implemented on GET for ${req.params.id}`);
};

// Delete brand POST
exports.brand_delete_post = (req, res, next) => {
  res.send( `Delete brand not implemented on POST for id ${req.params.id}`);
};

// Brand detail
exports.brand_detail = (req, res, next) => {
  res.send(`brand detail not implemented for ${req.params.id}`);
};

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
  console.log(countedBrands);
  res.render('lists', {title: 'BRANDS', list: countedBrands});
})
