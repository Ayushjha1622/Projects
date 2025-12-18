const express = require('express');
const router = express.Router();
const foodController = require('../controllers/food.controller');
const { authFoodPartnerMiddleware } = require('../middleware/auth.middleware');
const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage()
});

// /api/food  (protected) - POST
router.post(
  '/',
  authFoodPartnerMiddleware,
  upload.single('video'),
  foodController.createFood
);

// /api/food - GET
router.get(
  '/',
  foodController.getFoodItems
);

module.exports = router;
