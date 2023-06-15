const express = require('express');
const asyncHandler = require('async-handler');
const expressValidator = require('express-validator');

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

exports.category_list = (req, res, next) => {
  res.send('Categories list not implemented')
}
