import { useMemo, useState } from 'react'
import { Box, CloseButton, Input, InputGroup, TreeView } from '@chakra-ui/react'
import type { TreeCollection } from '@chakra-ui/react'
import { Check, ChevronLeft, Minus, Search } from 'lucide-react'
import type { LocationNode } from './locations'

export interface LocationTreeViewProps {
  /** کالکشن کامل (فیلترنشده) — برای مقایسه/محاسبه چک‌شدگی همیشه از این استفاده می‌شود */
  collection: TreeCollection<LocationNode>
  checkedValue: string[]
  onCheckedChange: (checkedValue: string[]) => void
}

/**
 * ستون درخت استان/شهر — Chakra TreeView واقعی با checkbox + filtering (نه موکاپ دستی طرح فیگما،
 * طبق دستور مستقیم کاربر: «کامپوننت treeview رو نداشتم از خودم ساختم ولی تو از chakra treeview
 * استفاده کن»). indeterminate چک‌باکس استان خودکار از روی زیرشاخه‌ها محاسبه می‌شود (منطق native
 * زاگ‌جی‌اس در getCheckedState، نه پیاده‌سازی دستی).
 *
 * فیلتر با TreeCollection.filter (native، نگه‌دارندهٔ زنجیرهٔ والد وقتی فرزند match می‌کند) —
 * collection پاس‌داده‌شده به Root فقط برای رندر لیست visible تغییر می‌کند؛ checkedValue و
 * محاسبهٔ همه‌شهرها/indeterminate در ستون «انتخاب‌شده» همیشه روی کالکشن کامل (بدون فیلتر) است.
 */
export function LocationTreeView({ collection, checkedValue, onCheckedChange }: LocationTreeViewProps) {
  const [query, setQuery] = useState('')

  const visibleCollection = useMemo(() => {
    if (!query.trim()) return collection
    const q = query.trim()
    return collection.filter((node) => node.label.includes(q))
  }, [collection, query])

  return (
    <Box display="flex" flexDirection="column" gap="4" w="full" h="full">
      <InputGroup
        startElement={<Search size={16} />}
        endElement={query ? <CloseButton size="xs" onClick={() => setQuery('')} aria-label="پاک‌کردن جستجو" /> : undefined}
      >
        <Input
          placeholder="جستجوی استان یا شهر"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </InputGroup>

      <Box flex="1" minH="0" overflowY="auto">
        <TreeView.Root
          dir="rtl"
          collection={visibleCollection}
          checkedValue={checkedValue}
          onCheckedChange={(e) => onCheckedChange(e.checkedValue)}
          size="md"
          colorPalette="brand"
        >
          <TreeView.Tree>
            <TreeView.Node
              render={({ node, indexPath, nodeState }) => {
                // ریشهٔ باگ قبلی: TreeView.Root بدون dir="rtl" پیشفرضش ltr بود، پس ps (که باید
                // راست بشه) داشت left می‌شد — با dir="rtl" فرمول native رسیپی (--depth) خودش
                // درست شد (استان=12px، شهر=36px)، ولی کاربر صریح خواسته شهر دقیقاً 60px باشه —
                // چون همون ps prop معمولی با کلاس رسیپی specificity-conflict داره و override
                // نمی‌شه، این‌جا با style inline واقعی (اولویت بالاتر از کلاس) ست می‌شه.
                const paddingInlineStart = indexPath.length === 1 ? '12px' : '60px'
                return nodeState.isBranch ? (
                  <TreeView.BranchControl style={{ paddingInlineStart }}>
                    <TreeView.BranchTrigger>
                      <TreeView.BranchIndicator>
                        <ChevronLeft size={16} />
                      </TreeView.BranchIndicator>
                    </TreeView.BranchTrigger>
                    <LocationCheckbox checked={nodeState.checked} />
                    <TreeView.BranchText>{node.label}</TreeView.BranchText>
                  </TreeView.BranchControl>
                ) : (
                  <TreeView.Item style={{ paddingInlineStart }}>
                    <LocationCheckbox checked={nodeState.checked} />
                    <TreeView.ItemText>{node.label}</TreeView.ItemText>
                  </TreeView.Item>
                )
              }}
            />
          </TreeView.Tree>
        </TreeView.Root>
      </Box>
    </Box>
  )
}

/** چک‌باکس دستی روی TreeView.NodeCheckbox — رسیپی tree-view چاکرا فقط display:inline-flex می‌ده،
 * بدون باکس/آیکون؛ سایز و رنگ اینجا مطابق رسیپی checkmark چاکرا در size="md" (boxSize=5, p=0.5). */
function LocationCheckbox({ checked }: { checked: boolean | 'indeterminate' }) {
  const isActive = checked !== false
  return (
    <TreeView.NodeCheckbox
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      flexShrink={0}
      boxSize="5"
      p="0.5"
      borderWidth="1px"
      borderRadius="l1"
      color="brand.contrast"
      borderColor={isActive ? 'brand.solid' : 'border.emphasized'}
      bg={isActive ? 'brand.solid' : 'transparent'}
    >
      <TreeView.NodeCheckboxIndicator indeterminate={<Minus size={14} />}>
        <Check size={14} />
      </TreeView.NodeCheckboxIndicator>
    </TreeView.NodeCheckbox>
  )
}
