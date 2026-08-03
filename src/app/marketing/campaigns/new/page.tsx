'use client'

import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CampaignNewSales } from '@/views/marketing/CampaignNewSales'
import { CampaignNewPromotion } from '@/views/marketing/CampaignNewPromotion'

function CampaignNewByType() {
  const searchParams = useSearchParams()
  const type = searchParams.get('type')

  if (type === 'promotion') return <CampaignNewPromotion />
  return <CampaignNewSales />
}

export default function Page() {
  return (
    <Suspense>
      <CampaignNewByType />
    </Suspense>
  )
}
