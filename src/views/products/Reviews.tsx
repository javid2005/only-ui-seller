import { useMemo, useState } from 'react'
import {
  Alert, Badge, Box, Flex, IconButton, Input, InputGroup,
  SegmentGroup, Select, Spacer, Switch, Text,
} from '@chakra-ui/react'
import { ListFilter, Search } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header } from '@/components/layout/Header'
import { toLatinDigits, toPersianDigits } from '@/utils/numbers'
import {
  VERIFIED_REVIEWS, ARCHIVED_REVIEWS, ratingCollection,
} from '@/components/products/reviews/data'
import { CommentCard } from '@/components/products/reviews/CommentCard'
import { ReviewsFilterModal } from '@/components/products/reviews/ReviewsFilterModal'

type Tab = 'verified' | 'archived'

/** Select امتیاز — namespace Select (نه NativeSelect — قانون پروژه) */
function RatingSelect() {
  return (
    <Select.Root collection={ratingCollection} defaultValue={['all']} size="sm" flexShrink={0} w="160px">
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
        <Select.Content minW="max-content" maxW="360px">
          {ratingCollection.items.map((it) => (
            <Select.Item key={it.value} item={it}>
              <Select.ItemText whiteSpace="nowrap">{it.label}</Select.ItemText>
              <Select.ItemIndicator />
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Positioner>
    </Select.Root>
  )
}

/** سوییچ فیلتر inline — Switch FIRST (راست) · label LAST (چپ) */
function InlineSwitch({ label }: { label: string }) {
  return (
    <Flex align="center" gap="2" flexShrink={0}>
      <Switch.Root size="sm" colorPalette="teal">
        <Switch.HiddenInput />
        <Switch.Control><Switch.Thumb /></Switch.Control>
      </Switch.Root>
      <Text fontSize="xs" whiteSpace="nowrap">{label}</Text>
    </Flex>
  )
}

export function Reviews() {
  const isCompact = useCompactMode()
  const [tab, setTab] = useState<Tab>('verified')
  const [search, setSearch] = useState('')
  const [filterOpen, setFilterOpen] = useState(false)
  const [replyingId, setReplyingId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  // پاسخ‌های حذف‌شده — id کامنت‌هایی که پاسخ فروشنده‌شون پاک شده
  const [deletedReplies, setDeletedReplies] = useState<string[]>([])

  const archived = tab === 'archived'
  const reviews = archived ? ARCHIVED_REVIEWS : VERIFIED_REVIEWS

  // جستجو در نام کاربر یا متن نظر — اعداد فارسی→لاتین
  const filtered = useMemo(() => {
    const q = toLatinDigits(search.trim()).toLowerCase()
    if (!q) return reviews
    return reviews.filter(
      (r) => r.author.toLowerCase().includes(q) || r.text.toLowerCase().includes(q),
    )
  }, [reviews, search])

  // search input — inline در هر دو bar
  const makeSearch = (flex: string, maxW: string) => (
    <InputGroup startElement={<Search size={14} color="var(--chakra-colors-fg-subtle)" />} flex={flex} maxW={maxW}>
      <Input
        placeholder="نام کاربر، محصول و..."
        size="sm"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </InputGroup>
  )

  return (
    <Flex direction="column" gap="4" w="full">

      {/* ── Page Header ── */}
      <Header
        title="نظرات کاربران"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'نظرات کاربران' }]}
      />

      {/* ── Panel — One Column Center ── */}
      <Box
        bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full" overflow="clip"
      >
        <Flex direction="column" gap="4" maxW="960px" w="full" mx="auto">

          {/* ── Tabs (تایید شده / آرشیو شده) — SegmentGroup track ──
              RTL: تایید شده FIRST = راست‌ترین */}
          <SegmentGroup.Root
            value={tab}
            onValueChange={(e) => { setTab((e.value ?? 'verified') as Tab); setReplyingId(null); setEditingId(null) }}
            size="sm" alignSelf="start"
          >
            <SegmentGroup.Indicator bg="bg.subtle" />
            <SegmentGroup.Item value="verified">
              <SegmentGroup.ItemText>
                <Flex align="center" gap="2">
                  تایید شده
                  <Badge colorPalette="green" variant="subtle" size="xs">
                    {toPersianDigits(VERIFIED_REVIEWS.length)}
                  </Badge>
                </Flex>
              </SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
            <SegmentGroup.Item value="archived">
              <SegmentGroup.ItemText>
                <Flex align="center" gap="2">
                  آرشیو شده
                  <Badge colorPalette="red" variant="subtle" size="xs">
                    {toPersianDigits(ARCHIVED_REVIEWS.length)}
                  </Badge>
                </Flex>
              </SegmentGroup.ItemText>
              <SegmentGroup.ItemHiddenInput />
            </SegmentGroup.Item>
          </SegmentGroup.Root>

          {/* ── Alert (فقط آرشیو) ── */}
          {archived && (
            <Alert.Root status="warning" size="sm" rounded="lg">
              <Alert.Indicator />
              <Alert.Title fontWeight="medium" fontSize="xs">
                کامنت‌های آرشیو شده در فروشگاه شما به مشتریان نمایش داده نمی‌شوند.
              </Alert.Title>
            </Alert.Root>
          )}

          {/* ── Filter bar ──
              compact/mobile: search + filter-icon (→modal)
              desktop: search + امتیاز select + switches + spacer */}

          {/* compact bar */}
          <Flex display={{ base: 'flex', md: isCompact ? 'flex' : 'none' }} gap="2" align="center">
            {makeSearch('1', 'full')}
            <IconButton variant="outline" size="sm" aria-label="فیلترها" onClick={() => setFilterOpen(true)} flexShrink={0}>
              <ListFilter size={16} />
            </IconButton>
          </Flex>

          {/* desktop bar — search(راست) → امتیاز → switches → spacer(چپ) */}
          <Flex display={{ base: 'none', md: isCompact ? 'none' : 'flex' }} gap="3" align="center">
            {makeSearch('0 1 200px', '240px')}
            <RatingSelect />
            <InlineSwitch label="شامل تصویر" />
            {!archived && <InlineSwitch label="پاسخ داده شده" />}
            <Spacer />
          </Flex>

          {/* ── List ── */}
          <Flex direction="column" gap="4">
            {filtered.map((r) => {
              // پاسخ حذف‌شده → vendorReply رو خالی کن تا دکمه «پاسخ» برگرده
              const review = deletedReplies.includes(r.id) ? { ...r, vendorReply: undefined } : r
              return (
              <CommentCard
                key={r.id}
                review={review}
                archived={archived}
                replying={replyingId === r.id}
                editing={editingId === r.id}
                onReply={() => { setReplyingId(r.id); setEditingId(null) }}
                onCancelReply={() => setReplyingId(null)}
                onSubmitReply={() => { setReplyingId(null); setDeletedReplies((p) => p.filter((x) => x !== r.id)) }}
                onEditReply={() => { setEditingId(r.id); setReplyingId(null) }}
                onCancelEdit={() => setEditingId(null)}
                onSubmitEdit={() => setEditingId(null)}
                onDeleteReply={() => setDeletedReplies((p) => [...p, r.id])}
              />
              )
            })}
            {filtered.length === 0 && (
              <Text fontSize="sm" color="fg.muted" textAlign="center" py="8">
                نظری یافت نشد.
              </Text>
            )}
          </Flex>

        </Flex>
      </Box>

      {/* ── Mobile Filter Modal ── */}
      <ReviewsFilterModal open={filterOpen} onClose={() => setFilterOpen(false)} archived={archived} />
    </Flex>
  )
}
