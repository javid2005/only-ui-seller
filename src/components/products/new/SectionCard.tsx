import type { ReactNode } from 'react'
import { Box, Flex, Text, Icon } from '@chakra-ui/react'
import { CircleHelp } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'

// ─── SectionCard ────────────────────────────────────────────────────────────────
/**
 * کارت یک بخش از فرم محصول — واحد تقسیم‌بندی طرح تأییدشده.
 *
 * ساختار: کادر بیرونی → سرتیتر (عنوان + راهنما، زیرعنوان) → بدنه.
 * در طرح، فیلدها داخل یک «پنل» جداگانه در همین کارت می‌نشینند (کامپوننت Panel زیر).
 *
 * RTL DOM order سرتیتر (first = rightmost): عنوان ← آیکن راهنما.
 */
export interface SectionCardProps {
  title: string
  subtitle?: string
  /** متن راهنما — با آیکن «؟» کنار عنوان نمایش داده می‌شود */
  help?: string
  /** کنترل‌های سمت چپ سرتیتر (مثل تب تومان/دلار) */
  actions?: ReactNode
  children: ReactNode
}

export function SectionCard({ title, subtitle, help, actions, children }: SectionCardProps) {
  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="xl"
      p={{ base: '4', sm: '5' }}
      w="full"
    >
      <Flex align="start" justify="space-between" gap="4" mb="4" wrap="wrap">
        <Box minW="0">
          {/* FIRST = rightmost: عنوان · سپس آیکن راهنما */}
          <Flex align="center" gap="2">
            <Text fontSize="md" fontWeight="semibold" color="fg">{title}</Text>
            {help && (
              <Tooltip content={help}>
                <Icon size="sm" color="fg.muted" cursor="help" tabIndex={0} aria-label="راهنما">
                  <CircleHelp />
                </Icon>
              </Tooltip>
            )}
          </Flex>
          {subtitle && (
            <Text fontSize="xs" color="fg.muted" textAlign="start" mt="1">{subtitle}</Text>
          )}
        </Box>
        {actions}
      </Flex>

      {children}
    </Box>
  )
}

// ─── Panel ──────────────────────────────────────────────────────────────────────
/**
 * پنل داخلیِ یک بخش — همان کادر دور گروهِ فیلدها در طرح.
 * با `title` یک سرتیتر کوچک (آیکن + عنوان + زیرعنوان) هم می‌گیرد، مثل «ابعاد بسته».
 */
export interface PanelProps {
  title?: string
  subtitle?: string
  icon?: ReactNode
  /** پس‌زمینهٔ ملایم — برای گروه‌هایی که باید از سطح کارت جدا دیده شوند */
  tinted?: boolean
  children: ReactNode
}

export function Panel({ title, subtitle, icon, tinted, children }: PanelProps) {
  return (
    <Box
      borderWidth="1px"
      borderColor="border.muted"
      bg={tinted ? 'bg.subtle' : 'transparent'}
      rounded="lg"
      p="4"
      w="full"
    >
      {title && (
        <Flex align="center" gap="2" mb="4">
          {/* FIRST = rightmost: آیکن (در طرح راست‌ترین است) · سپس عنوان و زیرعنوان */}
          {icon && <Box color="fg.muted" flexShrink={0}>{icon}</Box>}
          <Box minW="0" textAlign="start" flex="1">
            <Text fontSize="sm" fontWeight="medium" color="fg">{title}</Text>
            {subtitle && <Text fontSize="xs" color="fg.muted">{subtitle}</Text>}
          </Box>
        </Flex>
      )}
      {children}
    </Box>
  )
}
