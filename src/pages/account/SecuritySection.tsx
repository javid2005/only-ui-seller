import { useState } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Box, Flex, Text, Field, Tabs,
} from '@chakra-ui/react'
import { CircleCheck, Circle } from 'lucide-react'
import { PasswordInput } from '@/components/ui/password-input'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { OtpDialog } from '@/components/ui/OtpDialog'
import { TwoFactorSection } from './TwoFactorSection'

// ─── Types ────────────────────────────────────────────────────────────────────

type SecurityTab = 'password' | '2fa' | 'history'

// ─── CheckItem ────────────────────────────────────────────────────────────────

function CheckItem({ met, label }: { met: boolean; label: string }) {
  return (
    <Flex px="3" py="1.5" gap="2" align="center">
      {/* RTL DOM order: icon FIRST=rightmost, text LAST=leftmost */}
      <Box color={met ? 'green.fg' : 'fg.subtle'} display="flex" flexShrink={0}>
        {met ? <CircleCheck size={14} /> : <Circle size={14} />}
      </Box>
      <Text
        fontSize="xs"
        fontWeight="medium"
        color={met ? 'green.fg' : 'fg.subtle'}
        flex="1"
      >
        {label}
      </Text>
    </Flex>
  )
}

// ─── PasswordField ────────────────────────────────────────────────────────────

interface PasswordFieldProps {
  label: string
  placeholder?: string
  value: string
  onChange: (val: string) => void
  helperText?: React.ReactNode
}

function PasswordField({ label, placeholder, value, onChange, helperText }: PasswordFieldProps) {
  return (
    <Field.Root>
      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">{label}</Field.Label>
      <PasswordInput
        placeholder={placeholder ?? label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        w="full"
      />
      {helperText && (
        <Field.HelperText fontSize="xs" color="fg.muted">{helperText}</Field.HelperText>
      )}
    </Field.Root>
  )
}

// ─── SecuritySection ──────────────────────────────────────────────────────────

interface SecuritySectionProps {
  /** شماره موبایل تأییدشده */
  mobile: string
  /** ایمیل تأییدشده — برای badge کارت ایمیل در 2FA */
  email?: string
}

export function SecuritySection({ mobile, email }: SecuritySectionProps) {
  const isCompact = useCompactMode()

  // ── Tab ──────────────────────────────────────────────────────────────────
  const [secTab, setSecTab] = useState<SecurityTab>('password')

  // ── Password form ─────────────────────────────────────────────────────────
  /**
   * hasPassword = false: کاربر هنوز رمز عبور ست نکرده (فیلد فعلی نشون نمیده)
   * hasPassword = true: بعد از اولین ست شدن، فیلد «رمز عبور فعلی» نمایش داده میشه
   */
  const [hasPassword, setHasPassword] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  // ── OTP dialog ─────────────────────────────────────────────────────────────
  const [otpOpen, setOtpOpen] = useState(false)

  // ── Live password criteria ─────────────────────────────────────────────────
  const criteria = {
    minLength:    newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasLowercase: /[a-z]/.test(newPassword),
    hasNumber:    /[0-9]/.test(newPassword),
  }

  const allCriteriaMet  = Object.values(criteria).every(Boolean)
  const passwordsMatch  = newPassword !== '' && newPassword === confirmPassword
  const formValid       = allCriteriaMet && passwordsMatch && (!hasPassword || currentPassword !== '')

  // ── Handlers ───────────────────────────────────────────────────────────────

  function handleSubmit() {
    if (!formValid) return
    setOtpOpen(true)
  }

  function handleOtpConfirm() {
    setOtpOpen(false)
    // رمز با موفقیت ست شد — از این پس فیلد «رمز عبور فعلی» نمایش داده میشه
    setHasPassword(true)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ══ Horizontal Tabs ══ */}
      <Tabs.Root
        variant="enclosed"
        fitted
        value={secTab}
        onValueChange={(e) => setSecTab(e.value as SecurityTab)}
        w="full"
      >
        <Tabs.List>
          {/* RTL: first tab in DOM = rightmost visually */}
          <Tabs.Trigger value="password" fontSize="sm">رمز عبور</Tabs.Trigger>
          <Tabs.Trigger value="2fa" fontSize="sm">تایید دو مرحله‌ای</Tabs.Trigger>
          <Tabs.Trigger value="history" fontSize="sm">تاریخچه ورود</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>

      {/* ══ Password tab ══ */}
      {secTab === 'password' && (
        <>
          <TitleBar
            title="رمز عبور"
            subtitle="ایجاد و ویرایش رمز عبور"
            divider
          />

          {/* Fields — max-w 472px (Figma: Column w=472px) */}
          <Flex
            direction="column"
            gap="4"
            maxW={isCompact ? 'full' : { base: 'full', md: '472px' }}
            w="full"
          >
            {/* رمز عبور فعلی — فقط اگه hasPassword */}
            {hasPassword && (
              <PasswordField
                label="رمز عبور فعلی"
                value={currentPassword}
                onChange={setCurrentPassword}
                helperText={
                  <Text as="span" fontSize="xs" color="fg.muted">
                    در صورت فراموشی رمز عبور، از طریق گزینه{' '}
                    <Text as="span" fontWeight="bold">فراموشی رمز عبور</Text>
                    {' '}در صفحه لاگین اقدام نمایید.
                  </Text>
                }
              />
            )}

            {/* رمز عبور جدید */}
            <PasswordField
              label="رمز عبور جدید"
              value={newPassword}
              onChange={setNewPassword}
            />

            {/* تکرار رمز عبور جدید */}
            <PasswordField
              label="تکرار رمز عبور جدید"
              value={confirmPassword}
              onChange={setConfirmPassword}
            />
          </Flex>

          {/* CheckList — Figma: bg.subtle + border.emphasized + dashed */}
          <Box
            bg="bg.subtle"
            borderWidth="1px"
            borderColor="border.emphasized"
            borderStyle="dashed"
            borderRadius="sm"
            py="1"
            maxW={isCompact ? 'full' : { base: 'full', md: '472px' }}
            w="full"
          >
            <CheckItem met={criteria.minLength}    label="حداقل ۸ کاراکتر باشد." />
            <CheckItem met={criteria.hasUppercase} label="شامل حروف بزرگ باشد." />
            <CheckItem met={criteria.hasLowercase} label="شامل حروف کوچک باشد." />
            <CheckItem met={criteria.hasNumber}    label="شامل عدد باشد." />
          </Box>

          <ButtonFooter
            primary={{
              label: 'ذخیره و ارسال کد',
              onClick: handleSubmit,
              disabled: !formValid,
            }}
          />
        </>
      )}

      {/* ══ 2FA tab ══ */}
      {secTab === '2fa' && (
        <TwoFactorSection mobile={mobile} email={email} />
      )}

      {/* ══ Login history tab placeholder ══ */}
      {secTab === 'history' && (
        <Box py="8" textAlign="center" color="fg.muted" fontSize="sm">
          بخش تاریخچه ورود در حال توسعه است
        </Box>
      )}

      {/* ══ OTP Dialog ══ */}
      <OtpDialog
        open={otpOpen}
        title="کد تایید شماره"
        description={`کد تایید برای شماره ${mobile} از طریق پیامک ارسال شد`}
        onClose={() => setOtpOpen(false)}
        onConfirm={handleOtpConfirm}
      />
    </>
  )
}
