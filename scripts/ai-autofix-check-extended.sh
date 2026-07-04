#!/bin/bash

# AI AutoFix 擴展檢查腳本
# 在部署前進行完整的代碼質量檢查

set -e

echo "🤖 AI AutoFix 擴展檢查開始..."
echo ""

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$PROJECT_DIR"

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

ERRORS=0
WARNINGS=0

# ============================================================================
# 第一部分：基礎結構檢查
# ============================================================================
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}第一部分：基礎結構檢查${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# 檢查 1: page.tsx 和 client.tsx 配對
echo "📋 檢查 1: page.tsx 和 client.tsx 配對..."
for page in $(find app -name "page.tsx" -type f); do
  dir=$(dirname "$page")
  if [ -f "$dir/client.tsx" ]; then
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

# ============================================================================
# 第二部分：代碼風格檢查
# ============================================================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}第二部分：代碼風格檢查${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# 檢查 6: 檢查是否有未使用的 import
echo "📋 檢查 6: 檢查未使用的 import..."
UNUSED_IMPORTS=$(find app -name "*.tsx" -type f -exec grep -l "^import.*from" {} \; | wc -l)
echo -e "${YELLOW}⚠️  檢查了 $UNUSED_IMPORTS 個文件中的 import（需要手動審查）${NC}"

# 檢查 7: 檢查是否有 console.log 調試代碼
echo ""
echo "📋 檢查 7: 檢查是否有 console.log 調試代碼..."
CONSOLE_LOGS=$(grep -r "console\\.log\|console\\.error\|console\\.warn" app --include="*.tsx" 2>/dev/null | grep -v "node_modules" | wc -l)
if [ $CONSOLE_LOGS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  發現 $CONSOLE_LOGS 個 console 調試語句${NC}"
  WARNINGS=$((WARNINGS + CONSOLE_LOGS))
else
  echo -e "${GREEN}✅ 沒有 console 調試語句${NC}"
fi

# 檢查 8: 檢查是否有 TODO/FIXME 註釋
echo ""
echo "📋 檢查 8: 檢查是否有 TODO/FIXME 註釋..."
TODO_COMMENTS=$(grep -r "TODO\|FIXME" app --include="*.tsx" 2>/dev/null | wc -l)
if [ $TODO_COMMENTS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  發現 $TODO_COMMENTS 個 TODO/FIXME 註釋${NC}"
  WARNINGS=$((WARNINGS + TODO_COMMENTS))
else
  echo -e "${GREEN}✅ 沒有 TODO/FIXME 註釋${NC}"
fi

# 檢查 9: 檢查是否有硬編碼的 URL
echo ""
echo "📋 檢查 9: 檢查是否有硬編碼的 URL..."
HARDCODED_URLS=$(grep -r "http://\|https://" app --include="*.tsx" 2>/dev/null | grep -v "node_modules" | grep -v "NEXT_PUBLIC" | wc -l)
if [ $HARDCODED_URLS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  發現 $HARDCODED_URLS 個硬編碼的 URL（應使用環境變量）${NC}"
  WARNINGS=$((WARNINGS + HARDCODED_URLS))
else
  echo -e "${GREEN}✅ 沒有硬編碼的 URL${NC}"
fi

# 檢查 10: 檢查代碼行長度
echo ""
echo "📋 檢查 10: 檢查代碼行長度..."
LONG_LINES=$(find app -name "*.tsx" -type f -exec awk 'length > 120 {count++} END {print count}' {} \; | awk '{sum+=$1} END {print sum}')
if [ "$LONG_LINES" -gt 0 ]; then
  echo -e "${YELLOW}⚠️  發現 $LONG_LINES 行超過 120 個字符${NC}"
  WARNINGS=$((WARNINGS + LONG_LINES))
else
  echo -e "${GREEN}✅ 沒有超長代碼行${NC}"
fi

# ============================================================================
# 第三部分：性能檢查
# ============================================================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}第三部分：性能檢查${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# 檢查 11: 檢查是否有 useEffect 依賴數組缺失
echo "📋 檢查 11: 檢查 useEffect 使用..."
USEEFFECT_COUNT=$(grep -r "useEffect" app --include="*.tsx" 2>/dev/null | wc -l)
echo -e "${YELLOW}⚠️  發現 $USEEFFECT_COUNT 個 useEffect（需要檢查依賴數組）${NC}"

# 檢查 12: 檢查是否有 useMemo/useCallback 使用
echo ""
echo "📋 檢查 12: 檢查性能優化..."
USEMEMO_COUNT=$(grep -r "useMemo\|useCallback" app --include="*.tsx" 2>/dev/null | wc -l)
if [ $USEMEMO_COUNT -eq 0 ]; then
  echo -e "${YELLOW}⚠️  沒有發現 useMemo/useCallback（可能需要性能優化）${NC}"
else
  echo -e "${GREEN}✅ 發現 $USEMEMO_COUNT 個性能優化${NC}"
fi

# 檢查 13: 檢查是否有 .map() 在 ScrollView 中
echo ""
echo "📋 檢查 13: 檢查列表渲染..."
MAP_IN_SCROLL=$(grep -r "ScrollView.*\.map\|\.map.*ScrollView" app --include="*.tsx" 2>/dev/null | wc -l)
if [ $MAP_IN_SCROLL -gt 0 ]; then
  echo -e "${RED}❌ 發現 $MAP_IN_SCROLL 個在 ScrollView 中使用 .map()（應使用 FlatList）${NC}"
  ERRORS=$((ERRORS + MAP_IN_SCROLL))
else
  echo -e "${GREEN}✅ 沒有在 ScrollView 中使用 .map()${NC}"
fi

# ============================================================================
# 第四部分：安全檢查
# ============================================================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}第四部分：安全檢查${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# 檢查 14: 檢查是否有 eval() 使用
echo "📋 檢查 14: 檢查是否有 eval()..."
EVAL_COUNT=$(grep -r "eval(" app --include="*.tsx" 2>/dev/null | wc -l)
if [ $EVAL_COUNT -gt 0 ]; then
  echo -e "${RED}❌ 發現 $EVAL_COUNT 個 eval() 調用（安全風險）${NC}"
  ERRORS=$((ERRORS + EVAL_COUNT))
else
  echo -e "${GREEN}✅ 沒有 eval() 調用${NC}"
fi

# 檢查 15: 檢查是否有 dangerouslySetInnerHTML
echo ""
echo "📋 檢查 15: 檢查是否有 dangerouslySetInnerHTML..."
DANGEROUS_HTML=$(grep -r "dangerouslySetInnerHTML" app --include="*.tsx" 2>/dev/null | wc -l)
if [ $DANGEROUS_HTML -gt 0 ]; then
  echo -e "${YELLOW}⚠️  發現 $DANGEROUS_HTML 個 dangerouslySetInnerHTML（需要驗證安全性）${NC}"
  WARNINGS=$((WARNINGS + DANGEROUS_HTML))
else
  echo -e "${GREEN}✅ 沒有 dangerouslySetInnerHTML${NC}"
fi

# 檢查 16: 檢查是否有硬編碼的密鑰/令牌
echo ""
echo "📋 檢查 16: 檢查是否有硬編碼的密鑰..."
# 排除變量名稱、表單標籤和類型屬性
HARDCODED_SECRETS=$(grep -r "password\|secret\|token\|api_key" app --include="*.tsx" 2>/dev/null | grep -v "NEXT_PUBLIC\|process.env\|import\|const\|let\|var\|htmlFor\|id=\|type=\|name=\|placeholder=" | wc -l)
if [ $HARDCODED_SECRETS -gt 0 ]; then
  echo -e "${YELLOW}⚠️  發現 $HARDCODED_SECRETS 個可能的硬編碼密鑰（需要手動審查）${NC}"
  WARNINGS=$((WARNINGS + HARDCODED_SECRETS))
else
  echo -e "${GREEN}✅ 沒有硬編碼的密鑰${NC}"
fi

# ============================================================================
# 第五部分：TypeScript 和構建檢查
# ============================================================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}第五部分：TypeScript 和構建檢查${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

# 檢查 17: TypeScript 編譯檢查
echo "📋 檢查 17: TypeScript 編譯檢查..."
if pnpm tsc --noEmit 2>&1 | grep -q "error"; then
  echo -e "${RED}❌ TypeScript 編譯錯誤${NC}"
  pnpm tsc --noEmit 2>&1 | head -20
  ERRORS=$((ERRORS + 1))
else
  echo -e "${GREEN}✅ TypeScript 編譯通過${NC}"
fi

# 檢查 18: ESLint 檢查
echo ""
echo "📋 檢查 18: ESLint 檢查..."
if command -v pnpm &> /dev/null; then
  if pnpm lint 2>&1 | grep -q "error"; then
    echo -e "${YELLOW}⚠️  ESLint 發現問題${NC}"
    WARNINGS=$((WARNINGS + 1))
  else
    echo -e "${GREEN}✅ ESLint 檢查通過${NC}"
  fi
else
  echo -e "${YELLOW}⚠️  ESLint 未配置${NC}"
fi

# ============================================================================
# 總結
# ============================================================================
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}檢查總結${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════════${NC}"
echo ""

if [ $ERRORS -eq 0 ]; then
  echo -e "${GREEN}✅ 所有檢查通過！${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  有 $WARNINGS 個警告（建議修復）${NC}"
  fi
  exit 0
else
  echo -e "${RED}❌ 發現 $ERRORS 個錯誤${NC}"
  if [ $WARNINGS -gt 0 ]; then
    echo -e "${YELLOW}⚠️  有 $WARNINGS 個警告${NC}"
  fi
  exit 1
fi
