import { useState } from 'react'
import { Box, Flex, Drawer, Portal, CloseButton } from '@chakra-ui/react'
import { Outlet } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'

export function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)

  return (
    /* Outer: full-width, full-height */
    <Flex direction="column" h="100dvh" overflow="hidden">

      {/* Navbar: full-width — inner content capped at 1920px */}
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        isCompact={isCompact}
        onToggleWidth={() => setIsCompact((c) => !c)}
      />

      {/* Body: capped at 1920px or 1440px based on isCompact, centered */}
      <Flex
        flex="1"
        overflow="hidden"
        maxW={isCompact ? '1440px' : '1920px'}
        w="full"
        mx="auto"
        transition="max-width 0.2s ease"
      >

        {/* Sidebar: FIRST → rightmost in RTL ✓ — never collapses */}
        <Box display={{ base: 'none', md: 'block' }} h="full" overflowY="auto">
          <Sidebar />
        </Box>

        {/* Main content: SECOND → left in RTL ✓ */}
        <Box flex="1" overflowY="auto" p="4" minW="0">
          <Outlet />
        </Box>

      </Flex>

      {/* Mobile sidebar — Drawer from right (RTL start = right) */}
      <Drawer.Root
        open={mobileOpen}
        onOpenChange={(e) => setMobileOpen(e.open)}
        placement="start"
      >
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content maxW="280px" w="full">
              <Drawer.Header
                borderBottomWidth="1px"
                borderColor="border"
                display="flex"
                justifyContent="flex-start"
              >
                <CloseButton
                  size="sm"
                  onClick={() => setMobileOpen(false)}
                  aria-label="بستن منو"
                />
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
