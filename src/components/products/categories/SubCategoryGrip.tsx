import { useEffect, useRef, useState } from 'react'
import { Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { GripVertical, Pencil, Trash2 } from 'lucide-react'

export interface SubCategoryGripProps {
  name: string
  icon?: string
  onRemove?: () => void
  onEdit?: () => void
  onDragStart?: () => void
  onDragEnter?: () => void
  onDragEnd?: () => void
  isDragging?: boolean
}

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
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // mobile: دکمه‌ها همیشه دیده می‌شن (hover معنی نداره)
  const showActions = isMobile || hover

  return (
    <Flex
      align="center"
      gap="2"
      w="full"
      h="12"               /* ارتفاع ثابت 48px — layout shift نشه */
      px="4"
      bg={hover && !isMobile ? 'brand.bg' : 'bg.muted'}
      borderWidth="1px"
      borderColor={hover && !isMobile ? 'brand.border' : 'transparent'}
      rounded="md"
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
      {/* FIRST = rightmost: grip */}
      <Box color="fg.muted" cursor="grab" flexShrink={0} _active={{ cursor: 'grabbing' }} aria-hidden>
        <GripVertical size={16} />
      </Box>

      {/* آیکن */}
      <Box as="span" fontSize="lg" lineHeight="1" flexShrink={0}>
        {icon}
      </Box>

      {/* نام */}
      <Text fontSize="sm" fontWeight="semibold" color="fg" flexShrink={0}>
        {name}
      </Text>

      <Box flex="1" minW="0" />

      {/* actions — placeholder ثابت تا layout shift نشه */}
      <Flex gap="1" flexShrink={0} opacity={showActions ? 1 : 0} pointerEvents={showActions ? 'auto' : 'none'}>
        {onEdit && (
          <IconButton size="sm" variant="ghost" colorPalette="teal" aria-label="ویرایش زیردسته" onClick={onEdit}>
            <Pencil size={16} />
          </IconButton>
        )}
        {onRemove && (
          <IconButton size="sm" variant="ghost" colorPalette="red" aria-label="حذف زیردسته" onClick={onRemove}>
            <Trash2 size={16} />
          </IconButton>
        )}
      </Flex>
    </Flex>
  )
}
