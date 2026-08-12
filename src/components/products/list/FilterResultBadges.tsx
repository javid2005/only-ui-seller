import { Button, Flex, Text } from '@chakra-ui/react'
import { X } from 'lucide-react'

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
        <Flex
          key={f.key}
          as="button"
          onClick={() => onRemove(f.key)}
          align="center" gap="1.5" h="6" px="2"
          bg="gray.subtle" color="gray.fg" rounded="l2" fontSize="sm" flexShrink={0}
          cursor="pointer"
        >
          {f.label}
          <X size={14} />
        </Flex>
      ))}

      <Button variant="ghost" size="2xs" color="red.fg" fontWeight="medium" onClick={onClearAll} flexShrink={0}>
        حذف فیلترها
      </Button>
    </Flex>
  )
}
