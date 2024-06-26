const mongoose = require('mongoose');

const StoreSchema = new mongoose.Schema(
  {
    storeName: {
      type: String,
      required: true,
      index: true,
    },
    storeAddress: {
      type: String,
      required: true,
      index: true,
    },
    storeContact: {
      type: String,
      required: true,
      index: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Profile',
      required: true,
      index: true,
      unique: true,
    },
    customers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        index: true,
      },
    ],
  },
  { timestamps: true },
);

StoreSchema.index({ storeName: 1, storeAddress: 1 });

module.exports = mongoose.model('Store', StoreSchema);
