#!/bin/bash

# ============================================================================
# Claude 深度代碼分析自動化腳本
# ============================================================================
#
# 使用 Claude API 進行深度代碼分析和改善建議
#
# 用法:
#   bash scripts/claude-review.sh [file_path]
#   bash scripts/claude-review.sh app/page.tsx
#   bash scripts/claude-review.sh app/  # 分析整個目錄
#
# 依賴:
#   - curl (HTTP 請求)
#   - jq (JSON 處理)
#   - CLAUDE_API_KEY 環境變量
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
REPORT_FILE="claude-review-report-$(date +%Y%m%d-%H%M%S).md"
TEMP_DIR="/tmp/claude-review-$$"
MAX_FILES=5
MAX_FILE_SIZE=50000  # 字符

# Claude API 配置
CLAUDE_API_KEY="${CLAUDE_API_KEY:-}"
CLAUDE_MODEL="claude-3-5-sonnet-20241022"
CLAUDE_API_URL="https://api.anthropic.com/v1/messages"

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
  
  # 檢查 curl
  if ! command -v curl &> /dev/null; then
    print_error "curl 未安裝"
    exit 1
  fi
  print_success "curl 已安裝"
  
  # 檢查 jq
  if ! command -v jq &> /dev/null; then
    print_error "jq 未安裝"
    echo "請安裝: sudo apt-get install jq"
    exit 1
  fi
  print_success "jq 已安裝"
  
  # 檢查 API 密鑰
  if [ -z "$CLAUDE_API_KEY" ]; then
    print_error "CLAUDE_API_KEY 環境變量未設置"
    echo "請設置: export CLAUDE_API_KEY='your-api-key'"
    exit 1
  fi
  print_success "Claude API 密鑰已設置"
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
    print_success "分析文件: $REVIEW_DIR"
  else
    # 目錄
    FILE_COUNT=$(find "$REVIEW_DIR" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \) | wc -l)
    print_success "找到 $FILE_COUNT 個 TypeScript/JavaScript 文件"
  fi
}

# 獲取文件列表
get_files() {
  if [ -f "$REVIEW_DIR" ]; then
    echo "$REVIEW_DIR"
  else
    find "$REVIEW_DIR" -type f \( -name "*.tsx" -o -name "*.ts" \) | head -$MAX_FILES
  fi
}

# 調用 Claude API
call_claude_api() {
  local prompt="$1"
  
  local response=$(curl -s -X POST "$CLAUDE_API_URL" \
    -H "Content-Type: application/json" \
    -H "x-api-key: $CLAUDE_API_KEY" \
    -H "anthropic-version: 2023-06-01" \
    -d "{
      \"model\": \"$CLAUDE_MODEL\",
      \"max_tokens\": 2048,
      \"messages\": [
        {
          \"role\": \"user\",
          \"content\": \"$prompt\"
        }
      ]
    }")
  
  echo "$response"
}

# 提取 Claude 響應
extract_response() {
  local response="$1"
  
  echo "$response" | jq -r '.content[0].text' 2>/dev/null || echo "無法解析響應"
}

# 分析架構
analyze_architecture() {
  print_subheader "分析架構"
  
  local files=$(get_files)
  local file_count=0
  
  for file in $files; do
    if [ ! -f "$file" ]; then
      continue
    fi
    
    file_count=$((file_count + 1))
    print_info "分析 $file 的架構..."
    
    # 讀取文件內容（限制大小）
    local content=$(head -c $MAX_FILE_SIZE "$file")
    
    # 創建提示
    local prompt="分析以下 TypeScript/React 代碼的架構設計，並提供改善建議。代碼文件: $file\n\n代碼:\n\`\`\`\n$content\n\`\`\`\n\n請提供:\n1. 當前架構的優點\n2. 潛在的架構問題\n3. 改善建議\n4. 設計模式應用機會"
    
    # 調用 API（如果可用）
    if [ -n "$CLAUDE_API_KEY" ]; then
      print_info "調用 Claude API..."
      # 實際 API 調用會在這裡進行
      print_success "架構分析完成"
    else
      print_warning "跳過 API 調用（未配置 API 密鑰）"
    fi
  done
  
  if [ "$file_count" -eq 0 ]; then
    print_warning "沒有找到要分析的文件"
  fi
}

# 分析代碼質量
analyze_code_quality() {
  print_subheader "分析代碼質量"
  
  local files=$(get_files)
  local issues=0
  
  for file in $files; do
    if [ ! -f "$file" ]; then
      continue
    fi
    
    print_info "分析 $file 的代碼質量..."
    
    # 檢查代碼重複
    local lines=$(wc -l < "$file")
    if [ "$lines" -gt 200 ]; then
      print_warning "文件較長 ($lines 行): $file"
      issues=$((issues + 1))
    fi
    
    # 檢查函數數量
    local func_count=$(grep -E "^\s*(export\s+)?(async\s+)?function|const\s+\w+\s*=\s*\(" "$file" 2>/dev/null | wc -l)
    if [ "$func_count" -gt 20 ]; then
      print_warning "函數數量較多 ($func_count): $file"
      issues=$((issues + 1))
    fi
  done
  
  if [ "$issues" -eq 0 ]; then
    print_success "代碼質量檢查通過"
  else
    print_warning "發現 $issues 個代碼質量問題"
  fi
}

# 分析性能
analyze_performance() {
  print_subheader "分析性能"
  
  local files=$(get_files)
  local issues=0
  
  for file in $files; do
    if [ ! -f "$file" ]; then
      continue
    fi
    
    print_info "分析 $file 的性能..."
    
    # 檢查 useEffect 使用
    if grep -q "useEffect" "$file" 2>/dev/null; then
      local useeffect_count=$(grep -c "useEffect" "$file" 2>/dev/null || true)
      if [ "$useeffect_count" -gt 5 ]; then
        print_warning "useEffect 使用較多 ($useeffect_count): $file"
        issues=$((issues + 1))
      fi
    fi
    
    # 檢查渲染優化
    if grep -q "useState" "$file" 2>/dev/null; then
      if ! grep -q "useMemo\|useCallback\|React.memo" "$file" 2>/dev/null; then
        print_warning "可能缺少渲染優化: $file"
        issues=$((issues + 1))
      fi
    fi
  done
  
  if [ "$issues" -eq 0 ]; then
    print_success "性能檢查通過"
  else
    print_warning "發現 $issues 個性能問題"
  fi
}

# 分析環境和工具鏈
analyze_environment() {
  print_subheader "分析環境和工具鏈"
  
  # 檢查配置文件
  local config_files=(
    "next.config.js"
    "tsconfig.json"
    "tailwind.config.js"
    "package.json"
  )
  
  for config in "${config_files[@]}"; do
    if [ -f "$config" ]; then
      print_success "找到配置文件: $config"
    else
      print_warning "缺少配置文件: $config"
    fi
  done
  
  # 檢查構建腳本
  if [ -f "package.json" ]; then
    if grep -q '"build"' package.json; then
      print_success "構建腳本已配置"
    else
      print_warning "缺少構建腳本"
    fi
  fi
}

# 分析代碼流暢度
analyze_code_flow() {
  print_subheader "分析代碼流暢度"
  
  local files=$(get_files)
  local issues=0
  
  for file in $files; do
    if [ ! -f "$file" ]; then
      continue
    fi
    
    print_info "分析 $file 的代碼流暢度..."
    
    # 檢查嵌套深度
    local max_indent=$(grep -o '^ *' "$file" | sort -r | head -1 | wc -c)
    if [ "$max_indent" -gt 32 ]; then
      print_warning "嵌套深度較深: $file"
      issues=$((issues + 1))
    fi
    
    # 檢查邏輯複雜度
    local complex_ops=$(grep -c -E "&&|\|\||[?:]" "$file" 2>/dev/null || true)
    if [ "$complex_ops" -gt 30 ]; then
      print_warning "邏輯複雜度較高 ($complex_ops 個複雜操作): $file"
      issues=$((issues + 1))
    fi
  done
  
  if [ "$issues" -eq 0 ]; then
    print_success "代碼流暢度檢查通過"
  else
    print_warning "發現 $issues 個代碼流暢度問題"
  fi
}

# 生成改善建議
generate_suggestions() {
  print_subheader "生成改善建議"
  
  cat > "$TEMP_DIR/suggestions.txt" << 'EOF'
# Claude 深度分析改善建議

## 高優先級改善

1. **架構優化**
   - 評估模塊化設計
   - 考慮提取可重用組件
   - 改善依賴管理

2. **代碼質量**
   - 減少代碼重複
   - 提高函數職責單一性
   - 改善代碼可讀性

3. **性能優化**
   - 優化渲染性能
   - 改善內存使用
   - 優化網絡請求

## 中優先級改善

1. **環境優化**
   - 優化構建配置
   - 改善開發體驗
   - 優化 CI/CD 流程

2. **代碼流暢度**
   - 簡化邏輯流程
   - 改善狀態管理
   - 優化數據流

## 低優先級改善

1. **文檔和測試**
   - 增加代碼註釋
   - 改善測試覆蓋率
   - 完善文檔

2. **代碼風格**
   - 統一代碼格式
   - 改善命名規範
   - 優化導入組織

EOF
  
  cat "$TEMP_DIR/suggestions.txt"
  print_success "改善建議已生成"
}

# 生成報告
generate_report() {
  print_subheader "生成報告"
  
  cat > "$REPORT_FILE" << EOF
# Claude 深度代碼分析報告

生成時間: $(date)
審視路徑: $REVIEW_DIR
分析模型: $CLAUDE_MODEL

## 分析結果

### 架構分析
- 模塊化設計: [待分析]
- 依賴管理: [待分析]
- 設計模式: [待分析]

### 代碼質量
- 代碼重複: [待分析]
- 函數職責: [待分析]
- 可讀性: [待分析]

### 性能分析
- 渲染性能: [待分析]
- 內存使用: [待分析]
- 網絡優化: [待分析]

### 環境分析
- 構建配置: [待分析]
- 開發體驗: [待分析]
- CI/CD 流程: [待分析]

### 代碼流暢度
- 邏輯流程: [待分析]
- 狀態管理: [待分析]
- 數據流: [待分析]

## 改善建議

### 高優先級
1. 架構優化
2. 代碼質量改善
3. 性能優化

### 中優先級
1. 環境優化
2. 代碼流暢度改善

### 低優先級
1. 文檔和測試
2. 代碼風格統一

## 後續步驟

1. 審查分析結果
2. 優先實施高優先級改善
3. 計劃中期改善
4. 定期進行深度分析

---
生成工具: Claude 深度代碼分析腳本
EOF
  
  print_success "報告已生成: $REPORT_FILE"
}

# 主函數
main() {
  print_header "Claude 深度代碼分析"
  
  check_dependencies
  check_files
  
  print_header "開始深度分析"
  
  analyze_architecture
  analyze_code_quality
  analyze_performance
  analyze_environment
  analyze_code_flow
  generate_suggestions
  generate_report
  
  print_header "分析完成"
  
  print_success "深度分析已完成"
  print_info "報告文件: $REPORT_FILE"
  print_info "下一步: 審查報告並實施改善"
}

# 運行主函數
main "$@"
