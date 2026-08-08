import { Badge, Box, Collapsible, Flex, IconButton, Separator, Text, Wrap } from '@chakra-ui/react'
import { ChevronDown, ChevronUp, CirclePlus, X } from 'lucide-react'
import type { SignupCategory } from './signupCategoriesData'

export interface SignupCategoryAccordionProps {
  category: SignupCategory
  selected: boolean
  isDefault: boolean
  isOpen: boolean
  onToggleSelect: () => void
  onToggleOpen: () => void
  isLast?: boolean
}

// RTL DOM order (first = راست‌ترین): آیکن دسته → عنوان → بج پیش‌فرض (کنار دکمه) → دکمهٔ انتخاب/حذف → دکمهٔ باز/بسته (چپ‌ترین).
// موبایل (< sm=480px): دکمهٔ فلش مجزا حذف می‌شه، کل ردیف بازکنندهٔ آکاردئون می‌شه.
export function SignupCategoryAccordion({
  category,
  selected,
  isDefault,
  isOpen,
  onToggleSelect,
  onToggleOpen,
  isLast = false,
}: SignupCategoryAccordionProps) {
  return (
    <Box w="full" borderBottomWidth={isLast ? '0' : '1px'} borderColor="border">
      <Flex
        align="center"
        gap="4"
        w="full"
        px="4"
        py="3"
        bg={isOpen ? 'bg.subtle' : 'transparent'}
        _hover={{ bg: 'bg.subtle' }}
        transition="background 0.15s"
        cursor={{ base: 'pointer', sm: 'default' }}
        onClick={onToggleOpen}
      >
        <img src={category.icon.src} alt="" width={32} height={32} style={{ flexShrink: 0 }} />

        <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start" truncate minW="0" flex="1">
          {category.name}
        </Text>

        {selected && isDefault && (
          <Badge colorPalette="green" size="xs" flexShrink={0}>پیش فرض</Badge>
        )}

        <IconButton
          size="xs"
          variant="ghost"
          colorPalette={selected ? 'red' : 'brand'}
          flexShrink={0}
          aria-label={selected ? 'حذف دسته‌بندی' : 'افزودن دسته‌بندی'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleSelect()
          }}
        >
          {selected ? <X size={16} /> : <CirclePlus size={16} />}
        </IconButton>

        {/* موبایل: کل ردیف بازکننده‌ست (onClick بالای Flex) → دکمهٔ فلش مجزا لازم نیست */}
        <IconButton
          display={{ base: 'none', sm: 'flex' }}
          size="xs"
          variant="ghost"
          color="fg.muted"
          flexShrink={0}
          aria-label={isOpen ? 'بستن زیردسته‌ها' : 'مشاهدهٔ زیردسته‌ها'}
          onClick={(e) => {
            e.stopPropagation()
            onToggleOpen()
          }}
        >
          {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </IconButton>
      </Flex>

      <Collapsible.Root open={isOpen}>
        <Collapsible.Content>
          <Box bg="bg.subtle" px="4" pb="4">
            <Separator borderColor="border" mb="3" />
            <Text fontSize="xs" fontWeight="medium" color="fg.muted" textAlign="start" mb="2" w="full">
              این دسته بندی شامل زیردسته های زیر می باشد:
            </Text>
            <Wrap justify="start" gap="2">
              {category.subcategories.map((sub) => (
                <Badge key={sub} variant="outline" colorPalette="gray" size="lg" fontWeight="normal">
                  {sub}
                </Badge>
              ))}
            </Wrap>
          </Box>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )
}
