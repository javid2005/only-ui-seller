import { Flex, Grid, Input, Text, Switch, Select, Portal, createListCollection } from '@chakra-ui/react'
import { Package, Settings } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { NumberField } from '@/components/ui/NumberField'
import { SectionCard, Panel } from './SectionCard'
import { NotchedField, bareControl } from './NotchedField'
import { SHIPPING_PROFILES, type ProductForm } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface WarehouseTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
}

const shippingCollection = createListCollection({ items: SHIPPING_PROFILES })

/** واحد انتهای فیلد — «عدد»، «گرم»، «cm» */
function Unit({ children }: { children: string }) {
  return (
    <Text fontSize="xs" color="fg.muted" bg="bg.subtle" rounded="sm" px="1.5" py="0.5">
      {children}
    </Text>
  )
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * WarehouseTab — مرحلهٔ ۳: «انبارداری و ارسال».
 *
 * سه بخش طرح تأییدشده:
 *   ۱. اطلاعات انبارداری — شناسه/موجودی/وزن **در یک پنل واحد**، نه سه کادر جدا.
 *      (بازخورد دور «چاکرا اصلاح»: سه کادر مستقل باعث شده بود عنوان هر فیلد به
 *      لبهٔ بالای کادرش بچسبد.)
 *   ۲. ابعاد بسته — پنل با پس‌زمینهٔ ملایم تا مرز خود فیلد دیده شود.
 *   ۳. تنظیمات ارسال — زمان آماده‌سازی (قابل تایپ، نه فقط +/−)، هزینه، توضیح.
 *
 * RTL DOM order هر ردیف (first = rightmost): شناسه ← موجودی ← وزن.
 */
export function WarehouseTab({ form, onChange, onBack, onSave }: WarehouseTabProps) {
  return (
    <Flex direction="column" gap="5" w="full">

      <TitleBar
        title="انبارداری و ارسال"
        subtitle="شناسه، موجودی، وزن و روش‌های ارسال"
        size="xl"
        divider
      />

      {/* ═══ ۱. اطلاعات انبارداری ═══════════════════════════════════════════════ */}
      <SectionCard
        title="اطلاعات انبارداری"
        subtitle="اطلاعاتی که برای کنترل موجودی و بسته‌بندی لازم است"
        help="شناسه برای پیگیری کالا در انبار است؛ موجودی و وزن مبنای فروش و محاسبهٔ هزینهٔ ارسال‌اند."
      >
        {/* هر سه فیلد در یک پنل واحد — FIRST = rightmost: شناسه */}
        <Panel tinted>
          <Grid templateColumns={{ base: '1fr', md: '1fr 1.25fr 1fr' }} gap="4" alignItems="start">

            <NotchedField
              label="شناسه / SKU"
              required
              hint="یک شناسه پیشنهادی ساخته می‌شود و هر زمان خواستید قابل ویرایش است."
            >
              <Input
                {...bareControl}
                placeholder="VT-NOVA-X"
                value={form.sku}
                onChange={(e) => onChange({ sku: e.target.value })}
              />
            </NotchedField>

            <Flex align="center" gap="2.5" minW="0">
              <NotchedField
                label="موجودی اولیه"
                required
                disabled={form.unlimitedInventory}
                endElement={<Unit>عدد</Unit>}
              >
                <NumberField
                  value={form.inventory}
                  onChange={(v) => onChange({ inventory: v })}
                  disabled={form.unlimitedInventory}
                  showSteppers
                  inputProps={bareControl}
                />
              </NotchedField>
              {/* LAST = leftmost: نامحدود — بیرون از خود فیلد، طبق بازخورد */}
              <Flex direction="column" align="center" gap="1" flexShrink={0}>
                <Switch.Root
                  size="sm"
                  colorPalette="brand"
                  checked={form.unlimitedInventory}
                  onCheckedChange={(e) => onChange({ unlimitedInventory: e.checked })}
                >
                  <Switch.HiddenInput />
                  <Switch.Control><Switch.Thumb /></Switch.Control>
                </Switch.Root>
                <Text fontSize="2xs" color="fg.muted" whiteSpace="nowrap">نامحدود</Text>
              </Flex>
            </Flex>

            <NotchedField label="وزن محصول" endElement={<Unit>گرم</Unit>}>
              <NumberField
                value={form.weight}
                onChange={(v) => onChange({ weight: v })}
                allowDecimals
                showSteppers
                inputProps={bareControl}
              />
            </NotchedField>

          </Grid>
        </Panel>

        {/* ابعاد بسته — پنل جدا با پس‌زمینهٔ ملایم */}
        <Flex mt="4">
          <Panel
            title="ابعاد بسته"
            subtitle="طول، عرض و ارتفاع بسته"
            icon={<Package size={18} />}
            tinted
          >
            {/* FIRST = rightmost: طول ← عرض ← ارتفاع */}
            <Grid templateColumns={{ base: '1fr', sm: 'repeat(3, 1fr)' }} gap="3">
              {([
                ['طول', form.packLength, (v: string) => onChange({ packLength: v })],
                ['عرض', form.packWidth, (v: string) => onChange({ packWidth: v })],
                ['ارتفاع', form.packHeight, (v: string) => onChange({ packHeight: v })],
              ] as const).map(([label, value, set]) => (
                <NotchedField key={label} label={label} endElement={<Unit>cm</Unit>} tinted>
                  <NumberField
                    value={value}
                    onChange={set}
                    allowDecimals
                    showSteppers
                    inputProps={bareControl}
                  />
                </NotchedField>
              ))}
            </Grid>
          </Panel>
        </Flex>
      </SectionCard>

      {/* ═══ ۲. تنظیمات ارسال ═══════════════════════════════════════════════════ */}
      <SectionCard
        title="تنظیمات ارسال"
        subtitle="زمان آماده‌سازی، نحوه محاسبه هزینه و توضیحی که در صورت نیاز به خریدار نمایش داده می‌شود مشخص کنید."
        help="این تنظیمات فقط برای همین محصول است و تنظیمات کلی فروشگاه را تغییر نمی‌دهد."
      >
        {/* FIRST = rightmost: زمان آماده‌سازی ← هزینه ← توضیح.
            در طرح هر کدام یک پنل با عنوان بالای کنترل است، نه فیلدِ لیبل‌روی‌کادر. */}
        <Grid templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }} gap="4">

          <Panel title="زمان آماده‌سازی">
            {/* عدد هم قابل تایپ است، نه فقط +/− — بازخورد بند ۷ دور «چاکرا اصلاح» */}
            <NumberField
              value={form.prepDays}
              onChange={(v) => onChange({ prepDays: v })}
              showSteppers
              min={0}
              endElement={<Unit>روز</Unit>}
            />
          </Panel>

          <Panel title="هزینه ارسال" icon={<Settings size={16} />}>
            <Select.Root
              collection={shippingCollection}
              value={[form.shippingProfile]}
              onValueChange={(e) => onChange({ shippingProfile: e.value[0] ?? 'store' })}
            >
              <Select.HiddenSelect />
              <Select.Control>
                <Select.Trigger>
                  <Select.ValueText placeholder="طبق تنظیمات فروشگاه" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                  <Select.Indicator />
                </Select.IndicatorGroup>
              </Select.Control>
              <Portal>
                <Select.Positioner>
                  <Select.Content dir="rtl">
                    {SHIPPING_PROFILES.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        <Select.ItemText>{item.label}</Select.ItemText>
                        <Select.ItemIndicator />
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Positioner>
              </Portal>
            </Select.Root>
          </Panel>

          <Panel title="توضیح ارسال">
            <Input
              placeholder="مثال: ارسال ۲۵ روزه از انبار چین"
              value={form.shippingNote}
              onChange={(e) => onChange({ shippingNote: e.target.value })}
            />
          </Panel>

        </Grid>

      </SectionCard>

      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
        back={{ label: 'بازگشت به لیست', onClick: onBack }}
      />

    </Flex>
  )
}
