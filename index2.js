const { nextISSTimesForMyLocation } = require('./iss_promised');

const printPassTime = (passTimes) => {
  for (const pass of passTimes) {
    const datetime = new Date(0);
    datetime.setUTCSeconds(pass.risetime);
    const period = pass.duration;
    console.log(`Next pass at ${datetime} for ${period} seconds!`);
  }
};

nextISSTimesForMyLocation().then(printPassTime).catch(error => console.log(error.message));