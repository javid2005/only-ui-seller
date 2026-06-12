import { Box, Flex, Text, Button, IconButton } from '@chakra-ui/react'
import { Phone, Copy, Pencil } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import type { ContactInfo } from './orderData'

interface ContactInfoCardProps {
  title: string
  info: ContactInfo
  /** نمایش دکمه ویرایش (فقط گیرنده) */
  onEdit?: () => void
}

function FieldRow({ label, value, withActions }: { label: string; value: string; withActions?: boolean }) {
  return (
    <Flex align="center" justify="space-between" gap="3" w="full">
      <Text fontSize="sm" color="fg.muted" flexShrink={0}>{label}</Text>
      <Flex align="center" gap="2" minW="0">
        {withActions && (
          <Flex align="center" gap="1" flexShrink={0}>
            <IconButton size="xs" variant="ghost" colorPalette="brand" aria-label="تماس">
              <Phone size={16} />
            </IconButton>
            <IconButton
              size="xs"
              variant="ghost"
              color="fg.muted"
              aria-label="کپی"
              onClick={() => navigator.clipboard?.writeText(value)}
            >
              <Copy size={16} />
            </IconButton>
          </Flex>
        )}
        <Text fontSize="sm" fontWeight="semibold" color="fg" dir="ltr">{value}</Text>
      </Flex>
    </Flex>
  )
}

/**
 * ContactInfoCard — پنل اطلاعات گیرنده/مشتری (reusable).
 */
export function ContactInfoCard({ title, info, onEdit }: ContactInfoCardProps) {
  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
      w="full"
    >
      <TitleBar
        title={title}
        size="md"
        cta={
          onEdit && (
            <Button size="sm" variant="outline" colorPalette="brand" onClick={onEdit}>
              <Pencil size={16} />
              ویرایش
            </Button>
          )
        }
      />

      <Flex direction="column" gap="4" pt="4">
        <FieldRow label="نام" value={info.name} />
        <FieldRow label="شماره تماس" value={info.phone} withActions />
      </Flex>
    </Box>
  )
}
