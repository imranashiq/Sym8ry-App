exports.validateRequiredFields = (fields, reqBody) => {
  for (const field of fields) {
    if (!reqBody[field]) {
      return `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
    }
  }
  return null;
};
