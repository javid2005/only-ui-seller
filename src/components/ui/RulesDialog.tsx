import { Button, CloseButton, Dialog, Flex, Portal, Text } from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'

// محتوای دقیقاً طبق طرح Figma (node 4566:75758) — پاراگراف‌های P1/P2/P3 که ۹بار (با یک الحاق P3+P1
// عیناً در فایل طراحی) تکرار شده‌اند، حتی جایی که به‌نظر artifact کپی‌پیست می‌رسه، عیناً کپی شده.
const P1 =
  'پلتفرم فروش کالا در اینستاگرام به عنوان یکی از محبوب‌ترین روش‌های خرید و فروش آنلاین، نیازمند رعایت قوانین و مقررات خاصی است تا کاربران بتوانند تجربه‌ای امن و مثبت داشته باشند. این قوانین به منظور جلوگیری از سوءاستفاده و حفظ حقوق تمامی کاربران طراحی شده‌اند. از جمله این قوانین می‌توان به ممنوعیت فروش کالاهای غیرقانونی و رعایت حقوق مالکیت معنوی اشاره کرد. به عنوان مثال، فروش کالاهایی که تحت قوانین کپی‌رایت قرار دارند، مجاز نیست و کاربران باید از ارائه اطلاعات نادرست یا گمراه‌کننده درباره محصولات خود پرهیز کنند.'
const P2 =
  'اینستاگرام همچنین به کاربران توصیه می‌کند که از محتوای اصلی و تصاویر خود استفاده کنند و از کپی‌برداری از دیگران خودداری نمایند. این اقدام نه تنها به اعتبار فروشندگان کمک می‌کند، بلکه به ایجاد یک جامعه سالم و قابل اعتماد در پلتفرم نیز می‌انجامد. کاربران باید به حقوق دیگران احترام بگذارند و از هرگونه فعالیتی که ممکن است به دیگران آسیب برساند، دوری کنند.'
const P3 =
  'رعایت این قوانین به کاربران کمک می‌کند تا در فضای مجازی با اطمینان بیشتری فعالیت کنند و از تجربه خرید و فروش خود لذت ببرند. در نهایت، اینستاگرام با ایجاد یک محیط امن و قابل اعتماد، به کاربران این امکان را می‌دهد که بدون نگرانی از مشکلات قانونی، به تجارت خود ادامه دهند.'

const RULES_PARAGRAPHS = [P1, P2, P3 + P1, P2, P3 + P1, P2, P3 + P1, P2, P3]

export interface RulesDialogProps {
  open: boolean
  onClose: () => void
}

export function RulesDialog({ open, onClose }: RulesDialogProps) {
  const isCompact = useCompactMode()

  return (
    <Dialog.Root open={open} onOpenChange={({ open: o }) => !o && onClose()} placement="center">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl">
          <Dialog.Content maxW={isCompact ? '480px' : '672px'} w="full" mx="4">
            <Dialog.Header pt="6" pb="4" px="6">
              <Dialog.Title fontSize="lg" fontWeight="semibold" color="fg">قوانین و مقررات ویترینا</Dialog.Title>
            </Dialog.Header>

            {/* maxH+overflowY = محتوا اسکرول می‌خوره، طبق h=600px فیگما */}
            <Dialog.Body pt="2" pb="4" px="6" maxH="600px" overflowY="auto">
              <Flex direction="column" gap="5">
                {RULES_PARAGRAPHS.map((p, i) => (
                  <Text key={i} fontSize="sm" color="fg.muted" textAlign="start" lineHeight="1.43">
                    {p}
                  </Text>
                ))}
              </Flex>
            </Dialog.Body>

            {/* دکمهٔ تنها (بستن) — چپ، طبق طرح Figma و قرارداد پروژه (primary/تنها دکمه = چپ) */}
            <Dialog.Footer pt="2" pb="4" px="6">
              <Flex justify="end" w="full">
                <Button variant="outline" colorPalette="gray" onClick={onClose}>بستن</Button>
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
