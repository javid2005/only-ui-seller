import { useState } from 'react'
import { Flex, Box, Input, Text, Table, IconButton, Alert, chakra } from '@chakra-ui/react'
import { Plus, X } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { StepVideoButton } from './StepVideo'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { SectionCard } from './SectionCard'
import type { Attribute, ProductForm } from './data'
import { attributesForCategory, exampleOf } from './categoryKnowledge'
import { SuggestInput } from './SuggestInput'
import { enterItem } from './motion'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface SpecsTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
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
export function SpecsTab({ form, onChange, onSave }: SpecsTabProps) {
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

  /** ویرایش درجا — همان جدول، بدون دیالوگ و بدون حالتِ «ویرایش» */
  const patchAttr = (id: string, patch: Partial<Attribute>) =>
    onChange({ attributes: form.attributes.map((a) => (a.id === id ? { ...a, ...patch } : a)) })

  const addTag = () => {
    const t = tag.trim()
    if (!t || form.tags.includes(t)) { setTag(''); return }
    onChange({ tags: [...form.tags, t] })
    setTag('')
  }

  const removeTag = (t: string) => onChange({ tags: form.tags.filter((x) => x !== t) })

  const allAttrs = attributesForCategory(form.category)
  const attrTitles = allAttrs.map((a) => a.title)
  const attrSuggestions = allAttrs.filter((a) => !form.attributes.some((x) => x.name === a.title))

  /** مقادیر پیشنهادی یک مشخصه — با تطبیق نرم، چون عنوان ممکن است دست‌نویس باشد */
  const valuesOfAttr = (title: string) => {
    const t = title.trim()
    if (!t) return []
    const hit = allAttrs.find((a) => a.title === t)
      ?? allAttrs.find((a) => t.includes(a.title) || a.title.includes(t))
    return hit?.values ?? []
  }

  return (
    <Flex direction="column" gap="5" w="full">

      <TitleBar title="مشخصات محصول" subtitle="ویژگی‌ها و برچسب‌های محصول" size="xl" cta={<StepVideoButton step="specs" title="مشخصات محصول" />} />

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
            // هم‌تراز با ستون‌های جدول پایین: دو نیمهٔ مساوی + ستون ۴۴px
            gridTemplateColumns={{ base: '1fr', sm: 'minmax(0, 1fr) minmax(0, 1fr) 44px' }}
            gap="2"
            onSubmit={(e) => { e.preventDefault(); addAttr() }}
          >
            {/* عنوان و مقدار هر دو از درخت دانشِ دسته‌بندی پیشنهاد می‌گیرند؛
                انتخاب یک عنوان، نمونه‌مقدارش را هم در فیلد کناری می‌گذارد تا
                کاربر ببیند چه شکلی از مقدار انتظار می‌رود. */}
            <SuggestInput
              size="sm"
              placeholder={`عنوان مشخصه، مثلاً ${attrSuggestions[0]?.title ?? 'برند'}`}
              value={name}
              maxLength={20}
              onChange={setName}
              suggestions={attrSuggestions.map((a) => a.title)}
              onPick={(title) => {
                setName(title)
                const hit = attrSuggestions.find((a) => a.title === title)
                if (hit && !value.trim()) setValue(exampleOf(hit))
              }}
            />
            <SuggestInput
              size="sm"
              placeholder={`مقدار، مثلاً ${attrSuggestions[0] ? exampleOf(attrSuggestions[0]) : 'سامسونگ'}`}
              value={value}
              maxLength={20}
              onChange={setValue}
              suggestions={valuesOfAttr(name)}
            />
            <IconButton
              type="submit"
              size="sm"
              w="44px"
              minW="44px"
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
            <Box
              borderWidth="1px"
              borderColor="border"
              rounded="10px"
              overflow="hidden"
              css={{
                '& th': { height: '38px', paddingInline: '11px', fontSize: '11px', fontWeight: 700 },
                '& td': { paddingBlock: '5px', paddingInline: '8px' },
              }}
            >
              <Table.Root size="sm" variant="line">
                <Table.Header>
                  {/* FIRST = rightmost: عنوان مشخصه · مقدار · حذف (چپ‌ترین) */}
                  <Table.Row bg="bg.subtle">
                    <Table.ColumnHeader w="50%">عنوان مشخصه</Table.ColumnHeader>
                    <Table.ColumnHeader w="50%">مقدار</Table.ColumnHeader>
                    <Table.ColumnHeader w="44px" />
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {form.attributes.map((a, i) => (
                    <Table.Row key={a.id} bg={i % 2 ? 'bg.subtle' : undefined}>
                      {/* ویرایش درجا: خودِ سلول یک ورودی بی‌کادر است. کاربر برای
                          اصلاح یک غلط تایپی نباید ردیف را حذف و دوباره بسازد. */}
                      <Table.Cell>
                        <SuggestInput
                          value={a.name}
                          onChange={(v) => patchAttr(a.id, { name: v })}
                          suggestions={attrTitles.filter((t) => t !== a.name)}
                          onPick={(title) => {
                            const hit = allAttrs.find((x) => x.title === title)
                            patchAttr(a.id, { name: title, ...(hit && !a.value.trim() ? { value: exampleOf(hit) } : {}) })
                          }}
                          variant="flushed"
                          size="sm"
                          fontSize="xs"
                          fontWeight="medium"
                          maxLength={30}
                          aria-label={`عنوان ${a.name}`}
                        />
                      </Table.Cell>
                      <Table.Cell>
                        <SuggestInput
                          value={a.value}
                          onChange={(v) => patchAttr(a.id, { value: v })}
                          suggestions={valuesOfAttr(a.name).filter((v) => v !== a.value)}
                          variant="flushed"
                          size="sm"
                          fontSize="xs"
                          color="fg.muted"
                          maxLength={40}
                          aria-label={`مقدار ${a.name}`}
                        />
                      </Table.Cell>
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
        {/*
          کادر برچسب‌ها یک فیلدِ واحد است: چیپ‌ها و ورودی **داخل همان کادر** و در
          یک جریان می‌آیند، نه چیپ‌ها بالا و یک ورودیِ تمام‌عرض زیرشان. ورودی
          `flex:1` است، پس با هر برچسب تازه سر جای خالیِ همان ردیف ادامه می‌دهد.

          پیشنهادِ خودکارِ برچسب برداشته شد: برچسب انتخابی شخصیِ فروشنده است و
          حدس‌زدنش از روی دسته‌بندی، فهرستی مبهم می‌ساخت که به کاربر کمکی نمی‌کرد.
          به‌جایش راهنمای همین بخش می‌گوید برچسب خوب چه شکلی است.
        */}
        <chakra.form
          data-field="tags"
          display="flex"
          gap="2"
          alignItems="start"
          w="full"
          onSubmit={(e) => { e.preventDefault(); addTag() }}
        >
          <Flex
            flex="1"
            minW="0"
            minH="42px"
            wrap="wrap"
            align="center"
            gap="1.5"
            borderWidth="1px"
            borderColor="border"
            rounded="lg"
            bg="bg.panel"
            px="1.5"
            py="1"
            cursor="text"
            onClick={(e) => {
              // کلیک روی هر جای کادر → مکان‌نما داخل ورودی
              const input = e.currentTarget.querySelector('input')
              input?.focus()
            }}
            _focusWithin={{ borderColor: 'brand.solid', boxShadow: '0 0 0 1px var(--chakra-colors-brand-solid)' }}
          >
            {form.tags.map((t) => (
              <Flex
                key={t}
                align="center"
                gap="1"
                ps="2.5"
                pe="1"
                h="7"
                flexShrink={0}
                rounded="l2"
                borderWidth="1px"
                borderColor="border"
                bg="bg.subtle"
                {...enterItem}
              >
                {/* FIRST = rightmost: متن برچسب · X سمت چپ */}
                <Text fontSize="xs" whiteSpace="nowrap">{t}</Text>
                <IconButton
                  size="2xs"
                  variant="ghost"
                  colorPalette="red"
                  aria-label={`حذف ${t}`}
                  onClick={(e) => { e.stopPropagation(); removeTag(t) }}
                >
                  <X size={12} />
                </IconButton>
              </Flex>
            ))}
            <Input
              variant="outline"
              border="none"
              bg="transparent"
              px="1"
              h="7"
              flex="1"
              minW="140px"
              fontSize="13px"
              _focusVisible={{ boxShadow: 'none' }}
              placeholder={form.tags.length === 0 ? 'مثلاً گوشی پرچمدار' : 'برچسب بعدی…'}
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={(e) => {
                // Backspace روی ورودیِ خالی آخرین برچسب را برمی‌دارد — رفتار
                // آشنای هر فیلدِ چیپ‌دار
                if (e.key === 'Backspace' && tag === '' && form.tags.length > 0) {
                  removeTag(form.tags[form.tags.length - 1])
                }
              }}
            />
          </Flex>
          <IconButton
            type="submit"
            size="sm"
            h="42px"
            w="38px"
            minW="38px"
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
        noDivider
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
      />

    </Flex>
  )
}
