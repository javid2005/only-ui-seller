import { Fragment, type ReactNode } from 'react'
import { Flex, Text, Box, Badge, Button } from '@chakra-ui/react'
import { ChevronLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface HeaderProps {
  /** Page title — 2xl semibold */
  title: string
  /** Breadcrumb trail — first item = root (rightmost in RTL) */
  breadcrumbs?: BreadcrumbItem[]
  /** Small badge rendered inline before the title */
  badge?: string
  /** Welcome subtitle shown between breadcrumb and title */
  welcome?: string
  /** CTA slot — rendered on the left side in RTL */
  cta?: ReactNode
}

export function Header({
  title,
  breadcrumbs,
  badge,
  welcome,
  cta,
}: HeaderProps) {
  return (
    /**
     * RTL outer row:
     *   FIRST child = Content (title / breadcrumb) → rightmost ✓
     *   LAST  child = CTA                          → leftmost  ✓
     */
    <Flex align="flex-start" gap="2" w="full" flexShrink={0}>

      {/* ── Content: FIRST → right side in RTL ✓ ─────────────── */}
      <Flex direction="column" gap="2" flex="1" minW="0" align="flex-end">

        {/* Breadcrumb row */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Flex align="center" gap="1" w="full" justify="flex-end">
            {breadcrumbs.map((crumb, i) => (
              <Fragment key={i}>
                {/* RTL breadcrumb: first item = rightmost = root */}
                {crumb.href ? (
                  <Link to={crumb.href} style={{ textDecoration: 'none' }}>
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.fg"
                      cursor="pointer"
                      _hover={{ color: 'brand.solid' }}
                      transition="color 0.15s"
                      whiteSpace="nowrap"
                    >
                      {crumb.label}
                    </Text>
                  </Link>
                ) : (
                  <Text
                    fontSize="xs"
                    fontWeight="medium"
                    color="gray.fg"
                    whiteSpace="nowrap"
                  >
                    {crumb.label}
                  </Text>
                )}

                {/* Separator — chevron-left between items (not after last) */}
                {i < breadcrumbs.length - 1 && (
                  <Box
                    color="fg.muted"
                    opacity={0.8}
                    display="flex"
                    alignItems="center"
                    flexShrink={0}
                  >
                    <ChevronLeft size={12} />
                  </Box>
                )}
              </Fragment>
            ))}
          </Flex>
        )}

        {/* Welcome subtitle (optional) */}
        {welcome && (
          <Text
            fontSize="md"
            fontWeight="normal"
            color="fg.muted"
            textAlign="right"
            w="full"
            whiteSpace="nowrap"
          >
            {welcome}
          </Text>
        )}

        {/* Title row — badge + page title */}
        <Flex align="center" gap="4" justify="flex-end" w="full">
          {badge && (
            <Badge
              colorPalette="purple"
              variant="subtle"
              size="md"
              px="2.5"
              h="7"
              flexShrink={0}
            >
              {badge}
            </Badge>
          )}
          <Text
            fontSize="2xl"
            fontWeight="semibold"
            lineHeight="8"
            color="fg"
            textAlign="right"
            whiteSpace="nowrap"
          >
            {title}
          </Text>
        </Flex>

      </Flex>

      {/* ── CTA slot: LAST → left side in RTL ✓ ──────────────── */}
      {cta && (
        <Box flexShrink={0} alignSelf="flex-start">
          {cta}
        </Box>
      )}

    </Flex>
  )
}

/**
 * Default CTA button matching Figma brand.solid style.
 * Pass as <Header cta={<HeaderCTA label="..." icon={<Mail />} onClick={...} />} />
 */
interface HeaderCTAProps {
  label: string
  icon?: ReactNode
  onClick?: () => void
}

export function HeaderCTA({ label, icon, onClick }: HeaderCTAProps) {
  return (
    <Button
      bg="brand.solid"
      color="brand.contrast"
      size="sm"
      h="9"
      px="3.5"
      fontWeight="semibold"
      fontSize="sm"
      borderRadius="sm"
      _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
      onClick={onClick}
      gap="2"
    >
      {/* RTL: label FIRST = rightmost, icon LAST = leftmost ✓ */}
      <Text>{label}</Text>
      {icon && (
        <Box display="flex" alignItems="center" flexShrink={0}>
          {icon}
        </Box>
      )}
    </Button>
  )
}
