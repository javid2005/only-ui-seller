import {
  Avatar, Badge, Box, Button, Flex, IconButton, Text, Textarea,
} from '@chakra-ui/react'
import {
  Check, Image as ImageIcon, Pencil, ThumbsDown, ThumbsUp, Trash2,
} from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'
import { Rating } from './Rating'
import type { Review } from './data'

const FILTERED_TEXT = '[محتوای این نظر حاوی کلمات نامناسب بوده و فیلتر شده است]'

/** placeholder تصویر نظر — Box خاکستری با آیکون عکس (Thumb-Empty در Figma) */
function ThumbEmpty() {
  return (
    <Flex
      flexShrink={0} boxSize="64px" rounded="md"
      bg="bg.muted" borderWidth="1px" borderColor="border"
      align="center" justify="center" color="fg.subtle"
    >
      <ImageIcon size={24} />
    </Flex>
  )
}

/** شمارنده لایک/دیسلایک — آیکون رنگی (success/error) FIRST (راست در RTL) + عدد */
function ReactionCount({ icon, value, color }: { icon: React.ReactNode; value: number; color: string }) {
  return (
    <Flex align="center" gap="2">
      <Flex color={color} align="center">{icon}</Flex>
      <Text fontSize="sm" color="fg.muted">{toPersianDigits(value)}</Text>
    </Flex>
  )
}

export interface CommentCardProps {
  review: Review
  /** کارت در تب آرشیو است */
  archived?: boolean
  /** حالت پاسخ‌دهی نو (textarea خالی باز) */
  replying?: boolean
  /** حالت ویرایش پاسخ فروشنده (textarea با متن قبلی) */
  editing?: boolean
  onReply?: () => void
  onCancelReply?: () => void
  onSubmitReply?: () => void
  onEditReply?: () => void
  onCancelEdit?: () => void
  onSubmitEdit?: () => void
  onDeleteReply?: () => void
  onDelete?: () => void
  onArchive?: () => void
  onRestore?: () => void
}

/**
 * کارت نظر کاربر — معادل کامپوننت Comment فیگما (۴ variant):
 *   verified/default · verified/reply · verified/replied · archived/default
 * RTL: اولین child = راست‌ترین.
 */
export function CommentCard({
  review, archived = false, replying = false, editing = false,
  onReply, onCancelReply, onSubmitReply, onEditReply, onCancelEdit, onSubmitEdit, onDeleteReply,
  onDelete, onArchive, onRestore,
}: CommentCardProps) {
  const { author, date, relativeTime, rating, verifiedBuyer, variant, text, images, likes, dislikes, vendorReply, filtered } = review

  const showInput = !archived && (replying || editing)
  const showVendorReply = !archived && !!vendorReply && !editing

  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="lg" overflow="hidden" w="full">

      {/* ── Content ── */}
      <Flex direction="column" gap="4" p="4" align="stretch">

        {/* Header: details (راست) ←→ status badge (چپ) */}
        <Flex gap="4" align="flex-start">
          {/* Details — flex 1، راست‌ترین */}
          <Flex flex="1" gap="2" align="center" minW="0">
            {/* Avatar FIRST = راست */}
            <Avatar.Root size="md" flexShrink={0} bg="brand.solid" color="brand.contrast">
              <Avatar.Fallback name={author} />
            </Avatar.Root>
            {/* Stack — نام + meta، چپ‌چین رو پر می‌کند، راست‌چین متن */}
            <Flex direction="column" gap="1" flex="1" minW="0" align="flex-start">
              {/* name row: نام (راست) + خریدار تایید شده (چپ) */}
              <Flex gap="2" align="center" flexWrap="wrap">
                <Text fontSize="sm" fontWeight="semibold" color="fg">{author}</Text>
                {verifiedBuyer && (
                  <Badge colorPalette="green" variant="subtle" size="xs">
                    <Check size={10} />
                    خریدار تایید شده
                  </Badge>
                )}
              </Flex>
              {/* meta row: تاریخ | تنوع | امتیاز */}
              <Flex gap="2" align="center" color="fg.muted" fontSize="xs" flexWrap="wrap">
                <Text whiteSpace="nowrap">
                  {date}{relativeTime ? ` | ${relativeTime}` : ''}
                </Text>
                {variant && (
                  <>
                    <Text color="fg.subtle">|</Text>
                    <Badge colorPalette="gray" variant="subtle" size="xs">{variant}</Badge>
                  </>
                )}
                <Text color="fg.subtle">|</Text>
                <Rating value={rating} />
              </Flex>
            </Flex>
          </Flex>

          {/* status badge — چپ‌ترین */}
          <Badge colorPalette={archived ? 'orange' : 'green'} variant="subtle" size="sm" flexShrink={0}>
            {archived ? 'آرشیو شده' : 'تایید شده'}
          </Badge>
        </Flex>

        {/* ── Body ── */}
        {filtered ? (
          /* archived: متن فیلترشده (راست) + مشاهده (چپ) */
          <Flex gap="2" align="center" flexWrap="wrap" justify="flex-end">
            <Text flex="1" fontSize="sm" color="fg.muted" textAlign="right">{FILTERED_TEXT}</Text>
            <Button variant="ghost" size="xs" color="brand.fg" flexShrink={0}>مشاهده</Button>
          </Flex>
        ) : (
          <Text fontSize="sm" color="fg.muted" textAlign="right">{text}</Text>
        )}

        {/* تصاویر نظر — راست‌چین (RTL: flex-start = راست) */}
        {!!images && images > 0 && (
          <Flex gap="2" justify="flex-start">
            {Array.from({ length: images }, (_, i) => <ThumbEmpty key={i} />)}
          </Flex>
        )}

        {/* حالت پاسخ‌دهی نو یا ویرایش — textarea + CTA (state=reply فیگما) */}
        {showInput && (
          <Flex direction="column" gap="1.5">
            <Textarea
              key={editing ? 'edit' : 'new'}
              defaultValue={editing ? vendorReply : undefined}
              placeholder="پاسخ شما..." size="sm" rows={2} resize="vertical"
            />
            {/* انصراف (راست) · ثبت پاسخ (چپ، primary) */}
            <Flex gap="2" justify="flex-end">
              <Button variant="ghost" size="xs" onClick={editing ? onCancelEdit : onCancelReply}>انصراف</Button>
              <Button
                size="xs" bg="brand.solid" color="brand.contrast"
                _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
                onClick={editing ? onSubmitEdit : onSubmitReply}
              >
                ثبت پاسخ
              </Button>
            </Flex>
          </Flex>
        )}

        {/* پاسخ فروشنده — بلوک teal (RTL: محتوا راست، اکشن‌ها زیر آن) */}
        {showVendorReply && (
          <Box
            w="full" bg="brand.bg" rounded="lg"
            borderInlineStartWidth="2px" borderInlineStartColor="brand.solid"
            px="4" py="2"
          >
            {/* محتوا راست (flex 1) · اکشن‌ها چپ، عمودی‌وسط */}
            <Flex gap="2" align="center">
              {/* محتوای پاسخ — FIRST = راست */}
              <Flex direction="column" gap="1" flex="1" align="flex-start" minW="0">
                <Text fontSize="sm" fontWeight="semibold" color="brand.fg">پاسخ فروشنده</Text>
                <Text fontSize="sm" color="fg.muted" textAlign="right">{vendorReply}</Text>
              </Flex>
              {/* edit/delete — LAST = چپ. ترتیب: ویرایش FIRST=راست، حذف LAST=چپ */}
              <Flex gap="2" align="center" flexShrink={0}>
                <IconButton aria-label="ویرایش پاسخ" size="xs" variant="subtle" colorPalette="teal" onClick={onEditReply}>
                  <Pencil size={14} />
                </IconButton>
                <IconButton aria-label="حذف پاسخ" size="xs" variant="subtle" colorPalette="red" onClick={onDeleteReply}>
                  <Trash2 size={14} />
                </IconButton>
              </Flex>
            </Flex>
          </Box>
        )}
      </Flex>

      {/* ── Footer ── < sm: ستونی (دکمه‌ها زیر like/dislike) · ≥ sm: ردیفی */}
      <Flex
        bg="bg.muted" px="4" py="2" gap="3"
        direction={{ base: 'column', sm: 'row' }}
        align={{ base: 'stretch', sm: 'center' }}
        justify="space-between"
      >
        {/* counts — راست (RTL flex-start). لایک=success، دیسلایک=error */}
        <Flex gap="4" align="center" justify="flex-start">
          <ReactionCount icon={<ThumbsUp size={16} />} value={likes} color="fg.success" />
          <ReactionCount icon={<ThumbsDown size={16} />} value={dislikes} color="fg.error" />
        </Flex>

        {/* CTA — < sm: fill (دکمه‌ها هم‌عرض) · ≥ sm: راست-معمولی. primary LAST = چپ */}
        <Flex gap="2" align="center" w={{ base: 'full', sm: 'auto' }}>
          {archived ? (
            <>
              <Button
                size="sm" bg="brand.solid" color="brand.contrast"
                _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
                flex={{ base: '1', sm: 'initial' }}
                onClick={onRestore}
              >
                انتقال به تایید شده
              </Button>
              <Button variant="outline" size="sm" colorPalette="red" color="fg.error" flex={{ base: '1', sm: 'initial' }} onClick={onDelete}>حذف</Button>
            </>
          ) : (
            <>
              {!vendorReply && !replying && !editing && (
                <Button variant="outline" size="sm" flex={{ base: '1', sm: 'initial' }} onClick={onReply}>پاسخ</Button>
              )}
              <Button variant="outline" size="sm" flex={{ base: '1', sm: 'initial' }} onClick={onArchive}>آرشیو</Button>
              <Button variant="outline" size="sm" colorPalette="red" color="fg.error" flex={{ base: '1', sm: 'initial' }} onClick={onDelete}>حذف</Button>
            </>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
