'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  let convertHandler = new ConvertHandler();

  app.route('/api/convert')
    .get((req, res) => {
      const input = req.query.input;
      
      // Check if input is provided
      if (!input) {
        return res.json({ error: 'invalid input' });
      }

      const initNum = convertHandler.getNum(input);
      const initUnit = convertHandler.getUnit(input);

      // Handle invalid inputs
      if (initNum === 'invalid number' && initUnit === 'invalid unit') {
        return res.json({ error: 'invalid number and unit' });
      }
      if (initNum === 'invalid number') {
        return res.json({ error: 'invalid number' });
      }
      if (initUnit === 'invalid unit') {
        return res.json({ error: 'invalid unit' });
      }

      const returnNum = convertHandler.convert(initNum, initUnit);
      const returnUnit = convertHandler.getReturnUnit(initUnit);
      const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);

      // Return JSON response
      res.json({
        initNum,
        initUnit,
        returnNum,
        returnUnit,
        string
      });
    });
};