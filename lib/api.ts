const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space';
const USE_PROXY = process.env.NEXT_PUBLIC_FIXIE_URL ? true : false;

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  let url = `${API_URL}${endpoint}`;
  
  // 如果配置了 Fixie 代理，通過伺服器端代理轉發請求
  if (USE_PROXY) {
    console.log('[API] 使用伺服器端代理發送請求');
    const proxyUrl = new URL('/api/proxy', window.location.origin);
    proxyUrl.searchParams.set('url', url);
    url = proxyUrl.toString();
  }
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

// 獲取分類
export async function getCategories() {
  return apiCall('/trpc/products.categories?input={}');
}

// 搜尋商品
export async function searchProducts(input: any) {
  const params = new URLSearchParams({
    input: JSON.stringify(input),
  });
  return apiCall(`/trpc/products.search?${params}`);
}

// 獲取代理狀態
export function getProxyStatus() {
  return {
    configured: USE_PROXY,
    proxyUrl: USE_PROXY ? '/api/proxy' : 'Not configured',
  };
}
