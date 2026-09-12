import { Flex, Grid, Input, Text, Button, IconButton, Alert } from '@chakra-ui/react'
import { Plus, Trash2 } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { SectionCard, Panel } from './SectionCard'
import { NotchedField, bareControl } from './NotchedField'
import type { Attribute, ProductForm } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface SpecsTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
}

let _attrId = 0
const newAttr = (): Attribute => ({ id: `attr_${++_attrId}`, name: '', value: '' })

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * SpecsTab — مرحلهٔ ۴: «مشخصات محصول».
 *
 * ویژگی‌های داینامیک (نام/مقدار) که قبلاً بخشی از تب اطلاعات بودند و در طرح
 * تأییدشده مرحلهٔ مستقل خودشان را دارند.
 *
 * RTL DOM order هر ردیف (first = rightmost): نام ویژگی ← مقدار ← حذف (چپ‌ترین).
 */
export function SpecsTab({ form, onChange, onBack, onSave }: SpecsTabProps) {
  const addAttr = () => onChange({ attributes: [...form.attributes, newAttr()] })
  const removeAttr = (id: string) =>
    onChange({ attributes: form.attributes.filter((a) => a.id !== id) })
  const patchAttr = (id: string, patch: Partial<Attribute>) =>
    onChange({ attributes: form.attributes.map((a) => (a.id === id ? { ...a, ...patch } : a)) })

  return (
    <Flex direction="column" gap="5" w="full">

      <TitleBar
        title="مشخصات محصول"
        subtitle="ویژگی‌های اختصاصی این محصول"
        size="xl"
        divider
      />

      <SectionCard
        title="ویژگی های محصول"
        subtitle="ویژگی‌های اختصاصی این محصول را وارد کنید. (حداکثر ۲۰ کاراکتر)"
        help="این ویژگی‌ها در جدول مشخصات صفحهٔ محصول نمایش داده می‌شوند."
        actions={
          <Button
            size="sm"
            variant="outline"
            colorPalette="brand"
            onClick={addAttr}
            disabled={!form.category}
          >
            {/* FIRST = rightmost: آیکن */}
            <Plus size={16} />افزودن ویژگی
          </Button>
        }
      >
        {form.attributes.length === 0 ? (
          <Alert.Root status="info" variant="subtle">
            <Alert.Indicator />
            <Alert.Content>
              <Text fontSize="xs">
                ابتدا دسته‌بندی محصول را انتخاب کنید تا ویژگی‌های پیش‌فرض بارگذاری شوند.
              </Text>
            </Alert.Content>
          </Alert.Root>
        ) : (
          <Panel tinted>
            <Flex direction="column" gap="3">
              {form.attributes.map((attr) => (
                <Grid key={attr.id} templateColumns="1fr 1fr auto" gap="3" alignItems="start">
                  <NotchedField label="نام ویژگی">
                    <Input
                      {...bareControl}
                      placeholder="نام ویژگی"
                      value={attr.name}
                      maxLength={20}
                      onChange={(e) => patchAttr(attr.id, { name: e.target.value })}
                    />
                  </NotchedField>
                  <NotchedField label="مقدار">
                    <Input
                      {...bareControl}
                      placeholder="مقدار"
                      value={attr.value}
                      maxLength={20}
                      onChange={(e) => patchAttr(attr.id, { value: e.target.value })}
                    />
                  </NotchedField>
                  {/* LAST = leftmost: حذف */}
                  <IconButton
                    aria-label="حذف ویژگی"
                    variant="outline"
                    colorPalette="red"
                    size="md"
                    onClick={() => removeAttr(attr.id)}
                  >
                    <Trash2 size={16} />
                  </IconButton>
                </Grid>
              ))}
            </Flex>
          </Panel>
        )}
      </SectionCard>

      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        back={{ label: 'بازگشت به لیست', onClick: onBack }}
      />

    </Flex>
  )
}
