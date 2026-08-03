'use client'

import { useState } from 'react'
import { Box, Button, EmptyState, Flex } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Plus, Snowflake, ArrowLeft } from 'lucide-react'
import { Header, HeaderCTA } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { toaster } from '@/components/ui/toaster'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { CampaignTable } from '@/components/marketing/campaigns/CampaignTable'
import { CampaignCard } from '@/components/marketing/campaigns/CampaignCard'
import { NewCampaignDialog, type CampaignTypeId } from '@/components/marketing/campaigns/NewCampaignDialog'
import { CAMPAIGNS, type Campaign } from '@/components/marketing/campaigns/data'

export function Campaigns() {
  const router = useRouter()
  const [campaigns, setCampaigns] = useState<Campaign[]>(CAMPAIGNS)
  const [newCampaignOpen, setNewCampaignOpen] = useState(false)
  const isCompact = useCompactMode()
  const isEmpty = campaigns.length === 0

  const handleDelete = (id: string) => {
    setCampaigns((prev) => prev.filter((c) => c.id !== id))
    toaster.create({ id: `delete-${id}`, title: 'کمپین حذف شد', type: 'success', duration: 2500 })
  }

  const handleConfirmNewCampaign = (type: CampaignTypeId) => {
    setNewCampaignOpen(false)
    router.push(`/marketing/campaigns/new?type=${type}`)
  }

  return (
    <Flex direction="column" gap="4" alignItems="flex-end" w="full">
      <Header
        title="کمپین ها"
        breadcrumbs={[{ label: 'داشبورد', href: '/' }, { label: 'کمپین ها' }]}
      />

      {/* Panel spans full width — One Column Center: only the inner Flex is capped/centered
          at 960px (پترن پروژه: AdChannels.tsx, Reviews.tsx, ThemeSettings.tsx) */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
        <Flex direction="column" gap="6" alignItems="flex-end" maxW="960px" w="full" mx="auto">
          <TitleBar
            title="مدیریت کمپین ها"
            subtitle="کمپین‌های بازاریابی خود را مدیریت کنید."
            size="xl"
            divider
            cta={
              <HeaderCTA
                label="کمپین جدید"
                icon={<Plus size={16} />}
                disabled={isEmpty}
                onClick={() => setNewCampaignOpen(true)}
              />
            }
          />

          {isEmpty ? (
            <Flex justify="center" w="full" py="6">
              <EmptyState.Root size="sm" maxW="374px">
                <EmptyState.Content>
                  <EmptyState.Indicator><Snowflake size={32} /></EmptyState.Indicator>
                  <EmptyState.Title>کمپینو هنوز فعال نشده</EmptyState.Title>
                  <EmptyState.Description>
                    برای استفاده از کمپین‌ها، ابتدا باید کانال کمپینو را در بخش کانال‌های تبلیغاتی فعال کنید.
                  </EmptyState.Description>
                  <Button asChild variant="outline" colorPalette="brand" size="sm" mt="2">
                    <Link href="/marketing/channels">
                      رفتن به کانال های تبلیغاتی
                      <ArrowLeft size={16} />
                    </Link>
                  </Button>
                </EmptyState.Content>
              </EmptyState.Root>
            </Flex>
          ) : (
            <>
              {/* Table — md و بالاتر (و خاموش در حالت compact) */}
              <Box display={isCompact ? 'none' : { base: 'none', md: 'block' }} w="full">
                <CampaignTable campaigns={campaigns} onDelete={handleDelete} />
              </Box>

              {/* Card list — زیر md (و روشن در حالت compact) */}
              <Flex
                display={isCompact ? 'flex' : { base: 'flex', md: 'none' }}
                direction="column"
                gap="4"
                w="full"
              >
                {campaigns.map((c) => (
                  <CampaignCard key={c.id} campaign={c} onDelete={handleDelete} />
                ))}
              </Flex>
            </>
          )}
        </Flex>
      </Box>

      <NewCampaignDialog
        open={newCampaignOpen}
        onClose={() => setNewCampaignOpen(false)}
        onConfirm={handleConfirmNewCampaign}
      />
    </Flex>
  )
}
