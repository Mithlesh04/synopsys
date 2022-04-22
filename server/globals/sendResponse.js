
function sendResponse(res, statusCode=200, data={}) {
  res.status(statusCode).json({
      status: 200,
      isValid: true,
      message: '',
      ...data
  });
}

module.exports = sendResponse;