const express = require('express');
const router = express.Router();

// Require controllers
const component_controller = require('../controllers/componentController');
const brand_controller = require('../controllers/brandController');
const category_controller = require('../controllers/categoryController');


/// COMPONENT ROUTES

// Index route
router.get('/', component_controller.index);

// Create component route on Get
router.get('/component/create', component_controller.component_create_get);

// Create component route on Post
router.post('/component/create', component_controller.component_create_post);

// Update component route on Get
router.get('/component/:id/update', component_controller.component_update_get);

// Update component route on Post
router.post('/component/:id/update', component_controller.component_update_post);

// Delete component route on Get
router.get('/component/:id/delete', component_controller.component_delete_get);

// Delete component route on Post
router.post('/component/:id/delete', component_controller.component_delete_post);

// Component detail route on Get
router.get('/component/:id', component_controller.component_detail);

// Components list route on Get 
router.get('/components', component_controller.component_list);


/// BRAND ROUTES

//// Create brand route on Get
router.get('/brand/create', brand_controller.brand_create_get);

// Create brand route on Post
router.post('/brand/create', brand_controller.brand_create_post);

// Update brand route on Get
router.get('/brand/:id/update', brand_controller.brand_update_get);

// Update brand route on Post
router.post('/brand/:id/update', brand_controller.brand_update_post);

// Delete brand route on Get
router.get('/brand/:id/delete', brand_controller.brand_delete_get);

// Delete brand route on Post
router.post('/brand/:id/delete', brand_controller.brand_delete_post);

// Brand detail route on Get
router.get('/brand/:id', brand_controller.brand_detail);

// Brands list route on Get 
router.get('/brands', brand_controller.brand_list);


/// CATEGORY ROUTES

//// Create category route on Get
router.get('/category/create', category_controller.category_create_get);

// Create category route on Post
router.post('/category/create', category_controller.category_create_post);

// Update category route on Get
router.get('/category/:id/update', category_controller.category_update_get);

// Update category route on Post
router.post('/category/:id/update', category_controller.category_update_post);

// Delete category route on Get
router.get('/category/:id/delete', category_controller.category_delete_get);

// Delete category route on Post
router.post('/category/:id/delete', category_controller.category_delete_post);

// Category detail route on Get
router.get('/category/:id', category_controller.category_detail);

// Categories list route on Get 
router.get('/categories', category_controller.category_list);


module.exports = router;
