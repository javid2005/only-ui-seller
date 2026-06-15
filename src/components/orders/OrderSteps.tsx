import { Box, Steps } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { ORDER_STEPS, ORDER_ACTIVE_STEP } from './orderData'

const STEP_NUMS = ['۱', '۲', '۳', '۴', '۵', '۶']

/**
 * OrderSteps — وضعیت پیشرفت سفارش (Chakra Steps).
 * مرحله‌های کامل ✓، مرحله جاری/آینده شماره. colorPalette teal (brand).
 * همیشه افقی — در عرض کم، List اسکرول افقی می‌خورد (نه shrink به vertical).
 */
export function OrderSteps() {
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
        step={ORDER_ACTIVE_STEP}
        count={ORDER_STEPS.length}
        colorPalette="teal"
        w="full"
        orientation="horizontal"
      >
        {/* overflowX: وقتی steps جا نشدن، داخل همین نوار scroll افقی */}
        <Steps.List overflowX="auto" overflowY="hidden" pb="1">
          {ORDER_STEPS.map((s, i) => (
            // flexGrow=1 → desktop پخش؛ flexShrink=0 + عرض = اندازه متن (title nowrap)
            <Steps.Item key={i} index={i} flexGrow={1} flexShrink={0} title={s.title}>
              <Steps.Indicator>
                <Steps.Status
                  incomplete={<>{STEP_NUMS[i]}</>}
                  complete={<Check size={14} />}
                />
              </Steps.Indicator>
              <Box>
                <Steps.Title whiteSpace="nowrap">{s.title}</Steps.Title>
                <Steps.Description fontSize="xs" whiteSpace="nowrap">{s.description}</Steps.Description>
              </Box>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>
      </Steps.Root>
    </Box>
  )
}
