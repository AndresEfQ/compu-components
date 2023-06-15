const express = require('express');
const asyncHandler = require('async-handler');
const expressValidator = require('express-validator');

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

exports.brand_list = (req, res, next) => {
  res.send('brand list not implemented')
}
