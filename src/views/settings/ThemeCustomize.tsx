import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Box, Flex, Grid, Text, Badge, Tabs, chakra,
  Icon, Field, FileUpload, Input, IconButton,
  ColorPicker, parseColor, Portal,
} from '@chakra-ui/react'
import {
  Plus, Trash2, Upload, Check,
  Image as ImageIcon, PanelTop, Palette, Type, LayoutDashboard,
} from 'lucide-react'
import { Header }       from '@/components/layout/Header'
import { TitleBar }     from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { SliderItem }   from '@/components/settings/themes/SliderItem'
import { BannerCard }   from '@/components/settings/themes/BannerCard'

// ─── Utils ────────────────────────────────────────────────────────────────────

/** Convert Arabic/Latin digits to Persian equivalents */
const toPersian = (n: number): string =>
  String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[Number(d)])

/** Label derived from 1-based position — always sequential regardless of reorder */
const slideLabel = (index: number) => `اسلاید ${toPersian(index + 1)}`

// ─── Types ────────────────────────────────────────────────────────────────────

interface Slide {
  id: string
  link: string
}

interface Banner {
  id: string
  title: string
  subtitle: string
  link: string
  imagePreview: string | null
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS = [
  { id: 'slider',     label: 'اسلایدر',   Icon: ImageIcon,       disabled: false },
  { id: 'banners',    label: 'بنرها',     Icon: PanelTop,        disabled: false },
  { id: 'colors',     label: 'رنگ',       Icon: Palette,         disabled: false },
  { id: 'typography', label: 'تایپوگرافی', Icon: Type,            disabled: true  },
  { id: 'layout',     label: 'چیدمان',    Icon: LayoutDashboard, disabled: true  },
]

// ─── Color palette (preset colors) ───────────────────────────────────────────
// Row-major order: 5 rows (lightest→darkest) × 10 columns (right-to-left in RTL)
// Col order (RTL): gray | orange | yellow | green | teal | blue | cyan | purple | pink | red
const PALETTE_ROWS: string[][] = [
  ['#a1a1aa','#fb923c','#facc15','#4ade80','#2dd4bf','#60a5fa','#22d3ee','#c084fc','#f472b6','#f87171'],
  ['#71717a','#f97316','#eab308','#22c55e','#14b8a6','#3b82f6','#06b6d4','#a855f7','#ec4899','#ef4444'],
  ['#52525b','#ea580c','#ca8a04','#16a34a','#0d9488','#2563eb','#0891b2','#9333ea','#db2777','#dc2626'],
  ['#3f3f46','#92310a','#845209','#116932','#0c5d56','#173da6','#0c5c72','#641ba3','#a41752','#991919'],
  ['#27272a','#6c2710','#713f12','#124a28','#114240','#1a3478','#134152','#4a1772','#6d0e34','#511111'],
]

const DEFAULT_BRAND_COLOR = '#0d9488' // teal.600 — Vitrina brand

// ─── Mock data ────────────────────────────────────────────────────────────────

const DEFAULT_SLIDES: Slide[] = [
  { id: '1', link: '' },
  { id: '2', link: '' },
  { id: '3', link: '' },
]

const DEFAULT_BANNERS: Banner[] = [
  { id: 'b1', title: 'بنر ۱', subtitle: 'بالای صفحه اصلی',       link: '', imagePreview: null },
  { id: 'b2', title: 'بنر ۲', subtitle: 'وسط صفحه اصلی',         link: '', imagePreview: null },
  { id: 'b3', title: 'بنر ۳', subtitle: 'داخل صفحات غیراصلی',     link: '', imagePreview: null },
]

// ─── Page ─────────────────────────────────────────────────────────────────────

export function ThemeCustomize() {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const isCompact    = useCompactMode()

  // Thumbnail + name passed from ThemeSettings via query params
  const themeName      = searchParams.get('name')      ?? 'قالب فروشگاهی مدرن'
  const themeThumbnail = searchParams.get('thumbnail') || null

  // ── State ─────────────────────────────────────────────────────────────────────
  const [slides,     setSlides]     = useState<Slide[]>(DEFAULT_SLIDES)
  const [selectedId, setSelectedId] = useState<string>(DEFAULT_SLIDES[0].id)
  const [activeTab,  setActiveTab]  = useState('slider')
  const [dragId,     setDragId]     = useState<string | null>(null)

  const selectedIndex = slides.findIndex(s => s.id === selectedId)
  const selectedSlide = slides[selectedIndex] ?? slides[0]

  // ── DnD ───────────────────────────────────────────────────────────────────────

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    if (!dragId || dragId === targetId) return
    const fromIdx = slides.findIndex(s => s.id === dragId)
    const toIdx   = slides.findIndex(s => s.id === targetId)
    if (fromIdx === -1 || toIdx === -1) return
    const next = [...slides]
    const [moved] = next.splice(fromIdx, 1)
    next.splice(toIdx, 0, moved)
    setSlides(next)
  }

  // ── Slide management ──────────────────────────────────────────────────────────

  const handleAdd = () => {
    const id = String(Date.now())
    setSlides(prev => [...prev, { id, link: '' }])
    setSelectedId(id)
  }

  const handleDelete = () => {
    if (slides.length <= 1) return
    const next = slides.filter(s => s.id !== selectedId)
    setSlides(next)
    setSelectedId(next[Math.max(0, selectedIndex - 1)].id)
  }

  const handleLinkChange = (value: string) =>
    setSlides(prev => prev.map(s => s.id === selectedId ? { ...s, link: value } : s))

  // ── Brand color (ColorPicker) ─────────────────────────────────────────────────

  const [pickerColor, setPickerColor] = useState(() => parseColor(DEFAULT_BRAND_COLOR))
  // Derived hex string — lowercase, matches PALETTE_ROWS values for preset selection
  const brandColor = pickerColor.toString('hex').toLowerCase()

  const handlePresetSelect = (hex: string) => setPickerColor(parseColor(hex))

  // ── Banner management ──────────────────────────────────────────────────────────

  const [banners, setBanners] = useState<Banner[]>(DEFAULT_BANNERS)

  const handleBannerLinkChange = (id: string, value: string) =>
    setBanners(prev => prev.map(b => b.id === id ? { ...b, link: value } : b))

  const handleBannerImageUpload = (id: string, dataUrl: string) =>
    setBanners(prev => prev.map(b => b.id === id ? { ...b, imagePreview: dataUrl } : b))

  const handleBannerImageRemove = (id: string) =>
    setBanners(prev => prev.map(b => b.id === id ? { ...b, imagePreview: null } : b))

  // ─── Start panel sub-components ───────────────────────────────────────────────

  // Selected theme mini-card
  const ThemeMiniCard = (
    <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4">
      <Flex direction="column" gap="4">
        {/* Thumbnail */}
        <Box
          w="full"
          aspectRatio="310/174"
          bg="bg.emphasized"
          rounded="md"
          overflow="hidden"
          position="relative"
        >
          {themeThumbnail && (
            <img
              src={themeThumbnail}
              alt={themeName}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
            />
          )}
        </Box>

        {/* Title + badge — align="flex-start" = physical RIGHT in RTL column flex */}
        <Flex direction="column" gap="2" align="flex-start">
          <Text fontSize="md" fontWeight="semibold" color="fg" textAlign="right">
            {themeName}
          </Text>
          <Badge
            bg="gray.solid"
            color="gray.contrast"
            rounded="sm"
            px="2"
            fontSize="sm"
            fontWeight="normal"
            lineHeight="1.5"
          >
            پیش‌فرض
          </Badge>
        </Flex>
      </Flex>
    </Box>
  )

  // Vertical tab list — Chakra Tabs subtle
  const VerticalTabList = (
    <Tabs.Root
      value={activeTab}
      onValueChange={(d) => setActiveTab(d.value)}
      variant="subtle"
      w="full"
    >
      <Tabs.List flexDirection="column" w="full" gap="0.5">
        {TABS.map(({ id, label, Icon: TabIcon, disabled }) => (
          <Tabs.Trigger
            key={id}
            value={id}
            disabled={disabled}
            w="full"
            justifyContent="flex-start"
            gap="2.5"
            px="4"
            h="10"
            rounded="sm"
            fontSize="sm"
            fontWeight="normal"
          >
            {/* Icon FIRST = rightmost in RTL ✓ */}
            <Box flexShrink={0} display="flex" alignItems="center">
              <TabIcon size={16} />
            </Box>
            {label}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )

  // ─── Render ───────────────────────────────────────────────────────────────────

  return (
    <Flex direction="column" gap="4" w="full">

      <Header
        title="شخصی سازی پوسته"
        breadcrumbs={[
          { label: 'داشبورد',          href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'پوسته‌ها',         href: '/settings/themes' },
          { label: 'شخصی سازی پوسته' },
        ]}
      />

      {/* Panel — Two Columns Right Center */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
      >
        <Flex gap="10" align="flex-start">

          {/* ── FIRST = rightmost: Start panel (vertical tabs) — xl+ non-compact ── */}
          {!isCompact && (
            <Box
              display={{ base: 'none', xl: 'block' }}
              w="224px"
              flexShrink={0}
              position="sticky"
              top="20"
              alignSelf="flex-start"
            >
              <Flex direction="column" gap="10">
                {ThemeMiniCard}
                {VerticalTabList}
              </Flex>
            </Box>
          )}

          {/* ── SECOND: Main content (Middle) ─────────────────────────────────── */}
          <Flex direction="column" gap="6" flex="1" minW="0" maxW="960px">

            {/* ── Mobile: theme card + horizontal tabs — hidden on xl+ (non-compact) ── */}
            <Box display={isCompact ? 'block' : { base: 'block', xl: 'none' }}>
              <Flex direction="column" gap="4">

                {/* Mobile theme card — horizontal row */}
                <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4" overflow="hidden">
                  <Flex align="center" gap="4">
                    {/* Thumbnail FIRST = rightmost in RTL ✓ */}
                    <Box
                      w="128px"
                      h="72px"
                      bg="bg.emphasized"
                      rounded="sm"
                      overflow="hidden"
                      flexShrink={0}
                      position="relative"
                    >
                      {themeThumbnail && (
                        <img
                          src={themeThumbnail}
                          alt={themeName}
                          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none' }}
                        />
                      )}
                    </Box>
                    {/* Content SECOND = leftmost in RTL ✓ */}
                    <Flex direction="column" gap="2" flex="1" minW="0" align="flex-start">
                      <Text fontSize="md" fontWeight="semibold" color="fg" textAlign="right">
                        {themeName}
                      </Text>
                      <Badge
                        bg="gray.solid"
                        color="gray.contrast"
                        rounded="sm"
                        px="2"
                        fontSize="sm"
                        fontWeight="normal"
                        lineHeight="1.5"
                      >
                        پیش‌فرض
                      </Badge>
                    </Flex>
                  </Flex>
                </Box>

                {/* Horizontal tab strip — Chakra Tabs subtle, scrollable */}
                <Tabs.Root
                  value={activeTab}
                  onValueChange={(d) => setActiveTab(d.value)}
                  variant="subtle"
                  w="full"
                >
                  <Tabs.List overflowX="auto" overflowY="clip">
                    {TABS.map(({ id, label, disabled }) => (
                      <Tabs.Trigger
                        key={id}
                        value={id}
                        disabled={disabled}
                        flexShrink={0}
                        whiteSpace="nowrap"
                        fontSize="sm"
                        fontWeight="normal"
                      >
                        {label}
                      </Tabs.Trigger>
                    ))}
                  </Tabs.List>
                </Tabs.Root>

              </Flex>
            </Box>

            {/* ═══════════════════════════════════════════════════════════════════
                TAB: slider
            ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'slider' && (<>

            <TitleBar
              title="اسلایدر"
              subtitle="تصاویر اسلایدر را انتخاب، ویرایش و مدیریت کنید"
              size="xl"
              divider
            />

            {/* ── Section: list + edit ─────────────────────────────────────────── */}
            <Flex
              gap="6"
              align="flex-start"
              direction={isCompact ? 'column' : { base: 'column', lg: 'row' }}
            >

              {/* FIRST = rightmost: Slides list panel */}
              <Box
                w={isCompact ? 'full' : { base: 'full', lg: '256px' }}
                flexShrink={0}
                borderWidth="1px"
                borderColor="border"
                rounded="lg"
                p="4"
              >
                <Flex direction="column" gap="4">
                  <TitleBar
                    title="اسلایدها"
                    size="md"
                    divider
                    cta={
                      <IconButton
                        variant="ghost"
                        aria-label="افزودن اسلاید"
                        size="sm"
                        onClick={handleAdd}
                      >
                        <Plus size={16} />
                      </IconButton>
                    }
                  />

                  {/* Horizontal chips — compact or < lg */}
                  <Box
                    display={isCompact ? 'block' : { base: 'block', lg: 'none' }}
                    overflowX="auto"
                    overflowY="clip"
                    mx="-1"
                  >
                    <Flex gap="1" px="1">
                      {slides.map((slide, index) => (
                        <SliderItem
                          key={slide.id}
                          label={slideLabel(index)}
                          selected={selectedId === slide.id}
                          onSelect={() => setSelectedId(slide.id)}
                          horizontal
                          draggable
                          onDragStart={() => setDragId(slide.id)}
                          onDragOver={e => handleDragOver(e, slide.id)}
                          onDrop={() => setDragId(null)}
                          onDragEnd={() => setDragId(null)}
                        />
                      ))}
                    </Flex>
                  </Box>

                  {/* Vertical draggable list — non-compact lg+ */}
                  <Flex
                    display={isCompact ? 'none' : { base: 'none', lg: 'flex' }}
                    direction="column"
                    gap="2"
                  >
                    {slides.map((slide, index) => (
                      <SliderItem
                        key={slide.id}
                        label={slideLabel(index)}
                        selected={selectedId === slide.id}
                        onSelect={() => setSelectedId(slide.id)}
                        draggable
                        onDragStart={() => setDragId(slide.id)}
                        onDragOver={e => handleDragOver(e, slide.id)}
                        onDrop={() => setDragId(null)}
                        onDragEnd={() => setDragId(null)}
                      />
                    ))}
                  </Flex>

                </Flex>
              </Box>

              {/* SECOND = leftmost: Edit panel */}
              <Box
                flex="1"
                minW="0"
                w={isCompact ? 'full' : { base: 'full', lg: 'auto' }}
                borderWidth="1px"
                borderColor="border"
                rounded="lg"
                p="4"
                overflow="hidden"
              >
                <Flex direction="column" gap="4">
                  <TitleBar
                    title={`ویرایش ${slideLabel(selectedIndex)}`}
                    size="md"
                    divider
                    cta={
                      <IconButton
                        variant="ghost"
                        aria-label="حذف اسلاید"
                        size="sm"
                        onClick={handleDelete}
                        disabled={slides.length <= 1}
                        color="red.fg"
                        _hover={{ bg: 'red.subtle' }}
                      >
                        <Trash2 size={16} />
                      </IconButton>
                    }
                  />

                  {/* ── Image upload ─────────────────────────────────────────── */}
                  <Field.Root>
                    <Field.Label fontWeight="semibold" fontSize="sm" color="fg">
                      تصویر
                    </Field.Label>
                    <FileUpload.Root
                      maxFiles={1}
                      accept="image/*"
                      maxFileSize={2 * 1024 * 1024}
                      w="full"
                    >
                      <FileUpload.HiddenInput />
                      <FileUpload.Dropzone minH="200px" w="full">
                        <Icon size="md" color="fg.muted">
                          <Upload />
                        </Icon>
                        <FileUpload.DropzoneContent>
                          <Box fontWeight="semibold" fontSize="sm" textAlign="center">
                            برای بارگذاری، اینجا بکشید و رها کنید یا کلیک کنید
                          </Box>
                          <Text color="fg.muted" fontSize="sm" textAlign="center">
                            حجم فایل: حداکثر ۲ مگابایت
                            <br />
                            فرمت تصویر مجاز: png, jpg, jpeg, webp, heic
                          </Text>
                        </FileUpload.DropzoneContent>
                      </FileUpload.Dropzone>
                    </FileUpload.Root>
                  </Field.Root>

                  {/* ── Link input ───────────────────────────────────────────── */}
                  <Field.Root>
                    <Field.Label fontWeight="semibold" fontSize="sm" color="fg">
                      لینک
                    </Field.Label>
                    <Input
                      placeholder="https://example.com"
                      textAlign="left"
                      dir="ltr"
                      value={selectedSlide.link}
                      onChange={e => handleLinkChange(e.target.value)}
                    />
                  </Field.Root>

                </Flex>
              </Box>

            </Flex>

            </>)}

            {/* ═══════════════════════════════════════════════════════════════════
                TAB: banners
            ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'banners' && (<>

            <TitleBar
              title="بنرها"
              subtitle="تصاویر بنرها را از این صفحه مدیریت نمایید."
              size="xl"
              divider
            />

            <Grid
              templateColumns={isCompact ? '1fr' : { base: '1fr', lg: 'repeat(2, 1fr)' }}
              gap="4"
              w="full"
            >
              {banners.map(banner => (
                <BannerCard
                  key={banner.id}
                  title={banner.title}
                  subtitle={banner.subtitle}
                  link={banner.link}
                  imagePreview={banner.imagePreview}
                  onLinkChange={v  => handleBannerLinkChange(banner.id, v)}
                  onImageUpload={url => handleBannerImageUpload(banner.id, url)}
                  onImageRemove={() => handleBannerImageRemove(banner.id)}
                />
              ))}
            </Grid>

            </>)}

            {/* ═══════════════════════════════════════════════════════════════════
                TAB: colors
            ═══════════════════════════════════════════════════════════════════ */}
            {activeTab === 'colors' && (<>

            {/* ── Section 1: Preset palette ─────────────────────────────────── */}
            <TitleBar
              title="رنگ های پیش‌فرض"
              subtitle="انتخاب رنگ اصلی برای پوسته ازبین رنگ های پیش فرض"
              size="xl"
              divider
            />

            {/* Scroll wrapper — on small screens grid scrolls horizontally at fixed minW */}
            <Box overflowX="auto" w="full">
            <Grid templateColumns="repeat(10, 1fr)" minW="640px" w="full">
              {PALETTE_ROWS.flatMap((row) =>
                row.map((hex) => {
                  const isSelected = brandColor === hex
                  return (
                    <chakra.button
                      key={hex}
                      type="button"
                      onClick={() => handlePresetSelect(hex)}
                      p="1"
                      rounded="xl"
                      bg={isSelected ? 'brand.subtle' : 'transparent'}
                      borderWidth="1px"
                      borderColor={isSelected ? 'brand.focusRing' : 'transparent'}
                      cursor="pointer"
                      display="flex"
                      flexDirection="column"
                      gap="1"
                      alignItems="stretch"
                      _hover={!isSelected ? { bg: 'bg.subtle' } : {}}
                      transition="background 0.1s"
                      border="none"
                    >
                      {/* Color area */}
                      <Box position="relative">
                        <Box
                          aspectRatio="140/88"
                          bg={hex}
                          rounded="lg"
                          w="full"
                        />
                        {isSelected && (
                          <Box
                            position="absolute"
                            inset="0"
                            display="flex"
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Check size={16} color="white" />
                          </Box>
                        )}
                      </Box>
                      {/* Hex label */}
                      <Text
                        fontSize="2xs"
                        textAlign="center"
                        color={isSelected ? 'fg' : 'fg.muted'}
                        fontWeight={isSelected ? 'medium' : 'normal'}
                        lineHeight="1.4"
                      >
                        {hex}
                      </Text>
                    </chakra.button>
                  )
                })
              )}
            </Grid>
            </Box>

            {/* ── Section 2: Custom color picker ───────────────────────────── */}
            <TitleBar
              title="انتخاب کد رنگ"
              subtitle="کد رنگ مورد نظر خود را وارد کنید"
              size="xl"
              divider
            />

            {/* ColorPickerControl — max 310px, right-aligned in RTL (start = right) */}
            <Box maxW={isCompact ? 'full' : '310px'}>
              <ColorPicker.Root
                value={pickerColor}
                onValueChange={(e) => setPickerColor(e.value)}
              >
                <ColorPicker.HiddenInput />
                <Field.Root>
                  <Field.Label fontWeight="semibold" fontSize="sm" color="fg">
                    رنگ
                  </Field.Label>
                  {/* Row: Input FIRST = rightmost in RTL ✓ | Trigger SECOND = leftmost ✓ */}
                  <Flex align="center" gap="2" w="full">
                    <ColorPicker.Input flex="1" dir="ltr" textAlign="right" />
                    <ColorPicker.Trigger
                      boxSize="10"
                      p="0"
                      borderWidth="1px"
                      borderColor="border"
                      rounded="md"
                      overflow="hidden"
                      flexShrink={0}
                    >
                      <ColorPicker.ValueSwatch w="full" h="full" rounded="none" />
                    </ColorPicker.Trigger>
                  </Flex>
                </Field.Root>
                <Portal>
                  <ColorPicker.Positioner dir="rtl">
                    <ColorPicker.Content>
                      <ColorPicker.Area />
                      <Flex gap="2" align="center">
                        <ColorPicker.EyeDropper size="xs" variant="outline" />
                        <ColorPicker.Sliders />
                      </Flex>
                    </ColorPicker.Content>
                  </ColorPicker.Positioner>
                </Portal>
              </ColorPicker.Root>
            </Box>

            </>)}

            {/* ── Footer ───────────────────────────────────────────────────────── */}
            <ButtonFooter
              primary={{ label: 'ذخیره تغییرات', onClick: () => {} }}
              back={{
                label: 'بازگشت',
                onClick: () => router.push('/settings/themes'),
              }}
            />

          </Flex>
        </Flex>
      </Box>

    </Flex>
  )
}
