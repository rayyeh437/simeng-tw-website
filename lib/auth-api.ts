const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space';

const TOKEN_KEY = 'auth_session_token';
const USER_KEY = 'auth_user';

export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    name: string;
    nickname?: string;
    realName?: string;
    mobile?: string;
    memberCode?: string;
    role: 'user' | 'admin';
    avatar?: string;
  };
  token?: string;
  sessionToken?: string;
  error?: string;
}

export interface RegisterResponse {
  success: boolean;
  memberCode?: string;
  error?: string;
}

export interface User {
  id: number;
  email: string;
  name: string;
  nickname?: string;
  realName?: string;
  mobile?: string;
  memberCode: string;
  role: 'user' | 'admin';
  avatar?: string;
}

/**
 * 從 localStorage 獲取 Token
 */
export function getStoredToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * 從 localStorage 獲取用戶信息
 */
export function getStoredUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

/**
 * 保存 Token 和用戶信息到 localStorage
 */
export function saveAuthData(token: string, user: User): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

/**
 * 清除 localStorage 中的認證數據
 */
export function clearAuthData(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * 用戶登入
 */
export async function loginUser(email: string, password: string): Promise<LoginResponse> {
  try {
    const response = await fetch(`${API_URL}/trpc/auth.loginLocal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: {
          email,
          password,
        },
      }),
      credentials: 'include', // 包含 Cookie
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: error || '登入失敗',
      };
    }

    const data = await response.json();
    
    // tRPC 返回格式: { result: { data: {...} } }
    const result = (data as any)?.result?.data;
    
    if (result?.success) {
      const token = result.token || result.sessionToken;
      const user = result.user;
      
      // 保存 Token 和用戶信息
      if (token && user) {
        saveAuthData(token, user);
      }
      
      return {
        success: true,
        user: result.user,
        token: token,
      };
    }

    return {
      success: false,
      error: result?.error || '登入失敗',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '登入失敗',
    };
  }
}

/**
 * 用戶註冊
 */
export async function registerUser(
  email: string,
  password: string,
  name: string
): Promise<RegisterResponse> {
  try {
    const response = await fetch(`${API_URL}/trpc/auth.registerLocal`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: {
          email,
          password,
          name,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: error || '註冊失敗',
      };
    }

    const data = await response.json();
    
    // tRPC 返回格式: { result: { data: {...} } }
    const result = (data as any)?.result?.data;
    
    if (result?.success) {
      return {
        success: true,
        memberCode: result.memberCode,
      };
    }

    return {
      success: false,
      error: result?.error || '註冊失敗',
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '註冊失敗',
    };
  }
}

/**
 * 獲取當前用戶信息
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const token = getStoredToken();
    
    const response = await fetch(`${API_URL}/trpc/auth.me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include', // 包含 Cookie
    });

    if (!response.ok) {
      // 如果 API 失敗，嘗試從 localStorage 返回緩存的用戶信息
      return getStoredUser();
    }

    const data = await response.json();
    
    // tRPC 返回格式: { result: { data: {...} } }
    const user = (data as any)?.result?.data;
    
    if (user?.id) {
      // 更新 localStorage 中的用戶信息
      const token = getStoredToken();
      if (token) {
        saveAuthData(token, user);
      }
      return user;
    }

    return getStoredUser();
  } catch (error) {
    // 返回緩存的用戶信息
    return getStoredUser();
  }
}

/**
 * 用戶登出
 */
export async function logoutUser(): Promise<boolean> {
  try {
    const token = getStoredToken();
    
    const response = await fetch(`${API_URL}/trpc/auth.logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` }),
      },
      credentials: 'include', // 包含 Cookie
    });

    // 無論 API 是否成功，都清除本地數據
    clearAuthData();
    
    return response.ok;
  } catch (error) {
    // 即使出錯也清除本地數據
    clearAuthData();
    return false;
  }
}

/**
 * 發送 OTP 驗證碼
 */
export async function sendOtpCode(mobile: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/trpc/auth.sendOtpSms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: {
          mobile,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: error || '發送驗證碼失敗',
      };
    }

    const data = await response.json();
    const result = (data as any)?.result?.data;
    
    return {
      success: result?.success || true,
      error: result?.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '發送驗證碼失敗',
    };
  }
}

/**
 * 驗證 OTP 驗證碼
 */
export async function verifyOtpCode(mobile: string, code: string): Promise<{ success: boolean; error?: string }> {
  try {
    const response = await fetch(`${API_URL}/trpc/auth.verifyOtp`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        json: {
          mobile,
          code,
        },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return {
        success: false,
        error: error || '驗證碼驗證失敗',
      };
    }

    const data = await response.json();
    const result = (data as any)?.result?.data;
    
    return {
      success: result?.success || true,
      error: result?.error,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : '驗證碼驗證失敗',
    };
  }
}
