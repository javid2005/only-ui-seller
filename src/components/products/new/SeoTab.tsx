import { Flex, Text, Alert } from '@chakra-ui/react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { SectionCard } from './SectionCard'
import type { ProductForm } from './data'

export interface SeoTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
}

/**
 * SeoTab — مرحلهٔ ۶: «سئو و انتشار».
 *
 * این مرحله در چک‌پوینت بعدی ساخته می‌شود (امتیاز سئو، فهرست هشدارها با پرش به
 * فیلد مربوط، و دکمهٔ تولید خودکار از فیلدهای محصول). فعلاً جای خودش را در استپر
 * می‌گیرد تا ساختار شش‌مرحله‌ای کامل باشد.
 */
export function SeoTab({ onBack, onSave }: SeoTabProps) {
  return (
    <Flex direction="column" gap="5" w="full">
      <TitleBar title="سئو و انتشار" subtitle="عنوان، توضیحات و وضعیت انتشار محصول" size="xl" divider />

      <SectionCard title="امتیاز سئو" subtitle="بررسی عنوان، توضیحات و تصاویر برای دیده‌شدن در جست‌وجو">
        <Alert.Root status="info" variant="subtle">
          <Alert.Indicator />
          <Alert.Content>
            <Text fontSize="xs">
              این مرحله در چک‌پوینت بعدی ساخته می‌شود: امتیاز سئو، فهرست هشدارها با پرش
              مستقیم به فیلد مربوط، و تولید خودکار توضیحات از اطلاعات محصول.
            </Text>
          </Alert.Content>
        </Alert.Root>
      </SectionCard>

      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        back={{ label: 'بازگشت به لیست', onClick: onBack }}
      />
    </Flex>
  )
}
