export const parseHeightToInches = (heightData) => {
  if (heightData === null || typeof heightData === 'undefined') return null;

  let heightStr = '';
  if (typeof heightData === 'object' && heightData.us) {
    heightStr = heightData.us;
  } else if (typeof heightData === 'string') {
    heightStr = heightData;
  }

  if (heightStr.includes("'" )) { // Handles 6'5"
    const parts = heightStr.replace(/\"/g, '').split("'" );
    const feet = parseInt(parts[0], 10) || 0;
    const inches = parseInt(parts[1], 10) || 0;
    return (feet * 12) + inches;
  }

  if (heightStr.includes("-" )) { // Handles 6-5
    const parts = heightStr.split("-" );
    const feet = parseInt(parts[0], 10) || 0;
    const inches = parseInt(parts[1], 10) || 0;
    return (feet * 12) + inches;
  }

  const parsed = parseFloat(heightStr);
  if (!isNaN(parsed)) {
    // Assuming the number might be in cm if it's a large number, or inches otherwise.
    // This logic might need refinement based on actual data patterns.
    return parsed > 100 ? parsed / 2.54 : parsed;
  }

  return null;
};

export const parseWingspanToInches = (wingspanData) => {
    if (wingspanData === null || typeof wingspanData === 'undefined') return null;
    if (typeof wingspanData === 'object' && wingspanData.us) {
        wingspanData = wingspanData.us;
    }
    if (typeof wingspanData === 'string' && wingspanData.includes("'")) {
        const parts = wingspanData.replace(/\"/g, '').split("'");
        const feet = parseInt(parts[0], 10) || 0;
        const inches = parseFloat(parts[1]) || 0;
        return (feet * 12) + inches;
    }
    const parsed = parseFloat(wingspanData);
    return !isNaN(parsed) ? parsed : null;
};


export const formatInchesToFeet = (inches) => {
    if (inches === null || typeof inches === 'undefined') return 'N/A';
    const feet = Math.floor(inches / 12);
    const remainingInches = Math.round(inches % 12);
    return `${feet}'${remainingInches}"`;
  };
  
export const parseWeightToLbs = (weightData) => {
  if (weightData === null || typeof weightData === 'undefined') return null;

  let weightStr = '';
  if (typeof weightData === 'object' && weightData.lbs) {
    weightStr = String(weightData.lbs);
  } else {
    weightStr = String(weightData);
  }
  
  const parsed = parseFloat(weightStr.replace(/ lbs/g, ''));
  return !isNaN(parsed) ? parsed : null;
};
  
