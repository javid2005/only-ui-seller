'use client'

import { Box, Flex } from '@chakra-ui/react'
import { LocationTreeView } from './LocationTreeView'
import { SelectedLocationsPanel } from './SelectedLocationsPanel'
import { locationsCollection } from './locations'

export interface FreeShippingGeoSectionProps {
  checkedValue: string[]
  onCheckedChange: (checkedValue: string[]) => void
}

/**
 * دو ستونِ «موقعیت جغرافیایی» — Figma node 2724:40293 (Container 928×456، دو فرزند 456px).
 * از متادیتای طرح: Treeview x=472 (راست‌تر) ← Selected x=0 (چپ‌تر) — یعنی در RTL واقعی، ستون
 * درخت باید FIRST=راست‌ترین باشه، ستون انتخاب‌شده‌ها SECOND=چپ‌ترین — دقیقاً همون‌طور که کاربر
 * توضیح داد: «ستون سمت راست شامل chakra treeview است».
 *
 * هر دو ستون داخل یک Container مشترک با border (طبق فیدبک کاربر) — نه دو باکس جدا با border
 * مستقل؛ عرض دو ستون با flex="1" مساوی، بدون separator بینشون.
 *
 * media<lg: ستون‌ها زیر هم (مثل موبایل) با ارتفاع ثابت ۴۰۰px و اسکرول عمودی داخلی؛
 * lg+: کنار هم با همون ۴۵۶px قبلی (دسکتاپ).
 */
export function FreeShippingGeoSection({ checkedValue, onCheckedChange }: FreeShippingGeoSectionProps) {
  return (
    <Box borderWidth="1px" borderColor="border" rounded="lg" p="4" w="full">
      <Flex gap="4" align="stretch" direction={{ base: 'column', lg: 'row' }}>
        {/* Treeview — FIRST = راست‌ترین */}
        {/* flex="1" با flex-basis:0% کار می‌کنه — زیر lg که والد Flex(column) خودش ارتفاع معین
            نداره، flex-grow چیزی برای پر کردن نداره و h صریح عملاً نادیده گرفته می‌شه (باکس با
            محتوا رشد می‌کنه، نه با h). راه‌حل: زیر lg اصلاً flex نده — فقط h ثابت + flexShrink={0}
            کافیه چون هر دو ستون به‌صورت block زیر هم قرار می‌گیرن، نیازی به grow/shrink نیست. */}
        <Box flex={{ base: 'none', lg: '1' }} flexShrink={0} minW="0" minH="0" h={{ base: '400px', lg: '456px' }}>
          <LocationTreeView
            collection={locationsCollection}
            checkedValue={checkedValue}
            onCheckedChange={onCheckedChange}
          />
        </Box>

        {/* Selected — SECOND = چپ‌ترین */}
        <Box flex={{ base: 'none', lg: '1' }} flexShrink={0} minW="0" minH="0" h={{ base: '400px', lg: '456px' }}>
          <SelectedLocationsPanel checkedValue={checkedValue} onCheckedChange={onCheckedChange} />
        </Box>
      </Flex>
    </Box>
  )
}
