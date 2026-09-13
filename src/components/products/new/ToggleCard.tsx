import type { ReactNode } from 'react'
import { Flex, Box, Text, Switch } from '@chakra-ui/react'

// ─── ToggleCard ─────────────────────────────────────────────────────────────────
/**
 * کارت یک وضعیت on/off — الگوی «وضعیت نمایش و فروش» در طرح تأییدشده.
 *
 * چرا کارت و نه یک سوییچ ساده در ردیف: هر کدام از این‌ها یک تصمیم مستقل با اثر
 * متفاوت روی فروشگاه است، و متن توضیح زیرش همان اثر را می‌گوید. کارت مرز هر تصمیم
 * را روشن می‌کند.
 *
 * RTL DOM order (first = rightmost): سوییچ ← عنوان + آیکن ← توضیح زیرشان.
 */
export interface ToggleCardProps {
  icon: ReactNode
  label: string
  /** توضیح اثر این وضعیت — زیر عنوان */
  hint: string
  checked: boolean
  onChange: (checked: boolean) => void
  /** ته‌رنگ کهربایی — در طرح فقط «پیشنهاد ویژه» این حالت را دارد */
  accent?: boolean
  disabled?: boolean
}

export function ToggleCard({
  icon, label, hint, checked, onChange, accent, disabled,
}: ToggleCardProps) {
  return (
    <Flex
      direction="column"
      gap="2"
      p="4"
      rounded="lg"
      borderWidth="1px"
      borderColor={accent ? 'orange.muted' : 'border'}
      bg={accent ? 'orange.bg' : 'bg.panel'}
      opacity={disabled ? 0.6 : 1}
      w="full"
      minW="0"
    >
      <Flex align="center" gap="2.5" w="full">
        {/* FIRST = rightmost: سوییچ */}
        <Switch.Root
          size="sm"
          colorPalette={accent ? 'orange' : 'brand'}
          checked={checked}
          onCheckedChange={(e) => onChange(e.checked)}
          disabled={disabled}
          flexShrink={0}
        >
          <Switch.HiddenInput />
          <Switch.Control><Switch.Thumb /></Switch.Control>
        </Switch.Root>

        <Text fontSize="sm" fontWeight="medium" color="fg" flex="1" textAlign="start" truncate>
          {label}
        </Text>

        {/* LAST = leftmost: آیکن */}
        <Box color={accent ? 'orange.fg' : 'fg.muted'} flexShrink={0}>{icon}</Box>
      </Flex>

      <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
        {hint}
      </Text>
    </Flex>
  )
}
