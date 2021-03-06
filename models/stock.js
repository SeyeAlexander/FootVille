const mongoose = require('mongoose')
const validator = require('validator')
const slugify = require('slugify')

const stockSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'stock must be named'],
      unique: true,
      trim: true,
      maxlength: [25, 'stockname must not be above 25 characters']
    },

    price: {
      type: Number,
      required: [true, 'a stock must have a price']
    },

    discount: {
      type: Number, 
      validate: {
        validator: function(val) {
          return val < this.price
        },
        message: 'price discount ({VALUE}) must be less than original price'
      }
    },
    
    slug: String,

    description: {
      type: String,
      trim: true,
      required: [true, 'stock must be described'],
      maxlength: [110, 'description should not be more than 110 characters']
    },

    maker: {
      type: String,
      required: [true, 'stock must have a maker'],
      maxlength: [30, 'maker must be within 30 characters']
    },

    sizes: [
      {
        type: Number,
        required: [true, 'available sizes must be described']
      }
    ],

    gender: {
      type: String,
      required: [true, 'gender must be specified'],
      enum: ['u', 'f', 'k'], 
      // Unisex, Female, kids
      default: 'u'
    },

    photo: {
      type: String,
      required: [true, 'a stock must have a picture']
    },

    ratingsQty: {
      type: Number,
      default: 0
    },

    aveRatings: {
      type: Number,
      min: 1,
      max: 5,
      default: 4.5,
      set: val => Math.round(val * 10) / 10
    },

    available: {
      type: Boolean,
      default: true
    },

    createdAt: {
      type: Date,
      default: Date.now()
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
)

stockSchema.virtual('reviews', {
  ref: 'review',
  foreignField: 'stock',
  localField: '_id'
})

stockSchema.index({ discount: 1 })
stockSchema.index({ slug: 1 })
stockSchema.index({ gender: 1 })

stockSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
})

const Stock = mongoose.model('stock', stockSchema)
module.exports = Stock
