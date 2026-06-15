import { Box, Flex, Grid, Text, Badge, Button, IconButton } from '@chakra-ui/react'
import { Pencil, Printer } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { MOCK_ORDER } from './orderData'

function InfoCard({ label, children, action }: { label: string; children: React.ReactNode; action?: React.ReactNode }) {
  // minH ثابت روی header و value → همه ۴ باکس هم‌ارتفاع، مستقل از آیکون/Badge
  return (
    <Box bg="bg.muted" rounded="lg" p="4" minW="0">
      <Flex align="center" justify="space-between" gap="2" minH="6">
        <Text fontSize="xs" color="fg.muted">{label}</Text>
        {action}
      </Flex>
      <Flex align="center" minH="6" mt="1">{children}</Flex>
    </Box>
  )
}

function AddressRow({ label, value }: { label: string; value: string }) {
  return (
    <Flex align="flex-start" justify="space-between" gap="4" w="full">
      <Text fontSize="sm" color="fg.muted" flexShrink={0}>{label}</Text>
      <Text fontSize="sm" fontWeight="medium" color="fg" textAlign="left">{value}</Text>
    </Flex>
  )
}

/**
 * ShippingAddressPanel — پنل «روش ارسال و آدرس».
 */
export function ShippingAddressPanel() {
  const isCompact = useCompactMode()
  const { shipping } = MOCK_ORDER

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
        title="روش ارسال و آدرس"
        size="md"
        cta={
          <Flex align="center" gap="2">
            {/* RTL: پرینت راست (اول DOM)، ویرایش چپ (آخر DOM) */}
            <Button size="sm" variant="outline" colorPalette="gray">
              <Printer size={16} />
              پرینت آدرس
            </Button>
            <Button size="sm" variant="outline" colorPalette="brand">
              <Pencil size={16} />
              ویرایش
            </Button>
          </Flex>
        }
      />

      {/* 4 mini info-cards — RTL: روش ارسال (راست) → کد رهگیری (چپ) */}
      <Grid
        templateColumns={isCompact ? '1fr 1fr' : { base: '1fr 1fr', md: 'repeat(4, 1fr)' }}
        gap="3"
        pt="4"
      >
        <InfoCard label="روش ارسال">
          <Text fontSize="sm" fontWeight="semibold" color="fg">{shipping.method}</Text>
        </InfoCard>
        <InfoCard label="نوع">
          <Badge colorPalette="green" variant="subtle" size="sm">{shipping.kind}</Badge>
        </InfoCard>
        <InfoCard label="کرایه">
          <Text fontSize="sm" fontWeight="semibold" color="fg">{shipping.fare}</Text>
        </InfoCard>
        <InfoCard
          label="کد رهگیری"
          action={
            <IconButton size="xs" variant="ghost" color="fg.muted" aria-label="ویرایش کد رهگیری">
              <Pencil size={14} />
            </IconButton>
          }
        >
          <Text fontSize="sm" fontWeight="medium" color="fg.muted">{shipping.tracking}</Text>
        </InfoCard>
      </Grid>

      {/* Address rows */}
      <Flex direction="column" gap="3" pt="5">
        <AddressRow label="استان"   value={shipping.province} />
        <AddressRow label="شهر"      value={shipping.city} />
        <AddressRow label="کد پستی"  value={shipping.postal} />
        <AddressRow label="آدرس"     value={shipping.address} />
      </Flex>
    </Box>
  )
}
