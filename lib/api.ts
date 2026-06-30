const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space';

export async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${endpoint}`;
  
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

  return response.json();
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
