const { nextISSTimesForMyLocation } = require('./iss');

const printPassTime = (passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const period = pass.duration;
    console.log(`Next pass at ${datetime} for ${period} seconds!`);
  }
};

nextISSTimesForMyLocation((error, passTimes) => {
  if (error) {
    return console.log("It didn't work!", error);
  }

  printPassTime(passTimes);
});