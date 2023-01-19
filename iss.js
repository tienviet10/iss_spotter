const request = require('request');

const fetchMyIP = function(callback) {
  request("https://api.ipify.org/?format=json", (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      const msg = `Status Code ${response.statusCode} when fetching IP. Response: ${body}`;
      callback(Error(msg), null);
      return;
    }

    callback(error, JSON.parse(body).ip);

  });
};

const fetchCoordsByIP = (ip, callback) => {
  request(`http://ipwho.is/${ip}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }


    const parsedBody = JSON.parse(body);

    if (!parsedBody.success) {
      const message = `Success status was ${parsedBody.success}. Server message says: ${parsedBody.message} when fetching for IP ${parsedBody.ip}`;
      callback(Error(message), null);
      return;
    }
    const { latitude, longitude } = parsedBody;

    callback(error, {latitude, longitude});

  });
};

const fetchISSFlyOverTimes = function(coords, callback) {
  request(`https://iss-flyover.herokuapp.com/json/?lat=${coords.latitude}&lon=${coords.longitude}`, (error, response, body) => {
    if (error) {
      callback(error, null);
      return;
    }

    if (response.statusCode !== 200) {
      callback(Error(`Status Code ${response.statusCode} when fetching ISS pass times: ${body}`), null);
      return;
    }

    const passesTime = JSON.parse(body).response;
    callback(null, passesTime);

  });
};

const nextISSTimesForMyLocation = function(callback) {
  // Each function deal with its error then return error here -> return to nextISSTimesForMyLocation for displaying error

  // fetchMyIP just take in a callback
  fetchMyIP((error, ip) => {
    if (error) {
      // return to nextISSTimesForMyLocation to handle error
      return callback(error, null);
    }

    // fetchCoordsByIP take in 1 arg and also a callback
    fetchCoordsByIP(ip, (error, coordinate) => {
      if (error) {
        // return to nextISSTimesForMyLocation to handle error
        return callback(error, null);
      }
      
      fetchISSFlyOverTimes(coordinate,(error, flyoverData) => {
        if (error) {
          // return to nextISSTimesForMyLocation to handle error
          return callback(error, null);
        }
        
        // Finally send successful message
        callback(null, flyoverData);
      });
    
    });

  });
};

module.exports = { fetchMyIP, fetchCoordsByIP, fetchISSFlyOverTimes, nextISSTimesForMyLocation };