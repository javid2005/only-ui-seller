import { Badge, Box, Flex, Text } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'

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

// ─── LoginHistorySection ──────────────────────────────────────────────────────

export function LoginHistorySection() {
  return (
    <>
      <TitleBar
        title="تاریخچه ورود"
        subtitle="دستگاه‌هایی که اخیراً وارد حساب شده‌اند."
        divider
      />

      <Box
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

            {/* وضعیت LAST = leftmost */}
            <Box flex="1" minW="0">
              {entry.isCurrent ? (
                <Badge colorPalette="green">آنلاین</Badge>
              ) : (
                <Text fontSize="sm" color="fg">-</Text>
              )}
            </Box>
          </Flex>
        ))}
        </Box>
        </Box>
      </Box>
    </>
  )
}
