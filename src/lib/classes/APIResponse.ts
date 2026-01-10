/* eslint-disable  @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';

class APIResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;

  constructor(success: boolean, message: string, data: T | null = null) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  static success<T>(message: string, data?: T, status = 200): NextResponse {
    return NextResponse.json(new APIResponse<T>(true, message, data ?? null), { status });
  }

  static error(message: string, status = 400): NextResponse {
    return NextResponse.json(new APIResponse(false, message, null), { status });
  }
}

export default APIResponse;
