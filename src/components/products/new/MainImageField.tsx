import { useState } from 'react'
import { Box, Flex, Text, chakra } from '@chakra-ui/react'
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

      <chakra.button
        type="button"
        onClick={() => setPickerOpen(true)}
        position="relative"
        display="block"
        w="full"
        rounded="14px"
        overflow="hidden"
        borderWidth="1px"
        borderColor="border.muted"
        cursor="pointer"
        aria-label="تغییر تصویر اصلی"
      >
        <MediaThumb src={featured?.src} alt="تصویر اصلی محصول" aspectRatio="1" w="full" />

        {/* دکمهٔ شناور روی تصویر — در طرح وسطِ کادر.
            وسط‌چینی با «دو لبه با مقدار یکسان + justify=center»، نه
            `insetInlineStart:50%` که در RTL می‌شکند (CLAUDE.md § position fixed). */}
        <Flex
          position="absolute"
          insetInline="0"
          top="50%"
          transform="translateY(-50%)"
          justify="center"
          pointerEvents="none"
        >
          <Flex
            align="center"
            gap="1.5"
            h="8"
            px="3"
            rounded="lg"
            bg="#22343a"
            color="white"
            fontSize="xs"
            fontWeight="medium"
            whiteSpace="nowrap"
          >
            {/* FIRST = rightmost: آیکن (leading) */}
            <ImagePlus size={14} />
            تغییر تصویر
          </Flex>
        </Flex>
      </chakra.button>

      <Text fontSize="10px" color="fg.muted" textAlign="start" mt="1" truncate>
        {featured ? featured.fileName : 'هنوز تصویری انتخاب نشده — از مرحلهٔ گالری اضافه کنید'}
      </Text>

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
