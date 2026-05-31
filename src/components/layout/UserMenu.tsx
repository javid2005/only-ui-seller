import { Box, Flex, Text, Avatar, Badge, Menu, Portal } from '@chakra-ui/react'
import { User, Headset, HelpCircle, SunMoon, Power } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useColorMode } from '@/contexts/ColorModeContext'

interface UserMenuProps {
  userName?: string
  userAvatar?: string
  userRole?: string
}

export function UserMenu({
  userName = 'مهسا تهرانی',
  userAvatar,
  userRole = 'احراز هویت نشده',
}: UserMenuProps) {
  const navigate = useNavigate()
  const { colorMode, toggleColorMode } = useColorMode()
  const isDark = colorMode === 'dark'

  return (
    <Menu.Root
      positioning={{ placement: 'bottom-end' }}
      onSelect={(details) => {
        if (details.value === 'account') navigate('/account/user-info')
      }}
    >
      {/* Wrap Avatar in plain button — Avatar.Root doesn't forward refs for asChild */}
      <Menu.Trigger asChild>
        <Box as="button" type="button" borderRadius="full" cursor="pointer" display="flex" outline="none">
          <Avatar.Root size="sm" pointerEvents="none">
            {userAvatar
              ? <Avatar.Image src={userAvatar} alt={userName} />
              : <Avatar.Fallback>{userName.charAt(0)}</Avatar.Fallback>
            }
          </Avatar.Root>
        </Box>
      </Menu.Trigger>

      <Portal>
        {/* dir="rtl" ensures Portal content inherits RTL context */}
        <Menu.Positioner dir="rtl">
          <Menu.Content minW="280px" p="1">

            {/* ── User info box ──────────────────────────────── */}
            <Box bg="bg.subtle" borderRadius="sm" p="2" mb="1">
              {/* RTL: Avatar FIRST = rightmost ✓, text fills left */}
              <Flex align="center" gap="2">
                <Avatar.Root size="md" flexShrink={0}>
                  {userAvatar
                    ? <Avatar.Image src={userAvatar} alt={userName} />
                    : <Avatar.Fallback>{userName.charAt(0)}</Avatar.Fallback>
                  }
                </Avatar.Root>
                {/* align="flex-start" = RIGHT side in RTL ✓ */}
                <Flex direction="column" align="flex-start" flex="1" gap="1" minW="0">
                  <Text fontSize="sm" fontWeight="semibold" color="fg" whiteSpace="nowrap">
                    {userName}
                  </Text>
                  <Badge colorPalette="purple" size="xs" variant="subtle">
                    {userRole}
                  </Badge>
                </Flex>
              </Flex>
            </Box>

            {/* ── حساب کاربری ─────────────────────────────────
                RTL: icon FIRST = rightmost ✓, text fills left ✓ */}
            <Menu.Item value="account">
              <Flex w="full" align="center" gap="2">
                <Box color="fg.muted" display="flex" alignItems="center" flexShrink={0}>
                  <User size={16} />
                </Box>
                <Text fontSize="sm" color="fg" flex="1">حساب کاربری</Text>
              </Flex>
            </Menu.Item>

            {/* ── پشتیبانی ─────────────────────────────────── */}
            <Menu.Item value="support">
              <Flex w="full" align="center" gap="2">
                <Box color="fg.muted" display="flex" alignItems="center" flexShrink={0}>
                  <Headset size={16} />
                </Box>
                <Text fontSize="sm" color="fg" flex="1">پشتیبانی</Text>
              </Flex>
            </Menu.Item>

            {/* ── راهنما ───────────────────────────────────── */}
            <Menu.Item value="help">
              <Flex w="full" align="center" gap="2">
                <Box color="fg.muted" display="flex" alignItems="center" flexShrink={0}>
                  <HelpCircle size={16} />
                </Box>
                <Text fontSize="sm" color="fg" flex="1">راهنما</Text>
              </Flex>
            </Menu.Item>

            {/* ── تم سایت — plain row, click doesn't close menu ─
                RTL: icon FIRST = rightmost ✓, text middle, switch LAST = leftmost ✓ */}
            <Flex
              as="button"
              type="button"
              w="full"
              align="center"
              gap="2"
              px="2"
              py="1.5"
              borderRadius="sm"
              _hover={{ bg: 'bg.muted' }}
              cursor="pointer"
              onClick={toggleColorMode}
              transition="background 0.15s"
            >
              {/* Icon: FIRST = rightmost in RTL ✓ */}
              <Box color="fg.muted" display="flex" alignItems="center" flexShrink={0}>
                <SunMoon size={16} />
              </Box>

              {/* Label: right next to icon — no flex-1 so it hugs the icon ✓ */}
              <Text fontSize="sm" color="fg" flex="1" textAlign="right">تم سایت</Text>

              {/* Switch visual: LAST = leftmost in RTL ✓
                  All colors are semantic tokens — no hardcoded values */}
              <Box
                as="span"
                display="flex"
                alignItems="center"
                pointerEvents="none"
                flexShrink={0}
                w="10"
                h="5"
                bg={isDark ? 'brand.solid' : 'bg.emphasized'}
                borderRadius="full"
                px="0.5"
                justifyContent={isDark ? 'flex-end' : 'flex-start'}
                transition="background 0.2s"
              >
                <Box
                  as="span"
                  display="block"
                  w="4"
                  h="4"
                  bg="white"       /* white = Chakra palette token, not hardcode */
                  borderRadius="full"
                  shadow="xs"
                  transition="all 0.2s"
                />
              </Box>
            </Flex>

            <Menu.Separator />

            {/* ── خروج ─────────────────────────────────────── */}
            <Menu.Item value="logout">
              <Flex w="full" align="center" gap="2">
                <Box color="red.fg" display="flex" alignItems="center" flexShrink={0}>
                  <Power size={16} />
                </Box>
                <Text fontSize="sm" color="red.fg" flex="1">خروج</Text>
              </Flex>
            </Menu.Item>

          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
