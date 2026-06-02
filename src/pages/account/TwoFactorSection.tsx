import { useState } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Alert, Badge, Button, Dialog, Field, Flex, Input,
  PinInput, Portal, CloseButton, QrCode, Text, chakra,
} from '@chakra-ui/react'
import { Copy, KeyRound, Mail, Smartphone } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { OtpDialog } from '@/components/ui/OtpDialog'

// ─── InfoAlert ────────────────────────────────────────────────────────────────

function InfoAlert({ children }: { children: React.ReactNode }) {
  return (
    <Alert.Root status="info" variant="subtle" w="full" size="sm">
      {/* Indicator FIRST = rightmost in RTL */}
      <Alert.Indicator />
      {/* Title LAST = leftmost in RTL */}
      <Alert.Title flex="1" fontSize="xs">{children}</Alert.Title>
    </Alert.Root>
  )
}

// ─── TwoFactorCard ────────────────────────────────────────────────────────────

interface TwoFactorCardProps {
  title: string
  description: string
  badge?: string
  icon: React.ReactNode
  isActive: boolean
  isDisabled?: boolean
  onActivate: () => void
  onDeactivate: () => void
}

function TwoFactorCard({
  title, description, badge, icon,
  isActive, isDisabled, onActivate, onDeactivate,
}: TwoFactorCardProps) {
  return (
    <Flex
      gap="4"
      align="center"
      p="4"
      borderWidth="1px"
      borderColor={isActive ? 'brand.solid' : 'border'}
      borderRadius="xl"
      bg={isActive ? 'teal.50' : 'bg.subtle'}
      w="full"
      overflow="hidden"
      minW="0"
    >
      {/* Icon container — FIRST = rightmost in RTL */}
      <Flex
        flexShrink={0}
        w="10"
        h="10"
        borderRadius="md"
        bg={isActive ? 'teal.100' : 'bg.muted'}
        align="center"
        justify="center"
        color="brand.solid"
      >
        {icon}
      </Flex>

      {/* Content — MIDDLE, alignItems=flex-start = right side in RTL column */}
      <Flex flex="1" direction="column" gap="1" alignItems="flex-start" minW="0">
        {/* title FIRST = rightmost, badge SECOND = to its left */}
        <Flex gap="4" align="center" w="full">
          <Text fontSize="sm" fontWeight="semibold" color="fg" whiteSpace="nowrap" flexShrink={0}>
            {title}
          </Text>
          {badge && (
            <Badge colorPalette="purple" variant="subtle" size="xs" flexShrink={0}>
              {badge}
            </Badge>
          )}
        </Flex>
        <Text fontSize="xs" color="fg.muted">{description}</Text>
      </Flex>

      {/* Button — LAST = leftmost in RTL */}
      {isActive ? (
        <Button
          variant="outline"
          size="sm"
          h="10"
          px="4"
          flexShrink={0}
          onClick={onDeactivate}
          color="brand.fg"
          borderColor="brand.solid"
        >
          غیرفعال کردن
        </Button>
      ) : (
        <Button
          colorPalette="brand"
          size="sm"
          h="10"
          px="4"
          flexShrink={0}
          onClick={onActivate}
          disabled={isDisabled}
          opacity={isDisabled ? 0.4 : 1}
        >
          فعال کردن
        </Button>
      )}
    </Flex>
  )
}

// ─── EmailInputDialog ─────────────────────────────────────────────────────────

interface EmailInputDialogProps {
  open: boolean
  onClose: () => void
  onContinue: (email: string) => void
}

function EmailInputDialog({ open, onClose, onContinue }: EmailInputDialogProps) {
  const isCompact = useCompactMode()
  const [emailVal, setEmailVal] = useState('')

  function handleContinue() {
    if (!emailVal.trim()) return
    onContinue(emailVal.trim())
  }

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '480px' : 'sm'} w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">
                فعال کردن تایید دومرحله ای
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="4" px="6" display="flex" flexDirection="column" gap="6">
              <Text fontSize="sm" color="fg.muted" textAlign="center" w="full">
                جهت فعال کردن تایید دومرحله ای از طریق ایمیل ابتدا ایمیل خود را ثبت نمایید.
              </Text>

              <Field.Root>
                <Field.Label fontSize="sm" fontWeight="semibold" color="fg">ایمیل</Field.Label>
                <Input
                  placeholder="ایمیل را وارد نمایید"
                  value={emailVal}
                  onChange={(e) => setEmailVal(e.target.value)}
                  type="email"
                  textAlign="end"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleContinue() }}
                />
              </Field.Root>
            </Dialog.Body>

            {/* Footer — انصراف FIRST=راست، ادامه LAST=چپ (consistent با ButtonFooter) */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex gap="3">
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={handleContinue} disabled={!emailVal.trim()}>
                  ادامه
                </Button>
              </Flex>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── AuthQrDialog ─────────────────────────────────────────────────────────────

const MOCK_SECRET = 'JHgjasdugJHBjhasd12312bjkBHJBGAsjsdh31eh'

interface AuthQrDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

function AuthQrDialog({ open, onClose, onConfirm }: AuthQrDialogProps) {
  const isCompact = useCompactMode()
  const [pinValue, setPinValue] = useState<string[]>(['', '', '', '', ''])

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '480px' : 'sm'} w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">
                فعال کردن تایید دومرحله ای
              </Dialog.Title>
            </Dialog.Header>

            <Dialog.Body pt="2" pb="4" px="6" display="flex" flexDirection="column" gap="6" alignItems="center">
              <Text fontSize="sm" color="fg.muted" textAlign="center" w="full">
                جهت فعال کردن تایید دومرحله ای مراحل زیر را انجام دهید:
              </Text>

              <Text fontSize="sm" color="fg.muted" textAlign="center" w="full" dir="rtl">
                ۱. QR Code زیر را از طریق برنامه Google Authenticator اسکن کنید و یا آدرس زیر را در برنامه Google Authenticator وارد کنید.
              </Text>

              {/* QR Code — در production value از سرور می‌آید */}
              <QrCode.Root
                value={`otpauth://totp/Vitrina?secret=${MOCK_SECRET}&issuer=Vitrina`}
                size="xl"
                flexShrink={0}
              >
                <QrCode.Frame>
                  <QrCode.Pattern />
                </QrCode.Frame>
              </QrCode.Root>

              {/* Secret key — text FIRST (right in RTL), copy LAST (left) */}
              <Flex
                justify="center"
                gap="2"
                align="center"
                py="2"
                px="3"
                bg="teal.50"
                borderWidth="1px"
                borderColor="teal.200"
                borderStyle="dashed"
                borderRadius="md"
                w="full"
                overflow="hidden"
              >
                {/* Copy icon FIRST = rightmost in RTL */}
                <chakra.button
                  type="button"
                  color="brand.solid"
                  display="flex"
                  flexShrink={0}
                  onClick={() => navigator.clipboard.writeText(MOCK_SECRET)}
                  _hover={{ color: 'brand.fg' }}
                  cursor="pointer"
                >
                  <Copy size={16} />
                </chakra.button>
                {/* Secret key text LAST = leftmost in RTL */}
                <Text
                  fontSize="sm"
                  fontWeight="semibold"
                  color="fg"
                  dir="ltr"
                  flex="1"
                  overflow="hidden"
                  textOverflow="ellipsis"
                  whiteSpace="nowrap"
                >
                  {MOCK_SECRET}
                </Text>
              </Flex>

              <Text fontSize="sm" color="fg.muted" textAlign="center" w="full" dir="rtl">
                ۲. کد ایجاد شده در Google Authenticator را وارد نمایید.
              </Text>

              {/* dir="ltr" روی Control — Dialog.Positioner dir="rtl" cascade میشه */}
              <PinInput.Root value={pinValue} onValueChange={(e) => setPinValue(e.value)} otp dir="ltr">
                <PinInput.HiddenInput />
                <PinInput.Control dir="ltr" gap="2">
                  <PinInput.Input index={0} />
                  <PinInput.Input index={1} />
                  <PinInput.Input index={2} />
                  <PinInput.Input index={3} />
                  <PinInput.Input index={4} />
                </PinInput.Control>
              </PinInput.Root>
            </Dialog.Body>

            {/* Footer — انصراف FIRST=راست، تایید LAST=چپ (consistent با ButtonFooter) */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex gap="3">
                <Button variant="outline" onClick={onClose}>انصراف</Button>
                <Button colorPalette="brand" onClick={onConfirm}>تایید و فعال کردن</Button>
              </Flex>
            </Dialog.Footer>

            <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── TwoFactorSection ─────────────────────────────────────────────────────────

type ActiveMethod = 'sms' | 'email' | 'authenticator' | null

interface TwoFactorSectionProps {
  mobile: string
  email?: string
}

export function TwoFactorSection({ mobile, email = '' }: TwoFactorSectionProps) {
  const [activeMethod, setActiveMethod] = useState<ActiveMethod>(null)

  const [smsOtpOpen, setSmsOtpOpen] = useState(false)
  const [emailDialog, setEmailDialog] = useState<'input' | 'otp' | null>(null)
  const [pendingEmail, setPendingEmail] = useState('')
  const [authDialog, setAuthDialog] = useState<'sms-otp' | 'qr' | null>(null)

  const [emailBadge, setEmailBadge] = useState(email)

  const isAnyActive = activeMethod !== null

  return (
    <>
      <TitleBar
        title="تایید دو مرحله‌ای"
        subtitle="امنیت حساب خود را با یک لایه تایید اضافه بیشتر کنید."
        divider
      />

      <InfoAlert>
        تنها یک روش تایید دو مرحله‌ای می‌توان فعال کرد. برای فعال‌سازی، نیاز به تایید OTP است.
      </InfoAlert>

      <Flex direction="column" gap="4" w="full">
        {/* پیامک */}
        <TwoFactorCard
          title="پیامک"
          description="دریافت کد از طریق پیامک"
          badge={mobile}
          icon={<Smartphone size={24} />}
          isActive={activeMethod === 'sms'}
          isDisabled={isAnyActive && activeMethod !== 'sms'}
          onActivate={() => setSmsOtpOpen(true)}
          onDeactivate={() => setActiveMethod(null)}
        />

        {/* ایمیل */}
        <TwoFactorCard
          title="ایمیل"
          description="دریافت کد از طریق ایمیل"
          badge={emailBadge || 'ایمیل ست نشده'}
          icon={<Mail size={24} />}
          isActive={activeMethod === 'email'}
          isDisabled={isAnyActive && activeMethod !== 'email'}
          onActivate={() => setEmailDialog('input')}
          onDeactivate={() => setActiveMethod(null)}
        />

        {/* Authenticator */}
        <TwoFactorCard
          title="اپلیکیشن Authenticator"
          description="دریافت کد از طریق برنامه Google Authenticator"
          icon={<KeyRound size={24} />}
          isActive={activeMethod === 'authenticator'}
          isDisabled={isAnyActive && activeMethod !== 'authenticator'}
          onActivate={() => setAuthDialog('sms-otp')}
          onDeactivate={() => setActiveMethod(null)}
        />
      </Flex>

      {/* SMS OTP */}
      <OtpDialog
        open={smsOtpOpen}
        title="فعال کردن تایید دومرحله ای"
        description={`کد تایید برای شماره ${mobile} از طریق پیامک ارسال شد`}
        confirmLabel="تایید و فعال کردن"
        onClose={() => setSmsOtpOpen(false)}
        onConfirm={() => { setSmsOtpOpen(false); setActiveMethod('sms') }}
      />

      {/* Email step 1 — enter email */}
      <EmailInputDialog
        open={emailDialog === 'input'}
        onClose={() => setEmailDialog(null)}
        onContinue={(em) => { setPendingEmail(em); setEmailDialog('otp') }}
      />

      {/* Email step 2 — OTP */}
      <OtpDialog
        open={emailDialog === 'otp'}
        title="فعال کردن تایید دومرحله ای"
        description={`کد تایید به ایمیل ${pendingEmail} ارسال شد`}
        confirmLabel="تایید و فعال کردن"
        onClose={() => setEmailDialog(null)}
        onConfirm={() => {
          setEmailBadge(pendingEmail)
          setEmailDialog(null)
          setActiveMethod('email')
        }}
      />

      {/* Authenticator step 1 — SMS OTP */}
      <OtpDialog
        open={authDialog === 'sms-otp'}
        title="کد تایید"
        description={`کد تایید برای شماره ${mobile} از طریق پیامک ارسال شد`}
        confirmLabel="تایید و ادامه"
        onClose={() => setAuthDialog(null)}
        onConfirm={() => setAuthDialog('qr')}
      />

      {/* Authenticator step 2 — QR code */}
      <AuthQrDialog
        open={authDialog === 'qr'}
        onClose={() => setAuthDialog(null)}
        onConfirm={() => { setAuthDialog(null); setActiveMethod('authenticator') }}
      />
    </>
  )
}
