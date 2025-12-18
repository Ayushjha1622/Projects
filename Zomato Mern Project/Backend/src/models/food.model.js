const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  video:{
    type: String,
    required: true,
  },
  desription: {
    type: String,
  },
  foodPartner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodPartner',
    required: true,
  }

})

const foodModel = mongoose.model('food', foodSchema)
module.exports = foodModel