import { useState } from 'react'
import {
  Dialog, Button, Portal, CloseButton, Field, Input,
  NativeSelect, Flex,
} from '@chakra-ui/react'
import type { SocialCardProps, Platform } from './SocialCard'

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddSocialDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: Omit<SocialCardProps, 'id' | 'onEdit' | 'onDelete'>) => void
  initial?: Omit<SocialCardProps, 'id' | 'onEdit' | 'onDelete'>
}

// ─── Platform options ─────────────────────────────────────────────────────────

const PLATFORMS: { value: Platform; label: string }[] = [
  { value: 'telegram',  label: 'تلگرام'      },
  { value: 'instagram', label: 'اینستاگرام'  },
  { value: 'youtube',   label: 'یوتیوب'       },
  { value: 'twitter',   label: 'توییتر / X'   },
  { value: 'linkedin',  label: 'لینکدین'      },
  { value: 'facebook',  label: 'فیسبوک'       },
  { value: 'other',     label: 'سایر'         },
]

// ─── Component ────────────────────────────────────────────────────────────────

export function AddSocialDialog({ open, onClose, onSubmit, initial }: AddSocialDialogProps) {
  const [title,    setTitle]    = useState(initial?.title    ?? '')
  const [platform, setPlatform] = useState<Platform>(initial?.platform ?? 'telegram')
  const [handle,   setHandle]   = useState(initial?.handle   ?? '')

  const isEdit = !!initial

  function handleSubmit() {
    if (!handle.trim()) return
    onSubmit({
      title:    title.trim() || (PLATFORMS.find(p => p.value === platform)?.label ?? platform),
      platform,
      handle:   handle.trim(),
    })
    onClose()
  }

  function handleClose() {
    setTitle('')
    setPlatform('telegram')
    setHandle('')
    onClose()
  }

  return (
    <Dialog.Root open={open} onOpenChange={(e) => !e.open && handleClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW="432px" w="full" mx="4">

            {/* Header */}
            <Dialog.Header
              borderBottomWidth="1px"
              borderColor="border"
              pb="4"
              pt="6"
              px="6"
              position="relative"
            >
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">
                {isEdit ? 'ویرایش شبکه اجتماعی' : 'افزودن شبکه اجتماعی'}
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="4" insetEnd="4">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            {/* Body */}
            <Dialog.Body px="6" py="5" display="flex" flexDirection="column" gap="5">

              {/* نوع شبکه */}
              <Field.Root required>
                <Field.Label fontSize="sm" color="fg">
                  پلتفرم
                  <Field.RequiredIndicator />
                </Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as Platform)}
                  >
                    {PLATFORMS.map((p) => (
                      <option key={p.value} value={p.value}>{p.label}</option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              {/* عنوان */}
              <Field.Root>
                <Field.Label fontSize="sm" color="fg">عنوان نمایشی</Field.Label>
                <Input
                  placeholder="مثال: کانال رسمی"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <Field.HelperText fontSize="xs">
                  اگه خالی بمونه، نام پلتفرم نمایش داده میشه
                </Field.HelperText>
              </Field.Root>

              {/* آدرس / یوزرنیم */}
              <Field.Root required>
                <Field.Label fontSize="sm" color="fg">
                  آدرس / یوزرنیم
                  <Field.RequiredIndicator />
                </Field.Label>
                <Input
                  placeholder="مثال: @mystore"
                  value={handle}
                  onChange={(e) => setHandle(e.target.value)}
                  dir="ltr"
                  textAlign="right"
                />
              </Field.Root>

            </Dialog.Body>

            {/* Footer */}
            <Dialog.Footer
              borderTopWidth="1px"
              borderColor="border"
              px="6"
              py="4"
            >
              <Flex gap="3">
                <Button
                  colorPalette="teal"
                  onClick={handleSubmit}
                  disabled={!handle.trim()}
                >
                  {isEdit ? 'ذخیره تغییرات' : 'افزودن'}
                </Button>
                <Button variant="ghost" onClick={handleClose}>
                  لغو
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
