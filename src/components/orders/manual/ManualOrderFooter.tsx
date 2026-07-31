import { Box, Button, Flex } from '@chakra-ui/react'
import { ArrowLeft } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'

interface ManualOrderFooterProps {
  /** غیرفعال تا وقتی مرحله کامل نشده */
  nextDisabled?: boolean
  onNext: () => void
  onCancel: () => void
  nextLabel?: string
}

/**
 * ManualOrderFooter — نوار اکشن ویزارد سفارش دستی.
 *
 * دسکتاپ (>md): درون جریان صفحه، border ساده بدون shadow.
 * موبایل/کامپکت: fixed به کف صفحه — با اسکرول صفحه حرکت نمی‌کند (نه sticky).
 * چون fixed از جریان صفحه خارج می‌شود، یک اسپیسر هم‌ارتفاع قبلش قرار می‌گیرد
 * تا محتوای زیرش زیر نوار گم نشود (همان راه‌حلی که خود Figma با اسپیسر ۱۲۰px شبیه‌سازی کرده بود).
 * shadow="md" فقط در حالت fixed — تا موقع اسکرول از محتوای زیرش جدا دیده شود
 * (هم‌راستا با نوار sticky صفحهٔ جزئیات سفارش — OrderSummaryAccordion).
 *
 * RTL (justify-between): «بازگشت به لیست» اولِ DOM = راست · «ادامه» آخر = چپ.
 */
export function ManualOrderFooter({
  nextDisabled = false,
  onNext,
  onCancel,
  nextLabel = 'ادامه',
}: ManualOrderFooterProps) {
  const isCompact = useCompactMode()

  return (
    <>
      {/* اسپیسر — فقط جایی که نوار fixed می‌شود، جای آن را در جریان صفحه نگه می‌دارد */}
      <Box display={isCompact ? 'block' : { base: 'block', md: 'none' }} h="24" aria-hidden />

      {/* insetInlineStart/End هر دو یکسان (۴=۱۶px) — عرض به‌جای w/maxW ثابت، از فاصلهٔ دو لبه
          محاسبه می‌شود (fill واقعی) و با کوچک‌شدن ویوپورت خودش کوچک می‌شود؛ چون مقدار دو طرف
          برابر است، فرقی با چپ/راست فیزیکی ندارد — نیازی به ترفند translateX هم نیست. */}
      <Box
        position={isCompact ? 'fixed' : { base: 'fixed', md: 'static' }}
        bottom={isCompact ? '4' : { base: '4', md: 'auto' }}
        insetInlineStart={isCompact ? '4' : { base: '4', md: 'auto' }}
        insetInlineEnd={isCompact ? '4' : { base: '4', md: 'auto' }}
        zIndex="sticky"
      >
        <Flex
          align="center"
          justify="space-between"
          gap="4"
          w="full"
          p="4"
          rounded="2xl"
          borderWidth="1px"
          borderColor="border"
          bg="bg.panel"
          shadow={isCompact ? 'md' : { base: 'md', md: 'none' }}
        >
          <Button
            variant="ghost"
            size="sm"
            h="10"
            px="4"
            rounded="md"
            fontWeight="semibold"
            fontSize="sm"
            color="gray.fg"
            onClick={onCancel}
          >
            بازگشت به لیست
          </Button>

          <Button
            bg="brand.solid"
            color="brand.contrast"
            size="sm"
            h="10"
            px="4"
            rounded="md"
            fontWeight="semibold"
            fontSize="sm"
            _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
            disabled={nextDisabled}
            onClick={onNext}
          >
            {/* استثنای icon-trailing (طبق Figma): فلشِ «جلو» در RTL به چپ اشاره می‌کند و باید
                سمت چپِ متن — یعنی آخرِ DOM — بنشیند. قرینهٔ دکمهٔ «بازگشت» که فلشش راست است. */}
            {nextLabel}
            <ArrowLeft size={20} />
          </Button>
        </Flex>
      </Box>
    </>
  )
}
