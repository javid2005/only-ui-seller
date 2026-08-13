import { Button, Flex, Tag, Text } from '@chakra-ui/react'

export interface ActiveFilter {
  key: string
  label: string
}

interface FilterResultBadgesProps {
  filters: ActiveFilter[]
  onRemove: (key: string) => void
  onClearAll: () => void
}

/**
 * ردیف بج‌های فیلتر اعمال‌شده — زیر ردیف فیلترها، فقط وقتی ≥۱ فیلتر/جستجو فعاله نشون داده می‌شه.
 * هر بج = Chakra `Tag` (chakra-ui.com/docs/components/tag)، size="md"، closable
 * (Tag.CloseTrigger) — طبق درخواست کاربر، به‌جای Flex/Box دستی قبلی.
 * RTL DOM order (اولین=راست‌ترین، تأیید شده با screenshot مجزای Figma node 5198:88601):
 * برچسب «فیلترها:» → بج‌ها (داخل هر بج: متن FIRST=راست، × بعدش=چپ) → دکمهٔ «حذف فیلترها» (چپ‌ترین).
 * RTL justify: کل ردیف باید چسبیده به لبهٔ راست صفحه باشه (justify="start") نه چپ —
 * تأیید شده با اندازه‌گیری DOM روی preview (قبلاً justify="end" بود، محتوا رو به لبهٔ چپ می‌چسبوند).
 */
export function FilterResultBadges({ filters, onRemove, onClearAll }: FilterResultBadgesProps) {
  if (filters.length === 0) return null

  return (
    <Flex align="center" justify="start" gap="2" flexWrap="wrap">
      <Text fontSize="sm" color="fg" flexShrink={0}>فیلترها:</Text>

      {filters.map((f) => (
        <Tag.Root key={f.key} size="md" variant="subtle" colorPalette="gray" flexShrink={0}>
          <Tag.Label>{f.label}</Tag.Label>
          <Tag.EndElement>
            <Tag.CloseTrigger onClick={() => onRemove(f.key)} />
          </Tag.EndElement>
        </Tag.Root>
      ))}

      <Button variant="ghost" size="2xs" color="red.fg" fontWeight="medium" onClick={onClearAll} flexShrink={0}>
        حذف فیلترها
      </Button>
    </Flex>
  )
}
