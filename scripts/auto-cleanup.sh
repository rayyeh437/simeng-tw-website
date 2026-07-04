#!/bin/bash

# ============================================================================
# 自動代碼清理腳本
# ============================================================================
#
# 自動移除調試代碼、未使用的 import 和其他不必要的代碼
#
# 用法:
#   bash scripts/auto-cleanup.sh [file_or_dir]
#   bash scripts/auto-cleanup.sh app/page.tsx
#   bash scripts/auto-cleanup.sh app/  # 清理整個目錄
#
# 功能:
#   - 移除 console.log 調試代碼
#   - 移除未使用的 import
#   - 移除空行和尾部空格
#   - 整理代碼格式
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
TARGET="${1:-.}"
BACKUP_DIR=".cleanup-backup-$(date +%Y%m%d-%H%M%S)"
DRY_RUN="${DRY_RUN:-false}"

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

# 移除 console.log
remove_console_logs() {
  local file="$1"
  local temp_file="$file.tmp"
  local count=0
  
  # 移除 console.log 行
  grep -v "console\.log" "$file" > "$temp_file" || true
  
  # 計算移除的行數
  count=$(diff "$file" "$temp_file" 2>/dev/null | grep "^<" | wc -l || true)
  
  if [ "$count" -gt 0 ]; then
    if [ "$DRY_RUN" = "true" ]; then
      print_info "[$file] 將移除 $count 個 console.log"
      rm "$temp_file"
    else
      mv "$temp_file" "$file"
      print_success "[$file] 已移除 $count 個 console.log"
    fi
    return 0
  else
    rm "$temp_file"
    return 1
  fi
}

# 移除尾部空格
remove_trailing_spaces() {
  local file="$1"
  local temp_file="$file.tmp"
  local count=0
  
  # 移除尾部空格
  sed 's/[[:space:]]*$//' "$file" > "$temp_file"
  
  # 計算修改的行數
  count=$(diff "$file" "$temp_file" 2>/dev/null | grep "^<" | wc -l || true)
  
  if [ "$count" -gt 0 ]; then
    if [ "$DRY_RUN" = "true" ]; then
      print_info "[$file] 將移除 $count 行的尾部空格"
      rm "$temp_file"
    else
      mv "$temp_file" "$file"
      print_success "[$file] 已移除 $count 行的尾部空格"
    fi
    return 0
  else
    rm "$temp_file"
    return 1
  fi
}

# 移除多個連續空行
remove_multiple_blank_lines() {
  local file="$1"
  local temp_file="$file.tmp"
  local count=0
  
  # 移除多個連續空行（保留最多一個）
  cat "$file" | cat -s > "$temp_file"
  
  # 計算修改的行數
  count=$(diff "$file" "$temp_file" 2>/dev/null | grep "^<" | wc -l || true)
  
  if [ "$count" -gt 0 ]; then
    if [ "$DRY_RUN" = "true" ]; then
      print_info "[$file] 將移除 $count 個多餘空行"
      rm "$temp_file"
    else
      mv "$temp_file" "$file"
      print_success "[$file] 已移除 $count 個多餘空行"
    fi
    return 0
  else
    rm "$temp_file"
    return 1
  fi
}

# 整理 import 語句
organize_imports() {
  local file="$1"
  local temp_file="$file.tmp"
  
  # 提取 import 語句
  grep "^import\|^export.*from" "$file" > "$temp_file.imports" 2>/dev/null || true
  
  # 排序 import 語句
  sort "$temp_file.imports" > "$temp_file.imports.sorted" 2>/dev/null || true
  
  # 檢查是否有變化
  if ! diff "$temp_file.imports" "$temp_file.imports.sorted" > /dev/null 2>&1; then
    if [ "$DRY_RUN" = "true" ]; then
      print_info "[$file] 將整理 import 語句"
    else
      # 移除原始 import 語句
      grep -v "^import\|^export.*from" "$file" > "$temp_file"
      
      # 添加排序後的 import 語句
      cat "$temp_file.imports.sorted" "$temp_file" > "$file"
      print_success "[$file] 已整理 import 語句"
    fi
  fi
  
  # 清理臨時文件
  rm -f "$temp_file" "$temp_file.imports" "$temp_file.imports.sorted"
}

# 檢查文件
check_file() {
  local file="$1"
  
  if [ ! -f "$file" ]; then
    return 1
  fi
  
  # 只處理 TypeScript/JavaScript 文件
  case "$file" in
    *.tsx | *.ts | *.jsx | *.js)
      return 0
      ;;
    *)
      return 1
      ;;
  esac
}

# 清理單個文件
cleanup_file() {
  local file="$1"
  
  if ! check_file "$file"; then
    return
  fi
  
  print_info "清理 $file..."
  
  # 備份文件
  if [ "$DRY_RUN" = "false" ]; then
    mkdir -p "$BACKUP_DIR"
    cp "$file" "$BACKUP_DIR/$(basename "$file")"
  fi
  
  # 執行清理操作
  remove_console_logs "$file" || true
  remove_trailing_spaces "$file" || true
  remove_multiple_blank_lines "$file" || true
  organize_imports "$file" || true
}

# 主函數
main() {
  print_header "自動代碼清理"
  
  # 檢查 DRY_RUN 模式
  if [ "$DRY_RUN" = "true" ]; then
    print_warning "DRY_RUN 模式啟用 - 不會修改文件"
  fi
  
  print_subheader "掃描文件"
  
  if [ -f "$TARGET" ]; then
    # 單個文件
    print_info "清理文件: $TARGET"
    cleanup_file "$TARGET"
  elif [ -d "$TARGET" ]; then
    # 目錄
    local file_count=0
    while IFS= read -r file; do
      cleanup_file "$file"
      file_count=$((file_count + 1))
    done < <(find "$TARGET" -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.jsx" -o -name "*.js" \))
    
    print_info "已清理 $file_count 個文件"
  else
    print_error "路徑不存在: $TARGET"
    exit 1
  fi
  
  print_header "清理完成"
  
  if [ "$DRY_RUN" = "false" ]; then
    print_success "代碼已清理"
    print_info "備份位置: $BACKUP_DIR"
  else
    print_success "DRY_RUN 完成 - 無文件被修改"
    print_info "要實際執行清理，請運行: DRY_RUN=false bash scripts/auto-cleanup.sh"
  fi
}

# 運行主函數
main "$@"
