export interface AuthResponse {
  success: boolean;
  expires_at: string;
  request_token: string;
  session_id: string;
}
