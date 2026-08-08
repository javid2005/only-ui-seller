import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Box, Flex, Button, IconButton, Input,
  Tabs, Grid, Field, FileUpload, EmptyState,
} from '@chakra-ui/react'
import { Plus, Phone, Share2, MapPin, Upload } from 'lucide-react'
import { Header }          from '@/components/layout/Header'
import { TitleBar }        from '@/components/ui/TitleBar'
import { ButtonFooter }    from '@/components/ui/ButtonFooter'
import { RichTextEditor }  from '@/components/ui/RichTextEditor'
import { PhoneCard }       from '@/components/settings/info/PhoneCard'
import { SocialCard }      from '@/components/settings/info/SocialCard'
import { AddressCard }     from '@/components/settings/info/AddressCard'
import { AddPhoneDialog }  from '@/components/settings/info/AddPhoneDialog'
import { AddSocialDialog } from '@/components/settings/info/AddSocialDialog'
import { AddAddressDialog } from '@/components/settings/info/AddAddressDialog'
import type { PhoneCardProps }   from '@/components/settings/info/PhoneCard'
import type { SocialCardProps }  from '@/components/settings/info/SocialCard'
import type { AddressCardProps } from '@/components/settings/info/AddressCard'

// ─── Types ────────────────────────────────────────────────────────────────────

type Phone   = Omit<PhoneCardProps,   'onEdit' | 'onDelete'>
type Social  = Omit<SocialCardProps,  'onEdit' | 'onDelete'>
type Address = Omit<AddressCardProps, 'onEdit' | 'onDelete' | 'onToggleActive'>

// ─── StoreEmptyState ──────────────────────────────────────────────────────────

function StoreEmptyState({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <EmptyState.Root size="sm">
      <EmptyState.Content>
        <EmptyState.Indicator>{icon}</EmptyState.Indicator>
        <EmptyState.Title>{text}</EmptyState.Title>
      </EmptyState.Content>
    </EmptyState.Root>
  )
}

// ─── Tab 1: اطلاعات هویتی ─────────────────────────────────────────────────────

function IdentityTab() {
  const router = useRouter()
  const [name,        setName]        = useState('')
  const [displayName, setDisplayName] = useState('')
  const [description, setDescription] = useState('')
  const isCompact = useCompactMode()

  return (
    <Box display="flex" flexDirection="column" gap="4">

      {/* فیلدهای اصلی */}
      <Grid templateColumns={isCompact ? '1fr' : { base: '1fr', md: '1fr 1fr' }} gap="4">
        <Field.Root required>
          <Field.Label fontSize="sm" fontWeight="semibold">
            نام فروشگاه به فارسی
            <Field.RequiredIndicator />
          </Field.Label>
          <Input
            placeholder="نام فروشگاه به فارسی را وارد کنید"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Field.Root>
        <Field.Root disabled>
          <Field.Label fontSize="sm" fontWeight="semibold">آدرسی اختصاصی</Field.Label>
          <Input
            placeholder="Store name in English"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            disabled
          />
        </Field.Root>
      </Grid>

      {/* توضیحات — rich text */}
      <Field.Root>
        <Field.Label fontSize="sm" fontWeight="semibold">توضیحات فروشگاه</Field.Label>
        <RichTextEditor
          value={description}
          onChange={setDescription}
          placeholder="درباره فروشگاه خود بنویسید..."
          minH="156px"
        />
        <Field.HelperText>تعداد کاراکتر مجاز: حداکثر ۱۵۰۰ کاراکتر</Field.HelperText>
      </Field.Root>

      {/* آپلود لوگو */}
      <Field.Root>
        <Field.Label fontSize="sm" fontWeight="semibold">لوگو فروشگاه</Field.Label>
        <FileUpload.Root
          accept={{ 'image/*': [] }}
          maxFileSize={2 * 1024 * 1024}
          w="full"
        >
          <FileUpload.HiddenInput />
          <FileUpload.Dropzone w="full" minH="128px">
            <Upload size={20} />
            <FileUpload.DropzoneContent>
              <Box fontSize="sm" fontWeight="semibold" color="fg" textAlign="center">
                برای بارگذاری، اینجا بکشید و رها کنید یا کلیک کنید
              </Box>
              <Box fontSize="sm" color="fg.muted" textAlign="center">
                حجم فایل: حداکثر ۲ مگابایت
                <br />
                فرمت تصویر مجاز: png, jpg, jpeg, webp, heic
              </Box>
            </FileUpload.DropzoneContent>
          </FileUpload.Dropzone>
          <FileUpload.List />
        </FileUpload.Root>
      </Field.Root>

      <ButtonFooter
        primary={{ label: 'ذخیره', onClick: () => {} }}
        back={{ label: 'بازگشت', onClick: () => router.push('/settings') }}
      />

    </Box>
  )
}

// ─── Tab 2: راه های ارتباطی ──────────────────────────────────────────────────

function ContactTab({ phones, onPhonesChange }: { phones: Phone[]; onPhonesChange: (phones: Phone[]) => void }) {
  const router = useRouter()
  const isCompact = useCompactMode()

  // ─── Phone state ────────────────────────────────────
  const [phoneOpen, setPhoneOpen] = useState(false)
  const [editPhone, setEditPhone] = useState<Phone | undefined>()

  function submitPhone(data: Omit<Phone, 'id'>) {
    if (editPhone) {
      onPhonesChange(phones.map((p) => p.id === editPhone.id ? { ...data, id: p.id } : p))
      setEditPhone(undefined)
    } else {
      onPhonesChange([...phones, { ...data, id: crypto.randomUUID() }])
    }
    setPhoneOpen(false)
  }

  // ─── Social state ────────────────────────────────────
  const [socials, setSocials]       = useState<Social[]>([])
  const [socialOpen, setSocialOpen] = useState(false)
  const [editSocial, setEditSocial] = useState<Social | undefined>()

  function submitSocial(data: Omit<Social, 'id'>) {
    if (editSocial) {
      setSocials((prev) => prev.map((s) => s.id === editSocial.id ? { ...data, id: s.id } : s))
      setEditSocial(undefined)
    } else {
      setSocials((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
    }
    setSocialOpen(false)
  }

  return (
    <Box display="flex" flexDirection="column" gap="10">

      {/* شماره‌های تماس */}
      <Box>
        <TitleBar
          title="شماره های تماس"
          size="xl"
          divider
          cta={
            <>
              <IconButton display={{ base: 'flex', sm: 'none' }} size="sm" variant="outline" colorPalette="brand" aria-label="افزودن شماره" onClick={() => { setEditPhone(undefined); setPhoneOpen(true) }}><Plus size={16} /></IconButton>
              <Button display={{ base: 'none', sm: 'flex' }} size="sm" variant="outline" colorPalette="brand" onClick={() => { setEditPhone(undefined); setPhoneOpen(true) }}><Plus size={16} />افزودن شماره</Button>
            </>
          }
        />
        <Box pt="4">
          {phones.length === 0 ? (
            <StoreEmptyState icon={<Phone size={24} />} text="هنوز شماره تماسی اضافه نشده" />
          ) : (
            <Grid templateColumns={isCompact ? '1fr' : { base: '1fr', md: 'repeat(2, 1fr)', xl: 'repeat(3, 1fr)' }} gap="4">
              {phones.map((p) => (
                <PhoneCard
                  key={p.id}
                  {...p}
                  onEdit={(id) => {
                    const found = phones.find((x) => x.id === id)
                    if (found) { setEditPhone(found); setPhoneOpen(true) }
                  }}
                  onDelete={(id) => onPhonesChange(phones.filter((x) => x.id !== id))}
                />
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      {/* شبکه‌های اجتماعی */}
      <Box>
        <TitleBar
          title="شبکه های اجتماعی"
          size="xl"
          divider
          cta={
            <>
              <IconButton display={{ base: 'flex', sm: 'none' }} size="sm" variant="outline" colorPalette="brand" aria-label="افزودن شبکه" onClick={() => { setEditSocial(undefined); setSocialOpen(true) }}><Plus size={16} /></IconButton>
              <Button display={{ base: 'none', sm: 'flex' }} size="sm" variant="outline" colorPalette="brand" onClick={() => { setEditSocial(undefined); setSocialOpen(true) }}><Plus size={16} />افزودن شبکه</Button>
            </>
          }
        />
        <Box pt="4">
          {socials.length === 0 ? (
            <StoreEmptyState icon={<Share2 size={24} />} text="هنوز شبکه اجتماعی‌ای اضافه نشده" />
          ) : (
            <Grid templateColumns={isCompact ? '1fr' : { base: '1fr', md: '1fr 1fr' }} gap="4">
              {socials.map((s) => (
                <SocialCard
                  key={s.id}
                  {...s}
                  onEdit={(id) => {
                    const found = socials.find((x) => x.id === id)
                    if (found) { setEditSocial(found); setSocialOpen(true) }
                  }}
                  onDelete={(id) => setSocials((prev) => prev.filter((x) => x.id !== id))}
                />
              ))}
            </Grid>
          )}
        </Box>
      </Box>

      <ButtonFooter
        back={{ label: 'بازگشت', onClick: () => router.push('/settings') }}
      />

      <AddPhoneDialog
        open={phoneOpen}
        onClose={() => { setPhoneOpen(false); setEditPhone(undefined) }}
        onSubmit={submitPhone}
        initial={editPhone ? { type: editPhone.type, number: editPhone.number, label: editPhone.label } : undefined}
      />
      <AddSocialDialog
        open={socialOpen}
        onClose={() => { setSocialOpen(false); setEditSocial(undefined) }}
        onSubmit={submitSocial}
        initial={editSocial ? { title: editSocial.title, platform: editSocial.platform, handle: editSocial.handle } : undefined}
      />
    </Box>
  )
}

// ─── Tab 3: آدرس ها ──────────────────────────────────────────────────────────

function AddressTab({ phones }: { phones: Phone[] }) {
  const router = useRouter()
  const isCompact = useCompactMode()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [addrOpen, setAddrOpen]   = useState(false)
  const [editAddr, setEditAddr]   = useState<Address | undefined>()

  function submitAddress(data: Omit<Address, 'id'>) {
    if (editAddr) {
      setAddresses((prev) => prev.map((a) => a.id === editAddr.id ? { ...data, id: a.id } : a))
      setEditAddr(undefined)
    } else {
      setAddresses((prev) => [...prev, { ...data, id: crypto.randomUUID() }])
    }
    setAddrOpen(false)
  }

  return (
    <Box display="flex" flexDirection="column" gap="6">

      <TitleBar
        title="آدرس ها"
        size="xl"
        divider
        cta={
          <>
            <IconButton display={{ base: 'flex', sm: 'none' }} size="sm" variant="outline" colorPalette="brand" aria-label="افزودن آدرس" onClick={() => { setEditAddr(undefined); setAddrOpen(true) }}><Plus size={16} /></IconButton>
            <Button display={{ base: 'none', sm: 'flex' }} size="sm" variant="outline" colorPalette="brand" onClick={() => { setEditAddr(undefined); setAddrOpen(true) }}><Plus size={16} />افزودن آدرس</Button>
          </>
        }
      />

      <Box>
        {addresses.length === 0 ? (
          <StoreEmptyState icon={<MapPin size={24} />} text="هنوز آدرسی اضافه نشده" />
        ) : (
          <Grid templateColumns={isCompact ? '1fr' : { base: '1fr', md: '1fr 1fr' }} gap="4" alignItems="start">
            {addresses.map((a) => (
              <AddressCard
                key={a.id}
                {...a}
                onToggleActive={(id, val) =>
                  setAddresses((prev) => prev.map((x) => x.id === id ? { ...x, active: val } : x))
                }
                onEdit={(id) => {
                  const found = addresses.find((x) => x.id === id)
                  if (found) { setEditAddr(found); setAddrOpen(true) }
                }}
                onDelete={(id) => setAddresses((prev) => prev.filter((x) => x.id !== id))}
              />
            ))}
          </Grid>
        )}
      </Box>

      <ButtonFooter
        back={{ label: 'بازگشت', onClick: () => router.push('/settings') }}
      />

      <AddAddressDialog
        open={addrOpen}
        onClose={() => { setAddrOpen(false); setEditAddr(undefined) }}
        onSubmit={submitAddress}
        phones={phones}
        initial={editAddr ? {
          title: editAddr.title, province: editAddr.province, city: editAddr.city,
          postal: editAddr.postal, address: editAddr.address,
          phone: editAddr.phone, active: editAddr.active,
        } : undefined}
      />
    </Box>
  )
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

type Tab = 'identity' | 'contact' | 'address'

const TABS: { value: Tab; label: string }[] = [
  { value: 'identity', label: 'اطلاعات هویتی' },
  { value: 'contact',  label: 'راه های ارتباطی' },
  { value: 'address',  label: 'آدرس ها' },
]

// ─── Main Page ────────────────────────────────────────────────────────────────

/**
 * GeneralInfo — صفحه اطلاعات فروشگاه
 * Template: One Column Center — panel = fill، محتوا = max 960px centered
 * Route: /settings/store-info
 */
export function GeneralInfo() {
  const isCompact = useCompactMode()
  const [phones, setPhones] = useState<Phone[]>([])
  const [activeTab, setActiveTab] = useState<Tab>('identity')

  return (
    <Flex direction="column" gap="4" w="full">

      <Header
        title="اطلاعات فروشگاه"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'اطلاعات فروشگاه' },
        ]}
      />

      {/* Panel: fill — One Column Center template */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', md: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', md: '6' }}
        w="full"
        overflow="clip"
      >
        <Flex
          gap="10"
          align="start"
          direction={isCompact ? 'column' : { base: 'column', lg: 'row' }}
        >

          {/* ══ Horizontal tabs — < lg viewport OR compact ══ */}
          <Box
            display={isCompact ? 'block' : { base: 'block', lg: 'none' }}
            w="full"
            flexShrink={0}
          >
            <Tabs.Root
              variant="subtle"
              value={activeTab}
              onValueChange={(e) => setActiveTab(e.value as Tab)}
              w="full"
            >
              <Tabs.List w="full">
                {TABS.map((tab) => (
                  <Tabs.Trigger key={tab.value} value={tab.value} flex="1" justifyContent="center" fontSize="sm" whiteSpace="nowrap">
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </Box>

          {/* ══ Vertical tabs — >= lg viewport AND not compact ══
               Chakra Tabs.Root orientation="vertical" variant="subtle"
               FIRST in DOM = rightmost in RTL row layout ✓ */}
          <Box
            display={isCompact ? 'none' : { base: 'none', lg: 'block' }}
            flexShrink={0}
            w="200px"
            position="sticky"
            top="4"
            alignSelf="start"
          >
            <Tabs.Root
              variant="subtle"
              orientation="vertical"
              value={activeTab}
              onValueChange={(e) => setActiveTab(e.value as Tab)}
              w="full"
            >
              <Tabs.List w="full">
                {TABS.map((tab) => (
                  <Tabs.Trigger
                    key={tab.value}
                    value={tab.value}
                    w="full"
                    justifyContent="start"
                    fontSize="sm"
                  >
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </Box>

          {/* ══ Main content ══ */}
          <Box
            flex="1"
            w="full"
            maxW={isCompact ? 'full' : { base: 'full', lg: '960px' }}
          >
            {activeTab === 'identity' && <IdentityTab />}
            {activeTab === 'contact' && <ContactTab phones={phones} onPhonesChange={setPhones} />}
            {activeTab === 'address' && <AddressTab phones={phones} />}
          </Box>
        </Flex>
      </Box>

    </Flex>
  )
}
