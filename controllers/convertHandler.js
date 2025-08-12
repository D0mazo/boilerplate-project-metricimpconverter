function ConvertHandler() {
  // Extract number from input string
  this.getNum = function(input) {
    // Extract numeric part (including fractions and decimals)
    let numberString = input.match(/^[\d./]*/)[0];
    
    // Handle fraction
    if (numberString.includes('/')) {
      let numbers = numberString.split('/');
      if (numbers.length > 2) return 'invalid number';
      let num1 = parseFloat(numbers[0]);
      let num2 = parseFloat(numbers[1]);
      if (isNaN(num1) || isNaN(num2) || num2 === 0) return 'invalid number';
      return num1 / num2;
    }
    
    // Handle decimal or whole number
    let result = parseFloat(numberString);
    return isNaN(result) ? 1 : result; // Default to 1 if no number provided
  };
  
  // Extract unit from input string
  this.getUnit = function(input) {
    const validUnits = ['gal', 'L', 'mi', 'km', 'lbs', 'kg'];
    let unitString = input.match(/[a-zA-Z]+$/)[0]?.toLowerCase();
    
    // Normalize 'l' or 'L' to 'L'
    if (unitString === 'l') unitString = 'L';
    
    return validUnits.includes(unitString) ? unitString : 'invalid unit';
  };
  
  // Get corresponding return unit
  this.getReturnUnit = function(initUnit) {
    const unitPairs = {
      'gal': 'L',
      'L': 'gal',
      'mi': 'km',
      'km': 'mi',
      'lbs': 'kg',
      'kg': 'lbs'
    };
    return unitPairs[initUnit] || 'invalid unit';
  };

  // Spell out unit in full
  this.spellOutUnit = function(unit) {
    const unitNames = {
      'gal': 'gallons',
      'L': 'liters',
      'mi': 'miles',
      'km': 'kilometers',
      'lbs': 'pounds',
      'kg': 'kilograms'
    };
    return unitNames[unit] || 'invalid unit';
  };
  
  // Perform the conversion
  this.convert = function(initNum, initUnit) {
    const galToL = 3.78541;
    const lbsToKg = 0.453592;
    const miToKm = 1.60934;
    
    if (initNum === 'invalid number' || initUnit === 'invalid unit') {
      return 'invalid input';
    }
    
    let result;
    switch (initUnit) {
      case 'gal':
        result = initNum * galToL;
        break;
      case 'L':
        result = initNum / galToL;
        break;
      case 'mi':
        result = initNum * miToKm;
        break;
      case 'km':
        result = initNum / miToKm;
        break;
      case 'lbs':
        result = initNum * lbsToKg;
        break;
      case 'kg':
        result = initNum / lbsToKg;
        break;
      default:
        return 'invalid unit';
    }
    
    // Round to 5 decimal places
    return Number(result.toFixed(5));
  };
  
  // Generate result string
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    if (initNum === 'invalid number' && initUnit === 'invalid unit') {
      return 'invalid number and unit';
    }
    if (initNum === 'invalid number') {
      return 'invalid number';
    }
    if (initUnit === 'invalid unit') {
      return 'invalid unit';
    }
    
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;