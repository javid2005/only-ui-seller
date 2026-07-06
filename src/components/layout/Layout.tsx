'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { Box, Flex, Drawer, Portal, CloseButton } from '@chakra-ui/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
import { CompactModeProvider } from '@/contexts/CompactModeContext'
import logoSrc from '../../assets/logo.svg'

export function Layout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCompact, setIsCompact] = useState(false)
  const pathname = usePathname()

  // در حالت موبایل/همبرگری: با تغییر مسیر (کلیک روی آیتم منو) drawer بسته شود
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  return (
    /* Outer: full-width, natural height — window scrolls (RTL scrollbar at browser left edge) */
    <CompactModeProvider value={isCompact}>
    <Flex direction="column" minH="100dvh">

      {/* Navbar: full-width — inner content capped */}
      <Navbar
        onMenuClick={() => setMobileOpen(true)}
        isCompact={isCompact}
        onToggleWidth={() => setIsCompact((c) => !c)}
      />

      {/* Body: capped at 1920px or 512px, centered */}
      <Flex
        flex="1"
        maxW={isCompact ? '512px' : '1920px'}
        w="full"
        mx="auto"
        transition="max-width 0.2s ease"
        alignItems="flex-start"
      >

        {/* Sidebar: FIRST → rightmost in RTL ✓ — hidden in compact/mobile */}
        {/* sticky so it stays visible while main content scrolls */}
        <Box
          display={isCompact ? 'none' : { base: 'none', md: 'block' }}
          position="sticky"
          top="16"
          h="calc(100dvh - 64px)"
          overflowY="auto"
          flexShrink={0}
        >
          <Sidebar />
        </Box>

        {/* Main content: SECOND → left in RTL ✓ — window handles scroll */}
        <Box flex="1" p="4" minW="0">
          {children}
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
                  <Link href="/" style={{ textDecoration: 'none' }}>
                    <img src={logoSrc.src} alt="ویترینا" style={{ height: '32px' }} />
                  </Link>
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
    </CompactModeProvider>
  )
}
