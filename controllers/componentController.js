const express = require('express');
const asyncHandler = require('async-handler');
const expressValidator = require('express-validator');

// Homepage
exports.index = (req, res, next) => {
  res.render('index.pug');
};

// Create component GET
exports.component_create_get = (req, res, next) => {
  res.send('Create component not implemented on GET');
};

// Create component POST
exports.component_create_post = (req, res, next) => {
  res.send('Create component not implemented on POST');
};

// Update component GET
exports.component_update_get = (req, res, next) => {
  res.send(`Update component not implemented on GET for ${req.params.id}`);
};

// Update component POST
exports.component_update_post = (req, res, next) => {
  res.send(`Update component not implemented on POST for ${req.params.id}`);
};

// Delete component GET
exports.component_delete_get = (req, res, next) => {
  res.send(`Delete component not implemented on GET for ${req.params.id}`);
};

// Delete component POST
exports.component_delete_post = (req, res, next) => {
  res.send( `Delete component not implemented on POST for id ${req.params.id}`);
};

// Component detail
exports.component_detail = (req, res, next) => {
  res.send(`Component detail not implemented for ${req.params.id}`);
};

// Components list

exports.component_list = (req, res, next) => {
  res.send('Component list not implemented')
}
