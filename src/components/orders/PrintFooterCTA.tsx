import { Flex, Button } from '@chakra-ui/react'
import { Printer, ArrowRight } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import { MOCK_ORDER } from './orderData'

/**
 * PrintFooterCTA — نوار اکشن زیر فرم‌های پرینت (Figma: Footer CTA — node 3912:42532).
 * در هر دو صفحه «پرینت برچسب» و «پرینت فاکتور» استفاده می‌شود.
 *
 * RTL (justify-between): بازگشت اولِ DOM = راست · دکمه‌ی پرینت آخر = چپ.
 * چاپ نمی‌شود — className="print-cta" در بلوک @media print صفحه `display:none` می‌گیرد.
 */
interface PrintFooterCTAProps {
  /** متن دکمه‌ی پرینت — مثل «پرینت برچسب» یا «پرینت فاکتور» */
  printLabel: string
  /** هندلر پرینت (window.print) */
  onPrint: () => void
}

export function PrintFooterCTA({ printLabel, onPrint }: PrintFooterCTAProps) {
  const router = useRouter()
  const params = useParams()
  const orderId = (params?.orderId as string) ?? MOCK_ORDER.code

  return (
    <Flex
      className="print-cta"
      align="center"
      justify="space-between"
      gap="4"
      w="full"
      p="6"
      rounded="2xl"
      borderWidth="1px"
      borderColor="border"
      bg="bg.panel"
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
        onClick={() => router.push(`/orders/${orderId}`)}
      >
        <ArrowRight size={20} />
        بازگشت
      </Button>

      {/* پرینت — RTL: آخرِ DOM = چپ · آیکن leading = راستِ متن */}
      <Button
        bg="brand.solid"
        color="brand.contrast"
        size="sm"
        h="9"
        px="3.5"
        rounded="md"
        fontWeight="semibold"
        fontSize="sm"
        _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
        onClick={onPrint}
      >
        <Printer size={16} />
        {printLabel}
      </Button>
    </Flex>
  )
}
