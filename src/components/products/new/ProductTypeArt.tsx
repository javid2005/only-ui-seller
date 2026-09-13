import { Box, Flex, Text } from '@chakra-ui/react'
import type { BoxProps } from '@chakra-ui/react'
import type { ProductTypeId } from './data'

// ─── ProductTypeArt ─────────────────────────────────────────────────────────────
/**
 * پیش‌نمایشِ کارتِ محصول برای هر نوع.
 *
 * ⚠️ نسخهٔ قبل فقط یک وکتورِ **عمودی** از یک گوشی بود: نه شکلِ کارت محصول را
 * نشان می‌داد و نه چیزی دربارهٔ تفاوت «ساده» و «متنوع» می‌گفت، و چون قدش بلند بود
 * دیالوگ را بی‌دلیل اسکرول‌دار می‌کرد.
 *
 * حالا همان چیزی است که در طرح تأییدشده بود (`.mini-product`): یک کارتِ **افقیِ**
 * کوتاه — تصویر سمت راست، و سمت چپ اسکلتِ عنوان و قیمت. تفاوت دو نوع دقیقاً در
 * ردیف آخر دیده می‌شود:
 *   ساده  → یک نشانِ «آماده فروش»
 *   متنوع → سواچ رنگ‌ها و پیل‌های سایز، یعنی خریدار قبل از خرید انتخاب می‌کند
 *
 * پس کاربر شکلِ نتیجه را می‌بیند، نه یک آیکنِ تزئینی.
 */
export interface ProductTypeArtProps extends Omit<BoxProps, 'children'> {
  type: ProductTypeId
}

/** رنگ‌های اسکلت — دادهٔ تصویرند، نه سطحِ theme-able؛ در dark هم همین‌اند */
const INK = '#cfd8dc'
const PRICE = '#8acdbd'

export function ProductTypeArt({ type, ...rest }: ProductTypeArtProps) {
  const varied = type === 'varied'

  return (
    <Box
      display="grid"
      gridTemplateColumns="86px minmax(0, 1fr)"
      gap="2.5"
      alignItems="center"
      p="2"
      minH="112px"
      rounded="11px"
      borderWidth="1px"
      borderColor="border.muted"
      bg="bg.subtle"
      {...rest}
    >
      {/* FIRST = rightmost: تصویرِ کالا (اسکلتِ انتزاعی) */}
      <Box
        h="92px"
        rounded="8px"
        overflow="hidden"
        bgGradient="to-bl"
        gradientFrom={varied ? 'blue.subtle' : 'brand.subtle'}
        gradientTo="bg.panel"
        display="grid"
        placeItems="center"
      >
        <Box
          w="46px"
          h="62px"
          rounded="6px"
          bgGradient="to-b"
          gradientFrom={varied ? 'blue.emphasized' : 'brand.emphasized'}
          gradientTo={varied ? 'blue.muted' : 'brand.muted'}
        />
      </Box>

      {/* SECOND = چپ: اسکلتِ متنِ کارت */}
      <Box minW="0">
        <Box h="7px" w="80%" rounded="5px" bg={INK} mb="2" />
        <Box h="7px" w="52%" rounded="5px" bg={PRICE} mb="2.5" />

        {varied ? (
          <Flex direction="column" gap="1.5">
            {/* FIRST = rightmost: سواچ رنگ‌ها */}
            <Flex gap="1">
              <Box w="17px" h="11px" rounded="4px" bg="#333" />
              <Box w="17px" h="11px" rounded="4px" bg="#f3f3f3" borderWidth="1px" borderColor="#dfe4e6" />
              <Box w="17px" h="11px" rounded="4px" bg="#5d8fc8" />
            </Flex>
            <Flex gap="1">
              <Flex minW="30px" h="16px" px="1" rounded="4px" bg="#e4eaec" align="center" justify="center">
                <Text fontSize="7px" color="#5d6970">M</Text>
              </Flex>
              <Flex minW="30px" h="16px" px="1" rounded="4px" bg="#e4eaec" align="center" justify="center">
                <Text fontSize="7px" color="#5d6970">L</Text>
              </Flex>
            </Flex>
          </Flex>
        ) : (
          <Flex align="center" gap="1.5" mt="1.5">
            {/* FIRST = rightmost: نقطهٔ وضعیت */}
            <Box boxSize="7px" rounded="full" bg="brand.solid" flexShrink={0} />
            <Text fontSize="9px" color="fg.muted">آماده فروش</Text>
          </Flex>
        )}
      </Box>
    </Box>
  )
}
