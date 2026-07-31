import { Box, Steps } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { toPersianDigits } from '@/utils/numbers'
import { MANUAL_ORDER_STEPS } from './manualOrderData'

/**
 * ManualOrderStepper — نوار ۵ مرحله‌ای ویزارد «ایجاد سفارش دستی».
 * همیشه افقی — در عرض کم List اسکرول افقی می‌خورد (الگوی OrderSteps).
 */
export function ManualOrderStepper({ step }: { step: number }) {
  const isCompact = useCompactMode()

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      px={isCompact ? '4' : { base: '4', md: '6' }}
      py="6"
      w="full"
    >
      <Steps.Root
        step={step}
        count={MANUAL_ORDER_STEPS.length}
        colorPalette="teal"
        w="full"
        orientation="horizontal"
      >
        <Steps.List overflowX="auto" overflowY="hidden" pb="1">
          {MANUAL_ORDER_STEPS.map((title, i) => (
            <Steps.Item key={i} index={i} flexGrow={1} flexShrink={0} title={title}>
              <Steps.Indicator>
                {/* current صریح — بدون آن، عدد مرحلهٔ جاری لاتین رندر می‌شود */}
                <Steps.Status
                  complete={<Check size={14} />}
                  current={toPersianDigits(i + 1)}
                  incomplete={toPersianDigits(i + 1)}
                />
              </Steps.Indicator>
              <Steps.Title whiteSpace="nowrap">{title}</Steps.Title>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>
      </Steps.Root>
    </Box>
  )
}
