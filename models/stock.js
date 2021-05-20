const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema

const stockSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'stock must be named'],
      unique: true,
      trim: true,
      maxlength: [25, 'stockname must not have above 25 characters']
    },

    standardPrice: {
      type: Number,
      required: [true, 'a stock must have a price']
    },

    newPrice: {
      type: Number,
      required: [true, 'a stock must have a price']
    },

    slug: String,

    description: {
      type: String,
      trim: true,
      required: [true, 'a stock must described']
    },

    maker: {
      type: String,
      required: [true, 'a stock must have a maker']
    },

    sizes: [
      {
        type: Number,
        required: [true, 'available sizes must be described']
      }
    ],

    available: {
      type: Boolean,
      default: true
    },

    gender: {
      type: String,
      required: [true, 'gender must be specified'],
      enum: ['female', 'male', 'unisex'],
      default: 'unisex'
    },

    photo: {
      type: String,
      // required: [true, 'a stock must have a picture']
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

stockSchema.virtual('cartItems', {
  ref: 'cartItem',
  foreignField: 'stock',
  localField: '_id'
})

stockSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
})

const Stock = mongoose.model('stock', stockSchema)
module.exports = Stock
