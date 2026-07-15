import { useState } from 'react'
import { Flex, Separator, Text, Link } from '@chakra-ui/react'
import { Headset, TriangleAlert } from 'lucide-react'
import { focusVisibleOnly } from '@/components/auth/AuthLayout'
import { RulesDialog } from '@/components/ui/RulesDialog'

interface AuthFooterProps {
  /** ردیف «تماس با پشتیبانی | قوانین و مقررات» — پیش‌فرض نمایش داده می‌شه */
  showLinks?: boolean
  maxW?: string
}

export function AuthFooter({ showLinks = true, maxW = '1242px' }: AuthFooterProps) {
  const [rulesOpen, setRulesOpen] = useState(false)

  return (
    <Flex
      direction={{ base: 'column', md: 'row' }}
      align="center"
      justify={{ base: 'center', md: showLinks ? 'space-between' : 'center' }}
      gap={{ base: '2', md: '4' }}
      maxW={maxW}
      w="full"
      px="4"
    >
      {/* لینک‌ها — راست در دسکتاپ (RTL: FIRST در DOM = راست)، ردیف بالا در موبایل */}
      {showLinks && (
        <Flex gap="4" align="center" justify="center" wrap="wrap">
          {/* آیکون FIRST در DOM = راست (قرارداد پروژه) */}
          <Link href="#" variant="plain" display="flex" gap="1" alignItems="center" px="2" py="0.5" borderRadius="l2" fontSize="xs" fontWeight="medium" color="gray.fg" {...focusVisibleOnly}>
            <Headset size={14} />
            تماس با پشتیبانی
          </Link>
          <Separator orientation="vertical" h="5" />
          <Link
            href="#"
            variant="plain"
            display="flex"
            gap="1"
            alignItems="center"
            px="2"
            py="0.5"
            borderRadius="l2"
            fontSize="xs"
            fontWeight="medium"
            color="gray.fg"
            onClick={(e) => { e.preventDefault(); setRulesOpen(true) }}
            {...focusVisibleOnly}
          >
            <TriangleAlert size={14} />
            قوانین و مقررات
          </Link>
        </Flex>
      )}

      <RulesDialog open={rulesOpen} onClose={() => setRulesOpen(false)} />

      {/* نوشته‌های حقوقی — چپ در دسکتاپ، ردیف پایین در موبایل */}
      <Flex gap="4" align="center" justify="center" fontSize="xs" color="fg.muted" wrap="wrap">
        <Text lineHeight="1.333" textAlign="center">تمامی حقوق مادی و معنوی ویترینا مربوط به آکادمی معین فرجی می‌باشد.</Text>
        <Text lineHeight="1.333" textAlign="center">|</Text>
        <Text lineHeight="1.333" textAlign="center">
          {'طراحی و توسعه توسط '}
          <Link href="https://Sepehr.it" target="_blank" rel="noreferrer" variant="underline" colorPalette="brand" {...focusVisibleOnly}>
            سپهر
          </Link>
        </Text>
      </Flex>
    </Flex>
  )
}
