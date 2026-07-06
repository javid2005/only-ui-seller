import { useEffect, useState } from 'react'
import { Box, Flex, Grid, Text, Badge, Icon, FileUpload } from '@chakra-ui/react'
import { Upload, Image as ImageIcon, Video, Scale } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { toPersianDigits } from '@/utils/numbers'
import { UploadedImageCard } from './UploadedImageCard'
import { VariantSelectDialog } from './VariantSelectDialog'
import {
  GALLERY_MAX_IMAGES, GALLERY_MAX_IMAGE_SIZE,
  type ProductForm, type GalleryImage,
} from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface GalleryTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onBack: () => void
  onSave: () => void
}

// ─── Info badges (راهنمای محدودیت‌ها) ───────────────────────────────────────────
// DOM order = rightmost-first در RTL؛ icon FIRST (leading = راست).
const INFO_BADGES = [
  { icon: ImageIcon, label: `حداکثر ${toPersianDigits(GALLERY_MAX_IMAGES)} تصویر` },
  { icon: Video, label: 'حداکثر ۲ ویدئو' },
  { icon: Scale, label: 'هر تصویر: ۲MB' },
  { icon: Scale, label: 'هر ویدئو: ۵۰MB' },
]

let _gid = 0
const newImage = (src: string, fileName: string, featured: boolean): GalleryImage => ({
  id: `img_${++_gid}`,
  src,
  fileName,
  featured,
  variantTags: [],
})

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * GalleryTab — تب «گالری» صفحه محصول جدید.
 *
 * ساختار: TitleBar → ردیف Badge راهنما → FileUpload dropzone →
 *         گرید کارت‌های تصویر (UploadedImageCard) → ButtonFooter
 *
 * این پاس: فقط تصویر (نه ویدئو). گروه‌های تنوع (رنگ/رم) در VariantSelectDialog
 * از VARIANT_GROUPS (mock) می‌آیند — با ساخته‌شدن تب «تنوع‌ها» از آنجا جایگزین می‌شود.
 *
 * Figma: New Product / gallery (node 4024:73486)
 */
export function GalleryTab({ form, onChange, onBack, onSave }: GalleryTabProps) {
  // روی موبایلِ واقعی hover نداریم → دکمه‌های کارت همیشه نمایش
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const images = form.gallery
  const remaining = GALLERY_MAX_IMAGES - images.length
  const isFull = remaining <= 0

  // تصویری که دیالوگ «انتخاب تنوع»‌اش باز است
  const [variantDialogImageId, setVariantDialogImageId] = useState<string | null>(null)
  const variantDialogImage = images.find((img) => img.id === variantDialogImageId) ?? null

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const handleFileAccept = (details: { files: File[] }) => {
    const files = details.files.slice(0, remaining)
    if (files.length === 0) return

    Promise.all(
      files.map(
        (file) =>
          new Promise<{ src: string; name: string }>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve({ src: reader.result as string, name: file.name })
            reader.readAsDataURL(file)
          }),
      ),
    ).then((loaded) => {
      const hasFeatured = images.some((img) => img.featured)
      const added = loaded.map((l, i) =>
        // اگر هنوز هیچ تصویر شاخصی نیست، اولین تصویرِ افزوده‌شده شاخص می‌شود
        newImage(l.src, l.name, !hasFeatured && i === 0),
      )
      onChange({ gallery: [...images, ...added] })
    })
  }

  const removeImage = (id: string) => {
    const next = images.filter((img) => img.id !== id)
    // اگر تصویر شاخص حذف شد و تصویری باقی ماند → اولی شاخص می‌شود
    if (next.length > 0 && !next.some((img) => img.featured)) {
      next[0] = { ...next[0], featured: true }
    }
    onChange({ gallery: next })
  }

  const setFeatured = (id: string) =>
    onChange({ gallery: images.map((img) => ({ ...img, featured: img.id === id })) })

  const removeTag = (id: string, tag: string) =>
    onChange({
      gallery: images.map((img) =>
        img.id === id ? { ...img, variantTags: img.variantTags.filter((t) => t !== tag) } : img,
      ),
    })

  const setVariantTags = (id: string, tags: string[]) =>
    onChange({
      gallery: images.map((img) => (img.id === id ? { ...img, variantTags: tags } : img)),
    })

  return (
    <Flex direction="column" gap="6" w="full">

      {/* ═══ TitleBar ═══════════════════════════════════════════════════════════ */}
      <TitleBar
        title="گالری"
        subtitle="تصاویر و ویدئوهای محصول را آپلود کنید."
        size="xl"
        divider
      />

      {/* ═══ ردیف Badge راهنما — راست‌چین، wrap روی فضای کم ═════════════════════ */}
      <Flex gap="2" wrap="wrap" justify="flex-start" w="full">
        {INFO_BADGES.map(({ icon: BadgeIcon, label }) => (
          <Badge key={label} colorPalette="gray" variant="subtle" size="sm" rounded="l2" gap="1.5">
            {/* FIRST = rightmost: icon (leading) · متن سمت چپ */}
            <BadgeIcon size={14} />
            {label}
          </Badge>
        ))}
      </Flex>

      {/* ═══ Dropzone ═══════════════════════════════════════════════════════════ */}
      <FileUpload.Root
        accept="image/*"
        maxFiles={Math.max(1, remaining)}
        maxFileSize={GALLERY_MAX_IMAGE_SIZE}
        disabled={isFull}
        w="full"
        onFileAccept={handleFileAccept}
      >
        <FileUpload.HiddenInput />
        <FileUpload.Dropzone minH="128px" w="full" opacity={isFull ? 0.6 : 1}>
          <Icon size="md" color="fg.muted">
            <Upload />
          </Icon>
          <FileUpload.DropzoneContent>
            <Box fontWeight="semibold" fontSize="sm" color="fg" textAlign="center">
              {isFull
                ? `به سقف ${toPersianDigits(GALLERY_MAX_IMAGES)} تصویر رسیده‌اید`
                : 'برای بارگذاری، اینجا بکشید و رها کنید یا کلیک کنید'}
            </Box>
            <Text color="fg.muted" fontSize="sm" textAlign="center">
              PNG, JPG, JPEG, HEIC — تبدیل به WebP
            </Text>
          </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
      </FileUpload.Root>

      {/* ═══ گرید کارت‌های تصویر ════════════════════════════════════════════════ */}
      {images.length > 0 && (
        <Grid
          templateColumns="1fr"
          gap="4"
          w="full"
        >
          {images.map((img, i) => (
            <UploadedImageCard
              key={img.id}
              src={img.src}
              label={`تصویر ${toPersianDigits(i + 1)}`}
              featured={img.featured}
              variantTags={img.variantTags}
              alwaysShowActions={isMobile}
              onRemove={() => removeImage(img.id)}
              onSetFeatured={() => setFeatured(img.id)}
              onSelectVariant={() => setVariantDialogImageId(img.id)}
              onRemoveTag={(tag) => removeTag(img.id, tag)}
            />
          ))}
        </Grid>
      )}

      {/* ═══ Footer ═════════════════════════════════════════════════════════════ */}
      <ButtonFooter
        primary={{ label: 'ذخیره', onClick: onSave }}
        back={{ label: 'بازگشت', onClick: onBack }}
      />

      {/* ═══ دیالوگ «انتخاب تنوع» ═══════════════════════════════════════════════ */}
      <VariantSelectDialog
        open={variantDialogImage !== null}
        onClose={() => setVariantDialogImageId(null)}
        selectedTags={variantDialogImage?.variantTags ?? []}
        onConfirm={(tags) => variantDialogImage && setVariantTags(variantDialogImage.id, tags)}
      />

    </Flex>
  )
}
