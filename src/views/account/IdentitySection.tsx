import { useState } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import {
  Alert, Badge, Box, Button,
  FileUpload, Flex, Icon, Separator, Steps, Text,
  useBreakpointValue,
} from '@chakra-ui/react'
import { Check, Upload } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { NationalIdInput } from '@/components/ui/NationalIdInput'
import { isValidNationalId } from '@/utils/validation'

// ─── Types ────────────────────────────────────────────────────────────────────

type IdentityStatus = 'empty' | 'pending' | 'approved'

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_CONFIG = {
  empty:    { label: 'در انتظار تکمیل', colorPalette: 'gray'   },
  pending:  { label: 'در انتظار بررسی', colorPalette: 'gray'   },
  approved: { label: 'تایید شده',       colorPalette: 'green'  },
} as const satisfies Record<IdentityStatus, { label: string; colorPalette: string }>

const STEPS = [
  {
    title: 'آپلود مدارک',
    description: 'کد ملی باید با شماره تلفن ثبت‌شده در سامانه شاهکار مطابقت داشته باشد. عکس واضح و خوانا از کارت ملی آپلود کنید.',
  },
  {
    title: 'تایید توسط پشتیبانی',
    description: 'پس از ارسال، تیم ویترینا ظرف ۱-۲ روز کاری بررسی می‌کند.',
  },
]

const MOCK_NATIONAL_ID = '۱۲۳۴۵۶۷۸'

// ─── IdentitySection ──────────────────────────────────────────────────────────

export function IdentitySection() {
  const isCompact = useCompactMode()
  const bpOrientation = useBreakpointValue({ base: 'vertical', lg: 'horizontal' } as const) ?? 'horizontal'
  const stepsOrientation = isCompact ? 'vertical' : bpOrientation

  const [status, setStatus] = useState<IdentityStatus>('empty')
  const [nationalId, setNationalId] = useState('')
  const [nationalIdError, setNationalIdError] = useState('')

  const { label, colorPalette } = STATUS_CONFIG[status]
  const isSubmitted = status !== 'empty'
  const isApproved  = status === 'approved'

  // empty=0 (step1 active), pending=1 (step1 done, step2 active), approved=2 (all done)
  const activeStep = status === 'empty' ? 0 : status === 'pending' ? 1 : 2

  function validateNationalId() {
    const valid = !nationalId.trim() || isValidNationalId(nationalId)
    setNationalIdError(valid ? '' : 'کد ملی وارد شده صحیح نمی باشد')
    return valid
  }

  function handleSubmit() {
    if (!nationalId.trim() || !validateNationalId()) return
    setStatus('pending')
  }

  function handleCancel() {
    setStatus('empty')
  }

  return (
    <>
      {/* ══ TitleBar ══ */}
      <TitleBar
        title="احراز هویت"
        subtitle="برای استفاده از تمامی خدمات و انتشار محصولات نیاز به احراز هویت دارید."
        divider
        badge={
          <Badge colorPalette={colorPalette} variant="subtle" size="sm" flexShrink={0}>
            {label}
          </Badge>
        }
      />

      {/* ══ Warning Alert ══ */}
      <Alert.Root status="warning" variant="subtle" w="full" size="sm">
        {/* Indicator FIRST = rightmost in RTL */}
        <Alert.Indicator />
        <Alert.Title flex="1" fontSize="xs">
          بدون احراز هویت می‌توانید محصولات را ثبت کنید اما برای انتشار عمومی باید هویت خود را تایید کنید.
        </Alert.Title>
      </Alert.Root>

      {/* ══ Steps ══ */}
      <Box bg="bg.subtle" borderRadius="lg" px="10" py="4" w="full">
        <Steps.Root
          step={activeStep}
          count={STEPS.length}
          colorPalette="teal"
          w="full"
          orientation={stepsOrientation}
        >
          <Steps.List>
            {STEPS.map((s, i) => (
              <Steps.Item key={i} index={i} flex="1" title={s.title}>
                <Steps.Indicator>
                  <Steps.Status
                    incomplete={<>{['۱','۲','۳','۴','۵'][i]}</>}
                    complete={<Check size={14} />}
                  />
                </Steps.Indicator>
                <Box>
                  <Steps.Title>{s.title}</Steps.Title>
                  <Steps.Description fontSize="xs">{s.description}</Steps.Description>
                </Box>
                <Steps.Separator />
              </Steps.Item>
            ))}
          </Steps.List>
        </Steps.Root>
      </Box>

      {/* ══ Section: کد ملی + Upload ══ */}
      <Flex direction="column" gap="6" w="full">

        {/* کد ملی */}
        <Box w={isCompact ? 'full' : { base: 'full', md: '472px' }}>
          <NationalIdInput
            label="کد ملی"
            placeholder="کد ملی را وارد کنید."
            value={isSubmitted ? MOCK_NATIONAL_ID : nationalId}
            onChange={(val) => { if (isSubmitted) return; setNationalId(val); if (nationalIdError) setNationalIdError('') }}
            onBlur={validateNationalId}
            error={nationalIdError}
            readOnly={isSubmitted}
            disabled={isApproved}
            type={status === 'pending' ? 'password' : 'text'}
          />
        </Box>

        {/* آپلود تصویر کارت ملی */}
        <Box w="full">
          <Text fontSize="sm" fontWeight="semibold" color="fg" mb="2">
            آپلود تصویر کارت ملی
          </Text>

          {!isSubmitted ? (
            /* Dropzone — state: empty */
            <FileUpload.Root
              accept={['image/png', 'image/jpeg', 'image/jpg', 'image/webp']}
              maxFiles={1}
              w="full"
            >
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone w="full" minH="128px" cursor="pointer">
                <Icon color="fg.muted"><Upload size={20} /></Icon>
                <FileUpload.DropzoneContent>
                  <Text fontSize="sm" fontWeight="medium" textAlign="center">
                    برای بارگذاری، اینجا بکشید و رها کنید یا کلیک کنید
                  </Text>
                  <Text fontSize="xs" color="fg.muted" textAlign="center">
                    حجم فایل: حداکثر ۲ مگابایت
                  </Text>
                  <Text fontSize="xs" color="fg.muted" textAlign="center">
                    فرمت تصویر مجاز: png, jpg, jpeg, webp, heic
                  </Text>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
            </FileUpload.Root>
          ) : (
            /* Image preview — states: pending / approved */
            <Box
              w="220px"
              h="138px"
              borderRadius="xl"
              overflow="hidden"
              bg="gray.100"
              borderWidth="1px"
              borderColor="border"
            />
          )}
        </Box>
      </Flex>

      {/* ══ Footer ══ */}
      {status === 'empty' && (
        <ButtonFooter
          primary={{
            label: 'ارسال برای بررسی',
            onClick: handleSubmit,
            disabled: !nationalId.trim(),
          }}
          secondary={{ label: 'بعداً تکمیل میکنم', onClick: () => {} }}
        />
      )}

      {status === 'pending' && (
        <Box pt="4" w="full">
          <Separator mb="4" />
          {/* justify="flex-end" در RTL = سمت چپ بصری */}
          <Flex justify="flex-end">
            <Button colorPalette="red" variant="outline" onClick={handleCancel}>
              لغو درخواست
            </Button>
          </Flex>
        </Box>
      )}
      {/* approved: no footer */}
    </>
  )
}
