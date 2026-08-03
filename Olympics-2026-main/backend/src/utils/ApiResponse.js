// Mirrors: com.sports.dto.response.ApiResponse<T>
// Keeping the exact same JSON shape means the existing React frontend
// does not need a single line changed.
class ApiResponse {
  constructor(success, message, data) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  static success(message, data = null) {
    return new ApiResponse(true, message, data);
  }

  static error(message) {
    return new ApiResponse(false, message, null);
  }
}

module.exports = ApiResponse;
