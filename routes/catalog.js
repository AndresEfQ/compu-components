const express = require('express');
const router = express.Router();

// Require controllers
const component_controller = require('../controllers/componentController');
const brand_controller = require('../controllers/brandController');
const category_controller = require('../controllers/categoryController');
const part_controller = require('../controllers/partController');

// Component routes
router.get('/', component_controller.index);
router.get('/component/create', component_controller.component_create_get);
router.post('/component/create', component_controller.component_create_post);
router.get('/component/:id/update', component_controller.component_update_get);
router.post('/component/:id/update', component_controller.component_update_post);
router.get('/component/:id/delete', component_controller.component_delete_get);
router.post('/component/:id/delete', component_controller.component_delete_post);
router.get('/component/:id', component_controller.component_detail);
router.get('/components', component_controller.component_list);

// Brand routes
router.get('/brand/create', brand_controller.brand_create_get);
router.post('/brand/create', brand_controller.brand_create_post);
router.get('/brand/:id/update', brand_controller.brand_update_get);
router.post('/brand/:id/update', brand_controller.brand_update_post);
router.get('/brand/:id/delete', brand_controller.brand_delete_get);
router.post('/brand/:id/delete', brand_controller.brand_delete_post);
router.get('/brand/:id', brand_controller.brand_detail);
router.get('/brands', brand_controller.brand_list);

// Category routes
router.get('/category/create', category_controller.category_create_get);
router.post('/category/create', category_controller.category_create_post);
router.get('/category/:id/update', category_controller.category_update_get);
router.post('/category/:id/update', category_controller.category_update_post);
router.get('/category/:id/delete', category_controller.category_delete_get);
router.post('/category/:id/delete', category_controller.category_delete_post);
router.get('/category/:id', category_controller.category_detail);
router.get('/categories', category_controller.category_list);

// Part routes
router.get('/part/create', part_controller.part_create_get);
router.post('/part/create', part_controller.part_create_post);
router.get('/part/:id/update', part_controller.part_update_get);
router.post('/part/:id/update', part_controller.part_update_post);
router.get('/part/:id/delete', part_controller.part_delete_get);
router.post('/part/:id/delete', part_controller.part_delete_post);
router.get('/part/:id', part_controller.part_detail);
router.get('/parts', part_controller.part_list);

module.exports = router;
