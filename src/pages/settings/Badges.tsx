import { useState } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Box, Flex, Text, Field, Input, Button, Badge, Separator,
} from '@chakra-ui/react'
import { Globe, ExternalLink, ImageIcon, CircleAlert, Info } from 'lucide-react'
import { Header } from '@/components/layout/Header'

// ─── Types ────────────────────────────────────────────────────────────────────

interface BadgeConfig {
  id: string
  title: string
  siteUrl: string
  siteDomain: string
  description: string
  inputLabel: string
  inputPlaceholder: string
  requiresDomain?: boolean
  submitDisabled?: boolean
  globeBg: string
  globeColor: string
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BADGES: BadgeConfig[] = [
  {
    id: 'enamad',
    title: 'نماد اعتماد الکترونیک',
    siteUrl: 'https://enamad.ir',
    siteDomain: 'enamad.ir',
    description: 'اطلاعات پایه و اصلی محصول را وارد نمایید.',
    inputLabel: 'کد HTML نماد اینماد',
    inputPlaceholder: 'کد نماد را از enamad.ir دریافت و اینجا وارد کنید',
    requiresDomain: true,
    submitDisabled: true,
    globeBg: 'brand.subtle',
    globeColor: 'brand.fg',
  },
  {
    id: 'ecunion',
    title: 'مجوز اتحادیه کسب‌وکارهای مجازی',
    siteUrl: 'https://ecunion.ir',
    siteDomain: 'ecunion.ir',
    description: 'مجوز صنفی برای فعالیت کسب‌وکارهای آنلاین مطابق ضوابط و مقررات اتحادیه مربوطه.',
    inputLabel: 'لینک استعلام مجوز',
    inputPlaceholder: 'لینک استعلام مجوز را از ecunion.ir وارد کنید',
    globeBg: 'blue.subtle',
    globeColor: 'blue.fg',
  },
  {
    id: 'samandehi',
    title: 'مجوز ساماندهی محتوای فضای مجازی',
    siteUrl: 'https://samandehi.ir',
    siteDomain: 'samandehi.ir',
    description: 'مجوز برای کسب‌وکارهایی که در حوزه انتشار محتوا یا ارائه خدمات محتوایی فعالیت می‌کنند.',
    inputLabel: 'لینک استعلام مجوز',
    inputPlaceholder: 'لینک استعلام مجوز را از samandehi.ir وارد کنید',
    globeBg: 'purple.subtle',
    globeColor: 'purple.fg',
  },
]

// ─── BadgeSectionCard ─────────────────────────────────────────────────────────

interface BadgeSectionCardProps {
  config: BadgeConfig
  value: string
  onChange: (v: string) => void
  isCompact: boolean
}

function BadgeSectionCard({ config, value, onChange, isCompact }: BadgeSectionCardProps) {
  return (
    <Flex direction="column" gap="4">

      {/* ── Section header ────────────────────────────────────────────── */}
      <Box w="full" pb="3">
        {/* RTL: title group FIRST = rightmost | link LAST = leftmost (below on < sm) */}
        <Flex
          direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}
          align={isCompact ? 'flex-start' : { base: 'flex-start', sm: 'center' }}
          gap="3"
          w="full"
          pb="3"
        >

          {/* Title group — rightmost */}
          <Flex align="center" gap="4" flex="1" minW="0">
            {/* Globe icon — square rounded box */}
            <Box
              bg={config.globeBg}
              color={config.globeColor}
              rounded="md"
              p="1"
              flexShrink={0}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <Globe size={20} />
            </Box>
            <Text
              fontWeight="semibold"
              fontSize={isCompact ? 'lg' : { base: 'lg', md: 'xl' }}
              color="fg"
              lineHeight="1.5"
            >
              {config.title}
            </Text>
            {config.requiresDomain && (
              <Badge colorPalette="orange" variant="subtle" size="sm" flexShrink={0}>
                نیاز به دامنه
              </Badge>
            )}
          </Flex>

          {/* External link — leftmost */}
          <Flex
            as="a"
            href={config.siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            align="center"
            gap="2"
            color="brand.fg"
            fontSize="sm"
            fontWeight="semibold"
            _hover={{ opacity: 0.8 }}
            textDecoration="none"
            flexShrink={0}
            alignSelf="flex-start"
            ms={isCompact ? '11' : { base: '11', sm: '0' }}
          >
            {/* RTL: text FIRST = rightmost, icon LAST = leftmost */}
            <Text>{config.siteDomain}</Text>
            <ExternalLink size={16} />
          </Flex>

        </Flex>
        <Separator />
      </Box>

      {/* ── Orange alert (domain required) — between header and content ── */}
      {config.requiresDomain && (
        <Flex
          position="relative"
          bg="orange.subtle"
          rounded="lg"
          p="3"
          gap="2"
          align="flex-start"
        >
          {/* Inset border */}
          <Box
            position="absolute"
            inset="0"
            rounded="inherit"
            boxShadow="inset 0 0 0 1px var(--chakra-colors-orange-muted, #fed7aa)"
            pointerEvents="none"
          />

          {/* Icon — FIRST = rightmost in RTL */}
          <Box
            w="4"
            display="flex"
            alignItems="center"
            justifyContent="center"
            pt="1px"
            flexShrink={0}
            color="orange.fg"
          >
            <CircleAlert size={14} />
          </Box>

          {/* Text — LAST = leftmost in RTL */}
          <Flex direction="column" flex="1" minW="0" color="orange.fg">
            <Text fontSize="xs" fontWeight="medium" lineHeight="16px">
              دامنه اختصاصی ثبت نشده است
            </Text>
            <Text fontSize="2xs" lineHeight="1.4" mt="1">
              برای فعالسازی اینماد، ابتدا باید دامنه اختصاصی فروشگاه ثبت شود.{' '}
              <Box
                as="a"
                href="/settings/store-info"
                textDecoration="underline"
                color="orange.fg"
              >
                رفتن به ثبت دامنه
              </Box>
            </Text>
          </Flex>
        </Flex>
      )}

      {/* ── Content row: image FIRST=rightmost | info LAST=leftmost ──── */}
      <Flex
        direction={isCompact ? 'column' : { base: 'column', md: 'row' }}
        gap="4"
      >

        {/* Image placeholder — rightmost (FIRST in DOM) */}
        {/* In mobile column: alignSelf=flex-start = RIGHT side in RTL */}
        <Box
          boxSize={isCompact ? '64px' : { base: '64px', md: '102px' }}
          alignSelf={isCompact ? 'flex-start' : { base: 'flex-start', md: 'auto' }}
          bg="bg.muted"
          borderWidth="2px"
          borderStyle="dashed"
          borderColor="border"
          rounded="md"
          display="flex"
          alignItems="center"
          justifyContent="center"
          color="fg.subtle"
          flexShrink={0}
        >
          <ImageIcon size={24} />
        </Box>

        {/* Description + input row — leftmost (LAST in DOM) */}
        <Flex direction="column" gap="4" flex="1" minW="0" w="full">

          <Text fontSize="sm" color="fg.muted" lineHeight="1.6">
            {config.description}
          </Text>

          {/* Input + Button — row on sm+, column on <sm */}
          <Flex
            direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}
            align={isCompact ? 'stretch' : { base: 'stretch', sm: 'flex-end' }}
            gap="2"
            w="full"
          >
            <Field.Root flex="1" minW="0">
              <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
                {config.inputLabel}
              </Field.Label>
              <Input
                placeholder={config.inputPlaceholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                size="md"
              />
            </Field.Root>
            <Button
              colorPalette={config.submitDisabled ? 'gray' : 'teal'}
              variant="outline"
              flexShrink={0}
              disabled={config.submitDisabled}
              opacity={config.submitDisabled ? 0.3 : 1}
              w={isCompact ? 'full' : { base: 'full', sm: 'auto' }}
            >
              ثبت
            </Button>
          </Flex>

        </Flex>
      </Flex>

    </Flex>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Badges() {
  const isCompact = useCompactMode()

  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(BADGES.map((b) => [b.id, '']))
  )

  function handleChange(id: string, v: string) {
    setValues((prev) => ({ ...prev, [id]: v }))
  }

  return (
    <Flex direction="column" gap="4" w="full">

      <Header
        title="نمادها و مجوزها"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'نمادها و مجوزها' },
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
        <Flex direction="column" gap="10" maxW="960px" w="full" mx="auto">

          {/* Badge sections */}
          {BADGES.map((badge) => (
            <BadgeSectionCard
              key={badge.id}
              config={badge}
              value={values[badge.id]}
              onChange={(v) => handleChange(badge.id, v)}
              isCompact={isCompact}
            />
          ))}

          {/* ── Blue info note ─────────────────────────────────────────── */}
          <Flex
            position="relative"
            bg="blue.subtle"
            rounded="lg"
            p="3"
            gap="2"
            align="flex-start"
          >
            {/* Inset border */}
            <Box
              position="absolute"
              inset="0"
              rounded="inherit"
              boxShadow="inset 0 0 0 1px var(--chakra-colors-blue-muted, #bfdbfe)"
              pointerEvents="none"
            />

            {/* Icon — FIRST = rightmost in RTL */}
            <Box
              w="4"
              display="flex"
              alignItems="center"
              justifyContent="center"
              pt="1px"
              flexShrink={0}
              color="blue.fg"
            >
              <Info size={14} />
            </Box>

            {/* Text — LAST = leftmost in RTL */}
            <Flex direction="column" flex="1" minW="0" color="blue.fg">
              <Text fontSize="xs" fontWeight="medium" lineHeight="16px">
                نکته
              </Text>
              <Text fontSize="2xs" lineHeight="1.4" mt="1">
                {`نمادها تنها زمانی در ویترین نمایش داده می‌شوند که لینک یا کد معتبر ثبت شده باشد. هر نماد به صورت تگ <a> در ویترین قرار می‌گیرد و بازدیدکنندگان می‌توانند اعتبار فروشگاه را استعلام کنند.`}
              </Text>
            </Flex>
          </Flex>


        </Flex>
      </Box>

    </Flex>
  )
}
