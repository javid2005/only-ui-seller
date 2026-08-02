import { Alert, Box, Button, EmptyState, Flex, IconButton, Text } from '@chakra-ui/react'
import { CircleCheckBig, Copy, Plus } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { toaster } from '@/components/ui/toaster'

interface OrderCompletePanelProps {
  customerName: string
  paymentLink: string
  onCreateNew: () => void
  onGoToList: () => void
}

/**
 * OrderCompletePanel — بخش «پیام تکمیل سفارش» (Figma «Manual / Order Complete»،
 * desktop node 2143:87803 / mobile node 2258:45668). جایگزینِ کاملِ ویزارد بعد از
 * «ثبت و ایجاد لینک پرداخت» — بدون Stepper و بدون پنل «جزئیات سفارش» (طبق طرح).
 */
export function OrderCompletePanel({ customerName, paymentLink, onCreateNew, onGoToList }: OrderCompletePanelProps) {
  const isCompact = useCompactMode()

  function handleCopyLink() {
    navigator.clipboard?.writeText(paymentLink)
    toaster.create({ id: 'order-complete-copy-toast', title: 'کپی شد', type: 'success', duration: 2000 })
  }

  return (
    <Flex
      direction="column"
      gap="6"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      px="6"
      py="20"
      align="flex-end"
    >
      <EmptyState.Root size="sm" w="full">
        <EmptyState.Content>
          <EmptyState.Indicator color="brand.solid">
            <CircleCheckBig size={32} />
          </EmptyState.Indicator>
          <EmptyState.Title>سفارش با موفقیت ثبت شد!</EmptyState.Title>
          <EmptyState.Description>
            لینک پرداخت سفارش برای مشتری{' '}
            <Text as="span" fontWeight="bold" color="fg">{customerName}</Text>
            {' '}ایجاد شد.
          </EmptyState.Description>
        </EmptyState.Content>
      </EmptyState.Root>

      {/* لینک پرداخت — همان الگوی VitrinaLinkCard: dashed brand.bg box + flexWrap safety-net برای موبایل */}
      <Flex
        flexWrap="wrap"
        justify="space-between"
        align="center"
        gap="4"
        w="full"
        bg="brand.bg"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="brand.focusRing"
        rounded="lg"
        px="6"
        py="4"
      >
        {/* RTL: اولِ DOM = راست → دکمهٔ کپی راست، لینک چپ (طبق فیدبک کاربر). dir="ltr" چون URL
            لاتین است؛ textAlign="left" هم‌جهت با dir برای align-left واقعی. */}
        <IconButton variant="ghost" colorPalette="brand" size="md" onClick={handleCopyLink} aria-label="کپی لینک">
          <Copy size={20} />
        </IconButton>
        <Box flex="1" minW="0" dir="ltr" textAlign="left">
          <Text
            fontSize={isCompact ? 'md' : { base: 'md', md: 'lg' }}
            fontWeight="medium"
            color="brand.fg"
            wordBreak="break-all"
          >
            {paymentLink}
          </Text>
        </Box>
      </Flex>

      <Alert.Root status="info" variant="subtle" w="full">
        <Alert.Indicator />
        <Alert.Content>
          <Text fontSize="xs">بعد از پرداخت مشتری، سفارش به صورت خودکار در پنل شما ثبت می‌شود.</Text>
        </Alert.Content>
      </Alert.Root>

      <Flex justify="center" align="center" gap="4" w="full" wrap="wrap">
        {/* RTL: آیکن leading = اولِ DOM = راستِ متن (طبق فیدبک کاربر). */}
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
          onClick={onCreateNew}
        >
          <Plus size={20} />
          ایجاد سفارش جدید
        </Button>
        <Button
          variant="ghost"
          size="sm"
          h="10"
          px="4"
          rounded="md"
          fontWeight="semibold"
          fontSize="sm"
          color="gray.fg"
          onClick={onGoToList}
        >
          لیست سفارشات
        </Button>
      </Flex>
    </Flex>
  )
}
