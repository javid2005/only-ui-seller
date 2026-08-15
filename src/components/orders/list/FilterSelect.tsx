import { Select, type ListCollection } from '@chakra-ui/react'
import type { FilterOption } from './data'

interface FilterSelectProps {
  collection: ListCollection<FilterOption>
  /** ردیف افقی (FilterBar) — flex:1 0 0 با min/max عرض */
  minW?: string
  maxW?: string
  /** ستون عمودی (FilterModal) — عرض کامل، بدون flex-grow */
  w?: string
  /** حالت uncontrolled (بدون data-binding واقعی) */
  defaultValue?: string
  /** حالت controlled (state واقعی برای بج‌های فیلتر) */
  value?: string
  onValueChange?: (value: string) => void
}

/** Select فیلتر مشترک سفارشات — استفاده در OrderFilterBar/OrderFilterModal (Select فقط، NativeSelect ممنوع). */
export function FilterSelect({ collection, minW, maxW, w, defaultValue, value, onValueChange }: FilterSelectProps) {
  const bindingProps = value !== undefined
    ? { value: [value], onValueChange: (e: { value: string[] }) => onValueChange?.(e.value[0]) }
    : { defaultValue: [defaultValue ?? collection.items[0]?.value ?? ''] }

  const sizingProps = w ? { w } : { flex: '1 0 0', minW, maxW }

  return (
    <Select.Root collection={collection} {...bindingProps} {...sizingProps} size="sm">
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Select.Positioner>
        {/* عرض منو > عرض trigger تا متن‌ها تک‌خطی بمونن */}
        <Select.Content minW="max-content" maxW="360px">
          {collection.items.map((it) => (
            <Select.Item key={it.value} item={it}>
              <Select.ItemText whiteSpace="nowrap">{it.label}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}
