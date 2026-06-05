import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { GripVertical, X } from 'lucide-react'

export interface SubCategoryGripProps {
  name: string
  icon?: string
  onRemove?: () => void
  /** HTML5 drag — مدیریت reorder در parent */
  onDragStart?: () => void
  onDragEnter?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}

/**
 * SubCategoryGrip — یک ردیف زیردسته داخل آکاردیون باز.
 * RTL DOM order (first = rightmost): [emoji] [name] …spacer… [remove] [grip].
 * grip = دستگیره‌ی drag (سمت چپ/end در RTL).
 */
export function SubCategoryGrip({
  name,
  icon = '🌰',
  onRemove,
  onDragStart,
  onDragEnter,
  onDragEnd,
  isDragging = false,
}: SubCategoryGripProps) {
  return (
    <Flex
      align="center"
      gap="4"
      w="full"
      minH="12"            /* 48px — design min-h */
      px="4"
      py="2"
      bg="bg.muted"
      rounded="md"          /* 4px = Figma radii/sm */
      opacity={isDragging ? 0.5 : 1}
      transition="opacity 0.15s"
      draggable
      onDragStart={onDragStart}
      onDragEnter={onDragEnter}
      onDragEnd={onDragEnd}
      onDragOver={(e) => e.preventDefault()}
    >
      {/* FIRST = rightmost در RTL: آیکن */}
      <Box as="span" fontSize="lg" lineHeight="1" flexShrink={0}>
        {icon}
      </Box>

      {/* نام زیردسته */}
      <Text fontSize="sm" fontWeight="semibold" color="fg" flexShrink={0}>
        {name}
      </Text>

      {/* spacer */}
      <Box flex="1" minW="0" />

      {/* remove — کنار grip */}
      {onRemove && (
        <IconButton
          size="2xs"
          variant="ghost"
          colorPalette="red"
          aria-label="حذف زیردسته"
          flexShrink={0}
          onClick={onRemove}
        >
          <X size={14} />
        </IconButton>
      )}

      {/* LAST = leftmost در RTL: دستگیره drag */}
      <Box
        color="fg.muted"
        cursor="grab"
        flexShrink={0}
        _active={{ cursor: 'grabbing' }}
        aria-hidden
      >
        <GripVertical size={16} />
      </Box>
    </Flex>
  )
}
