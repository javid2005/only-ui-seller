import { Badge, Box, Flex, IconButton, Text } from '@chakra-ui/react'
import { Trash2, X } from 'lucide-react'
import { LOCATIONS_ROOT, getProvinceCheckedState } from './locations'

export interface SelectedLocationsPanelProps {
  checkedValue: string[]
  onCheckedChange: (checkedValue: string[]) => void
}

/**
 * ستون «استان‌ها و شهرهای منتخب» — Figma node 5069:75932 (Selected)، ولی چون طرح صرفاً موکاپ
 * دستی treeview بود، اینجا با state واقعی TreeView (checkedValue) ساخته شده، نه کپی متن Figma.
 *
 * قانون کاربر: استان کامل انتخاب‌شده → یک بج «همه شهرها». استان با انتخاب جزئی (indeterminate) →
 * یک بج جدا برای هر شهر چک‌شده.
 *
 * RTL DOM order (از screenshot طرح): نام استان FIRST=راست‌ترین ← دکمهٔ حذف(trash) SECOND=چپ‌ترین.
 * داخل بج شهر: متن FIRST=راست‌تر ← × (حذف) SECOND=چپ‌تر.
 */
export function SelectedLocationsPanel({ checkedValue, onCheckedChange }: SelectedLocationsPanelProps) {
  const provinces = LOCATIONS_ROOT.children ?? []

  const selectedProvinces = provinces
    .map((province) => ({ province, state: getProvinceCheckedState(province.value, checkedValue) }))
    .filter(({ state }) => state !== false)

  const removeProvince = (provinceValue: string) => {
    const cityValues = new Set((provinces.find((p) => p.value === provinceValue)?.children ?? []).map((c) => c.value))
    onCheckedChange(checkedValue.filter((v) => !cityValues.has(v)))
  }

  const removeCity = (cityValue: string) => {
    onCheckedChange(checkedValue.filter((v) => v !== cityValue))
  }

  return (
    <Box bg="bg.subtle" rounded="lg" p="4" w="full" h="full" overflowY="auto">
      {/* ستونی + align="start" = راست در RTL (برعکسِ شهودِ ظاهری end) */}
      <Flex direction="column" gap="8" alignItems="start" w="full">
        <Text fontSize="md" fontWeight="semibold" color="fg">استان ها و شهر های منتخب</Text>

        {selectedProvinces.length === 0 ? (
          <Text fontSize="sm" color="fg.subtle">هنوز استان یا شهری انتخاب نشده است.</Text>
        ) : (
          selectedProvinces.map(({ province, state }) => (
            <Flex key={province.value} direction="column" gap="3" alignItems="start" w="full">
              {/* نام استان FIRST=راست‌ترین، حذف SECOND=چپ‌ترین — دو سرِ ردیف (space-between)، نه چسبیده به هم */}
              <Flex align="center" justify="space-between" w="full">
                <Text fontSize="md" fontWeight="semibold" color="fg">{province.label}</Text>
                <IconButton
                  aria-label={`حذف ${province.label}`}
                  variant="ghost"
                  size="sm"
                  colorPalette="red"
                  onClick={() => removeProvince(province.value)}
                >
                  <Trash2 size={16} />
                </IconButton>
              </Flex>

              {/* ردیفی + justify="start" = راست در RTL — بج‌ها به راست می‌چسبن */}
              <Flex gap="2" wrap="wrap" justify="start" w="full">
                {state === true ? (
                  <LocationBadge label="همه شهرها" onRemove={() => removeProvince(province.value)} />
                ) : (
                  (province.children ?? [])
                    .filter((city) => checkedValue.includes(city.value))
                    .map((city) => (
                      <LocationBadge key={city.value} label={city.label} onRemove={() => removeCity(city.value)} />
                    ))
                )}
              </Flex>
            </Flex>
          ))
        )}
      </Flex>
    </Box>
  )
}

function LocationBadge({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <Badge
      colorPalette="gray"
      variant="subtle"
      size="md"
      gap="1.5"
      cursor="pointer"
      onClick={onRemove}
    >
      {/* متن FIRST=راست‌تر، × SECOND=چپ‌تر */}
      {label}
      <X size={14} />
    </Badge>
  )
}
