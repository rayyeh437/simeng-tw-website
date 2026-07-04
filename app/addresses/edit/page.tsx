'use client';
export const dynamic = 'force-dynamic';



import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { MainLayout } from '@/components/layout'
import { useAuth } from '@/hooks/use-auth'
import { trpc } from '@/lib/trpc'

// 台灣地址數據
const taiwanAddresses: Record<string, string[]> = {
  '台北市': ['中正區', '大同區', '中山區', '松山區', '大安區', '文山區', '南港區', '內湖區', '士林區', '北投區'],
  '新北市': ['板橋區', '新莊區', '三重區', '蘆洲區', '五股區', '泰山區', '林口區', '八里區', '淡水區', '三芝區', '石門區', '北海岸', '金山區', '萬里區', '瑞芳區', '汐止區', '平溪區', '侯硐區', '雙溪區', '貢寮區', '新店區', '坪林區', '烏來區', '中和區', '永和區', '土城區', '樹林區', '鶯歌區'],
  '台中市': ['中區', '東區', '西區', '南區', '北區', '西屯區', '南屯區', '北屯區', '豐原區', '東勢區', '石岡區', '新社區', '和平區', '神岡區', '潭子區', '大雅區', '烏日區', '霧峰區', '太平區', '大里區', '沙鹿區', '龍井區', '梧棲區', '清水區', '大甲區', '外埔區', '大安區'],
  '台南市': ['中西區', '東區', '南區', '北區', '安平區', '安南區', '永康區', '歸仁區', '新化區', '左鎮區', '玉井區', '南化區', '楠西區', '山上區', '下營區', '六甲區', '官田區', '麻豆區', '佳里區', '西港區', '七股區', '將軍區', '北門區', '學甲區', '柳營區', '後壁區', '白河區', '東山區', '中埤區'],
  '高雄市': ['新興區', '前金區', '苓雅區', '鹽埕區', '鼓山區', '旗津區', '前鎮區', '小港區', '三民區', '楠梓區', '左營區', '仁武區', '大社區', '岡山區', '橋頭區', '燕巢區', '田寮區', '阿蓮區', '路竹區', '湖內區', '茄萣區', '永安區', '彌陀區', '梓官區', '旗山區', '美濃區', '六龜區', '內門區', '杉林區', '甲仙區', '桃源區', '那瑪夏區'],
  '基隆市': ['仁愛區', '中正區', '中山區', '安樂區', '暖暖區', '七堵區'],
  '新竹市': ['東區', '北區', '香山區'],
  '新竹縣': ['竹北市', '湖口鄉', '新豐鄉', '新埤鄉', '關西鎮', '芎蕉鄉', '寶山鄉', '竹東鎮', '五峰鄉', '橫山鄉', '尖石鄉', '北埔鄉', '峨眉鄉'],
  '苗栗縣': ['苗栗市', '頭份市', '竹南鎮', '南庄鄉', '獅潭鄉', '三灣鄉', '西湖鄉', '頭屋鄉', '公館鄉', '銅鑼鄉', '三義鄉', '大湖鄉', '泰安鄉', '後龍鎮'],
  '彰化縣': ['彰化市', '員林市', '和美鎮', '鹿港鎮', '溪湖鎮', '二林鎮', '田中鎮', '北斗鎮', '花壇鄉', '芬園鄉', '大村鄉', '永靖鄉', '伸港鄉', '線西鄉', '福興鄉', '秀水鄉', '埔心鄉', '埔鹽鄉', '大城鄉', '芳苑鄉', '社頭鄉', '田尾鄉', '埤頭鄉'],
  '南投縣': ['南投市', '埔里鎮', '草屯鎮', '竹山鎮', '集集鎮', '名間鄉', '鹿谷鄉', '中寮鄉', '國姓鄉', '水里鄉', '魚池鄉', '仁愛鄉', '信義鄉'],
  '雲林縣': ['斗六市', '斗南鎮', '虎尾鎮', '西螺鎮', '土庫鎮', '北港鎮', '古坑鄉', '大埤鄉', '莿桐鄉', '林內鄉', '褒忠鄉', '臺西鄉', '東勢鄉', '麥寮鄉', '崙背鄉', '二崙鄉', '口湖鄉', '四湖鄉'],
  '嘉義市': ['東區', '西區'],
  '嘉義縣': ['朴子市', '太保市', '民雄鄉', '溪口鄉', '中埤鄉', '竹村鄉', '六腳鄉', '東石鄉', '義竹鄉', '布袋鎮', '新港鄉', '香山鄉', '阿里山鄉', '番路鄉', '大埤鄉', '水上鄉', '鹿草鄉', '吳鳳鄉'],
  '屏東縣': ['屏東市', '潮州鎮', '東港鎮', '恆春鎮', '萬丹鄉', '長治鄉', '麟洛鄉', '九如鄉', '里港鄉', '高樹鄉', '鹽埔鄉', '高雄鄉', '新埤鄉', '南州鄉', '林邊鄉', '佳冬鄉', '枋寮鄉', '枋山鄉', '春日鄉', '獅子鄉', '牡丹鄉', '三地門鄉', '霧台鄉', '瑪家鄉', '泰武鄉', '來義鄉'],
  '宜蘭縣': ['宜蘭市', '羅東鎮', '蘇澳鎮', '頭城鎮', '礁溪鎮', '壯圍鄉', '員山鄉', '三星鄉', '大同鄉', '五結鄉', '冬山鄉', '南澳鄉'],
  '花蓮縣': ['花蓮市', '鳳林鎮', '玉里鎮', '新城鄉', '吉安鄉', '壽豐鄉', '豐濱鄉', '瑞穗鄉', '萬榮鄉', '卓溪鄉', '秀林鄉', '光復鄉'],
  '台東縣': ['台東市', '成功鎮', '關山鎮', '長濱鄉', '海端鄉', '池上鄉', '東河鄉', '鹿野鄉', '延平鄉', '卑南鄉', '金峰鄉', '大武鄉', '達仁鄉', '蘭嶼鄉', '綠島鄉'],
  '澎湖縣': ['馬公市', '湖西鄉', '白沙鄉', '西嶼鄉', '望安鄉', '七美鄉'],
  '金門縣': ['金城鎮', '金寧鄉', '金湖鎮', '金沙鎮', '烈嶼鄉', '烏坵鄉'],
  '連江縣': ['南竿鄉', '北竿鄉', '莒光鄉', '東引鄉'],
}

interface Address {
  id: number
  userId: number
  name: string
  phone: string
  address: string
  city: string
  district: string
  zipCode: string | null
  isDefault: number
  createdAt: string
  updatedAt: string
}

export default function AddressEditPage() {
  const { isAuthenticated, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const addressId = searchParams.get('id')

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: '',
    district: '',
    address: '',
    isDefault: false,
  })
  const [loading, setLoading] = useState(!!addressId)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  // 重定向未登入用戶
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/user-login')
    }
  }, [isAuthenticated, authLoading, router])

  // 獲取地址詳情（如果是編輯模式）
  useEffect(() => {
    if (addressId && isAuthenticated && !authLoading) {
      const fetchAddress = async () => {
        try {
          // 這裡應該調用 trpc.addresses.get，但目前先使用列表中的數據
          // 實際應用中應該有一個 get 端點
          setLoading(false)
        } catch (error) {
          console.error('獲取地址失敗:', error)
          setLoading(false)
        }
      }
      fetchAddress()
    }
  }, [addressId, isAuthenticated, authLoading])

  // 創建地址 mutation
  const createAddressMutation = trpc.addresses.create.useMutation({
    onSuccess: () => {
      router.push('/addresses')
    },
    onError: (err: any) => {
      alert('新增地址失敗：' + (err.message || '未知錯誤'))
      setSaving(false)
    },
  })

  // 更新地址 mutation
  const updateAddressMutation = trpc.addresses.update.useMutation({
    onSuccess: () => {
      router.push('/addresses')
    },
    onError: (err: any) => {
      alert('更新地址失敗：' + (err.message || '未知錯誤'))
      setSaving(false)
    },
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = '請輸入收件人姓名'
    }
    if (!formData.phone.trim()) {
      newErrors.phone = '請輸入手機號碼'
    } else if (!/^09\d{8}$/.test(formData.phone.trim())) {
      newErrors.phone = '請輸入有效的台灣手機號碼'
    }
    if (!formData.city) {
      newErrors.city = '請選擇縣市'
    }
    if (!formData.district) {
      newErrors.district = '請選擇鄉鎮市區'
    }
    if (!formData.address.trim()) {
      newErrors.address = '請輸入詳細地址'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setSaving(true)

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      city: formData.city,
      district: formData.district,
      address: formData.address.trim(),
      isDefault: formData.isDefault,
    }

    if (addressId) {
      updateAddressMutation.mutate({
        id: Number(addressId),
        ...payload,
      } as any)
    } else {
      createAddressMutation.mutate(payload as any)
    }
  }

  if (authLoading) {
    return (
      <MainLayout>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: '#6b7280' }}>載入中...</p>
        </div>
      </MainLayout>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const districts = formData.city ? taiwanAddresses[formData.city] || [] : []

  return (
    <MainLayout>
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
        <Link
          href="/addresses"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            color: '#7c3aed',
            textDecoration: 'none',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '600',
          }}
        >
          ← 返回地址列表
        </Link>

        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#1a1a1a', marginBottom: '2rem' }}>
          {addressId ? '編輯地址' : '新增地址'}
        </h1>

        <form onSubmit={handleSubmit}>
          {/* 收件人姓名 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              收件人姓名 *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value })
                if (errors.name) setErrors({ ...errors, name: '' })
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.name ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="請輸入收件人姓名"
            />
            {errors.name && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.name}</p>}
          </div>

          {/* 手機號碼 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              手機號碼 *
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => {
                setFormData({ ...formData, phone: e.target.value })
                if (errors.phone) setErrors({ ...errors, phone: '' })
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.phone ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="09xxxxxxxx"
            />
            {errors.phone && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.phone}</p>}
          </div>

          {/* 縣市 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              縣市 *
            </label>
            <select
              value={formData.city}
              onChange={(e) => {
                setFormData({ ...formData, city: e.target.value, district: '' })
                if (errors.city) setErrors({ ...errors, city: '' })
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.city ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
            >
              <option value="">請選擇縣市</option>
              {Object.keys(taiwanAddresses).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            {errors.city && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.city}</p>}
          </div>

          {/* 鄉鎮市區 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              鄉鎮市區 *
            </label>
            <select
              value={formData.district}
              onChange={(e) => {
                setFormData({ ...formData, district: e.target.value })
                if (errors.district) setErrors({ ...errors, district: '' })
              }}
              disabled={!formData.city}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.district ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
                opacity: !formData.city ? 0.5 : 1,
                cursor: !formData.city ? 'not-allowed' : 'pointer',
              }}
            >
              <option value="">請選擇鄉鎮市區</option>
              {districts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
            {errors.district && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.district}</p>}
          </div>

          {/* 詳細地址 */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#1a1a1a', marginBottom: '0.5rem' }}>
              詳細地址 *
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => {
                setFormData({ ...formData, address: e.target.value })
                if (errors.address) setErrors({ ...errors, address: '' })
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: errors.address ? '1px solid #ef4444' : '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                fontSize: '1rem',
                boxSizing: 'border-box',
              }}
              placeholder="例：信義路 123 號 5 樓"
            />
            {errors.address && <p style={{ color: '#ef4444', fontSize: '0.875rem', marginTop: '0.25rem' }}>{errors.address}</p>}
          </div>

          {/* 設為預設地址 */}
          <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <input
              type="checkbox"
              id="isDefault"
              checked={formData.isDefault}
              onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              style={{ width: '1rem', height: '1rem', cursor: 'pointer' }}
            />
            <label htmlFor="isDefault" style={{ fontSize: '0.875rem', color: '#6b7280', cursor: 'pointer' }}>
              設為預設地址
            </label>
          </div>

          {/* 按鈕 */}
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              type="button"
              onClick={() => router.push('/addresses')}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                background: '#f3f4f6',
                color: '#1a1a1a',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              取消
            </button>
            <button
              type="submit"
              disabled={saving}
              style={{
                flex: 1,
                padding: '0.75rem 1.5rem',
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: saving ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
                fontWeight: '600',
                opacity: saving ? 0.6 : 1,
              }}
            >
              {saving ? '保存中...' : '保存地址'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
