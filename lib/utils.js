

exports.getRandomInt = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};


exports.mapMultipleKeys = function(map, keys){
    return (new Map(keys.map((key)=>[key, map.get(key)])));
};

