import { useState } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Box, Flex, Grid, Button, Input, chakra,
  Badge, Avatar, Field, Portal,
  DatePicker, Tabs,
} from '@chakra-ui/react'
import { Check, Calendar } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { OtpDialog } from '@/components/ui/OtpDialog'
import { SecuritySection } from './SecuritySection'

// ─── Types ────────────────────────────────────────────────────────────────────

type OtpTarget = 'mobile' | 'email' | null
type Tab = 'user-info' | 'security' | 'auth'

// ─── Verification Badge ───────────────────────────────────────────────────────

function VerificationBadge({ verified }: { verified: boolean }) {
  return verified ? (
    <Badge colorPalette="green" variant="subtle" size="xs" gap="0.5" px="1.5" flexShrink={0}>
      <Check size={10} />
      تایید شده
    </Badge>
  ) : (
    <Badge colorPalette="gray" variant="subtle" size="xs" px="1.5" flexShrink={0}>
      تایید نشده
    </Badge>
  )
}

// ─── Input with inline badge (no InputGroup padding overhead) ─────────────────

interface BadgeInputProps {
  label: string
  placeholder?: string
  value: string
  onChange: (val: string) => void
  verified: boolean
  helperText?: string
  type?: string
}

function BadgeInput({ label, placeholder, value, onChange, verified, helperText, type }: BadgeInputProps) {
  return (
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">{label}</Field.Label>
      <Flex
        borderWidth="1px"
        borderColor="border"
        borderRadius="sm"
        h="10"
        px="3"
        gap="2"
        align="center"
        bg="bg"
        w="full"
        transition="border-color 0.15s"
        _focusWithin={{ borderColor: 'colorPalette.border', outline: '2px solid', outlineColor: 'colorPalette.border', outlineOffset: '-1px' }}
        colorPalette="gray"
      >
        {/* Input — FIRST = rightmost in RTL, text right-aligned ✓ */}
        <chakra.input
          flex="1"
          minW="0"
          border="none"
          outline="none"
          bg="transparent"
          fontSize="sm"
          color="fg"
          _placeholder={{ color: 'fg.subtle' }}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}
          textAlign="end"
          type={type ?? 'text'}
          placeholder={placeholder}
        />
        {/* Badge — LAST = leftmost in RTL ✓ */}
        <VerificationBadge verified={verified} />
      </Flex>
      {helperText && (
        <Field.HelperText fontSize="xs" color="fg.muted">{helperText}</Field.HelperText>
      )}
    </Field.Root>
  )
}

// ─── Persian Date Picker (Chakra DS) ─────────────────────────────────────────

function PersianDateInput() {
  return (
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">تاریخ تولد</Field.Label>
      {/*
        locale="fa-IR-u-ca-persian" → Jalali calendar + Persian digits/month names
        dir="rtl" on Positioner → portal inherits RTL correctly
      */}
      <DatePicker.Root
        locale="fa-IR-u-ca-persian"
        w="full"
        startOfWeek={6}
      >
        <DatePicker.Control>
          <DatePicker.Input />
          <DatePicker.IndicatorGroup>
            <DatePicker.Trigger>
              <Calendar size={16} />
            </DatePicker.Trigger>
          </DatePicker.IndicatorGroup>
        </DatePicker.Control>
        <Portal>
          <DatePicker.Positioner dir="rtl">
            <DatePicker.Content>
              <DatePicker.View view="day">
                <DatePicker.Header />
                <DatePicker.DayTable />
              </DatePicker.View>
              <DatePicker.View view="month">
                <DatePicker.Header />
                <DatePicker.MonthTable />
              </DatePicker.View>
              <DatePicker.View view="year">
                <DatePicker.Header />
                <DatePicker.YearTable />
              </DatePicker.View>
            </DatePicker.Content>
          </DatePicker.Positioner>
        </Portal>
      </DatePicker.Root>
    </Field.Root>
  )
}

// ─── Tabs config ──────────────────────────────────────────────────────────────

const TABS: { value: Tab; label: string }[] = [
  { value: 'user-info', label: 'اطلاعات کاربری' },
  { value: 'security',  label: 'امنیت' },
  { value: 'auth',      label: 'احراز هویت' },
]

// ─── Main Page ────────────────────────────────────────────────────────────────

export function UserInfo() {
  const isCompact = useCompactMode()

  const [activeTab, setActiveTab]     = useState<Tab>('user-info')
  const [firstName, setFirstName]     = useState('')
  const [lastName, setLastName]       = useState('')
  const [mobile, setMobile]           = useState('۰۹۱۲۳۴۵۶۷۸۹')
  const [email, setEmail]             = useState('')
  const [nationalId, setNationalId]   = useState('')

  const [mobileVerified, setMobileVerified] = useState(true)
  const [emailVerified, setEmailVerified]   = useState(false)
  const [verifiedMobile, setVerifiedMobile] = useState('۰۹۱۲۳۴۵۶۷۸۹')
  const [verifiedEmail, setVerifiedEmail]   = useState('')

  const [otpTarget, setOtpTarget] = useState<OtpTarget>(null)

  function handleMobileChange(val: string) {
    setMobile(val)
    setMobileVerified(val === verifiedMobile && val !== '')
  }

  function handleEmailChange(val: string) {
    setEmail(val)
    setEmailVerified(val === verifiedEmail && val !== '')
  }

  function handleOtpConfirm(target: OtpTarget) {
    if (target === 'mobile') { setMobileVerified(true); setVerifiedMobile(mobile) }
    else if (target === 'email') { setEmailVerified(true); setVerifiedEmail(email) }
    setOtpTarget(null)
  }

  return (
    <Box display="flex" flexDirection="column" gap="4">

      <Header
        title="حساب کاربری"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'حساب کاربری' },
        ]}
      />

      <Box bg="bg.panel" borderWidth="1px" borderColor="border" borderRadius="2xl" p="6" overflow="hidden">
        <Flex
          gap="10"
          align="flex-start"
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
              <Tabs.List>
                {TABS.map((tab) => (
                  <Tabs.Trigger key={tab.value} value={tab.value} fontSize="sm">
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
            alignSelf="flex-start"
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
                    justifyContent="flex-start"
                    fontSize="sm"
                  >
                    {tab.label}
                  </Tabs.Trigger>
                ))}
              </Tabs.List>
            </Tabs.Root>
          </Box>

          {/* ══ Main form ══ */}
          <Box
            flex="1"
            w="full"
            maxW={isCompact ? 'full' : { base: 'full', lg: '960px' }}
            display="flex"
            flexDirection="column"
            gap="6"
          >
            {activeTab === 'user-info' && (
              <>
                <TitleBar
                  title="اطلاعات حساب کاربری"
                  subtitle="اطلاعات شخصی و تماس خود را مدیریت کنید."
                  divider
                />

                <Flex flexWrap="wrap" gap="4" align="flex-start">

                  {/* نام — FIRST = rightmost */}
                  <Box flex="1 0 0" minW={isCompact ? 'full' : { base: 'full', md: '380px' }}>
                    <Field.Root>
                      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">نام</Field.Label>
                      <Input placeholder="نام را وارد نمایید" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    </Field.Root>
                  </Box>

                  {/* نام خانوادگی */}
                  <Box flex="1 0 0" minW={isCompact ? 'full' : { base: 'full', md: '380px' }}>
                    <Field.Root>
                      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">نام خانوادگی</Field.Label>
                      <Input placeholder="نام خانوادگی را وارد نمایید" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    </Field.Root>
                  </Box>

                  {/* شماره موبایل + ایمیل — side by side at xl+, stacked below xl */}
                  <Grid
                    templateColumns={isCompact ? '1fr' : { base: '1fr', xl: 'repeat(2, 1fr)' }}
                    gap="4"
                    w="full"
                  >
                    {/* شماره موبایل
                        < sm: column — input بالا، button fill زیر
                        >= sm: row   — input FIRST=rightmost، button LAST=leftmost */}
                    <Flex
                      gap="2"
                      direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}
                      align={isCompact ? 'stretch' : { base: 'stretch', sm: 'flex-end' }}
                    >
                      <Box flex="1" minW="0">
                        <BadgeInput
                          label="شماره موبایل"
                          value={mobile}
                          onChange={handleMobileChange}
                          verified={mobileVerified}
                          helperText="تغییر با تایید OTP انجام می‌شود"
                          type="tel"
                        />
                      </Box>
                      <Box
                        flexShrink={0}
                        pb={isCompact ? '0' : { base: '0', sm: '6' }}
                      >
                        <Button
                          variant="outline"
                          colorPalette={mobileVerified || !mobile.trim() ? 'gray' : 'brand'}
                          disabled={mobileVerified || !mobile.trim()}
                          opacity={mobileVerified || !mobile.trim() ? 0.4 : 1}
                          w={isCompact ? 'full' : { base: 'full', sm: 'auto' }}
                          h="10"
                          fontSize="sm"
                          fontWeight="semibold"
                          onClick={() => setOtpTarget('mobile')}
                          whiteSpace="nowrap"
                        >
                          ارسال کد تایید
                        </Button>
                      </Box>
                    </Flex>

                    {/* ایمیل — همان pattern */}
                    <Flex
                      gap="2"
                      direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}
                      align={isCompact ? 'stretch' : { base: 'stretch', sm: 'flex-end' }}
                    >
                      <Box flex="1" minW="0">
                        <BadgeInput
                          label="ایمیل"
                          placeholder="ایمیل را وارد نمایید"
                          value={email}
                          onChange={handleEmailChange}
                          verified={emailVerified}
                          helperText="تغییر با تایید OTP انجام می‌شود"
                          type="email"
                        />
                      </Box>
                      <Box
                        flexShrink={0}
                        pb={isCompact ? '0' : { base: '0', sm: '6' }}
                      >
                        <Button
                          variant="outline"
                          colorPalette={emailVerified || !email.trim() ? 'gray' : 'brand'}
                          disabled={emailVerified || !email.trim()}
                          opacity={emailVerified || !email.trim() ? 0.4 : 1}
                          w={isCompact ? 'full' : { base: 'full', sm: 'auto' }}
                          h="10"
                          fontSize="sm"
                          fontWeight="semibold"
                          onClick={() => setOtpTarget('email')}
                          whiteSpace="nowrap"
                        >
                          ارسال کد تایید
                        </Button>
                      </Box>
                    </Flex>
                  </Grid>

                  {/* کد ملی */}
                  <Box flex="1 0 0" minW={isCompact ? 'full' : { base: 'full', md: '380px' }}>
                    <Field.Root>
                      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">کد ملی</Field.Label>
                      <Input
                        placeholder="کد ملی را وارد نمایید"
                        value={nationalId}
                        onChange={(e) => setNationalId(e.target.value)}
                        dir="ltr"
                        textAlign="right"
                      />
                    </Field.Root>
                  </Box>

                  {/* تاریخ تولد — Chakra DatePicker با تقویم جلالی */}
                  <Box flex="1 0 0" minW={isCompact ? 'full' : { base: 'full', md: '380px' }}>
                    <PersianDateInput />
                  </Box>

                </Flex>

                {/* Avatar — flex-start = RIGHT in RTL */}
                <Flex align="center" gap="4">
                  {/* Avatar — FIRST = rightmost */}
                  <Avatar.Root size="xl" bg="gray.muted" flexShrink={0}>
                    <Avatar.Fallback color="gray.fg" fontWeight="normal" fontSize="2xl">
                      MT
                    </Avatar.Fallback>
                  </Avatar.Root>
                  {/* Button — SECOND = leftmost */}
                  <Button variant="outline" colorPalette="brand" h="10" fontSize="sm" fontWeight="semibold" flexShrink={0}>
                    آپلود تصویر پروفایل
                  </Button>
                </Flex>

                <ButtonFooter
                  primary={{ label: 'ذخیره تغییرات', onClick: () => {} }}
                />
              </>
            )}

            {activeTab === 'security' && (
              <SecuritySection mobile={verifiedMobile} email={verifiedEmail} />
            )}

            {activeTab === 'auth' && (
              <Box py="8" textAlign="center" color="fg.muted" fontSize="sm">
                بخش احراز هویت در حال توسعه است
              </Box>
            )}
          </Box>
        </Flex>
      </Box>

      <OtpDialog
        open={otpTarget !== null}
        title={otpTarget === 'mobile' ? 'تایید شماره موبایل' : 'تایید ایمیل'}
        description={
          otpTarget === 'mobile'
            ? `کد تایید برای شماره ${mobile} از طریق پیامک ارسال شد`
            : `کد تایید به ایمیل ${email} از طریق پیامک ارسال شد`
        }
        onClose={() => setOtpTarget(null)}
        onConfirm={() => handleOtpConfirm(otpTarget)}
      />

    </Box>
  )
}
