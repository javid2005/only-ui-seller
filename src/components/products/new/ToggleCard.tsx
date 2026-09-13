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
 * RTL DOM order (first = rightmost): **آیکن ← عنوان … سوییچ (چپ‌ترین)**.
 *
 * ⚠️ این یک **استثنا**ی عمدی بر الگوی «Switch اول» در CLAUDE.md است و از
 * اندازه‌گیری خود طرح تأییدشده آمده: در `.status-top` طرح، بلوک آیکن+عنوان
 * (`.status-action`) در لبهٔ راست کارت است و سوییچ در لبهٔ چپ. بدون این کامنت،
 * بازبینِ بعدی آن را «باگ جهت» می‌بیند و برعکسش می‌کند.
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
      gap="1.5"
      p="11px"
      rounded="9px"
      borderWidth="1px"
      borderColor={accent ? 'orange.muted' : 'border'}
      bg={accent ? 'orange.bg' : 'bg.panel'}
      opacity={disabled ? 0.6 : 1}
      w="full"
      minW="0"
    >
      <Flex align="center" gap="2" w="full">
        {/* FIRST = rightmost: آیکن (← طرح: آیکن و عنوان با هم در لبهٔ راست) */}
        <Box color={accent ? 'orange.fg' : 'fg.muted'} flexShrink={0} display="flex">{icon}</Box>

        <Text fontSize="sm" fontWeight="medium" color="fg" textAlign="start" truncate minW="0">
          {label}
        </Text>

        <Box flex="1" minW="2" />

        {/* LAST = leftmost: سوییچ */}
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
      </Flex>

      <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
        {hint}
      </Text>
    </Flex>
  )
}
