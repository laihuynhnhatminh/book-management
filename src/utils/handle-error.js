module.exports = {
  customErrorHandler: (errorMessage, errorCode) => {
    const error = new Error(errorMessage);
    error.code = errorCode;
    throw error;
  },
};
