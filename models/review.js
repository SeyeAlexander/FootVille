const mongoose = require('mongoose')
const Stock = require('./stock')

const reviewSchema = new mongoose.Schema({
  review: {
    type: String,
    required: [true, 'review cannot be empty']
  },

  rating: {
    type: Number,
    min: 1,
    max: 5
  },

  stock: {
    type: mongoose.Schema.ObjectId,
    ref: 'stock',
    required: [true, 'review must be about an item']
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'user',
    required: [true, 'review must be writen by a user']
  },

  createdAt: {
    type: Date,
    default: Date.now()
  }
},
{
  toJSON: { virtuals: true},
  toObject: { virtuals: true}
})

reviewSchema.index({ stock: 1, user: 1 }, { unique: true })

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name'
    // add avatar/photo when field is available
  })
  next()
})

reviewSchema.statics.calcAveRating = async function(stockId) {
  const Stats = await this.aggregate([
    {
      $match: { stock: stockId }
    },
    {
      $group: {
        _id: '$stock',
        numRatings: { $sum: 1 },
        aveRating: { $avg: '$rating'}
      }
    }
  ])

  if (Stats.length > 0) {
    await Stock.findByIdAndUpdate(stockId, {
      ratingsQty: Stats[0].numRatings,
      aveRating: Stats[0].aveRating
    })
  } 
  else {
    await Stock.findByIdAndUpdate(stockId, {
      ratingsQty: 0,
      aveRating: 4.5
    })
  }
}

reviewSchema.post('save', function() {
  this.constructor.calcAveRating(this.stock)
})

reviewSchema.pre(/^findOneAnd/, async function(next) {
  this.r = await this.findOne
  next()
})

reviewSchema.post(/^findOneAnd/, async function() {
  await this.r.constructor.calcAveRating(this.r.stock)
})

const Review = mongoose.model('review', reviewSchema)
module.exports = Review