export const validateString = (str, maxlength, minlength) => {
  if (str.length > maxlength) {
    return 'String exceeds maximum length of ' + maxlength + ' characters.';
  }
  if (str.length < minlength) {
    return (
      'String is shorter than minimum length of ' + minlength + ' characters.'
    );
  }
  if (!str || typeof str !== 'string') {
    return 'Invalid string provided.';
  }
  if (str.trim() === '') {
    return 'String cannot be empty.';
  }
  if (!/^[a-zA-Z0-9\s]+$/.test(str)) {
    return 'String contains invalid characters. Only alphanumeric characters and spaces are allowed.';
  }
  if (str.length === 0) {
    return 'String cannot be empty.';
  }
  return true;
};
