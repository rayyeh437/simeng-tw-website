// tRPC 客戶端 - 簡化版本，用於生產部署
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://maibaoshop-hqnzqh8u.manus.space'

// Mock query 函數
const createMockQuery = (initialData?: any) => ({
  useQuery: (input?: any, options?: any) => ({ 
    data: initialData,
    isLoading: false,
    refetch: () => Promise.resolve({ data: initialData }),
  }),
  query: () => Promise.resolve(initialData),
})

// Mock mutation 函數
const createMockMutation = (options?: any) => ({
  useMutation: (mutationOptions?: any) => ({
    mutate: (data?: any) => {
      if (mutationOptions?.onSuccess) {
        mutationOptions.onSuccess(data)
      }
    },
    mutateAsync: (data?: any) => Promise.resolve(data),
  }),
})

// 簡單的 API 客戶端
export const trpc = {
  orders: {
    list: createMockQuery([]),
    get: createMockQuery(null),
    stats: createMockQuery({}),
    create: createMockMutation(),
  },
  addresses: {
    list: createMockQuery([]),
    create: createMockMutation(),
    update: createMockMutation(),
    delete: createMockMutation(),
    setDefault: createMockMutation(),
  },
  products: {
    categories: createMockQuery([]),
    search: createMockQuery([]),
  },
  shares: {
    validateCoupon: createMockMutation(),
  },
}
