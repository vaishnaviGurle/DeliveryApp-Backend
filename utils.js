const haversine = require('haversine');

const calculateDistance = (coord1, coord2) => {
  return haversine(coord1, coord2);
};

module.exports = { calculateDistance };
