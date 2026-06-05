import { useRef, useState } from 'react'
import { Badge, Box, Button, Collapsible, Flex, IconButton, Separator, Text } from '@chakra-ui/react'
import { CirclePlus, CircleMinus } from 'lucide-react'
import type { ProductCategory } from './data'
import { SubCategoryGrip } from './SubCategoryGrip'

export interface CategoryMngAccordionProps {
  category: ProductCategory
  isOpen: boolean
  onToggle: () => void
  /** باز کردن دیالوگ افزودن زیردسته برای این دسته */
  onAddSub: () => void
  onRemoveSub: (subId: string) => void
  /** جابه‌جایی زیردسته (drag reorder) */
  onReorderSub: (fromIdx: number, toIdx: number) => void
  /** آخرین ردیف؟ → border پایین حذف */
  isLast?: boolean
}

/**
 * CategoryMngAccordion — ردیف مدیریت دسته با زیردسته‌ها.
 * collapsed: ردیف h-56 با border-b. open: bg.subtle + افزودن + لیست زیردسته.
 * RTL DOM order (first = rightmost): [emoji] [name] [badge] [add btn] [toggle].
 */
export function CategoryMngAccordion({
  category,
  isOpen,
  onToggle,
  onAddSub,
  onRemoveSub,
  onReorderSub,
  isLast = false,
}: CategoryMngAccordionProps) {
  const count = category.subcategories.length
  const dragFrom = useRef<number | null>(null)
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  return (
    <Box w="full" borderBottomWidth={isLast ? '0' : '1px'} borderColor="border.muted">
      {/* ─── Header row (clickable) ─────────────────────────────────────── */}
      <Flex
        align="center"
        gap="3"
        w="full"
        minH="14"          /* 56px */
        px="4"
        bg={isOpen ? 'bg.subtle' : 'transparent'}
        _hover={{ bg: 'bg.subtle' }}
        transition="background 0.15s"
        cursor="pointer"
        onClick={onToggle}
      >
        {/* FIRST = rightmost: آیکن دسته */}
        <Box as="span" fontSize="lg" lineHeight="1" flexShrink={0}>
          {category.icon}
        </Box>

        {/* نام دسته */}
        <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" truncate flex="1" minW="0">
          {category.name}
        </Text>

        {/* badge تعداد زیردسته (اگه > 0) */}
        {count > 0 && (
          <Badge colorPalette="purple" size="xs" flexShrink={0}>
            {count.toLocaleString('fa-IR')} زیردسته
          </Badge>
        )}

        {/* افزودن زیردسته — فقط حالت باز */}
        {isOpen && (
          <Button
            size="xs"
            colorPalette="brand"
            flexShrink={0}
            onClick={(e) => {
              e.stopPropagation()
              onAddSub()
            }}
          >
            افزودن زیردسته
          </Button>
        )}

        {/* LAST = leftmost: toggle */}
        <IconButton
          size="xs"
          variant="ghost"
          color="fg.muted"
          flexShrink={0}
          aria-label={isOpen ? 'بستن' : 'باز کردن'}
          onClick={(e) => {
            e.stopPropagation()
            onToggle()
          }}
        >
          {isOpen ? <CircleMinus size={20} /> : <CirclePlus size={20} />}
        </IconButton>
      </Flex>

      {/* ─── Subcategory list (collapsible) ─────────────────────────────── */}
      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
          <Box bg="bg.subtle" px="4" pb="4" pt="0">
            <Separator borderColor="border" mb="3" />
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="right" mb="2">
              زیردسته‌ها:
            </Text>

            {count > 0 ? (
              <Flex direction="column" gap="0.5">
                {category.subcategories.map((s, idx) => (
                  <SubCategoryGrip
                    key={s.id}
                    name={s.name}
                    onRemove={() => onRemoveSub(s.id)}
                    isDragging={dragIdx === idx}
                    onDragStart={() => {
                      dragFrom.current = idx
                      setDragIdx(idx)
                    }}
                    onDragEnter={() => {
                      const from = dragFrom.current
                      if (from === null || from === idx) return
                      onReorderSub(from, idx)
                      dragFrom.current = idx
                      setDragIdx(idx)
                    }}
                    onDragEnd={() => {
                      dragFrom.current = null
                      setDragIdx(null)
                    }}
                  />
                ))}
              </Flex>
            ) : (
              <Text fontSize="xs" color="fg.subtle" textAlign="center" py="4">
                هنوز زیردسته‌ای اضافه نشده.
              </Text>
            )}
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}
