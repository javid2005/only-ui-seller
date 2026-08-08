import { useMemo, useState } from 'react'
import { Avatar, Box, Button, Flex, Input, InputGroup, RadioCard, Text } from '@chakra-ui/react'
import { Plus, Search } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import type { ManualCustomer } from './manualOrderData'

/**
 * CustomerCard — یک ردیف انتخاب مشتری (Figma local component «Manual-Customer-Card»).
 * باید داخل <RadioCard.Root> استفاده شود.
 *
 * RTL DOM order داخل ItemControl (اولین child = راست‌ترین):
 *   Avatar (راست) → نام/شماره (وسط) → ItemIndicator (چپ)
 */
function CustomerCard({ customer }: { customer: ManualCustomer }) {
  return (
    <RadioCard.Item
      value={customer.id}
      w="full"
      rounded="lg"
      p="4"
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border.muted"
      boxShadow="none"
      cursor="pointer"
      _hover={{ bg: 'brand.bg', borderColor: 'brand.border', boxShadow: 'none' }}
      _checked={{ bg: 'brand.bg', borderColor: 'brand.solid', boxShadow: 'none' }}
    >
      <RadioCard.ItemHiddenInput />
      <RadioCard.ItemControl
        gap="4"
        p="0"
        border="none"
        bg="transparent"
        boxShadow="none"
        alignItems="center"
        justifyContent="space-between"
        w="full"
      >
        {/* گروه آواتار+نام — FIRST = راست‌ترین. جمع و چسبیده (بدون flex=1) تا از آواتار فاصله نگیرد */}
        <Flex align="center" gap="4" minW="0">
          <Avatar.Root size="md" bg="brand.solid" color="brand.contrast" flexShrink={0}>
            <Avatar.Fallback name={customer.name} />
          </Avatar.Root>

          {/* column flex در RTL: start = راست ✓ (end این‌جا چپ می‌شد) */}
          <RadioCard.ItemContent minW="0" gap="1" alignItems="start">
            <RadioCard.ItemText fontSize="sm" fontWeight="semibold" color="fg">
              {customer.name}
            </RadioCard.ItemText>
            <RadioCard.ItemDescription fontSize="xs" color="fg.muted" w="full" textAlign="start" m="0">
              {toPersianDigits(customer.phone)}
            </RadioCard.ItemDescription>
          </RadioCard.ItemContent>
        </Flex>

        {/* indicator رادیو — LAST = چپ‌ترین */}
        <RadioCard.ItemIndicator colorPalette="teal" flexShrink={0} />
      </RadioCard.ItemControl>
    </RadioCard.Item>
  )
}

interface CustomerSelectPanelProps {
  customers: ManualCustomer[]
  value: string | null
  onChange: (id: string) => void
  onAddNew: () => void
}

export function CustomerSelectPanel({ customers, value, onChange, onAddNew }: CustomerSelectPanelProps) {
  const [search, setSearch] = useState('')

  // نام یا شماره تلفن — ورودی فارسی/لاتین هر دو به لاتین نرمالایز می‌شود
  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    if (!q) return customers
    return customers.filter(
      (c) => c.name.toLowerCase().includes(q) || c.phone.includes(q),
    )
  }, [customers, search])

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
      <TitleBar
        title="انتخاب مشتری"
        subtitle="مشتری موجود را جستجو کنید یا مشتری جدید اضافه کنید."
        divider
        cta={
          <Button
            variant="outline"
            size="sm"
            h="9"
            px="3.5"
            rounded="md"
            fontWeight="semibold"
            fontSize="sm"
            color="brand.fg"
            borderColor="brand.solid"
            bg="bg.panel"
            _hover={{ bg: 'brand.bg' }}
            onClick={onAddNew}
          >
            {/* RTL: آیکن FIRST = راستِ متن */}
            <Plus size={16} />
            مشتری جدید
          </Button>
        }
      />

      <InputGroup startElement={<Search size={16} color="var(--chakra-colors-fg-subtle)" />}>
        <Input
          placeholder="جستجوی نام یا شماره تلفن..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </InputGroup>

      {filtered.length === 0 ? (
        <Box py="10" textAlign="center">
          <Text fontSize="sm" color="fg.subtle">مشتری‌ای با این مشخصات پیدا نشد.</Text>
        </Box>
      ) : (
        <RadioCard.Root
          value={value ?? undefined}
          onValueChange={(e) => e.value && onChange(e.value)}
          maxH="400px"
          overflowY="auto"
          /* اسکرول‌بار سمت چپ می‌افتد (RTL) — فاصله تا کارت‌ها */
          pe="2"
        >
          <Flex direction="column" gap="2">
            {filtered.map((c) => (
              <CustomerCard key={c.id} customer={c} />
            ))}
          </Flex>
        </RadioCard.Root>
      )}
    </Flex>
  )
}
