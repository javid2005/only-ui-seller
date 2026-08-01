import { Box, Button, Flex, IconButton } from '@chakra-ui/react'
import { ArrowLeft, ArrowRight, Trash2 } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'

interface ManualOrderFooterProps {
  /** غیرفعال تا وقتی مرحله کامل نشده */
  nextDisabled?: boolean
  onNext: () => void
  onCancel: () => void
  nextLabel?: string
  /** مرحلهٔ اول: «بازگشت به لیست» (خروج از ویزارد) — مراحل بعدی: «بازگشت» (مرحلهٔ قبل) */
  cancelLabel?: string
  /** دکمهٔ اختیاریِ سوم — مثل «حذف تخفیف» در مرحلهٔ تخفیف، فقط وقتی چیزی برای حذف هست نمایش داده می‌شود */
  extraAction?: { label: string; onClick: () => void }
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
  cancelLabel = 'بازگشت به لیست',
  extraAction,
}: ManualOrderFooterProps) {
  const isCompact = useCompactMode()

  return (
    <>
      {/* اسپیسر — فقط جایی که نوار fixed می‌شود، جای آن را در جریان صفحه نگه می‌دارد */}
      <Box display={isCompact ? 'block' : { base: 'block', md: 'none' }} h="24" aria-hidden />

      {/*
        روی موبایل واقعی ({ base }): insetInlineStart/End هر دو ۴=۱۶px — عرض از فاصلهٔ
        دو لبهٔ ویوپورتِ واقعی محاسبه می‌شود (fill واقعی)، چون ویوپورت خودش همان عرضِ
        باریک است.

        isCompact اما شبیه‌سازیِ صرفاً بصریِ ۵۱۲px روی یک مرورگر دسکتاپِ واقعاً پهن است
        (فقط با maxW در Layout.tsx) — ویوپورتِ واقعی هنوز پهن است. چون position="fixed"
        نسبت به ویوپورتِ واقعی محاسبه می‌شود نه ستونِ شبیه‌سازی‌شده، insetInlineStart="4"
        اینجا کل عرضِ واقعیِ صفحه را می‌گیرد نه ۴۸۰px. راه‌حل: inset صفر (تمام‌عرضِ
        ویوپورتِ واقعی) + maxW="480px" + mx="auto" — مرورگر خودش نوار را در وسطِ
        ویوپورتِ واقعی با همان عرضی که در حالت غیرِcompact داخلِ ستونِ ۵۱۲px می‌گرفت
        (۵۱۲ - ۲×۱۶ padding) قرار می‌دهد؛ بدون نیاز به تغییرِ containing-block (که رفتارِ
        «چسبیده به کفِ ویوپورت حین اسکرول» را می‌شکست — امتحان و برگردانده شد).
      */}
      <Box
        position={isCompact ? 'fixed' : { base: 'fixed', md: 'static' }}
        bottom={isCompact ? '4' : { base: '4', md: 'auto' }}
        insetInlineStart={isCompact ? '0' : { base: '4', md: 'auto' }}
        insetInlineEnd={isCompact ? '0' : { base: '4', md: 'auto' }}
        maxW={isCompact ? '480px' : undefined}
        mx={isCompact ? 'auto' : undefined}
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
            {/* آیکن leading = راستِ متن (هم‌الگو با PrintFooterCTA / ManualOrderConfirmFooter) */}
            <ArrowRight size={20} />
            {cancelLabel}
          </Button>

          {/* گروهِ اقدام اصلی — extraAction (مثل «حذف تخفیف») راست‌ترِ گروه = اولِ DOM،
              دکمهٔ اصلی «ادامه» چپ‌ترِ گروه = آخرِ DOM (طبق x-metadata Figma: ادامه x=0،
              extraAction x=97 — یعنی extraAction از ادامه راست‌تر است، نه برعکس) */}
          <Flex align="center" gap="2">
            {extraAction && (
              <>
                {/* زیر sm: IconButton با آیکن Trash2 به‌جای دکمهٔ متنی (طبق درخواست کاربر) */}
                <IconButton
                  aria-label={extraAction.label}
                  variant="outline"
                  colorPalette="red"
                  size="sm"
                  h="10"
                  rounded="md"
                  display={{ base: 'inline-flex', sm: 'none' }}
                  onClick={extraAction.onClick}
                >
                  <Trash2 size={16} />
                </IconButton>
                <Button
                  variant="outline"
                  colorPalette="red"
                  size="sm"
                  h="10"
                  px="4"
                  rounded="md"
                  fontWeight="semibold"
                  fontSize="sm"
                  display={{ base: 'none', sm: 'inline-flex' }}
                  onClick={extraAction.onClick}
                >
                  {extraAction.label}
                </Button>
              </>
            )}

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
        </Flex>
      </Box>
    </>
  )
}
