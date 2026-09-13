import { useState, type ReactNode } from 'react'
import { Box, Flex, Text, IconButton } from '@chakra-ui/react'
import { CircleHelp } from 'lucide-react'
import { Tooltip } from '@/components/ui/Tooltip'
import { HelpDialog } from './HelpDialog'

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
  /** کلید موضوع در HELP_TOPICS — آیکن «؟» را به دکمهٔ بازکنندهٔ راهنمای کامل تبدیل می‌کند */
  helpTopic?: string
  /** راهنمای این بخش باکس ویدئو هم داشته باشد */
  helpVideo?: boolean
  /** کنترل‌های سمت چپ سرتیتر (مثل تب تومان/دلار) */
  actions?: ReactNode
  children: ReactNode
}

export function SectionCard({
  title, subtitle, help, helpTopic, helpVideo, actions, children,
}: SectionCardProps) {
  const [helpOpen, setHelpOpen] = useState(false)

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      // شعاع‌های طرح از پیش‌فرض چاکرا گردترند: کارت ۱۶px، پنل ۱۲px، فیلد ۸px
      rounded="2xl"
      // سایهٔ ملایم — در طرح هر کارت کمی از سطح صفحه بلند می‌شود. بدون آن همهٔ
      // بخش‌ها یک تخته می‌شوند و چشم مرز بخش‌ها را پیدا نمی‌کند.
      boxShadow="xs"
      p={{ base: '4', sm: '5' }}
      w="full"
    >
      <Flex align="start" justify="space-between" gap="4" mb="4" wrap="wrap">
        <Box minW="0">
          {/* FIRST = rightmost: عنوان · سپس آیکن راهنما */}
          <Flex align="center" gap="2">
            {/* رنگ برند برای عنوان بخش، نه fg: در طرح همین رنگ است که چشم را روی
                سرتیتر بخش‌ها می‌نشاند و آن‌ها را از متن معمولی جدا می‌کند. */}
            <Text fontSize="sm" fontWeight="bold" color="brand.fg" letterSpacing="-0.01em">
              {title}
            </Text>
            {(help || helpTopic) && (
              <Tooltip content={helpTopic ? `راهنمای «${title}»` : help}>
                <IconButton
                  size="2xs"
                  variant="ghost"
                  color="fg.muted"
                  rounded="full"
                  aria-label={`راهنمای ${title}`}
                  cursor={helpTopic ? 'pointer' : 'help'}
                  onClick={helpTopic ? () => setHelpOpen(true) : undefined}
                >
                  <CircleHelp />
                </IconButton>
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

      {helpTopic && (
        <HelpDialog
          topic={helpOpen ? helpTopic : null}
          onClose={() => setHelpOpen(false)}
          description={subtitle}
          withVideo={helpVideo}
        />
      )}
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
      rounded="xl"
      p="4"
      w="full"
    >
      {title && (
        <Flex align="center" gap="2" mb="4">
          {/* FIRST = rightmost: آیکن (در طرح راست‌ترین است) · سپس عنوان و زیرعنوان */}
          {icon && <Box color="fg.muted" flexShrink={0}>{icon}</Box>}
          <Box minW="0" textAlign="start" flex="1">
            <Text fontSize="xs" fontWeight="semibold" color="fg">{title}</Text>
            {subtitle && <Text fontSize="xs" color="fg.muted">{subtitle}</Text>}
          </Box>
        </Flex>
      )}
      {children}
    </Box>
  )
}
