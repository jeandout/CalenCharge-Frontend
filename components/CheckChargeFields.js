export default function checkCharge(charge, keys) {
    let isValid = true;
  
    for (const field of keys) {
      if (!charge[field] || charge[field] === '') {
        isValid = false;
      }
    }
  
    return isValid;
  }
  
  