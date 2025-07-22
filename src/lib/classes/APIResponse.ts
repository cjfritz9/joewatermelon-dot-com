class APIResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data?: T): APIResponse<T> {
    return new APIResponse<T>(true, message, data ?? null);
  }

  static error(message: string): APIResponse<null> {
    return new APIResponse(false, message, null);
  }
}

export default APIResponse;