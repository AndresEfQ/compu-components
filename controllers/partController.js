const express = require('express');
const asyncHandler = require('async-handler');
const expressValidator = require('express-validator');

// Create part GET
exports.part_create_get = (req, res, next) => {
  res.send('Create part not implemented on GET');
};

// Create part POST
exports.part_create_post = (req, res, next) => {
  res.send('Create part not implemented on POST');
};

// Update part GET
exports.part_update_get = (req, res, next) => {
  res.send(`Update part not implemented on GET for ${req.params.id}`);
};

// Update part POST
exports.part_update_post = (req, res, next) => {
  res.send(`Update part not implemented on POST for ${req.params.id}`);
};

// Delete part GET
exports.part_delete_get = (req, res, next) => {
  res.send(`Delete part not implemented on GET for ${req.params.id}`);
};

// Delete part POST
exports.part_delete_post = (req, res, next) => {
  res.send( `Delete part not implemented on POST for id ${req.params.id}`);
};

// Part detail
exports.part_detail = (req, res, next) => {
  res.send(`part detail not implemented for ${req.params.id}`);
};

// Parts list

exports.part_list = (req, res, next) => {
  res.send('Parts list not implemented')
}
