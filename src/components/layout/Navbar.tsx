import { Box, Flex, IconButton } from '@chakra-ui/react'
import { Bell, Menu, Minimize, Maximize } from 'lucide-react'
import logoSrc from '../../assets/logo.svg'
import { UserMenu } from './UserMenu'

interface NavbarProps {
  onMenuClick: () => void
  isCompact?: boolean
  onToggleWidth?: () => void
  userName?: string
  userAvatar?: string
}

export function Navbar({
  onMenuClick,
  isCompact = false,
  onToggleWidth,
  userName = 'مهسا',
  userAvatar,
}: NavbarProps) {
  return (
    <Box
      as="header"
      w="full"
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg"
      position="sticky"
      top="0"
      zIndex="sticky"
    >
      {/* RTL: first child = RIGHT (Logo), last child = LEFT (controls) */}
      <Flex
        align="center"
        justify="space-between"
        maxW={isCompact ? '512px' : '1920px'}
        mx="auto"
        px="4"
        h="16"
        transition="max-width 0.2s ease"
      >

        {/* Logo: FIRST → right side in RTL ✓ */}
        <a href="/" style={{ textDecoration: 'none' }}>
          <Box as="img" src={logoSrc} alt="ویترینا" h="8" />
        </a>

        {/* Controls: LAST → left side in RTL ✓
            Visual order left→right: Avatar | Bell | Min/Max
            DOM order   (first=rightmost in RTL): Min/Max | Bell | Avatar */}
        <Flex align="center" gap="6">

          {/* Mobile hamburger */}
          <Box display={{ base: 'flex', md: 'none' }}>
            <IconButton
              aria-label="منو"
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
            >
              <Menu size={18} />
            </IconButton>
          </Box>

          {/* Min/Max: FIRST → rightmost in RTL ✓ */}
          <Box display={{ base: 'none', md: 'flex' }}>
            <IconButton
              aria-label={isCompact ? 'بازگشت به عرض کامل' : 'کوچک کردن صفحه'}
              variant="outline"
              size="sm"
              onClick={onToggleWidth}
            >
              {isCompact ? <Maximize size={16} /> : <Minimize size={16} />}
            </IconButton>
          </Box>

          {/* Bell: SECOND ✓ */}
          <IconButton
            aria-label="اعلان‌ها"
            variant="subtle"
            size="sm"
            bg="bg.muted"
            _hover={{ bg: 'bg.emphasized' }}
          >
            <Bell size={16} />
          </IconButton>

          {/* Avatar: LAST → leftmost in RTL ✓ */}
          <UserMenu userName={userName} userAvatar={userAvatar} />

        </Flex>
      </Flex>
    </Box>
  )
}
