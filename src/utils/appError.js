class AppError extends Error {
  /**
   * @param {string} message - Mô tả lỗi
   * @param {number} statusCode - HTTP status code (ví dụ: 400, 404)
   * @param {string} [errorCode] - Mã lỗi nội bộ tùy chỉnh (ví dụ: 'ERR_INVALID_PHONE')
   */
  constructor(message, statusCode, errorCode = null) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    if (errorCode) {
      this.errorCode = errorCode;
    }

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
