import { Button, Field, Flex, Input } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'

interface DiscountCodeFormProps {
  value: string
  onChange: (value: string) => void
  onApply: () => void
  error?: string
  /** true وقتی تخفیفی (دستی یا از لیست) همین الان اعمال شده — فیلد و دکمه قفل می‌شوند تا با «حذف تخفیف» باز شوند */
  disabled?: boolean
}

/**
 * DiscountCodeForm — «ورود دستی کد تخفیف» (Figma node 2143:86411).
 * RTL: Input اولِ DOM = راست (flex="1"، عریض‌تر) · دکمهٔ «اعمال کد» آخر = چپ
 * (بر اساس x-metadata: Input x=98..622 عریض‌تر و راست‌تر از Button x=0..82).
 */
export function DiscountCodeForm({ value, onChange, onApply, error, disabled = false }: DiscountCodeFormProps) {
  return (
    <Flex
      direction="column"
      gap="6"
      w="full"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
    >
      <TitleBar title="ورود دستی کد تخفیف" subtitle="کد تخفیف دیگری دارید؟ اینجا وارد کنید." divider />

      <Flex align="flex-start" gap="4" w="full">
        <Field.Root flex="1" invalid={Boolean(error)}>
          <Input
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="کد تخفیف را وارد کنید..."
            textAlign="right"
            bg="bg.panel"
            disabled={disabled}
          />
          {error && <Field.ErrorText>{error}</Field.ErrorText>}
        </Field.Root>

        <Button
          variant="outline"
          colorPalette="brand"
          h="10"
          flexShrink={0}
          onClick={onApply}
          disabled={disabled || !value.trim()}
        >
          اعمال کد
        </Button>
      </Flex>
    </Flex>
  )
}
