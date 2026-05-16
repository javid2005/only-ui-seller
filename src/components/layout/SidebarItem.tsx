import { useState } from 'react'
import { Box, Flex, Text, Tooltip as ChakraTooltip, Collapsible } from '@chakra-ui/react'
import { ChevronDown } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { NavLink, Link } from 'react-router-dom'
import type { SubNavItem } from '@/types/nav'

interface SidebarItemProps {
  label: string
  icon: LucideIcon
  path: string
  subItems?: SubNavItem[]
  collapsed?: boolean
  disabled?: boolean
}

// Tree connector line — RTL: inline-start = RIGHT side
// Uses border approach to achieve 4px radius at the corner
function SubLine({ isLast }: { isLast: boolean }) {
  return (
    <Box w="5" h="9" flexShrink={0} position="relative">
      {/* L-curve: right border (vertical) + bottom border (horizontal)
          borderEndStartRadius = bottom-right corner in RTL → 4px curve */}
      <Box
        position="absolute"
        insetInlineStart="0"
        top="0"
        w="full"
        h="50%"
        borderInlineStartWidth="1px"
        borderBottomWidth="1px"
        borderColor="border.emphasized"
        borderEndStartRadius="md"
      />
      {/* Vertical extension below L-curve (non-last items only) */}
      {!isLast && (
        <Box
          position="absolute"
          insetInlineStart="0"
          top="50%"
          bottom="0"
          w="1px"
          bg="border.emphasized"
        />
      )}
    </Box>
  )
}

function SubItemRow({ item }: { item: SubNavItem }) {
  return (
    <Link to={item.path} style={{ display: 'block', width: '100%' }}>
      <Flex
        align="center"
        px="2"
        h="9"
        borderRadius="sm"
        _hover={{ bg: 'bg.muted' }}
        cursor="pointer"
        w="full"
      >
        <Text
          fontSize="sm"
          lineHeight="5"
          color="fg"
          textAlign="right"
          w="full"
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {item.label}
        </Text>
      </Flex>
    </Link>
  )
}

export function SidebarItem({
  label,
  icon: Icon,
  path,
  subItems = [],
  collapsed = false,
  disabled = false,
}: SidebarItemProps) {
  const [open, setOpen] = useState(false)
  const hasSubItems = subItems.length > 0

  const itemRow = (isActive: boolean) => (
    /* RTL flex: first child = rightmost */
    <Flex
      as="span"
      display="flex"
      align="center"
      gap="3"
      px="2"
      h="36px"
      borderRadius="sm"
      bg={isActive && !hasSubItems ? 'brand.subtle' : open ? 'bg.muted' : 'transparent'}
      _hover={{ bg: isActive && !hasSubItems ? 'brand.muted' : 'bg.muted' }}
      cursor="pointer"
      w="full"
      transition="background 0.15s"
      justify={collapsed ? 'center' : undefined}
    >
      {/* 1. Icon → FIRST = rightmost in RTL ✓ */}
      <Box
        color={disabled ? 'fg.subtle' : 'brand.solid'}
        flexShrink={0}
        display="flex"
        alignItems="center"
      >
        <Icon size={16} />
      </Box>

      {/* 2. Label → fills middle */}
      {!collapsed && (
        <Text
          fontSize="sm"
          flex="1"
          textAlign="right"
          lineHeight="5"
          color={isActive && !hasSubItems ? 'brand.fg' : 'fg'}
          whiteSpace="nowrap"
          overflow="hidden"
          textOverflow="ellipsis"
        >
          {label}
        </Text>
      )}

      {/* 3. Expand icon → LAST = leftmost in RTL ✓ */}
      {!collapsed && hasSubItems && (
        <Box
          color="gray.400"
          flexShrink={0}
          display="flex"
          alignItems="center"
        >
          <ChevronDown
            size={12}
            style={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          />
        </Box>
      )}
    </Flex>
  )

  const inner = (
    <Box w="full">
      {/* Main row */}
      {hasSubItems ? (
        <Box
          as="button"
          w="full"
          display="block"
          onClick={() => setOpen((o) => !o)}
          _focus={{ outline: 'none' }}
        >
          {itemRow(false)}
        </Box>
      ) : (
        <NavLink to={path} style={{ display: 'block', width: '100%' }}>
          {({ isActive }) => itemRow(isActive)}
        </NavLink>
      )}

      {/* Sub-items panel — animated with Collapsible */}
      <Collapsible.Root open={open}>
        <Collapsible.Content>
          {/* RTL flex: first = rightmost
              ps="4" (16px in RTL = right padding) aligns SubLine bar
              under parent icon center: px(8) + half-icon(8) = 16px ✓ */}
          <Flex align="flex-start" w="full" mt="1" ps="4">
            {/* SubLines: FIRST → inline-start (RIGHT in RTL) ✓ tree connector */}
            <Flex direction="column" flexShrink={0}>
              {subItems.map((sub, i) => (
                <SubLine key={sub.path} isLast={i === subItems.length - 1} />
              ))}
            </Flex>

            {/* SubMenu items: LAST → fills remaining space (LEFT in RTL) ✓ */}
            <Flex direction="column" flex="1" minW="0">
              {subItems.map((sub) => (
                <SubItemRow key={sub.path} item={sub} />
              ))}
            </Flex>
          </Flex>
        </Collapsible.Content>
      </Collapsible.Root>
    </Box>
  )

  if (collapsed) {
    return (
      <ChakraTooltip.Root positioning={{ placement: 'left' }}>
        <ChakraTooltip.Trigger asChild>
          <Box w="full">{inner}</Box>
        </ChakraTooltip.Trigger>
        <ChakraTooltip.Content>{label}</ChakraTooltip.Content>
      </ChakraTooltip.Root>
    )
  }

  return inner
}
