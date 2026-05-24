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
  /** Breadcrumb trail. First item = root (rightmost in RTL) */
  breadcrumbs?: BreadcrumbItem[]
  /** Optional small badge inline before the title */
  badge?: string
  /** Optional welcome subtitle between breadcrumb and title */
  welcome?: string
  /** Optional CTA — rendered on the left side in RTL */
  cta?: ReactNode
}

export function Header({ title, breadcrumbs, badge, welcome, cta }: HeaderProps) {
  return (
    /**
     * RTL outer row — flex-start = RIGHT in RTL
     *   FIRST child = Content (breadcrumb + title) → rightmost ✓
     *   LAST  child = CTA                          → leftmost  ✓
     */
    <Flex align="flex-start" w="full" flexShrink={0}>

      {/* ── Content: FIRST → rightmost in RTL ✓ ──────────── */}
      <Flex
        direction="column"
        gap="2"          /* 8px — matches Figma spacing/2 */
        flex="1"
        minW="0"
        align="flex-start"  /* flex-start = RIGHT side in RTL ✓ */
      >

        {/* Breadcrumb */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Flex align="center" gap="1" flexShrink={0}>
            {breadcrumbs.map((crumb, i) => (
              <Fragment key={i}>
                {crumb.href ? (
                  <Link to={crumb.href} style={{ textDecoration: 'none' }}>
                    <Text
                      fontSize="xs"
                      fontWeight="medium"
                      color="gray.fg"
                      _hover={{ color: 'brand.solid' }}
                      transition="color 0.15s"
                      whiteSpace="nowrap"
                      cursor="pointer"
                    >
                      {crumb.label}
                    </Text>
                  </Link>
                ) : (
                  <Text fontSize="xs" fontWeight="medium" color="gray.fg" whiteSpace="nowrap">
                    {crumb.label}
                  </Text>
                )}
                {i < breadcrumbs.length - 1 && (
                  <Box color="fg.muted" opacity={0.8} display="flex" alignItems="center" flexShrink={0}>
                    <ChevronLeft size={12} />
                  </Box>
                )}
              </Fragment>
            ))}
          </Flex>
        )}

        {/* Welcome subtitle (optional) */}
        {welcome && (
          <Text fontSize="md" fontWeight="normal" color="fg.muted" whiteSpace="nowrap" flexShrink={0}>
            {welcome}
          </Text>
        )}

        {/* Title row: badge (optional) + title */}
        <Flex align="center" gap="4" flexShrink={0}>
          <Text
            fontSize={{ base: 'xl', sm: '2xl' }}
            fontWeight="semibold"
            lineHeight="1.333"
            color="fg"
            whiteSpace="nowrap"
          >
            {title}
          </Text>
          {badge && (
            <Badge colorPalette="purple" variant="subtle" size="md" px="2.5" h="7" flexShrink={0}>
              {badge}
            </Badge>
          )}
        </Flex>

      </Flex>

      {/* ── CTA: LAST → leftmost in RTL ✓ ──────────────── */}
      {cta && (
        <Box flexShrink={0} alignSelf="flex-start">
          {cta}
        </Box>
      )}

    </Flex>
  )
}

/** CTA button matching Figma brand.solid style */
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
    >
      {/* RTL: label FIRST = rightmost, icon LAST = leftmost ✓ */}
      {label}
      {icon && <Box display="flex" alignItems="center" flexShrink={0}>{icon}</Box>}
    </Button>
  )
}
