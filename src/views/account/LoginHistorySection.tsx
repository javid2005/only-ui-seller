import { Badge, Box, Button, Flex, Separator, Text } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'
import { useCompactMode } from '@/contexts/CompactModeContext'

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginEntry {
  device: string
  browser?: string
  ip: string
  date: string
  isCurrent?: boolean
}

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_HISTORY: LoginEntry[] = [
  { device: 'Windows', browser: 'Chrome',  ip: '185.200.4.12', date: '۱۴۰۴/۰۱/۲۱', isCurrent: true },
  { device: 'iPhone 15', browser: 'Safari', ip: '91.98.50.1',  date: '۱۴۰۴/۰۱/۱۸' },
  { device: 'نامشخص',                        ip: '45.11.80.200', date: '۱۴۰۴/۰۱/۱۰' },
]

// ─── Login-History-Card (Figma node 4701:87987) — کارتِ جایگزین ردیف جدول در موبایل ──
// ⚠️ RTL: ترتیب خام DOM فیگما (LTR) آینه‌ای بود؛ با مختصات x واقعی (get_metadata) تصحیح شد:
//  - ردیف ۱: دستگاه (x=76→400، راست‌ترین) اول در DOM … Badge «جاری» (x=0، چپ‌ترین) آخر
//  - ردیف ۲: IP (x=204→400، راست‌تر) اول در DOM … تاریخ (x=0→196، چپ‌تر) دوم — هم‌راستا با ترتیب جدول (دستگاه›IP›تاریخ)

function LoginHistoryCard({ entry }: { entry: LoginEntry }) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border"
      borderRadius="lg"
      bg={entry.isCurrent ? 'brand.bg' : 'bg.panel'}
      p="4"
      display="flex"
      flexDirection="column"
      gap="2"
      w="full"
    >
      <Flex w="full" gap="2" align="flex-start">
        <Flex direction="column" gap="1" flex="1" minW="0" align="flex-start" overflow="hidden">
          <Text fontSize="sm" fontWeight="semibold" color="fg" lineClamp="1">{entry.device}</Text>
          <Text fontSize="xs" color="fg.subtle">{entry.browser ?? '-'}</Text>
        </Flex>
        {entry.isCurrent && (
          <Badge colorPalette="green" size="sm" flexShrink={0}>جاری</Badge>
        )}
      </Flex>

      <Separator />

      <Flex w="full" gap="2">
        <Box flex="1" minW="0">
          <Text fontSize="xs" color="fg.subtle">IP</Text>
          <Text fontSize="sm" color="fg">{entry.ip}</Text>
        </Box>
        <Box flex="1" minW="0">
          <Text fontSize="xs" color="fg.subtle">تاریخ</Text>
          <Text fontSize="sm" color="fg">{entry.date}</Text>
        </Box>
      </Flex>

      <Button variant="outline" colorPalette="red" w="full" h="10" onClick={() => {}}>
        خروج
      </Button>
    </Box>
  )
}

// ─── LoginHistorySection ──────────────────────────────────────────────────────

export function LoginHistorySection() {
  const isCompact = useCompactMode()

  return (
    <>
      <TitleBar
        title="تاریخچه ورود"
        subtitle="دستگاه‌هایی که اخیراً وارد حساب شده‌اند."
        divider
      />

      {/* ── کارت — زیر md (و در حالت compact) ── */}
      <Box display={{ base: 'block', md: isCompact ? 'block' : 'none' }} w="full">
        <Flex direction="column" gap="4">
          {MOCK_HISTORY.map((entry, i) => (
            <LoginHistoryCard key={i} entry={entry} />
          ))}
        </Flex>
      </Box>

      {/* ── جدول — از md به بالا (و خارج از حالت compact) ── */}
      <Box
        display={{ base: 'none', md: isCompact ? 'none' : 'block' }}
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        overflow="hidden"
        w="full"
      >
        <Box overflowX="auto">
        <Box minW={{ base: '500px', sm: '0' }}>
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <Flex
          bg="bg.muted"
          borderBottomWidth="1px"
          borderColor="border"
          minH="11"
          px="4"
          align="center"
        >
          {/* RTL DOM: FIRST=rightmost → دستگاه | IP | تاریخ | وضعیت=leftmost */}
          <Flex flex="1" minW="0">
            <Text fontSize="sm" fontWeight="semibold" color="fg">دستگاه</Text>
          </Flex>
          <Box flex="1" minW="0">
            <Text fontSize="sm" fontWeight="semibold" color="fg">IP</Text>
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="sm" fontWeight="semibold" color="fg">تاریخ</Text>
          </Box>
          <Box flex="1" minW="0">
            <Text fontSize="sm" fontWeight="semibold" color="fg">وضعیت</Text>
          </Box>
          <Box w="32" flexShrink={0} />
        </Flex>

        {/* ── Rows ────────────────────────────────────────────────────────── */}
        {MOCK_HISTORY.map((entry, i) => (
          <Flex
            key={i}
            bg={entry.isCurrent ? 'teal.subtle' : 'bg'}
            borderBottomWidth="1px"
            borderColor="border"
            minH="20"
            px="4"
            py="2"
            align="center"
          >
            {/* دستگاه FIRST = rightmost — two-line: device name + browser */}
            <Flex flex="1" direction="column" gap="1" align="flex-start" minW="0" overflow="hidden">
              <Text fontSize="sm" fontWeight="semibold" color="fg" lineClamp="1">
                {entry.device}
              </Text>
              <Text fontSize="xs" color="fg.subtle">
                {entry.browser ?? '-'}
              </Text>
            </Flex>

            <Box flex="1" minW="0">
              <Text fontSize="sm" color="fg">{entry.ip}</Text>
            </Box>

            <Box flex="1" minW="0">
              <Text fontSize="sm" color="fg">{entry.date}</Text>
            </Box>

            {/* وضعیت */}
            <Box flex="1" minW="0">
              {entry.isCurrent ? (
                <Badge colorPalette="green">آنلاین</Badge>
              ) : (
                <Text fontSize="sm" color="fg">-</Text>
              )}
            </Box>

            {/* خروج LAST = leftmost */}
            <Box w="32" flexShrink={0}>
              <Button variant="outline" colorPalette="red" size="sm" w="full" onClick={() => {}}>
                خروج
              </Button>
            </Box>
          </Flex>
        ))}
        </Box>
        </Box>
      </Box>
    </>
  )
}
