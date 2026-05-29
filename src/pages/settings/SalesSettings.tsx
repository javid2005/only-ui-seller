import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Box, Flex, Switch, Grid, Text, Button, IconButton, EmptyState } from '@chakra-ui/react'
import { Plus, Phone } from 'lucide-react'
import { Header }         from '@/components/layout/Header'
import { TitleBar }       from '@/components/ui/TitleBar'
import { ButtonFooter }   from '@/components/ui/ButtonFooter'
import { PhoneCard }      from '@/components/settings/info/PhoneCard'
import { AddPhoneDialog } from '@/components/settings/info/AddPhoneDialog'
import type { PhoneCardProps } from '@/components/settings/info/PhoneCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type Phone = Omit<PhoneCardProps, 'onEdit' | 'onDelete'>

// ─── SwitchRow ────────────────────────────────────────────────────────────────

interface SwitchRowProps {
  label: string
  checked: boolean
  disabled?: boolean
  onCheckedChange?: (checked: boolean) => void
}

function SwitchRow({ label, checked, disabled, onCheckedChange }: SwitchRowProps) {
  return (
    // RTL: Switch FIRST = rightmost (start/right), Text LAST = leftmost (end/left)
    <Flex align="center" gap="2.5" w="full">
      <Switch.Root
        colorPalette="brand"
        checked={checked}
        disabled={disabled}
        onCheckedChange={(e) => onCheckedChange?.(e.checked)}
        flexShrink={0}
      >
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch.Root>
      <Text fontSize="sm" color="fg" flex="1" minW="0">
        {label}
      </Text>
    </Flex>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function SalesSettings() {
  const navigate   = useNavigate()
  const isCompact  = useCompactMode()

  const [dollarPrice, setDollarPrice] = useState(true)

  const [phones, setPhones]     = useState<Phone[]>([])
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [editPhone, setEditPhone] = useState<Phone | undefined>()

  function submitPhone(data: Omit<Phone, 'id'>) {
    if (editPhone) {
      setPhones((prev) => prev.map((p) => p.id === editPhone.id ? { ...data, id: p.id } : p))
      setEditPhone(undefined)
    } else {
      setPhones((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
    }
    setPhoneOpen(false)
  }

  return (
    <Flex direction="column" gap="4" w="full">

      <Header
        title="تنظیمات فروش"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'تنظیمات فروش' },
        ]}
      />

      {/* Panel — One Column Center template */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
        overflow="clip"
      >
        {/* Inner container: max 960px centered */}
        <Flex direction="column" gap="10" maxW="960px" w="full" mx="auto">

          {/* ── Section 1: قیمت دلاری ─────────────────────────────────── */}
          <Flex direction="column" gap="4">
            <TitleBar title="قیمت دلاری" size="xl" divider />
            <SwitchRow
              label="با فعال کردن این گزینه امکان ثبت قیمت دلاری برای محصولات فعال می شود."
              checked={dollarPrice}
              onCheckedChange={setDollarPrice}
            />
          </Flex>

          {/* ── Section 2: قیمت گذاری طلا ────────────────────────────── */}
          <Flex direction="column" gap="4">
            <TitleBar title="قیمت گذاری طلا" size="xl" divider />
            <SwitchRow
              label="این گزینه فقط هنگامی فعال می شود که فروشنده دسته بندی طلا و جواهرات را به فروشگاه خود افزوده باشد."
              checked={false}
              disabled
            />
          </Flex>

          {/* ── Section 3: شماره تماس فروش تلفنی ────────────────────── */}
          <Flex direction="column" gap="4">
            <TitleBar
              title="شماره تماس فروش تلفنی"
              size="xl"
              divider
              subtitle="جهت فروش تلفنی یکی از شماره های تماس فروشگاه را انتخاب نمایید و یا شماره جدید اضافه کنید."
              cta={
                <>
                  <IconButton display={{ base: 'flex', sm: 'none' }} size="sm" variant="outline" colorPalette="brand" aria-label="افزودن شماره" onClick={() => { setEditPhone(undefined); setPhoneOpen(true) }}><Plus size={16} /></IconButton>
                  <Button display={{ base: 'none', sm: 'flex' }} size="sm" variant="outline" colorPalette="brand" onClick={() => { setEditPhone(undefined); setPhoneOpen(true) }}><Plus size={16} />افزودن شماره</Button>
                </>
              }
            />

            {phones.length === 0 ? (
              <EmptyState.Root size="sm">
                <EmptyState.Content>
                  <EmptyState.Indicator><Phone size={24} /></EmptyState.Indicator>
                  <EmptyState.Title>هنوز شماره تماسی اضافه نشده</EmptyState.Title>
                </EmptyState.Content>
              </EmptyState.Root>
            ) : (
              <Grid
                templateColumns={
                  isCompact
                    ? '1fr'
                    : { base: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }
                }
                gap="4"
              >
                {phones.map((p) => (
                  <PhoneCard
                    key={p.id}
                    {...p}
                    onEdit={(id) => {
                      const found = phones.find((x) => x.id === id)
                      if (found) { setEditPhone(found); setPhoneOpen(true) }
                    }}
                    onDelete={(id) => setPhones((prev) => prev.filter((x) => x.id !== id))}
                  />
                ))}
              </Grid>
            )}
          </Flex>

          <ButtonFooter
            back={{ label: 'بازگشت', onClick: () => navigate('/settings') }}
          />

        </Flex>
      </Box>

      <AddPhoneDialog
        open={phoneOpen}
        onClose={() => { setPhoneOpen(false); setEditPhone(undefined) }}
        onSubmit={submitPhone}
        initial={editPhone
          ? { type: editPhone.type, number: editPhone.number, label: editPhone.label }
          : undefined
        }
      />

    </Flex>
  )
}
