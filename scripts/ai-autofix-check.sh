#!/bin/bash

# AI AutoFix 自動檢查腳本
# 在部署前檢查所有代碼問題

set -e

echo "🤖 AI AutoFix 自動檢查開始..."
echo ""

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# 檢查 1: page.tsx 和 client.tsx 配對
echo "📋 檢查 1: page.tsx 和 client.tsx 配對..."
for page in $(find app -name "page.tsx" -type f); do
  dir=$(dirname "$page")
  if [ -f "$dir/client.tsx" ]; then
    # 提取 <ComponentName /> 形式的組件名稱
    import_name=$(grep -oE "<[A-Z][a-zA-Z0-9]*Client />" "$page" 2>/dev/null | sed 's/[<> /]//g' | head -1)
    if [ -n "$import_name" ]; then
      if ! grep -q "export function $import_name\|export default function $import_name" "$dir/client.tsx" 2>/dev/null; then
        echo -e "${RED}❌ $page: 組件 $import_name 在 client.tsx 中未找到${NC}"
        ERRORS=$((ERRORS + 1))
      fi
    fi
  fi
done

# 檢查 2: 所有 page.tsx 是否都有 'export const dynamic'
echo ""
echo "📋 檢查 2: page.tsx 是否都有 'export const dynamic'..."
for page in $(find app -name "page.tsx" -type f); do
  if ! grep -q "export const dynamic" "$page"; then
    echo -e "${YELLOW}⚠️  $page: 沒有 'export const dynamic'${NC}"
    WARNINGS=$((WARNINGS + 1))
  fi
done

# 檢查 3: 所有 client.tsx 是否都有 'use client'
echo ""
echo "📋 檢查 3: client.tsx 是否都有 'use client'..."
for client in $(find app -name "client.tsx" -type f); do
  if ! grep -q "'use client'" "$client"; then
    echo -e "${RED}❌ $client: 沒有 'use client'${NC}"
    ERRORS=$((ERRORS + 1))
  fi
done

# 檢查 4: 檢查是否有無效的組件名稱（包含方括號）
echo ""
echo "📋 檢查 4: 檢查無效的組件名稱..."
if grep -r "import { \[" app --include="*.tsx" 2>/dev/null; then
  echo -e "${RED}❌ 發現無效的組件名稱（包含方括號）${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ 沒有無效的組件名稱${NC}"
fi

# 檢查 5: 檢查 error.tsx 和 not-found.tsx
echo ""
echo "📋 檢查 5: 檢查 error.tsx 和 not-found.tsx..."
if grep -q "export const dynamic.*force-dynamic" app/error.tsx 2>/dev/null; then
  echo -e "${RED}❌ app/error.tsx: 不應該有 'export const dynamic = force-dynamic'${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ app/error.tsx 配置正確${NC}"
fi

if grep -q "export const dynamic\|'use client'" app/not-found.tsx 2>/dev/null; then
  echo -e "${RED}❌ app/not-found.tsx: 不應該有任何指令${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ app/not-found.tsx 配置正確${NC}"
fi

# 檢查 6: 檢查是否有 'use client' 在 page.tsx 中
echo ""
echo "📋 檢查 6: 檢查 page.tsx 是否有 'use client'..."
if grep -r "'use client'" app --include="page.tsx" 2>/dev/null | grep -v "node_modules"; then
  echo -e "${RED}❌ 發現 page.tsx 中有 'use client'（應該在 client.tsx 中）${NC}"
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ 沒有 page.tsx 中的 'use client'${NC}"
fi

# 檢查 7: TypeScript 編譯檢查
echo ""
echo "📋 檢查 7: TypeScript 編譯檢查..."
if pnpm tsc --noEmit 2>&1 | grep -q "error"; then
  echo -e "${RED}❌ TypeScript 編譯錯誤${NC}"
  pnpm tsc --noEmit 2>&1 | head -20
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ TypeScript 編譯通過${NC}"
fi

# 總結
echo ""
echo "================================"
if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ 所有檢查通過！${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  有 $WARNINGS 個警告${NC}"
  fi
  exit 0
else
  echo -e "${RED}❌ 發現 $ERRORS 個錯誤${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  有 $WARNINGS 個警告${NC}"
  fi
  exit 1
fi
