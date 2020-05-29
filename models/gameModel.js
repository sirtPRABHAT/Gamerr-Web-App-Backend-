const mongoose = require('mongoose');
const slugify = require('slugify');
const User = require('./userModel');

const gameSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
    duration: {
      type: String,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: String,
      required: [true, 'A tour must have a group size'],
    },

    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },

    description: {
      type: String,
      trim: true,
      required: true,
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image'],
    },
    images: [String],
    startDates: Date,
    roomId: String,
    players_participated: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

gameSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// gameSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'players_participated', //path to filed we wnna replace
//     select: '-__v -role', //properties we don't want to select
//   });
//   next();
// });

//************************************************************************************************************* */
//this is process of making embedded data model as tours have array of guides
//but we gonna use reference type so coment it out
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => {
//     await User.findById(id);
//   });
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });
//************************************************************************************************************* */

const Games = mongoose.model('Games', gameSchema);

module.exports = Games;
