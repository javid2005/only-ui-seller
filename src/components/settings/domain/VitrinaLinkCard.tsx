import { Box, Button, Flex, IconButton, Text } from '@chakra-ui/react'
import { Copy, Pencil, SquareArrowOutUpLeft } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { TitleBar } from '@/components/ui/TitleBar'
import { toaster } from '@/components/ui/toaster'

interface VitrinaLinkCardProps {
  slug: string
  editLabel: string
  onEdit: () => void
}

export function VitrinaLinkCard({ slug, editLabel, onEdit }: VitrinaLinkCardProps) {
  const isCompact = useCompactMode()
  const fullUrl = `${slug}.vitrina.ir`

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(`https://${fullUrl}`)
    toaster.create({ id: 'copy-link-toast', title: 'کپی شد', type: 'success', duration: 2000 })
  }

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p={isCompact ? '4' : { base: '4', sm: '6' }}
      w="full"
    >
      <Flex direction="column" gap="6" alignItems="flex-end" w="full">
        <TitleBar
          title="لینک اختصاصی ویترینا"
          subtitle="این آدرس از زمان ثبت‌نام به‌صورت خودکار ساخته شده و آدرس اصلی و همیشگی فروشگاه شماست. مشتریان از طریق آن وارد ویترین شما می‌شوند."
          badge={
            <Box bg="brand.subtle" px="2" py="1" rounded="md">
              <Text fontSize="sm" color="brand.fg">آدرس اصلی فروشگاه</Text>
            </Box>
          }
          size="xl"
        />

        {/* Figma's 512px compact frame keeps this row (icon-only CTA buttons make it fit) —
            flexWrap is the safety net for real narrow mobile instead of a hard column switch,
            matching the same technique Figma uses for the check-domain button+input row below. */}
        <Flex
          flexWrap="wrap"
          justify="space-between"
          align="center"
          gap="4"
          bg="brand.bg"
          borderWidth="1px"
          borderStyle="dashed"
          borderColor="brand.focusRing"
          rounded="lg"
          p="4"
          w="full"
        >
          {/* URL display — FIRST in DOM = rightmost in RTL
              (evidence: Figma screenshot shows mazbox.vitrina.ir on the right, CTA
              buttons on the left — opposite of the naive first-child-rightmost
              default, confirmed via pixel crop of check-domain.png) */}
          {/* dir="ltr" ضروریه — بدون این، موتور bidi مرورگر نقطهٔ ابتدای ".vitrina.ir"
              را به انتهای رشته جابه‌جا می‌کند (چون کل خوشه داخل یک ancestor با dir=rtl است).
              با dir="ltr" ترتیب طبیعی DOM (mazbox سپس .vitrina.ir) درست خوانده می‌شود؛
              جایگاه کل خوشه در ردیف بیرونی (سمت راست) از قبل با DOM order آن Flex تضمین شده. */}
          <Flex align="center" justify={{ base: 'center', sm: 'flex-start' }} w={{ base: 'full', sm: 'auto' }} dir="ltr">
            <Box bg="brand.subtle" px="2" rounded="8px">
              <Text fontSize="2xl" fontWeight="semibold" color="brand.fg">{slug}</Text>
            </Box>
            <Text fontSize="2xl" fontWeight="semibold" color="fg.subtle">.vitrina.ir</Text>
          </Flex>

          {/* CTA group — SECOND = leftmost in RTL.
              Compact mode (512px Figma frame): icon-only IconButtons (no text label) —
              confirmed via get_design_context on the mobile Check-Domain frame. */}
          <Flex gap="2" align="center" flexWrap="wrap" justify={{ base: 'center', sm: 'flex-end' }} w={{ base: 'full', sm: 'auto' }}>
            {isCompact ? (
              <IconButton
                variant="outline"
                colorPalette="brand"
                size="md"
                onClick={handleCopyLink}
                aria-label="کپی لینک"
              >
                <Copy size={20} />
              </IconButton>
            ) : (
              <>
                <IconButton
                  display={{ base: 'inline-flex', lg: 'none' }}
                  variant="outline"
                  colorPalette="brand"
                  size="md"
                  onClick={handleCopyLink}
                  aria-label="کپی لینک"
                >
                  <Copy size={20} />
                </IconButton>
                <Button
                  display={{ base: 'none', lg: 'inline-flex' }}
                  variant="outline"
                  colorPalette="brand"
                  size="sm"
                  onClick={handleCopyLink}
                >
                  <Copy size={20} />
                  کپی لینک
                </Button>
              </>
            )}
            {isCompact ? (
              <IconButton variant="outline" colorPalette="brand" size="md" asChild aria-label="مشاهده ویترین">
                <a href={`https://${fullUrl}`} target="_blank" rel="noopener noreferrer">
                  <SquareArrowOutUpLeft size={20} />
                </a>
              </IconButton>
            ) : (
              <>
                <IconButton
                  display={{ base: 'inline-flex', lg: 'none' }}
                  variant="outline"
                  colorPalette="brand"
                  size="md"
                  asChild
                  aria-label="مشاهده ویترین"
                >
                  <a href={`https://${fullUrl}`} target="_blank" rel="noopener noreferrer">
                    <SquareArrowOutUpLeft size={20} />
                  </a>
                </IconButton>
                <Button
                  display={{ base: 'none', lg: 'inline-flex' }}
                  variant="outline"
                  colorPalette="brand"
                  size="sm"
                  asChild
                >
                  <a href={`https://${fullUrl}`} target="_blank" rel="noopener noreferrer">
                    <SquareArrowOutUpLeft size={20} />
                    مشاهده ویترین
                  </a>
                </Button>
              </>
            )}
            {isCompact ? (
              <IconButton colorPalette="brand" size="md" onClick={onEdit} aria-label={editLabel}>
                <Pencil size={20} />
              </IconButton>
            ) : (
              <>
                <IconButton
                  display={{ base: 'inline-flex', lg: 'none' }}
                  colorPalette="brand"
                  size="md"
                  onClick={onEdit}
                  aria-label={editLabel}
                >
                  <Pencil size={20} />
                </IconButton>
                <Button
                  display={{ base: 'none', lg: 'inline-flex' }}
                  colorPalette="brand"
                  size="sm"
                  onClick={onEdit}
                >
                  <Pencil size={20} />
                  {editLabel}
                </Button>
              </>
            )}
          </Flex>
        </Flex>
      </Flex>
    </Box>
  )
}
