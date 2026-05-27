import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Box, Flex, Grid, Text, Button, Badge } from '@chakra-ui/react'
import { RotateCcw } from 'lucide-react'
import { Header }    from '@/components/layout/Header'
import { TitleBar }  from '@/components/ui/TitleBar'
import { ThemeCard } from '@/components/settings/themes/ThemeCard'

// ─── SVG Thumbnail Generator ──────────────────────────────────────────────────
// Generates an inline SVG that looks like a mini website mockup.
// Deterministic — no external dependency required.

function makeThemeSvg(header: string, hero: string, accent: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 174">
    <rect width="310" height="174" fill="#f5f5f5"/>
    <rect width="310" height="30" fill="${header}"/>
    <rect x="10" y="10" width="44" height="10" rx="2" fill="rgba(255,255,255,.55)"/>
    <rect x="60" y="10" width="22" height="10" rx="2" fill="rgba(255,255,255,.3)"/>
    <rect x="88" y="10" width="22" height="10" rx="2" fill="rgba(255,255,255,.3)"/>
    <rect x="248" y="10" width="52" height="10" rx="2" fill="rgba(255,255,255,.65)"/>
    <rect y="30" width="310" height="70" fill="${hero}"/>
    <rect x="16" y="48" width="110" height="12" rx="2" fill="rgba(255,255,255,.85)"/>
    <rect x="16" y="66" width="72" height="9" rx="2" fill="rgba(255,255,255,.5)"/>
    <rect x="16" y="82" width="52" height="16" rx="3" fill="${accent}"/>
    <rect x="188" y="38" width="106" height="54" rx="6" fill="rgba(255,255,255,.18)"/>
    <rect y="100" width="310" height="74" fill="#ffffff"/>
    <rect x="8" y="110" width="90" height="56" rx="4" fill="#f0f0f0"/>
    <rect x="110" y="110" width="90" height="56" rx="4" fill="#f0f0f0"/>
    <rect x="212" y="110" width="90" height="56" rx="4" fill="#f0f0f0"/>
    <rect x="14" y="118" width="62" height="6" rx="2" fill="${accent}" opacity=".7"/>
    <rect x="14" y="130" width="52" height="4" rx="2" fill="#ccc"/>
    <rect x="14" y="140" width="72" height="4" rx="2" fill="#e0e0e0"/>
    <rect x="116" y="118" width="62" height="6" rx="2" fill="${accent}" opacity=".7"/>
    <rect x="116" y="130" width="52" height="4" rx="2" fill="#ccc"/>
    <rect x="116" y="140" width="72" height="4" rx="2" fill="#e0e0e0"/>
    <rect x="218" y="118" width="62" height="6" rx="2" fill="${accent}" opacity=".7"/>
    <rect x="218" y="130" width="52" height="4" rx="2" fill="#ccc"/>
    <rect x="218" y="140" width="72" height="4" rx="2" fill="#e0e0e0"/>
  </svg>`
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

// ─── Mock Data ─────────────────────────────────────────────────────────────────

interface Theme {
  id: string
  name: string
  thumbnail: string
  comingSoon?: boolean
}

const DEFAULT_THEME_ID = 'theme-default'

// Normal themes first — coming soon LAST (RTL grid: last = bottom-left positions)
const THEMES: Theme[] = [
  {
    id: 'theme-default',
    name: 'قالب فروشگاهی مدرن',
    thumbnail: makeThemeSvg('#0D9488', '#0F766E', '#2DD4BF'),
  },
  {
    id: 'theme-2',
    name: 'قالب فروشگاه آنلاین',
    thumbnail: makeThemeSvg('#1D4ED8', '#1E40AF', '#60A5FA'),
  },
  {
    id: 'theme-3',
    name: 'قالب وب‌سایت خرید و فروش',
    thumbnail: makeThemeSvg('#6D28D9', '#5B21B6', '#A78BFA'),
  },
  {
    id: 'theme-4',
    name: 'قالب فروشگاه اینترنتی جذاب',
    thumbnail: makeThemeSvg('#B91C1C', '#991B1B', '#FCA5A5'),
  },
  {
    id: 'theme-5',
    name: 'قالب وب‌سایت تجارت الکترونیک',
    thumbnail: makeThemeSvg('#B45309', '#92400E', '#FCD34D'),
  },
  {
    id: 'theme-6',
    name: 'قالب فروشگاه آنلاین کاربرپسند',
    thumbnail: makeThemeSvg('#047857', '#065F46', '#6EE7B7'),
  },
  {
    id: 'theme-7',
    name: 'قالب فروشگاه اینترنتی حرفه‌ای',
    thumbnail: makeThemeSvg('#0E7490', '#155E75', '#67E8F9'),
  },
  // ── Coming Soon — always last (RTL: bottom-left in grid) ──
  {
    id: 'theme-8',
    name: 'قالب وب‌سایت خرید و فروش آسان',
    thumbnail: makeThemeSvg('#334155', '#1E293B', '#94A3B8'),
    comingSoon: true,
  },
  {
    id: 'theme-9',
    name: 'قالب فروشگاه آنلاین با طراحی زیبا',
    thumbnail: makeThemeSvg('#9F1239', '#881337', '#FB7185'),
    comingSoon: true,
  },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ThemeSettings() {
  const navigate  = useNavigate()
  const isCompact = useCompactMode()

  const [selectedId, setSelectedId] = useState<string>(DEFAULT_THEME_ID)

  const selectedTheme    = THEMES.find(t => t.id === selectedId) ?? THEMES[0]
  const isDefaultSelected = selectedId === DEFAULT_THEME_ID

  return (
    <Flex direction="column" gap="4" w="full">

      <Header
        title="پوسته‌ها"
        breadcrumbs={[
          { label: 'داشبورد',          href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'پوسته‌ها' },
        ]}
      />

      {/* Panel — One Column Center */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
        overflow="clip"
      >
        {/* Inner container max 960px, sections gap = 64px */}
        <Flex direction="column" gap={{ base: '10', sm: '16' }} maxW="960px" w="full" mx="auto">

          {/* ── Section 1: انتخاب شده ─────────────────────────────────────── */}
          <Flex direction="column" gap="6">
            <TitleBar
              title="انتخاب شده"
              subtitle="پوسته مورد نظر خود را جهت اعمال روی فروشگاه انتخاب نمایید."
              size="xl"
              divider
            />

            {/* Current theme — responsive: column on base/sm, row on md+ */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align={{ base: 'stretch', md: 'center' }}
              gap={{ base: '4', md: '2' }}
              p="4"
              bg="bg.subtle"
              borderWidth="1px"
              borderColor="border"
              rounded="lg"
              overflow="hidden"
            >
              {/* Thumbnail — FIRST in DOM = rightmost in RTL row / topmost in column ✓ */}
              <Box
                w={{ base: 'full', md: '171px' }}
                h={{ base: 'auto', md: '24' }}
                aspectRatio={{ base: '310 / 174', md: 'auto' }}
                bg="bg.emphasized"
                rounded={{ base: 'md', md: 'sm' }}
                overflow="hidden"
                flexShrink={0}
                position="relative"
              >
                <img
                  src={selectedTheme.thumbnail}
                  alt={selectedTheme.name}
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                />
              </Box>

              {/* Content — SECOND */}
              <Flex
                flex="1"
                direction={{ base: 'column', md: 'row' }}
                align={{ base: 'stretch', md: 'center' }}
                justify={{ base: 'flex-start', md: 'space-between' }}
                px={{ base: '0', md: '4' }}
                gap="4"
                minW="0"
              >
                {/* Theme info — FIRST in inner Flex = rightmost in RTL row ✓
                    align="flex-start" on column Flex = physical RIGHT in RTL */}
                <Flex direction="column" gap="2" flex="1" minW="0" align="flex-start">
                  <Text fontSize="md" fontWeight="semibold" color="fg">
                    {selectedTheme.name}
                  </Text>
                  {isDefaultSelected ? (
                    <Badge
                      bg="gray.solid"
                      color="gray.contrast"
                      rounded="sm"
                      px="2"
                      fontSize="sm"
                      fontWeight="normal"
                      lineHeight="1.5"
                    >
                      قالب پیش‌فرض
                    </Badge>
                  ) : (
                    <Badge
                      colorPalette="purple"
                      variant="subtle"
                      rounded="sm"
                      px="2"
                      fontSize="sm"
                      fontWeight="normal"
                    >
                      انتخاب شده
                    </Badge>
                  )}
                </Flex>

                {/* CTAs — LAST in inner Flex = leftmost in RTL row ✓ */}
                <Flex
                  gap="2"
                  flexShrink={0}
                  align="center"
                  direction={{ base: 'column', md: 'row' }}
                  w={{ base: 'full', md: 'auto' }}
                >
                  {/* Reset — FIRST = rightmost in RTL row (only when non-default) */}
                  {!isDefaultSelected && (
                    <Button
                      colorPalette="gray"
                      variant="ghost"
                      size="md"
                      w={{ base: 'full', md: 'auto' }}
                      onClick={() => setSelectedId(DEFAULT_THEME_ID)}
                    >
                      {/* RTL DOM: icon FIRST = rightmost ✓ */}
                      <RotateCcw size={16} />
                      پوسته پیش‌فرض
                    </Button>
                  )}

                  {/* Customize — LAST = leftmost (always visible) */}
                  <Button
                    colorPalette="teal"
                    variant="solid"
                    size="md"
                    w={{ base: 'full', md: 'auto' }}
                    onClick={() => navigate('/settings/themes/customize', {
                      state: { thumbnail: selectedTheme.thumbnail, name: selectedTheme.name },
                    })}
                  >
                    شخصی‌سازی پوسته
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>

          {/* ── Section 2: گالری پوسته‌ها ────────────────────────────────── */}
          <Flex direction="column" gap="6">
            <TitleBar
              title="گالری پوسته‌ها"
              subtitle="پوسته مورد نظر خود را جهت اعمال روی فروشگاه انتخاب نمایید."
              size="xl"
              divider
            />

            <Grid
              templateColumns={
                isCompact
                  ? '1fr'
                  : { base: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }
              }
              gap="4"
              w="full"
            >
              {THEMES.map((theme, index) => (
                <ThemeCard
                  key={theme.id}
                  {...theme}
                  isDefault={index === 0}              // first = always default
                  isSelected={selectedId === theme.id}
                  onSelect={theme.comingSoon ? undefined : () => setSelectedId(theme.id)}
                />
              ))}
            </Grid>
          </Flex>

        </Flex>
      </Box>

    </Flex>
  )
}
