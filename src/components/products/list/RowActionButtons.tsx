import { Flex, IconButton } from '@chakra-ui/react'
import { Copy, Eye, Pencil, Trash2 } from 'lucide-react'

interface RowActionButtonsProps {
  onEdit?: () => void
  onPreview?: () => void
  onDuplicate?: () => void
  onDelete?: () => void
}

/**
 * ۴ دکمهٔ عملیات ردیف جدول — جایگزین منوی ⋮.
 * RTL DOM order (اولین=راست‌ترین داخل همین سلول، از مقایسهٔ screenshot، نه خروجی کد فیگما):
 * ویرایش → پیش‌نمایش → کپی → حذف (چپ‌ترین، لبهٔ بیرونی جدول، outline قرمز).
 */
export function RowActionButtons({ onEdit, onPreview, onDuplicate, onDelete }: RowActionButtonsProps) {
  return (
    // justify="end" چون RTL: start=راست، end=چپ — این ستون لبهٔ چپ جدوله، آیکون‌ها باید
    // به همون لبه بچسبن نه به لبهٔ راستِ سلول (که با auto table-layout ممکنه از محتوا پهن‌تر بشه)
    <Flex gap="2" align="center" justify="end">
      <IconButton variant="outline" size="sm" aria-label="ویرایش" onClick={onEdit}>
        <Pencil size={16} />
      </IconButton>
      <IconButton variant="outline" size="sm" aria-label="پیش نمایش" onClick={onPreview}>
        <Eye size={16} />
      </IconButton>
      <IconButton variant="outline" size="sm" aria-label="ایجاد کپی" onClick={onDuplicate}>
        <Copy size={16} />
      </IconButton>
      <IconButton
        variant="outline" size="sm" aria-label="حذف"
        borderColor="red.solid" color="red.solid"
        _hover={{ bg: 'red.subtle' }}
        onClick={onDelete}
      >
        <Trash2 size={16} />
      </IconButton>
    </Flex>
  )
}
