const chai = require('chai');
let assert = chai.assert;
const ConvertHandler = require('../controllers/convertHandler.js');

let convertHandler = new ConvertHandler();

suite('Unit Tests', function() {
  // Test number parsing
  test('convertHandler should correctly read a whole number input', function() {
    assert.strictEqual(convertHandler.getNum('42kg'), 42, 'Whole number input should be correctly parsed');
  });

  test('convertHandler should correctly read a decimal number input', function() {
    assert.strictEqual(convertHandler.getNum('3.14mi'), 3.14, 'Decimal number input should be correctly parsed');
  });

  test('convertHandler should correctly read a fractional input', function() {
    assert.strictEqual(convertHandler.getNum('1/2gal'), 0.5, 'Fractional input should be correctly parsed');
  });

  test('convertHandler should correctly read a fractional input with a decimal', function() {
    assert.strictEqual(convertHandler.getNum('2.5/5L'), 0.5, 'Fractional input with decimal should be correctly parsed');
  });

  test('convertHandler should correctly return an error on a double-fraction', function() {
    assert.strictEqual(convertHandler.getNum('3/2/3kg'), 'invalid number', 'Double fraction should return invalid number');
  });

  test('convertHandler should correctly default to 1 when no numerical input is provided', function() {
    assert.strictEqual(convertHandler.getNum('kg'), 1, 'No numerical input should default to 1');
  });

  // Test unit parsing
  test('convertHandler should correctly read each valid input unit', function() {
    const validUnits = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    validUnits.forEach(unit => {
      assert.strictEqual(convertHandler.getUnit(`1${unit}`), unit.toLowerCase() === 'l' ? 'L' : unit.toLowerCase(), `Unit ${unit} should be correctly parsed`);
    });
  });

  test('convertHandler should correctly return an error for an invalid input unit', function() {
    assert.strictEqual(convertHandler.getUnit('1xyz'), 'invalid unit', 'Invalid unit should return error');
  });

  test('convertHandler should return the correct return unit for each valid input unit', function() {
    const unitPairs = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    };
    Object.keys(unitPairs).forEach(unit => {
      assert.strictEqual(convertHandler.getReturnUnit(unit), unitPairs[unit], `Return unit for ${unit} should be ${unitPairs[unit]}`);
    });
  });

  test('convertHandler should correctly return the spelled-out string unit for each valid input unit', function() {
    const unitNames = {
      'gal': 'gallons',
      'L': 'liters',
      'mi': 'miles',
      'km': 'kilometers',
      'lbs': 'pounds',
      'kg': 'kilograms'
    };
    Object.keys(unitNames).forEach(unit => {
      assert.strictEqual(convertHandler.spellOutUnit(unit), unitNames[unit], `Spelled out unit for ${unit} should be ${unitNames[unit]}`);
    });
  });

  // Test conversions
  test('convertHandler should correctly convert gal to L', function() {
    assert.approximately(convertHandler.convert(1, 'gal'), 3.78541, 0.00001, '1 gallon should convert to 3.78541 liters');
  });

  test('convertHandler should correctly convert L to gal', function() {
    assert.approximately(convertHandler.convert(1, 'L'), 1/3.78541, 0.00001, '1 liter should convert to 0.26417 gallons');
  });

  test('convertHandler should correctly convert mi to km', function() {
    assert.approximately(convertHandler.convert(1, 'mi'), 1.60934, 0.00001, '1 mile should convert to 1.60934 kilometers');
  });

  test('convertHandler should correctly convert km to mi', function() {
    assert.approximately(convertHandler.convert(1, 'km'), 1/1.60934, 0.00001, '1 kilometer should convert to 0.62137 miles');
  });

  test('convertHandler should correctly convert lbs to kg', function() {
    assert.approximately(convertHandler.convert(1, 'lbs'), 0.453592, 0.00001, '1 pound should convert to 0.453592 kilograms');
  });

  test('convertHandler should correctly convert kg to lbs', function() {
    assert.approximately(convertHandler.convert(1, 'kg'), 1/0.453592, 0.00001, '1 kilogram should convert to 2.20462 pounds');
  });
});