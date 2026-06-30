const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space';

export interface LoginResponse {
  success: boolean;
  user?: {
    id: number;
    email: string;
    name: string;
    role: 'user' | 'admin';
  };
  token?: string;
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
  role: 'user' | 'admin';
  memberCode: string;
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
      return {
        success: true,
        user: result.user,
        token: result.token,
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
    const response = await fetch(`${API_URL}/trpc/auth.me`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 Cookie
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    
    // tRPC 返回格式: { result: { data: {...} } }
    const user = (data as any)?.result?.data;
    
    if (user?.id) {
      return user;
    }

    return null;
  } catch (error) {
    return null;
  }
}

/**
 * 用戶登出
 */
export async function logoutUser(): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/trpc/auth.logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 包含 Cookie
    });

    return response.ok;
  } catch (error) {
    return false;
  }
}
