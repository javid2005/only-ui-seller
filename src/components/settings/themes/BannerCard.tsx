import { Box, Flex, Text, Icon, Field, FileUpload, Input, IconButton } from '@chakra-ui/react'
import { Trash2, Upload } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BannerCardProps {
  title: string
  subtitle: string
  link: string
  imagePreview?: string | null
  onLinkChange: (value: string) => void
  onImageUpload: (dataUrl: string) => void
  onImageRemove: () => void
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * BannerCard — editable banner slot for the theme customize banners tab.
 *
 * States:
 *  - No image: FileUpload.Dropzone
 *  - Has image: aspect-ratio 21/9 preview + Trash icon in TitleBar CTA
 *
 * RTL: icon in TitleBar CTA is handled by TitleBar layout.
 */
export function BannerCard({
  title,
  subtitle,
  link,
  imagePreview = null,
  onLinkChange,
  onImageUpload,
  onImageRemove,
}: BannerCardProps) {
  const handleFileAccept = (details: { files: File[] }) => {
    const file = details.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => onImageUpload(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <Box borderWidth="1px" borderColor="border" rounded="lg" p="4" overflow="hidden">
      <Flex direction="column" gap="4">

        {/* Title + optional trash */}
        <TitleBar
          title={title}
          subtitle={subtitle}
          size="md"
          divider
          cta={imagePreview ? (
            <IconButton
              variant="ghost"
              aria-label="حذف تصویر"
              size="sm"
              color="red.fg"
              _hover={{ bg: 'red.subtle' }}
              onClick={onImageRemove}
            >
              <Trash2 size={16} />
            </IconButton>
          ) : undefined}
        />

        {/* ── Image area ───────────────────────────────────────────────────── */}
        <Field.Root>
          <Field.Label fontWeight="semibold" fontSize="sm" color="fg">
            تصویر
          </Field.Label>

          {imagePreview ? (
            /* Uploaded image preview */
            <Box
              w="full"
              aspectRatio="21/9"
              rounded="lg"
              overflow="hidden"
              position="relative"
            >
              <img
                src={imagePreview}
                alt={title}
                style={{
                  position: 'absolute', inset: 0,
                  width: '100%', height: '100%',
                  objectFit: 'cover',
                  pointerEvents: 'none',
                }}
              />
            </Box>
          ) : (
            /* Dropzone */
            <FileUpload.Root
              maxFiles={1}
              accept="image/*"
              maxFileSize={2 * 1024 * 1024}
              w="full"
              onFileAccept={handleFileAccept}
            >
              <FileUpload.HiddenInput />
              <FileUpload.Dropzone minH="140px" w="full">
                <Icon size="md" color="fg.muted">
                  <Upload />
                </Icon>
                <FileUpload.DropzoneContent>
                  <Box fontWeight="semibold" fontSize="sm" textAlign="center">
                    برای بارگذاری، اینجا بکشید و رها کنید یا کلیک کنید
                  </Box>
                  <Text color="fg.muted" fontSize="sm" textAlign="center">
                    حجم فایل: حداکثر ۲ مگابایت
                    <br />
                    فرمت تصویر مجاز: png, jpg, jpeg, webp, heic
                  </Text>
                </FileUpload.DropzoneContent>
              </FileUpload.Dropzone>
            </FileUpload.Root>
          )}
        </Field.Root>

        {/* ── Link input ───────────────────────────────────────────────────── */}
        <Field.Root>
          <Field.Label fontWeight="semibold" fontSize="sm" color="fg">
            لینک
          </Field.Label>
          <Input
            placeholder="https://example.com"
            textAlign="end"
            dir="ltr"
            value={link}
            onChange={e => onLinkChange(e.target.value)}
          />
        </Field.Root>

      </Flex>
    </Box>
  )
}
