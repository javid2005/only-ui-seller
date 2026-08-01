import { Box, Button, Flex } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'

interface ManualOrderConfirmFooterProps {
  onCreate: () => void
  onBack: () => void
}

/**
 * ManualOrderConfirmFooter — نوار اکشنِ مرحلهٔ آخرِ ویزارد (Figma «Footer CTA»، node 2258:45663 /
 * 4941:75222). دسکتاپ (>md): درونِ جریانِ صفحه، border ساده بدون shadow — هم‌الگو با PrintFooterCTA.
 * موبایل/کامپکت: fixed به کفِ صفحه، هم‌الگو با ManualOrderFooter (مراحل ۱ تا ۴) — طبق درخواست
 * کاربر، رفتار responsive این مرحله هم باید با بقیهٔ ویزارد یکدست باشد.
 *
 * RTL: «بازگشت» اولِ DOM = راست (با ArrowRight پیشرو) · دکمهٔ اصلی آخرِ DOM = چپ.
 */
export function ManualOrderConfirmFooter({ onCreate, onBack }: ManualOrderConfirmFooterProps) {
  const isCompact = useCompactMode()

  return (
    <>
      {/* اسپیسر — فقط جایی که نوار fixed می‌شود، جای آن را در جریان صفحه نگه می‌دارد */}
      <Box display={isCompact ? 'block' : { base: 'block', md: 'none' }} h="24" aria-hidden />

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
          {/* بازگشت — RTL: اولِ DOM = راست · آیکن leading = راستِ متن */}
          <Button
            variant="ghost"
            size="sm"
            h="10"
            px="4"
            rounded="md"
            fontWeight="semibold"
            fontSize="sm"
            color="gray.fg"
            onClick={onBack}
          >
            <ArrowRight size={20} />
            بازگشت
          </Button>

          {/* ثبت و ایجاد لینک پرداخت — RTL: آخرِ DOM = چپ */}
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
            onClick={onCreate}
          >
            ثبت و ایجاد لینک پرداخت
          </Button>
        </Flex>
      </Box>
    </>
  )
}
