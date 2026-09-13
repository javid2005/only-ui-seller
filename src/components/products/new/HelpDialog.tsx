import { Dialog, Portal, CloseButton, Text, Flex, Grid, Box, Icon } from '@chakra-ui/react'
import { Sparkles, Lightbulb } from 'lucide-react'
import { HELP_TOPICS, type HelpTone } from './helpContent'
import { sampleForCategory } from './categoryKnowledge'
import { useProductCategory } from './ProductContext'
import { CATEGORIES } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface HelpDialogProps {
  /** کلید موضوع در HELP_TOPICS — null یعنی بسته */
  topic: string | null
  onClose: () => void
  /** توضیح یک‌خطی زیر عنوان (از زیرعنوان همان بخش می‌آید) */
  description?: string
}

// رنگ هر لحن — سه لحن طرح: برند، آبی، کهربایی
const TONE: Record<HelpTone, { bg: string; border: string; fg: string }> = {
  brand:  { bg: 'brand.bg',  border: 'brand.muted',  fg: 'brand.fg'  },
  blue:   { bg: 'blue.bg',   border: 'blue.muted',   fg: 'blue.fg'   },
  orange: { bg: 'orange.bg', border: 'orange.muted', fg: 'orange.fg' },
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * HelpDialog — راهنمای هر بخش.
 *
 * سه بازخورد پشت این شکل است:
 *   ۱۴/۳ — رنگ و آیکن و گرید را می‌پسندم؛ برای ویدئو یک باکس شبیه پلیر بگذار.
 *   ۱۱/۲ — مدال‌ها عرض موبایلی داشتند و فونت‌ها بزرگ بود؛ مینیمال و عریض‌تر شود.
 * پس: عرض ۸۲۰px، فونت کوچک، گرید دوستونی، و لحن رنگی متفاوت برای هر کارت.
 *
 * ویدئو اینجا **نیست**: آموزش تصویریِ هر مرحله پشت آیکن ▶ قرمزِ کنار عنوانِ همان
 * مرحله است. دو جای متفاوت برای یک چیز، کاربر را گیج می‌کرد (بازخورد ۱۴۰۵/۰۶).
 *
 * متن‌ها از نسخهٔ تأییدشده می‌آیند (helpContent) و اینجا بازنویسی نمی‌شوند.
 */
export function HelpDialog({ topic, onClose, description }: HelpDialogProps) {
  const data = topic ? HELP_TOPICS[topic] : undefined
  const category = useProductCategory()
  const sample = sampleForCategory(category)
  const categoryLabel = CATEGORIES.find((c) => c.value === category)?.label

  return (
    <Dialog.Root open={Boolean(data)} onOpenChange={(e) => !e.open && onClose()} size="lg">
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner dir="rtl" py="6">
          <Dialog.Content maxW="820px" w="full" mx="4">

            <Dialog.Header pt="5" px="6" pb="3" position="relative">
              <Dialog.Title fontSize="md" fontWeight="semibold" textAlign="start" w="full">
                راهنمای «{data?.title}»
              </Dialog.Title>
              <Dialog.CloseTrigger asChild position="absolute" top="3" insetEnd="3">
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>

            <Dialog.Body px="6" pt="0" pb="5">
              {/* Hero — همان کادر رنگی طرح */}
              <Flex
                align="center"
                gap="3"
                p="4"
                rounded="xl"
                borderWidth="1px"
                borderColor="brand.muted"
                bgGradient="to-l"
                gradientFrom="brand.bg"
                gradientTo="blue.bg"
                mb="4"
              >
                {/* FIRST = rightmost: آیکن */}
                <Flex
                  boxSize="10" rounded="lg" flexShrink={0}
                  align="center" justify="center" bg="bg.panel" color="brand.fg"
                >
                  <Sparkles size={20} />
                </Flex>
                <Box minW="0">
                  <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start">
                    {data?.title}
                  </Text>
                  {description && (
                    <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
                      {description}
                    </Text>
                  )}
                </Box>
              </Flex>

              {/* گرید کارت‌ها — دو ستون، هر کارت با لحن رنگی خودش.
                  `alignItems: start` **برداشته شد** (بازخورد کاربر، مورد ۸):
                  کارت‌های نابرابرِ چسبیده به بالا ردیف‌ها را به‌هم‌ریخته نشان
                  می‌داد. راهِ درست، پرکردنِ خودِ محتوا بود نه کوتاه‌کردنِ کادر —
                  حالا هیچ کارتی کمتر از سه سطر ندارد، پس ارتفاع برابرِ ردیف
                  فضای پرت نمی‌سازد. (helpContent.ts) */}
              <Grid
                templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
                gap="2"
              >
                {data?.cards.map((card) => {
                  const tone = TONE[card.tone]
                  const CardIcon = card.icon
                  return (
                    <Flex
                      key={card.title}
                      gap="2"
                      p="2.5"
                      rounded="lg"
                      borderWidth="1px"
                      borderColor={tone.border}
                      bg={tone.bg}
                    >
                      {/* FIRST = rightmost: آیکن کارت */}
                      <Icon size="md" color={tone.fg} flexShrink={0} mt="0.5">
                        <CardIcon />
                      </Icon>
                      <Box minW="0">
                        <Text fontSize="xs" fontWeight="semibold" color="fg" textAlign="start" mb="1.5">
                          {card.title}
                        </Text>
                        <Flex direction="column" gap="0.5">
                          {card.items.map((item) => (
                            <Flex key={item} gap="2" align="start">
                              {/* FIRST = rightmost: نقطهٔ فهرست */}
                              <Box boxSize="1" rounded="full" bg={tone.fg} mt="1.5" flexShrink={0} />
                              <Text fontSize="11px" color="fg.muted" textAlign="start" lineHeight="1.6">
                                {item}
                              </Text>
                            </Flex>
                          ))}
                        </Flex>
                      </Box>
                    </Flex>
                  )
                })}
              </Grid>

              {/* ─── مثال، بر اساس دستهٔ انتخاب‌شده ────────────────────────────
                  راهنمای عمومی می‌گوید «نام واضح بنویسید»؛ این بخش می‌گوید برای
                  همین دسته‌بندی، «واضح» یعنی چه. متن‌ها از درخت دانش می‌آیند. */}
              <Flex
                direction="column"
                gap="2"
                mt="3"
                p="4"
                rounded="lg"
                borderWidth="1px"
                borderColor="border"
                bg="bg.subtle"
              >
                <Flex align="center" gap="2">
                  {/* FIRST = rightmost: آیکن */}
                  <Icon size="sm" color="fg.muted" flexShrink={0}><Lightbulb /></Icon>
                  <Text fontSize="xs" fontWeight="semibold" color="fg" textAlign="start">
                    مثال{categoryLabel ? ` — ${categoryLabel}` : ''}
                  </Text>
                </Flex>
                <Grid templateColumns={{ base: '1fr', md: '1fr 1fr' }} gap="2">
                  <ExampleRow label="نام محصول" value={sample.name} />
                  <ExampleRow label="توضیح کوتاه" value={sample.shortDescription} />
                  <ExampleRow label="برچسب‌ها" value={sample.tags.join(' · ')} />
                </Grid>
                {!categoryLabel && (
                  <Text fontSize="2xs" color="fg.muted" textAlign="start">
                    با انتخاب دسته‌بندی، مثال‌ها مخصوص همان دسته می‌شوند.
                  </Text>
                )}
              </Flex>
            </Dialog.Body>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

// ─── ExampleRow ─────────────────────────────────────────────────────────────────
/** یک ردیف از بخش مثال — برچسب بالا، متنِ نمونه داخل یک کادر سفید */
function ExampleRow({ label, value }: { label: string; value: string }) {
  return (
    <Box>
      <Text fontSize="2xs" color="fg.muted" textAlign="start" mb="1">{label}</Text>
      <Box
        px="2.5"
        py="1.5"
        rounded="md"
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border.muted"
      >
        <Text fontSize="xs" color="fg" textAlign="start" lineHeight="1.9">{value}</Text>
      </Box>
    </Box>
  )
}
