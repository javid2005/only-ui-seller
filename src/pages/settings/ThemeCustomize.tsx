import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Box, Flex, Grid, Text, Badge,
  Icon, Field, FileUpload, Input, IconButton,
} from '@chakra-ui/react'
import {
  Plus, Trash2, Upload,
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
  const navigate  = useNavigate()
  const location  = useLocation()
  const isCompact = useCompactMode()

  // Thumbnail + name passed from ThemeSettings via router state
  const routeState = (location.state as { thumbnail?: string; name?: string }) ?? {}
  const themeName      = routeState.name      ?? 'قالب فروشگاهی مدرن'
  const themeThumbnail = routeState.thumbnail ?? null

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

  // Vertical tab list
  const VerticalTabList = (
    <Flex direction="column" gap="1">
      {TABS.map(({ id, label, Icon: TabIcon, disabled }) => {
        const isActive = activeTab === id
        return (
          <Flex
            key={id}
            align="center"
            gap="2.5"
            px="4"
            py="2"
            h="10"
            rounded="sm"
            overflow="hidden"
            w="full"
            cursor={disabled ? 'not-allowed' : 'pointer'}
            opacity={disabled ? 0.5 : 1}
            bg={isActive ? 'bg.muted' : 'transparent'}
            color={isActive ? 'gray.fg' : 'fg.muted'}
            _hover={disabled || isActive ? {} : { bg: 'bg.subtle' }}
            transition="background 0.1s"
            onClick={disabled ? undefined : () => setActiveTab(id)}
          >
            {/* Icon — FIRST = rightmost in RTL ✓ */}
            <Box flexShrink={0} display="flex" alignItems="center">
              <TabIcon size={16} />
            </Box>
            {/* Label — SECOND = leftmost ✓ */}
            <Text flex="1" fontSize="sm" fontWeight="normal" textAlign="right">
              {label}
            </Text>
          </Flex>
        )
      })}
    </Flex>
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

                {/* Horizontal tab strip — text-only, scrollable */}
                <Box bg="bg.muted" p="1" rounded="sm" overflowX="auto" overflowY="clip" w="full">
                  <Flex align="center">
                    {TABS.map(({ id, label, disabled }) => {
                      const isActive = activeTab === id
                      return (
                        <Box
                          key={id}
                          px="4"
                          py="2"
                          h="10"
                          rounded="sm"
                          flexShrink={0}
                          cursor={disabled ? 'not-allowed' : 'pointer'}
                          opacity={disabled ? 0.5 : 1}
                          bg={isActive ? 'bg' : 'transparent'}
                          boxShadow={isActive ? 'xs' : 'none'}
                          transition="background 0.1s"
                          onClick={disabled ? undefined : () => setActiveTab(id)}
                        >
                          <Text
                            fontSize="sm"
                            fontWeight="normal"
                            color={isActive ? 'gray.fg' : 'fg.muted'}
                            whiteSpace="nowrap"
                          >
                            {label}
                          </Text>
                        </Box>
                      )
                    })}
                  </Flex>
                </Box>

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

            {/* ── Footer ───────────────────────────────────────────────────────── */}
            <ButtonFooter
              primary={{ label: 'ذخیره تغییرات', onClick: () => {} }}
              back={{
                label: 'بازگشت به پوسته‌ها',
                onClick: () => navigate('/settings/themes'),
              }}
            />

          </Flex>
        </Flex>
      </Box>

    </Flex>
  )
}
