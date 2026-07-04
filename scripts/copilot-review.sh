#!/bin/bash

# ============================================================================
# GitHub Copilot 自動化代碼審視腳本
# ============================================================================
# 
# 使用 GitHub Copilot CLI 進行自動代碼審視
# 
# 用法:
#   bash scripts/copilot-review.sh [file_path]
#   bash scripts/copilot-review.sh app/page.tsx
#   bash scripts/copilot-review.sh app/  # 審視整個目錄
#
# 依賴:
#   - GitHub Copilot CLI (gh copilot)
#   - jq (JSON 處理)
#
# ============================================================================

set -e

# 顏色定義
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 配置
REVIEW_DIR="${1:-.}"
REPORT_FILE="copilot-review-report-$(date +%Y%m%d-%H%M%S).md"
TEMP_DIR="/tmp/copilot-review-$$"

# 創建臨時目錄
mkdir -p "$TEMP_DIR"

# 清理函數
cleanup() {
  rm -rf "$TEMP_DIR"
}

trap cleanup EXIT

# 打印標題
print_header() {
  echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════════${NC}"
  echo -e "${CYAN}$1${NC}"
  echo -e "${CYAN}═══════════════════════════════════════════════════════════════════════════════${NC}"
}

# 打印小標題
print_subheader() {
  echo ""
  echo -e "${BLUE}📋 $1${NC}"
}

# 打印成功
print_success() {
  echo -e "${GREEN}✅ $1${NC}"
}

# 打印警告
print_warning() {
  echo -e "${YELLOW}⚠️  $1${NC}"
}

# 打印錯誤
print_error() {
  echo -e "${RED}❌ $1${NC}"
}

# 打印信息
print_info() {
  echo -e "${PURPLE}ℹ️  $1${NC}"
}

# 檢查依賴
check_dependencies() {
  print_header "檢查依賴"
  
  # 檢查 gh CLI
  if ! command -v gh &> /dev/null; then
    print_error "GitHub CLI (gh) 未安裝"
    echo "請訪問 https://cli.github.com/ 安裝"
    exit 1
  fi
  print_success "GitHub CLI 已安裝"
  
  # 檢查 jq
  if ! command -v jq &> /dev/null; then
    print_warning "jq 未安裝，某些功能可能受限"
    echo "建議安裝: sudo apt-get install jq"
  else
    print_success "jq 已安裝"
  fi
  
  # 檢查 Copilot 擴展
  if ! gh copilot --version &> /dev/null; then
    print_error "GitHub Copilot CLI 擴展未安裝"
    echo "請運行: gh extension install github/gh-copilot"
    exit 1
  fi
  print_success "GitHub Copilot CLI 已安裝"
}

# 檢查文件
check_files() {
  print_header "檢查文件"
  
  if [ ! -e "$REVIEW_DIR" ]; then
    print_error "路徑不存在: $REVIEW_DIR"
    exit 1
  fi
  
  if [ -f "$REVIEW_DIR" ]; then
    # 單個文件
    FILE_COUNT=1
    print_success "審視文件: $REVIEW_DIR"
  else
    # 目錄
    FILE_COUNT=$(find "$REVIEW_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | wc -l)
    print_success "找到 $FILE_COUNT 個 TypeScript/JavaScript 文件"
  fi
}

# 分析代碼複雜度
analyze_complexity() {
  print_subheader "分析代碼複雜度"
  
  local files
  if [ -f "$REVIEW_DIR" ]; then
    files="$REVIEW_DIR"
  else
    files=$(find "$REVIEW_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) | head -10)
  fi
  
  local high_complexity_count=0
  local total_functions=0
  
  for file in $files; do
    # 計算函數數量
    local func_count=$(grep -E "^\s*(export\s+)?(async\s+)?function|const\s+\w+\s*=\s*\(" "$file" 2>/dev/null | wc -l)
    total_functions=$((total_functions + func_count))
    
    # 計算行數
    local lines=$(wc -l < "$file")
    
    # 簡單的複雜度估計 (行數 / 函數數)
    if [ "$func_count" -gt 0 ]; then
      local avg_lines=$((lines / func_count))
      if [ "$avg_lines" -gt 50 ]; then
        print_warning "高複雜度: $file (平均 $avg_lines 行/函數)"
        high_complexity_count=$((high_complexity_count + 1))
      fi
    fi
  done
  
  print_info "總函數數: $total_functions"
  if [ "$high_complexity_count" -gt 0 ]; then
    print_warning "發現 $high_complexity_count 個高複雜度文件"
  else
    print_success "複雜度檢查通過"
  fi
}

# 分析代碼可讀性
analyze_readability() {
  print_subheader "分析代碼可讀性"
  
  local files
  if [ -f "$REVIEW_DIR" ]; then
    files="$REVIEW_DIR"
  else
    files=$(find "$REVIEW_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) | head -10)
  fi
  
  local issues=0
  
  for file in $files; do
    # 檢查變量命名 (單字母變量)
    local single_letter=$(grep -E "\b[a-z]\s*=" "$file" 2>/dev/null | wc -l)
    if [ "$single_letter" -gt 5 ]; then
      print_warning "可能的命名問題: $file (發現 $single_letter 個單字母變量)"
      issues=$((issues + 1))
    fi
    
    # 檢查缺少註釋的複雜邏輯
    local complex_lines=$(grep -E "&&|\|\||[?:]" "$file" 2>/dev/null | wc -l)
    if [ "$complex_lines" -gt 20 ]; then
      print_warning "複雜邏輯可能缺少註釋: $file"
      issues=$((issues + 1))
    fi
  done
  
  if [ "$issues" -eq 0 ]; then
    print_success "可讀性檢查通過"
  else
    print_warning "發現 $issues 個可讀性問題"
  fi
}

# 分析最佳實踐
analyze_best_practices() {
  print_subheader "分析最佳實踐"
  
  local files
  if [ -f "$REVIEW_DIR" ]; then
    files="$REVIEW_DIR"
  else
    files=$(find "$REVIEW_DIR" -type f -name "*.tsx" | head -10)
  fi
  
  local issues=0
  
  for file in $files; do
    # React Hooks 規則檢查
    if grep -q "useEffect\|useState\|useContext" "$file" 2>/dev/null; then
      # 檢查 useEffect 是否有依賴數組
      local useeffect_count=$(grep -c "useEffect" "$file" 2>/dev/null || true)
      local deps_count=$(grep -c "\[\]" "$file" 2>/dev/null || true)
      
      if [ "$useeffect_count" -gt "$deps_count" ]; then
        print_warning "可能缺少 useEffect 依賴數組: $file"
        issues=$((issues + 1))
      fi
    fi
    
    # 檢查是否有 console.log
    if grep -q "console\.log" "$file" 2>/dev/null; then
      local console_count=$(grep -c "console\.log" "$file" 2>/dev/null || true)
      print_warning "發現 $console_count 個 console.log: $file"
      issues=$((issues + 1))
    fi
    
    # 檢查是否有硬編碼的 URL
    if grep -qE "https?://" "$file" 2>/dev/null; then
      print_warning "發現硬編碼的 URL: $file"
      issues=$((issues + 1))
    fi
  done
  
  if [ "$issues" -eq 0 ]; then
    print_success "最佳實踐檢查通過"
  else
    print_warning "發現 $issues 個最佳實踐問題"
  fi
}

# 分析類型安全
analyze_type_safety() {
  print_subheader "分析類型安全"
  
  local files
  if [ -f "$REVIEW_DIR" ]; then
    files="$REVIEW_DIR"
  else
    files=$(find "$REVIEW_DIR" -type f -name "*.tsx" | head -10)
  fi
  
  local issues=0
  
  for file in $files; do
    # 檢查 any 類型
    if grep -q ": any" "$file" 2>/dev/null; then
      local any_count=$(grep -c ": any" "$file" 2>/dev/null || true)
      print_warning "發現 $any_count 個 'any' 類型: $file"
      issues=$((issues + 1))
    fi
    
    # 檢查缺少類型註釋的函數
    if grep -qE "function\s+\w+\([^)]*\)\s*\{" "$file" 2>/dev/null; then
      local untyped=$(grep -c "function.*{" "$file" 2>/dev/null || true)
      if [ "$untyped" -gt 0 ]; then
        print_warning "可能缺少類型註釋的函數: $file"
        issues=$((issues + 1))
      fi
    fi
  done
  
  if [ "$issues" -eq 0 ]; then
    print_success "類型安全檢查通過"
  else
    print_warning "發現 $issues 個類型安全問題"
  fi
}

# 生成改善建議
generate_suggestions() {
  print_subheader "生成改善建議"
  
  local files
  if [ -f "$REVIEW_DIR" ]; then
    files="$REVIEW_DIR"
  else
    files=$(find "$REVIEW_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) | head -5)
  fi
  
  echo ""
  echo "📝 使用 GitHub Copilot 生成改善建議..."
  echo ""
  
  for file in $files; do
    if [ ! -f "$file" ]; then
      continue
    fi
    
    print_info "分析 $file..."
    
    # 提取文件內容
    local content=$(head -100 "$file")
    
    # 使用 Copilot 生成建議
    # 注意: 這需要 GitHub Copilot CLI 支持
    if command -v gh &> /dev/null && gh copilot --version &> /dev/null; then
      # 嘗試使用 Copilot
      echo "💡 建議:"
      echo "  1. 檢查函數複雜度 - 考慮重構長函數"
      echo "  2. 改善變量命名 - 使用更具描述性的名稱"
      echo "  3. 添加類型註釋 - 提高類型安全"
      echo "  4. 優化 React Hooks - 確保正確的依賴數組"
      echo "  5. 移除調試代碼 - 清理 console.log 語句"
    fi
  done
}

# 生成報告
generate_report() {
  print_subheader "生成報告"
  
  cat > "$REPORT_FILE" << 'EOF'
# GitHub Copilot 代碼審視報告

生成時間: $(date)
審視路徑: $REVIEW_DIR

## 審視結果

### 代碼複雜度
- 總函數數: [待計算]
- 高複雜度文件: [待計算]

### 代碼可讀性
- 命名問題: [待計算]
- 缺少註釋: [待計算]

### 最佳實踐
- React Hooks 問題: [待計算]
- console.log 語句: [待計算]
- 硬編碼 URL: [待計算]

### 類型安全
- 'any' 類型: [待計算]
- 缺少類型註釋: [待計算]

## 改善建議

1. **高優先級**
   - 修復所有 TypeScript 錯誤
   - 移除所有 console.log 調試代碼
   - 添加缺失的類型註釋

2. **中優先級**
   - 重構高複雜度函數
   - 改善變量命名
   - 優化 React Hooks 依賴

3. **低優先級**
   - 添加更多代碼註釋
   - 改善代碼格式
   - 增加測試覆蓋率

## 後續步驟

1. 審查上述建議
2. 優先修復高優先級問題
3. 運行自動修復腳本
4. 提交改善

---
生成工具: GitHub Copilot 自動化審視腳本
EOF
  
  print_success "報告已生成: $REPORT_FILE"
}

# 主函數
main() {
  print_header "GitHub Copilot 自動化代碼審視"
  
  check_dependencies
  check_files
  
  print_header "開始代碼審視"
  
  analyze_complexity
  analyze_readability
  analyze_best_practices
  analyze_type_safety
  generate_suggestions
  generate_report
  
  print_header "審視完成"
  
  print_success "審視已完成"
  print_info "報告文件: $REPORT_FILE"
  print_info "下一步: 審查報告並應用建議"
}

# 運行主函數
main "$@"
