export const getCost = function(bodyArray: BodyPartConstant[]) {
  let sum = 0;
  for (let i in bodyArray)
    sum += BODYPART_COST[bodyArray[i]];
  return sum;
  }

