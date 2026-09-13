import { Dialog, Portal, CloseButton, Text, Flex, Grid, Box, Icon, AspectRatio } from '@chakra-ui/react'
import { Play, Sparkles } from 'lucide-react'
import { HELP_TOPICS, type HelpTone } from './helpContent'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface HelpDialogProps {
  /** کلید موضوع در HELP_TOPICS — null یعنی بسته */
  topic: string | null
  onClose: () => void
  /** توضیح یک‌خطی زیر عنوان (از زیرعنوان همان بخش می‌آید) */
  description?: string
  /** نمایش باکس ویدئوی آموزشی */
  withVideo?: boolean
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
 * متن‌ها از نسخهٔ تأییدشده می‌آیند (helpContent) و اینجا بازنویسی نمی‌شوند.
 */
export function HelpDialog({ topic, onClose, description, withVideo }: HelpDialogProps) {
  const data = topic ? HELP_TOPICS[topic] : undefined

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

              {/* باکس ویدئو — فقط نمای پلیر، بدون پخش واقعی (بند ۳ دور «چاکرا طراح») */}
              {withVideo && (
                <Box rounded="xl" overflow="hidden" borderWidth="1px" borderColor="border" mb="4">
                  <AspectRatio ratio={16 / 9}>
                    <Flex
                      direction="column"
                      align="center"
                      justify="center"
                      gap="3"
                      bgGradient="to-b"
                      gradientFrom="gray.700"
                      gradientTo="gray.900"
                    >
                      <Flex
                        boxSize="14" rounded="full" align="center" justify="center"
                        borderWidth="1px" borderColor="whiteAlpha.400" bg="whiteAlpha.200" color="white"
                      >
                        <Play size={22} />
                      </Flex>
                      <Text fontSize="xs" color="whiteAlpha.800">ویدئوی آموزشی این بخش</Text>
                    </Flex>
                  </AspectRatio>
                </Box>
              )}

              {/* گرید کارت‌ها — دو ستون، هر کارت با لحن رنگی خودش */}
              <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }} gap="3">
                {data?.cards.map((card, i) => {
                  const tone = TONE[card.tone]
                  const CardIcon = card.icon
                  const isLastOdd = i === data.cards.length - 1 && data.cards.length % 2 === 1
                  return (
                    <Flex
                      key={card.title}
                      gap="3"
                      p="4"
                      rounded="lg"
                      borderWidth="1px"
                      borderColor={tone.border}
                      bg={tone.bg}
                      gridColumn={{ base: 'auto', md: isLastOdd ? '1 / -1' : 'auto' }}
                    >
                      {/* FIRST = rightmost: آیکن کارت */}
                      <Icon size="md" color={tone.fg} flexShrink={0} mt="0.5">
                        <CardIcon />
                      </Icon>
                      <Box minW="0">
                        <Text fontSize="xs" fontWeight="semibold" color="fg" textAlign="start" mb="1.5">
                          {card.title}
                        </Text>
                        <Flex direction="column" gap="1">
                          {card.items.map((item) => (
                            <Flex key={item} gap="2" align="start">
                              {/* FIRST = rightmost: نقطهٔ فهرست */}
                              <Box boxSize="1" rounded="full" bg={tone.fg} mt="2.5" flexShrink={0} />
                              <Text fontSize="xs" color="fg.muted" textAlign="start" lineHeight="1.9">
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
            </Dialog.Body>

          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
