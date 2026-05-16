import { useState } from 'react'
import { Box, Flex, Drawer, Portal, CloseButton, IconButton } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import logoSrc from '../../assets/logo.svg'

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  return (
    /* Outer: full-width, full-height */
    <Flex direction="column" h="100dvh" overflow="hidden">

      {/* Navbar: full-width — inner content capped */}
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        isCompact={isCompact}
        onToggleWidth={() => setIsCompact((c) => !c)}
      />

      {/* Body: capped at 1920px or 512px, centered */}
      <Flex
        flex="1"
        overflow="hidden"
        maxW={isCompact ? '512px' : '1920px'}
        w="full"
        mx="auto"
        transition="max-width 0.2s ease"
      >

        {/* Sidebar: FIRST → rightmost in RTL ✓ — hidden in compact/mobile */}
        <Box display={isCompact ? 'none' : { base: 'none', md: 'block' }} h="full" overflowY="auto">
          <Sidebar />
        </Box>

        {/* Main content: SECOND → left in RTL ✓ */}
        <Box flex="1" overflowY="auto" p="4" minW="0">
          <Outlet />
        </Box>

      </Flex>

      {/* Mobile/compact sidebar — Drawer from right (RTL start = right) */}
      <Drawer.Root
        open={mobileOpen}
        onOpenChange={(e) => setMobileOpen(e.open)}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner dir="rtl">
            {/* Same width as desktop sidebar */}
            <Drawer.Content w="full" maxW="256px">

              {/* Header: Logo (RIGHT) + Close button (LEFT) */}
              <Drawer.Header
                borderBottomWidth="1px"
                borderColor="border"
                px="4"
                h="16"
                display="flex"
                alignItems="center"
              >
                {/* RTL: Logo FIRST → rightmost, Close LAST → leftmost */}
                <Flex align="center" justify="space-between" w="full">
                  <a href="/" style={{ textDecoration: 'none' }}>
                    <Box as="img" src={logoSrc} alt="ویترینا" h="8" />
                  </a>
                  <CloseButton
                    size="sm"
                    onClick={() => setMobileOpen(false)}
                    aria-label="بستن منو"
                  />
                </Flex>
              </Drawer.Header>

              <Drawer.Body p="0" overflowY="auto">
                <Sidebar />
              </Drawer.Body>

            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>

    </Flex>
  )
}
