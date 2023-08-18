const express = require('express');
const asyncHandler = require('express-async-handler');
const expressValidator = require('express-validator');

const Component = require('../models/component');

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
exports.component_detail = asyncHandler(async(req, res, next) => {
  const component = await Component.findById(req.params.id);
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
