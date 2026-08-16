import {
  Avatar, Badge, Box, Button, Flex, IconButton, Text, Textarea,
} from '@chakra-ui/react'
import {
  Check, Image as ImageIcon, Pencil, Trash2,
} from 'lucide-react'
import { STATUS_COLOR, STATUS_LABEL, type Review, type ReviewStatus } from './data'
import { Rating } from './Rating'

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

export interface CommentCardProps {
  review: Review
  /** وضعیت کارت — تعیین‌کنندهٔ badge بالا و دکمه‌های فوتر (Figma Comment prop `type`) */
  status: ReviewStatus
  /** حالت پاسخ‌دهی نو (textarea خالی باز) — فقط verified */
  replying?: boolean
  /** حالت ویرایش پاسخ فروشنده (textarea با متن قبلی) — فقط verified */
  editing?: boolean
  onReply?: () => void
  onCancelReply?: () => void
  onSubmitReply?: () => void
  onEditReply?: () => void
  onCancelEdit?: () => void
  onSubmitEdit?: () => void
  onDeleteReply?: () => void
  /** pending → verified */
  onApprove?: () => void
  /** verified/pending → archived */
  onArchive?: () => void
  /** verified/pending/archived → deleted */
  onDelete?: () => void
  /** archived → verified */
  onRestore?: () => void
  /** deleted → archived */
  onRestoreArchive?: () => void
}

/**
 * کارت نظر کاربر — معادل کامپوننت Comment فیگما (node 2547:52028)، ۴ وضعیت × ۳ state:
 *   pending/verified/archived/deleted (type) × Default/Reply/Replied (state, فقط verified)
 * RTL: اولین child = راست‌ترین.
 *
 * ⚠️ فوتر بدون Separator/شمارندهٔ لایک-دیسلایک — طبق fetch واقعی Comment از Figma این
 * ردیف اصلاً وجود نداره (حذف شد، قبلاً اضافه‌ی خارج از طرح بوده).
 * ⚠️ ترتیب DOM دکمه‌های فوتر: چون Wrapper فوتر در Figma بدون justify-end بوده و
 * پیش‌فرض چپ‌چین (packed-start در LTR خام) رندر شده، دکمهٔ primary (پاسخ/تایید) همیشه
 * چسبیده به لبهٔ **چپ** کارته (نه راست) — یعنی در RTL ما باید **LAST** DOM باشه، نه اول.
 * پس ترتیب: حذف(اول/راست‌ترین کلاستر) → آرشیو/انتقال(وسط) → primary(آخر/چسبیده چپ).
 */
export function CommentCard({
  review, status, replying = false, editing = false,
  onReply, onCancelReply, onSubmitReply, onEditReply, onCancelEdit, onSubmitEdit, onDeleteReply,
  onApprove, onArchive, onDelete, onRestore, onRestoreArchive,
}: CommentCardProps) {
  const { author, date, relativeTime, rating, verifiedBuyer, variant, text, images, vendorReply, filtered } = review

  const showInput = status === 'verified' && (replying || editing)
  const showVendorReply = status === 'verified' && !!vendorReply && !editing
  const showFilteredBody = status === 'archived' && filtered

  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="lg" overflow="hidden" w="full">

      {/* ── Content ── */}
      <Flex direction="column" gap="4" p="4" align="stretch">

        {/* Header: details (راست) ←→ status badge (چپ) */}
        <Flex gap="4" align="start">
          {/* Details — flex 1، راست‌ترین. موبایل: وقتی نام/بج wrap می‌شن و Stack بلند
              می‌شه، Avatar باید بالا(start) بچسبه نه وسط — دسکتاپ همون center بمونه */}
          <Flex flex="1" gap="2" align={{ base: 'start', md: 'center' }} minW="0">
            {/* Avatar FIRST = راست */}
            <Avatar.Root size="md" flexShrink={0} bg="brand.solid" color="brand.contrast">
              <Avatar.Fallback name={author} />
            </Avatar.Root>
            {/* Stack — نام + meta، چپ‌چین رو پر می‌کند، راست‌چین متن */}
            <Flex direction="column" gap="1" flex="1" minW="0" align="start">
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
          <Badge colorPalette={STATUS_COLOR[status]} variant="subtle" size="sm" flexShrink={0}>
            {STATUS_LABEL[status]}
          </Badge>
        </Flex>

        {/* ── Body ── */}
        {showFilteredBody ? (
          /* archived+filtered: متن فیلترشده (راست) + مشاهده (چپ) */
          <Flex gap="2" align="center" flexWrap="wrap" justify="end">
            <Text flex="1" fontSize="sm" color="fg.muted" textAlign="start">{FILTERED_TEXT}</Text>
            <Button variant="ghost" size="xs" color="brand.fg" flexShrink={0}>مشاهده</Button>
          </Flex>
        ) : (
          <Text fontSize="sm" color="fg.muted" textAlign="start">{text}</Text>
        )}

        {/* تصاویر نظر — راست‌چین (RTL: start = راست) */}
        {!!images && images > 0 && (
          <Flex gap="2" justify="start">
            {Array.from({ length: images }, (_, i) => <ThumbEmpty key={i} />)}
          </Flex>
        )}

        {/* حالت پاسخ‌دهی نو یا ویرایش — فقط textarea؛ دکمه‌های انصراف/ثبت جای همون سه
            دکمهٔ فوتر می‌شینن (پایین‌تر)، نه اینجا (state=Reply فیگما، فقط verified) */}
        {showInput && (
          <Textarea
            key={editing ? 'edit' : 'new'}
            defaultValue={editing ? vendorReply : undefined}
            placeholder="پاسخ شما..." size="sm" rows={2} resize="vertical"
          />
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
              <Flex direction="column" gap="1" flex="1" align="start" minW="0">
                <Text fontSize="sm" fontWeight="semibold" color="brand.fg">پاسخ فروشنده</Text>
                <Text fontSize="sm" color="fg.muted" textAlign="start">{vendorReply}</Text>
              </Flex>
              {/* edit/delete — LAST = چپ، ترتیب: ویرایش FIRST=راست، حذف LAST=چپ.
                  ghost بدون پس‌زمینه (طبق fetch جدید Vendor-Reply، نه subtle باکس‌دار قبلی) */}
              <Flex gap="2" align="center" flexShrink={0}>
                <IconButton aria-label="ویرایش پاسخ" size="2xs" variant="ghost" colorPalette="teal" onClick={onEditReply}>
                  <Pencil size={14} />
                </IconButton>
                <IconButton aria-label="حذف پاسخ" size="2xs" variant="ghost" colorPalette="red" onClick={onDeleteReply}>
                  <Trash2 size={14} />
                </IconButton>
              </Flex>
            </Flex>
          </Box>
        )}
      </Flex>

      {/* ── Footer — بدون شمارندهٔ لایک/دیسلایک، فقط CTA. flex-wrap برای موبایل ──
          وقتی showInput فعاله، انصراف/ثبت دقیقاً جای همون سه دکمهٔ پایین می‌شینن. */}
      <Flex bg="bg.subtle" px="4" py="2" gap="2" justify="end" flexWrap="wrap">
        {showInput && (
          /* انصراف (اول/راست‌ترین) · ثبت (آخر/چسبیده چپ، primary) — هم‌ترتیب بقیهٔ حالت‌ها */
          <>
            <Button variant="ghost" size="sm" onClick={editing ? onCancelEdit : onCancelReply}>انصراف</Button>
            <Button
              size="sm" bg="brand.solid" color="brand.contrast"
              _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }}
              onClick={editing ? onSubmitEdit : onSubmitReply}
            >
              ثبت
            </Button>
          </>
        )}

        {status === 'pending' && !showInput && (
          <>
            {/* حذف(اول/راست‌ترین کلاستر) → آرشیو(وسط) → تایید(آخر/چسبیده چپ، primary) */}
            <Button variant="ghost" size="sm" color="fg.error" onClick={onDelete}>حذف</Button>
            <Button variant="outline" size="sm" onClick={onArchive}>آرشیو</Button>
            <Button size="sm" bg="brand.solid" color="brand.contrast" _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }} onClick={onApprove}>
              تایید
            </Button>
          </>
        )}

        {status === 'verified' && !showInput && !vendorReply && (
          <>
            <Button variant="ghost" size="sm" color="fg.error" onClick={onDelete}>حذف</Button>
            <Button variant="outline" size="sm" onClick={onArchive}>آرشیو</Button>
            <Button size="sm" bg="brand.solid" color="brand.contrast" _hover={{ bg: 'brand.emphasized', color: 'brand.fg' }} onClick={onReply}>
              پاسخ
            </Button>
          </>
        )}

        {status === 'verified' && !showInput && !!vendorReply && (
          /* Replied — بدون primary، فقط حذف(راست‌ترین) → آرشیو(چسبیده چپ) */
          <>
            <Button variant="ghost" size="sm" color="fg.error" onClick={onDelete}>حذف</Button>
            <Button variant="outline" size="sm" onClick={onArchive}>آرشیو</Button>
          </>
        )}

        {status === 'archived' && (
          <>
            <Button variant="ghost" size="sm" color="fg.error" onClick={onDelete}>حذف</Button>
            <Button variant="outline" size="sm" onClick={onRestore}>انتقال به تایید شده</Button>
          </>
        )}

        {status === 'deleted' && (
          <Button variant="outline" size="sm" onClick={onRestoreArchive}>انتقال به آرشیو</Button>
        )}
      </Flex>
    </Box>
  )
}
