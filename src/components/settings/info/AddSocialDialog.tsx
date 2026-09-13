import { useState } from 'react'
import {
  Dialog, Button, Portal, CloseButton, Field, Input,
  Select, createListCollection, Flex,
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
  { value: 'whatsapp',  label: 'واتساپ'      },
  { value: 'instagram', label: 'اینستاگرام'  },
  { value: 'twitter',   label: 'توییتر / X'  },
  { value: 'facebook',  label: 'فیسبوک'      },
  { value: 'linkedin',  label: 'لینکدین'     },
  { value: 'tiktok',    label: 'تیک‌تاک'     },
  { value: 'discord',   label: 'دیسکورد'     },
  { value: 'youtube',   label: 'یوتیوب'      },
  { value: 'other',     label: 'سایر'        },
]

const platformCollection = createListCollection({ items: PLATFORMS })

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
              position="relative" pe="12">
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
                <Select.Root
                  collection={platformCollection}
                  value={[platform]}
                  onValueChange={(e) => setPlatform((e.value[0] ?? 'telegram') as Platform)}
                >
                  <Select.HiddenSelect />
                  <Select.Control>
                    <Select.Trigger>
                      <Select.ValueText />
                    </Select.Trigger>
                    <Select.IndicatorGroup>
                      <Select.Indicator />
                    </Select.IndicatorGroup>
                  </Select.Control>
                  <Select.Positioner>
                    <Select.Content>
                      {platformCollection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                          <Select.ItemText>{item.label}</Select.ItemText>
                          <Select.ItemIndicator />
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Positioner>
                </Select.Root>
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
                  textAlign="start"
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
              {/* RTL: FIRST=rightmost=لغو, LAST=leftmost=ذخیره */}
              <Flex gap="3">
                <Button variant="outline" onClick={handleClose}>
                  لغو
                </Button>
                <Button
                  colorPalette="brand"
                  onClick={handleSubmit}
                  disabled={!handle.trim()}
                >
                  {isEdit ? 'ذخیره تغییرات' : 'ذخیره'}
                </Button>
              </Flex>
            </Dialog.Footer>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
