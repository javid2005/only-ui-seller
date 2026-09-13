import { useState } from 'react'
import { Flex, Box, Input, Text, Table, IconButton, Alert, chakra } from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { SectionCard } from './SectionCard'
import type { Attribute, ProductForm } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface SpecsTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
}

let _attrId = 0

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * SpecsTab — مرحلهٔ ۴: «مشخصات محصول».
 *
 * الگوی طرح تأییدشده: یک ردیفِ **افزودن** بالا و یک **جدول** از آنچه اضافه شده،
 * نه فهرستی از ردیف‌های همیشه-قابل-ویرایش. تفاوتش در عمل زیاد است: چشم فهرست
 * مشخصات را یک‌جا می‌خواند و ورودی خالی وسط داده‌ها نمی‌ماند.
 *
 * برچسب‌های محصول هم در طرح **همین مرحله** است، نه مرحلهٔ اول — هر دو «داده‌ای
 * برای پیدا شدن محصول»اند و کنار هم معنا دارند.
 *
 * RTL DOM order ردیف افزودن (first = rightmost): عنوان ← مقدار ← دکمهٔ +.
 */
export function SpecsTab({ form, onChange, onBack, onSave }: SpecsTabProps) {
  const [name, setName] = useState('')
  const [value, setValue] = useState('')
  const [tag, setTag] = useState('')

  const addAttr = () => {
    const n = name.trim()
    const v = value.trim()
    if (!n || !v) return
    const attr: Attribute = { id: `attr_${++_attrId}`, name: n, value: v }
    onChange({ attributes: [...form.attributes, attr] })
    setName(''); setValue('')
  }

  const removeAttr = (id: string) =>
    onChange({ attributes: form.attributes.filter((a) => a.id !== id) })

  const addTag = () => {
    const t = tag.trim()
    if (!t || form.tags.includes(t)) { setTag(''); return }
    onChange({ tags: [...form.tags, t] })
    setTag('')
  }

  const removeTag = (t: string) => onChange({ tags: form.tags.filter((x) => x !== t) })

  return (
    <Flex direction="column" gap="5" w="full">

      <TitleBar title="مشخصات محصول" subtitle="ویژگی‌ها و برچسب‌های محصول" size="xl" divider />

      {/* ═══ مشخصات ═════════════════════════════════════════════════════════════ */}
      <SectionCard
        title="مشخصات محصول"
        subtitle="مشخصات قابل مشاهده و قابل استفاده در فیلتر فروشگاه"
        helpTopic="مشخصات محصول"
      >
        <Flex direction="column" gap="4">

          {/* ردیف افزودن — FIRST = rightmost: عنوان · مقدار · دکمهٔ + چپ‌ترین */}
          <chakra.form
            display="grid"
            gridTemplateColumns={{ base: '1fr', sm: '1fr 1fr auto' }}
            gap="2"
            onSubmit={(e) => { e.preventDefault(); addAttr() }}
          >
            <Input
              size="sm"
              placeholder="عنوان مشخصه، مثلاً برند"
              value={name}
              maxLength={20}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              size="sm"
              placeholder="مقدار، مثلاً سامسونگ"
              value={value}
              maxLength={20}
              onChange={(e) => setValue(e.target.value)}
            />
            <IconButton
              type="submit"
              size="sm"
              colorPalette="brand"
              aria-label="افزودن مشخصه"
              disabled={!name.trim() || !value.trim()}
            >
              <Plus size={16} />
            </IconButton>
          </chakra.form>

          {form.attributes.length === 0 ? (
            <Alert.Root status="info" variant="subtle">
              <Alert.Indicator />
              <Alert.Content>
                <Text fontSize="xs">
                  هنوز مشخصه‌ای اضافه نشده است. عنوان و مقدار را بنویسید و «+» را بزنید.
                </Text>
              </Alert.Content>
            </Alert.Root>
          ) : (
            <Box borderWidth="1px" borderColor="border.muted" rounded="xl" overflow="hidden">
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  {/* FIRST = rightmost: عنوان مشخصه · مقدار · حذف (چپ‌ترین) */}
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader>عنوان مشخصه</Table.ColumnHeader>
                    <Table.ColumnHeader>مقدار</Table.ColumnHeader>
                    <Table.ColumnHeader w="12" />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {form.attributes.map((a, i) => (
                    <Table.Row key={a.id} bg={i % 2 ? 'bg.subtle' : undefined}>
                      <Table.Cell fontSize="xs" fontWeight="medium">{a.name}</Table.Cell>
                      <Table.Cell fontSize="xs" color="fg.muted">{a.value}</Table.Cell>
                      <Table.Cell>
                        <IconButton
                          size="2xs"
                          variant="ghost"
                          colorPalette="red"
                          aria-label={`حذف ${a.name}`}
                          onClick={() => removeAttr(a.id)}
                        >
                          <X size={14} />
                        </IconButton>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table.Root>
            </Box>
          )}

        </Flex>
      </SectionCard>

      {/* ═══ برچسب‌ها — در طرح همین مرحله است ═══════════════════════════════════ */}
      <SectionCard
        title="برچسب‌های محصول"
        subtitle="برچسب را بنویسید و Enter بزنید"
        helpTopic="برچسب‌های محصول"
      >
        {/* FIRST = rightmost: کادر برچسب‌ها · LAST = leftmost: دکمهٔ + */}
        <chakra.form
          display="flex"
          gap="2"
          alignItems="start"
          w="full"
          onSubmit={(e) => { e.preventDefault(); addTag() }}
        >
          <Box
            flex="1"
            minW="0"
            borderWidth="1px"
            borderColor="border"
            rounded="lg"
            bg="bg.panel"
            p="2"
            _focusWithin={{ borderColor: 'brand.solid', boxShadow: '0 0 0 1px var(--chakra-colors-brand-solid)' }}
          >
            {form.tags.length > 0 && (
              <Flex gap="2" wrap="wrap" mb="2">
                {form.tags.map((t) => (
                  <Flex
                    key={t}
                    align="center"
                    gap="1"
                    ps="2.5"
                    pe="1"
                    h="7"
                    rounded="l2"
                    borderWidth="1px"
                    borderColor="border"
                    bg="bg.subtle"
                  >
                    {/* FIRST = rightmost: متن برچسب · X سمت چپ */}
                    <Text fontSize="xs" whiteSpace="nowrap">{t}</Text>
                    <IconButton
                      size="2xs"
                      variant="ghost"
                      colorPalette="red"
                      aria-label={`حذف ${t}`}
                      onClick={() => removeTag(t)}
                    >
                      <X size={12} />
                    </IconButton>
                  </Flex>
                ))}
              </Flex>
            )}
            <Input
              variant="outline"
              border="none"
              px="1"
              h="8"
              fontSize="13px"
              _focusVisible={{ boxShadow: 'none' }}
              placeholder="مثلاً گوشی پرچمدار"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
            />
          </Box>
          <IconButton
            type="submit"
            size="sm"
            colorPalette="brand"
            aria-label="افزودن برچسب"
            disabled={!tag.trim()}
            flexShrink={0}
          >
            <Plus size={16} />
          </IconButton>
        </chakra.form>
      </SectionCard>

      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        back={{ label: 'بازگشت به لیست', onClick: onBack }}
      />

    </Flex>
  )
}
