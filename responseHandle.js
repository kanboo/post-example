const { HEADER } = require('./constants')

const successResponse = (res, statusCode, data) => {
  res.writeHead(statusCode, HEADER)
  res.write(JSON.stringify({
    status: 'success',
    data
  }))
  res.end()
}

const errorResponse = (res, statusCode, message) => {
  res.writeHead(statusCode, HEADER)
  res.write(JSON.stringify({
    status: 'false',
    message
  }))
  res.end()
}

module.exports = {
  successResponse,
  errorResponse
}