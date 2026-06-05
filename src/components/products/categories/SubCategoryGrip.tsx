import { useState } from 'react'
import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'

export interface SubCategoryGripProps {
  name: string
  icon?: string
  onRemove?: () => void
  onEdit?: () => void
  /** HTML5 drag — مدیریت reorder در parent */
  onDragStart?: () => void
  onDragEnter?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}

/**
 * SubCategoryGrip — یک ردیف زیردسته (Figma 287:5982).
 * RTL DOM order (first = rightmost): [grip] [emoji] [name] …spacer… [edit] [delete].
 * grip سمت راست (کنار محتوا، همیشه دیده می‌شه). edit/delete فقط hover.
 * hover: bg teal.subtle + border teal.focusRing.
 */
export function SubCategoryGrip({
  name,
  icon = '🌰',
  onRemove,
  onEdit,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging = false,
}: SubCategoryGripProps) {
  const [hover, setHover] = useState(false)

  return (
    <Flex
      align="center"
      gap="4"
      w="full"
      minH="12"            /* 48px */
      px="4"
      py="2"
      bg={hover ? 'teal.subtle' : 'bg.muted'}
      borderWidth="1px"
      borderColor={hover ? 'teal.focusRing' : 'transparent'}
      rounded="md"          /* 4px = Figma radii/sm */
      opacity={isDragging ? 0.5 : 1}
      transition="background 0.15s, border-color 0.15s, opacity 0.15s"
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* FIRST = rightmost در RTL: دستگیره drag */}
      <Box color="fg.muted" cursor="grab" flexShrink={0} _active={{ cursor: 'grabbing' }} aria-hidden>
        <GripVertical size={16} />
      </Box>

      {/* آیکن */}
      <Box as="span" fontSize="lg" lineHeight="1" flexShrink={0}>
        {icon}
      </Box>

      {/* نام زیردسته */}
      <Text fontSize="sm" fontWeight="semibold" color="fg" flexShrink={0}>
        {name}
      </Text>

      {/* spacer */}
      <Box flex="1" minW="0" />

      {/* hover-only: edit (راست) + delete (چپ) */}
      {hover && (
        <>
          {onEdit && (
            <IconButton size="sm" variant="ghost" aria-label="ویرایش زیردسته" flexShrink={0} onClick={onEdit}>
              <Pencil size={16} />
            </IconButton>
          )}
          {onRemove && (
            <IconButton size="sm" variant="ghost" colorPalette="red" aria-label="حذف زیردسته" flexShrink={0} onClick={onRemove}>
              <Trash2 size={16} />
            </IconButton>
          )}
        </>
      )}
    </Flex>
  )
}
