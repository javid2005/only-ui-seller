import { useMemo, useState } from 'react'
import { Box, CloseButton, Input, InputGroup, TreeView } from '@chakra-ui/react'
import type { TreeCollection } from '@chakra-ui/react'
import { Check, ChevronLeft, Minus, Search } from 'lucide-react'
import type { CategoryNode } from './categories'

export interface CategoryTreeViewProps {
  /** کالکشن کامل (فیلترنشده) — برای مقایسه/محاسبه چک‌شدگی همیشه از این استفاده می‌شود */
  collection: TreeCollection<CategoryNode>
  checkedValue: string[]
  onCheckedChange: (checkedValue: string[]) => void
}

/**
 * ستون درخت دسته/زیردسته — عیناً LocationTreeView.tsx (Chakra TreeView واقعی + فیلتر)، فقط
 * دیتای دسته‌بندی به‌جای استان/شهر (طبق دستور کاربر: «همون treeview موقعیت جغرافیایی»).
 * جزئیات RTL/padding/چک‌باکس همه از همان کامپوننت اثبات‌شده کپی شده — دوباره چک نشده چون
 * چیزی در منطق عوض نشده، فقط نوع دیتا.
 */
export function CategoryTreeView({ collection, checkedValue, onCheckedChange }: CategoryTreeViewProps) {
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
          placeholder="جستجو در دسته ها و زیردسته ها"
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
                const paddingInlineStart = indexPath.length === 1 ? '12px' : '60px'
                return nodeState.isBranch ? (
                  <TreeView.BranchControl style={{ paddingInlineStart }}>
                    <TreeView.BranchTrigger>
                      <TreeView.BranchIndicator>
                        <ChevronLeft size={16} />
                      </TreeView.BranchIndicator>
                    </TreeView.BranchTrigger>
                    <CategoryCheckbox checked={nodeState.checked} />
                    <TreeView.BranchText>{node.label}</TreeView.BranchText>
                  </TreeView.BranchControl>
                ) : (
                  <TreeView.Item style={{ paddingInlineStart }}>
                    <CategoryCheckbox checked={nodeState.checked} />
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

/** چک‌باکس دستی روی TreeView.NodeCheckbox — عیناً LocationCheckbox در LocationTreeView.tsx */
function CategoryCheckbox({ checked }: { checked: boolean | 'indeterminate' }) {
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
