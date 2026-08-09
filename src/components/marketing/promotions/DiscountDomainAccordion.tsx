'use client'

import { Badge, Box, Button, Checkbox, Flex, IconButton, Separator, Text } from '@chakra-ui/react'
import { ChevronDown, ChevronUp, Plus, Trash2, X } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'

/**
 * DiscountDomainAccordion — Figma local component «DiscountDomain-Accordion»
 * (node 5171:81109، variants: selected=false/true/Selected3 × open × badge × chevron).
 *
 * رفتار (طبق توضیح کاربر):
 * - کلیک روی چک‌باکس/عنوان → انتخاب + باز شدن دامنه (select همیشه auto-open می‌کند)
 * - دامنهٔ انتخاب‌شدهٔ بدون داده → متن EmptyState
 * - chevron همیشه در حالت open نمایش داده می‌شود (برای جمع‌کردن)، یا وقتی بسته ولی hasData
 *   (برای بازکردن دوباره) — تأیید کاربر در این جلسه، چون طرح (فریم Empty) خودِ حالت
 *   open+بدون‌داده هم chevron-up نشان می‌داد.
 * - badge (تعداد انتخاب‌شده) فقط وقتی hasData
 *
 * چیدمان (تأییدشده با مقایسهٔ preview و screenshot طرح):
 *   header → [چک‌باکس + عنوان (راست) , بج + chevron (چپ)]   justifyContent="space-between"
 */
export interface DiscountDomainAccordionProps {
  title: string
  selected: boolean
  open: boolean
  hasData: boolean
  badgeText?: string
  onToggleSelected: () => void
  onToggleOpen: () => void
  children?: React.ReactNode
}

export function DiscountDomainAccordion({
  title, selected, open, hasData, badgeText, onToggleSelected, onToggleOpen, children,
}: DiscountDomainAccordionProps) {
  const isOpenSelected = selected && open
  const showChevron = open || hasData
  // فقط وقتی hasData می‌تونه با کلیک روی هدر بسته/باز بشه — دامنهٔ انتخاب‌شدهٔ بدون‌داده
  // نباید بتونه به حالت «بسته + بدون chevron» برسه (dead-end: هیچ راهی برای بازکردن دوباره
  // نمی‌مونه جز uncheck/recheck). گزارش کاربر 1404/05/09: دقیقاً همین حالت رخ داد.
  const canToggleOpen = hasData

  return (
    <Box
      w="full"
      rounded="lg"
      borderWidth="1px"
      /* teal در هر حالت انتخاب‌شده (چه باز چه بسته) — نه فقط باز */
      borderColor={selected ? 'brand.focusRing' : 'border'}
      /* همیشه — وگرنه bg تیل هدر از گوشهٔ گرد بیرون می‌زند */
      overflow="hidden"
      bg="bg.panel"
    >
      {selected ? (
        <Box
          as="button"
          w="full"
          p="4"
          bg="brand.bg"
          /* هدر border دور خودش ندارد (دو خط موازی می‌شد) — فقط وقتی باز است یک خط
             جداکننده زیرش، مطابق variantهای کامپوننت فیگما (node 5171:81109) */
          borderBottomWidth={isOpenSelected ? '1px' : '0'}
          borderColor="brand.focusRing"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          cursor="pointer"
          onClick={() => canToggleOpen && onToggleOpen()}
        >
          {/* FIRST = rightmost: چک‌باکس + عنوان */}
          <Flex
            align="center"
            gap="4"
            onClick={(e) => e.stopPropagation()}
          >
            <Checkbox.Root
              checked={selected}
              onCheckedChange={onToggleSelected}
              colorPalette="brand"
              size="md"
              cursor="pointer"
            >
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
            <Text fontSize="sm" fontWeight="semibold" color="brand.fg">{title}</Text>
          </Flex>

          {/* SECOND = leftmost: بج تعداد + chevron */}
          <Flex align="center" gap="4">
            {hasData && (
              <Badge colorPalette="brand" variant="subtle" size="sm">{badgeText}</Badge>
            )}
            {showChevron && (open ? <ChevronUp size={20} /> : <ChevronDown size={20} />)}
          </Flex>
        </Box>
      ) : (
        <Flex
          w="full"
          p="4"
          /* راست (justify="start"=راست در RTL) — قبلاً end بود و چک‌باکس+عنوان چپ می‌افتاد */
          justify="start"
          align="center"
          cursor="pointer"
          onClick={onToggleSelected}
        >
          <Flex align="center" gap="4">
            <Checkbox.Root checked={false} colorPalette="brand" size="md" cursor="pointer" pointerEvents="none">
              <Checkbox.HiddenInput />
              <Checkbox.Control />
            </Checkbox.Root>
            <Text fontSize="sm" fontWeight="semibold" color="fg">{title}</Text>
          </Flex>
        </Flex>
      )}

      {isOpenSelected && (
        <Box p="4" w="full">
          {children}
        </Box>
      )}
    </Box>
  )
}

/**
 * یک گروه از مقادیر انتخاب‌شدهٔ یک دامنه.
 * دامنه‌های تخت (محصول/مشتری) یک گروه با عنوان «انتخاب شده» دارند؛ دامنه‌های سلسله‌مراتبی
 * (دسته‌بندی/موقعیت) یک گروه به‌ازای هر والد — عیناً مطابق فریم Selected (node 5171:81668):
 * «کالای دیجیتال و لوازم الکترونیکی» با ۶ زیرچیپ، «استان تهران» با ۳ شهر، …
 */
export interface DiscountDomainGroup {
  id: string
  /** عنوان گروه — TitleBar سایز md (دستور کاربر) */
  title: string
  items: string[]
  /**
   * تعداد واقعیِ این گروه برای محاسبهٔ بجِ هدر — وقتی یک چیپ نمایندهٔ چند مورد است
   * (مثل «همه شهرها» که در طرح ۶ شهر استان فارس را نمایندگی می‌کند و بج کل «۹ شهر» می‌شود).
   * نداده باشی = items.length.
   */
  count?: number
}

/**
 * محتوای یک دامنهٔ لیستی — به‌ازای هر گروه: TitleBar (عنوان راست، IconButton سطل‌زباله چپ)
 * + ردیف چیپ‌های قابل‌حذف. در پایان Separator + دکمهٔ «افزودن …» (فعلاً غیرفعال؛ دیالوگ
 * مخصوص هر دامنه بعداً wire می‌شود — تصمیم کاربر).
 *
 * جهت: کل ستون `alignItems="start"` = راست در RTL. (قبلاً `end` بود → «انتخاب شده» چپ
 * می‌افتاد؛ با مقایسهٔ preview و طرح در 1404/05/09 کشف شد — چشمی درست به‌نظر می‌رسید چون
 * چیپ‌ها w="full" داشتند و فقط همین یک برچسبِ کوتاه جابه‌جا می‌شد.)
 */
export function DiscountDomainListContent({
  groups, emptyText, addLabel, onRemoveItem, onRemoveGroup,
}: {
  groups: DiscountDomainGroup[]
  emptyText: string
  addLabel: string
  onRemoveItem: (groupId: string, item: string) => void
  onRemoveGroup: (groupId: string) => void
}) {
  const isEmpty = groups.every((g) => g.items.length === 0)

  return (
    <Flex direction="column" gap="4" alignItems="start" w="full">
      {isEmpty ? (
        <Flex justify="center" py="2" w="full">
          <Text fontSize="sm" color="fg.muted" textAlign="center" flex="1">{emptyText}</Text>
        </Flex>
      ) : (
        groups.map((group) => (
          <Flex key={group.id} direction="column" gap="2" alignItems="start" w="full">
            <TitleBar
              title={group.title}
              size="md"
              cta={
                <IconButton
                  aria-label={`حذف ${group.title}`}
                  variant="ghost"
                  size="sm"
                  colorPalette="red"
                  onClick={() => onRemoveGroup(group.id)}
                >
                  <Trash2 size={16} />
                </IconButton>
              }
            />
            {/* چیپ‌ها به راست می‌چسبن — justify="start" = راست در RTL (مطابق SelectedLocationsPanel.tsx) */}
            <Flex gap="2" wrap="wrap" justify="start" w="full">
              {group.items.map((item) => (
                <Badge
                  key={item}
                  colorPalette="gray"
                  variant="subtle"
                  size="md"
                  gap="1.5"
                  cursor="pointer"
                  onClick={() => onRemoveItem(group.id, item)}
                >
                  {/* متن FIRST=راست‌تر، × SECOND=چپ‌تر */}
                  {item}
                  <X size={14} />
                </Badge>
              ))}
            </Flex>
          </Flex>
        ))
      )}

      <Separator w="full" />

      {/* دکمهٔ افزودن هم‌سمتِ چک‌باکس/عنوانه (راست) — justify="start"=راست، نه end */}
      <Flex justify="start" w="full">
        <Button variant="outline" colorPalette="brand" size="sm" disabled>
          <Plus size={16} />
          {addLabel}
        </Button>
      </Flex>
    </Flex>
  )
}
