import { Box, Flex, Text, Menu, IconButton, Portal } from '@chakra-ui/react'
import { Phone, EllipsisVertical, Pencil, Trash2 } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PhoneCardProps {
  id: string
  /** شماره تلفن */
  number: string
  /** برچسب / نام (مثل: دفتر مرکزی) */
  label: string
  /** نوع: work | mobile | home */
  type: 'work' | 'mobile' | 'home'
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TYPE_LABEL: Record<string, string> = {
  work: 'دفتر',
  mobile: 'موبایل',
  home: 'خانه',
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * PhoneCard — نمایش یک شماره تلفن در لیست
 *
 * RTL DOM order (first=rightmost):
 *   [phone icon box]  [number + label]  [⋮ menu]
 */
export function PhoneCard({ id, number, label, type, onEdit, onDelete }: PhoneCardProps) {
  return (
    <Flex
      align="center"
      gap="4"
      p="4"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      w="full"
      minH="72px"
    >
      {/* FIRST = rightmost in RTL — آیکن تلفن */}
      <Box
        bg="bg.muted"
        rounded="md"
        p="2"
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color="fg.muted"
      >
        <Phone size={24} />
      </Box>

      {/* Content — flex-start = RIGHT side in RTL column */}
      <Flex direction="column" gap="1" flex="1" minW="0" align="flex-start">
        <Text fontSize="sm" fontWeight="semibold" color="fg" lineHeight="1.428" noOfLines={1}>
          {number}
        </Text>
        <Text fontSize="xs" color="fg.muted" lineHeight="1.333">
          {label ? `${label} — ${TYPE_LABEL[type]}` : TYPE_LABEL[type]}
        </Text>
      </Flex>

      {/* LAST = leftmost in RTL — منوی سه‌نقطه */}
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            variant="ghost"
            size="sm"
            flexShrink={0}
            aria-label="گزینه‌ها"
          >
            <EllipsisVertical size={20} />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner dir="rtl">
            <Menu.Content minW="40">
              <Menu.Item value="edit" onClick={() => onEdit?.(id)}>
                <Pencil size={14} />
                ویرایش
              </Menu.Item>
              <Menu.Item
                value="delete"
                onClick={() => onDelete?.(id)}
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
              >
                <Trash2 size={14} />
                حذف
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  )
}
