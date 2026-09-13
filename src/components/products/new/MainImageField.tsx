import { useState } from 'react'
import { Box, Button, Text, chakra } from '@chakra-ui/react'
import { ImagePlus } from 'lucide-react'
import { MediaThumb } from './MediaThumb'
import { VariantImagePickerDialog } from './VariantImagePickerDialog'
import type { GalleryImage } from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface MainImageFieldProps {
  gallery: GalleryImage[]
  /** تصویر شاخص را عوض می‌کند (منبع همان گالری است، آپلود جدا ندارد) */
  onSelect: (src: string) => void
}

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * MainImageField — «تصویر اصلی» در کارت اطلاعات اصلی.
 *
 * در طرح تأییدشده این بلوک ستون **چپِ** کارت است (۳۰۰px) و فیلدها ستون راست؛
 * کادر تصویر radius ۱۴px دارد و روی آن یک دکمهٔ تیرهٔ «تغییر تصویر» می‌نشیند.
 *
 * منبع، گالری محصول است نه یک آپلودِ جدا — همان رسانه‌ای که در مرحلهٔ گالری
 * «شاخص» است اینجا دیده می‌شود و برعکس. دو جای مستقل برای یک تصویر یعنی دو
 * حقیقت متناقض.
 */
export function MainImageField({ gallery, onSelect }: MainImageFieldProps) {
  const [pickerOpen, setPickerOpen] = useState(false)
  const featured = gallery.find((img) => img.featured) ?? gallery[0]

  return (
    <Box w="full" minW="0">
      <Text
        as="label"
        display="block"
        fontSize="10px"
        fontWeight="bold"
        lineHeight="16px"
        color="fg.muted"
        mb="2"
        textAlign="start"
      >
        تصویر اصلی
        <chakra.span color="red.fg" ms="1" aria-hidden>*</chakra.span>
      </Text>

      {/* کادر تصویر — خودش کلیک‌پذیر است، ولی دکمهٔ اصلی زیرش می‌نشیند (بازخورد
          کاربر): دکمهٔ وسطِ تصویر هم تصویر را می‌پوشاند و هم لبِ کادر را شلوغ
          می‌کرد. حالا فقط نام فایل روی تصویر شناور است. */}
      <Box position="relative" w="full" rounded="14px" overflow="hidden" borderWidth="1px" borderColor="border.muted">
        <chakra.button
          type="button"
          onClick={() => setPickerOpen(true)}
          display="block"
          w="full"
          cursor="pointer"
          aria-label="تغییر تصویر اصلی"
        >
          <MediaThumb src={featured?.src} alt="تصویر اصلی محصول" aspectRatio="1" w="full" />
        </chakra.button>

        {/* نام فایل — شناور روی پایینِ تصویر، سفید با سایهٔ متن تا روی هر تصویری
            خوانده شود. در RTL «پایین-چپِ» طرح یعنی `insetInlineEnd`. */}
        {featured && (
          <Text
            position="absolute"
            bottom="1.5"
            insetInlineEnd="2"
            insetInlineStart="2"
            fontSize="10px"
            fontWeight="medium"
            color="white"
            textAlign="end"
            textShadow="0 1px 3px rgba(0,0,0,0.85), 0 0 2px rgba(0,0,0,0.6)"
            pointerEvents="none"
            truncate
            dir="ltr"
          >
            {featured.fileName}
          </Text>
        )}
      </Box>

      {/* دکمهٔ «تغییر تصویر» — زیر کادر، تمام‌عرض و با فاصلهٔ کافی */}
      <Button
        type="button"
        onClick={() => setPickerOpen(true)}
        mt="2.5"
        w="full"
        size="sm"
        variant="subtle"
        colorPalette="gray"
        fontWeight="medium"
      >
        {/* FIRST = rightmost: آیکن (leading) */}
        <ImagePlus size={14} />
        تغییر تصویر
      </Button>

      {!featured && (
        <Text fontSize="10px" color="fg.muted" textAlign="start" mt="1.5">
          هنوز تصویری انتخاب نشده — از مرحلهٔ گالری اضافه کنید
        </Text>
      )}

      <VariantImagePickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        images={gallery}
        selected={featured?.src ?? ''}
        onConfirm={onSelect}
      />
    </Box>
  )
}
