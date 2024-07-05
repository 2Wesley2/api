const mongoose = require('mongoose');

const buildAggregationPipeline = (userId) => [
  { $match: { _id: mongoose.Types.ObjectId(userId) } },
  {
    $lookup: {
      from: 'roles',
      localField: 'role',
      foreignField: '_id',
      as: 'role',
    },
  },
  { $unwind: '$role' },
  {
    $lookup: {
      from: 'rolepermissions',
      localField: 'role._id',
      foreignField: 'role',
      as: 'rolePermissions',
    },
  },
  { $unwind: '$rolePermissions' },
  {
    $lookup: {
      from: 'permissions',
      localField: 'rolePermissions.permissions',
      foreignField: '_id',
      as: 'permissions',
    },
  },
  {
    $project: {
      permissions: 1,
    },
  },
];

module.exports = buildAggregationPipeline;
