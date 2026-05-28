import { useState } from 'react'
import { Box, Button, Collapsible, Flex, IconButton, Separator, Text, Badge } from '@chakra-ui/react'
import { CheckCircle2, CircleMinus, CirclePlus, Trash2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CategoryData {
  id: string
  /** نام فارسی دسته */
  name: string
  /** مسیر آیکن (SVG import شده) */
  iconSrc: string
  /** زیردسته‌ها */
  subcategories?: string[]
}

export interface CategoryAccordionProps {
  category: CategoryData
  /** آیا کاربر این دسته را به فروشگاه اضافه کرده */
  isSelected: boolean
  /** آیا این دسته پیش‌فرض انتخاب‌شده است */
  isDefault?: boolean
  onAdd: (id: string) => void
  onRemove: (id: string) => void
  onSetDefault?: (id: string) => void
  /** کنترل خارجی حالت باز/بسته (اختیاری — اگه داده نشه self-managed) */
  isOpenControlled?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

// ─── Sub-component: SubCategoryItem ──────────────────────────────────────────

function SubCategoryItem({ label }: { label: string }) {
  return (
    <Flex
      align="center"
      gap="2"
      bg="bg.muted"
      px="2"
      py="2"
      minW="150px"
      maxW="186px"
      flex="1 0 0"
    >
      {/* FIRST = rightmost در RTL: آیکن تیک */}
      <Box color="brand.solid" display="flex" alignItems="center" flexShrink={0}>
        <CheckCircle2 size={16} />
      </Box>
      <Text fontSize="xs" fontWeight="medium" color="fg" lineHeight="1.333" noOfLines={1} flex="1">
        {label}
      </Text>
    </Flex>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CategoryAccordion({
  category,
  isSelected,
  isDefault = false,
  onAdd,
  onRemove,
  onSetDefault,
  isOpenControlled,
  onOpenChange,
}: CategoryAccordionProps) {
  const [isOpenInternal, setIsOpenInternal] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // اگه isOpenControlled داده شده → controlled mode، وگرنه self-managed
  const isOpen = isOpenControlled !== undefined ? isOpenControlled : isOpenInternal

  function handleOpenChange(open: boolean) {
    setIsOpenInternal(open)
    onOpenChange?.(open)
  }

  // «افزودن» — hover یا open، فقط اگه انتخاب نشده
  const showAdd = (isHovered || isOpen) && !isSelected
  // «انتخاب پیش‌فرض» — فقط hover، فقط اگه selected و پیش‌فرض نیست و open نیست
  const showMakeDefault = isHovered && !isOpen && isSelected && !isDefault

  return (
    <Collapsible.Root
      open={isOpen}
      onOpenChange={({ open }) => handleOpenChange(open)}
      style={{ width: '100%', minWidth: 0 }}
    >
      <Flex
        direction="column"
        borderBottomWidth="1px"
        borderColor="border"
        bg={isOpen || isHovered ? 'bg.subtle' : 'bg'}
        px="4"
        py="3"
        gap="3"
        w="full"
        minW="0"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        transition="background 0.15s ease"
      >
        {/* ─── Header row ─────────────────────────────────────────────────────── */}
        <Flex align="center" gap="4" w="full" overflow="hidden">

          {/* FIRST = rightmost در RTL: آیکن دسته‌بندی */}
          <Box
            w="8"
            h="8"
            flexShrink={0}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Box
              as="img"
              src={category.iconSrc}
              alt={category.name}
              w="full"
              h="full"
              objectFit="cover"
            />
          </Box>

          {/* SECOND: نام + badge — RTL: [icon | text | badge | ...buttons]
               Text FIRST = rightmost (کنار آیکن)، Badge SECOND = سمت چپ text */}
          <Flex flex="1" minW="0" align="center" gap="2" justify="flex-start">
            <Text
              fontSize="sm"
              fontWeight="semibold"
              color="fg"
              lineHeight="1.428"
              truncate
              flex="1"
              minW="0"
            >
              {category.name}
            </Text>
            {isSelected && isDefault && (
              <Badge colorPalette="green" size="xs" flexShrink={0}>
                پیش فرض
              </Badge>
            )}
          </Flex>

          {/* THIRD: دکمه‌های شرطی (mutually exclusive) */}
          {showMakeDefault && (
            <Button
              size="2xs"
              colorPalette="brand"
              variant="outline"
              flexShrink={0}
              onClick={() => onSetDefault?.(category.id)}
            >
              انتخاب پیش‌فرض
            </Button>
          )}

          {showAdd && (
            <Button
              size="2xs"
              colorPalette="brand"
              variant="solid"
              flexShrink={0}
              onClick={() => onAdd(category.id)}
            >
              افزودن
            </Button>
          )}

          {/* Trash — وقتی selected */}
          {isSelected && (
            <IconButton
              variant="ghost"
              size="xs"
              flexShrink={0}
              aria-label="حذف دسته‌بندی"
              color="fg.error"
              _hover={{ bg: 'bg.error' }}
              onClick={(e) => {
                e.stopPropagation()
                onRemove(category.id)
              }}
            >
              <Trash2 size={14} />
            </IconButton>
          )}

          {/* LAST = leftmost در RTL: باز/بسته */}
          <Collapsible.Trigger asChild>
            <Box
              as="button"
              type="button"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
              color="fg.subtle"
              _hover={{ color: 'fg' }}
              cursor="pointer"
              transition="color 0.15s ease"
            >
              {isOpen ? <CircleMinus size={20} /> : <CirclePlus size={20} />}
            </Box>
          </Collapsible.Trigger>
        </Flex>

        {/* ─── Expanded content (animated) ─────────────────────────────────── */}
        <Collapsible.Content>
          <Flex direction="column" gap="2" w="full">
            <Separator />
            <Flex direction="column" gap="2" pt="1" w="full">
              <Text
                fontSize="xs"
                fontWeight="medium"
                color="fg.muted"
                lineHeight="1.333"
                w="full"
                textAlign="right"
              >
                این دسته‌بندی شامل زیردسته‌های زیر می‌باشد:
              </Text>

              {(category.subcategories ?? []).length > 0 ? (
                <Flex wrap="wrap" gap="2" justify="flex-start" w="full">
                  {(category.subcategories ?? []).map((sub) => (
                    <SubCategoryItem key={sub} label={sub} />
                  ))}
                </Flex>
              ) : (
                <Text
                  fontSize="xs"
                  color="fg.subtle"
                  textAlign="right"
                  w="full"
                >
                  زیردسته‌ای ثبت نشده است.
                </Text>
              )}
            </Flex>
          </Flex>
        </Collapsible.Content>
      </Flex>
    </Collapsible.Root>
  )
}
