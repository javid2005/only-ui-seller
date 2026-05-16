import { Box, Flex, IconButton } from '@chakra-ui/react'
import { Bell, Minimize, Maximize, Menu } from 'lucide-react'
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
      {/* RTL: first child = RIGHT, last child = LEFT */}
      <Flex
        align="center"
        justify="space-between"
        maxW={isCompact ? '512px' : '1920px'}
        mx="auto"
        px="4"
        h="16"
        transition="max-width 0.2s ease"
      >

        {/* Logo group: FIRST → rightmost in RTL
            Hamburger FIRST in group → rightmost (right of logo)
            Logo SECOND in group → just left of hamburger */}
        <Flex align="center" gap="3">
          {/* Hamburger: FIRST → right of logo in RTL ✓ */}
          <Box display={isCompact ? 'flex' : { base: 'flex', md: 'none' }}>
            <IconButton
              aria-label="منو"
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
            >
              <Menu size={18} />
            </IconButton>
          </Box>
          {/* Logo: SECOND → just left of hamburger in RTL ✓ */}
          <a href="/" style={{ textDecoration: 'none' }}>
            <Box as="img" src={logoSrc} alt="ویترینا" h="8" />
          </a>
        </Flex>

        {/* Controls: LAST → leftmost in RTL ✓
            DOM order (first=rightmost): Min/Max | Bell | Avatar */}
        <Flex align="center" gap="6">

          {/* Min/Max: FIRST → rightmost in controls ✓ */}
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
