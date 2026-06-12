import { Box, Steps, useBreakpointValue } from '@chakra-ui/react'
import { Check } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { ORDER_STEPS, ORDER_ACTIVE_STEP } from './orderData'

const STEP_NUMS = ['۱', '۲', '۳', '۴', '۵', '۶']

/**
 * OrderSteps — وضعیت پیشرفت سفارش (Chakra Steps).
 * مرحله‌های کامل ✓، مرحله جاری/آینده شماره. colorPalette teal (brand).
 */
export function OrderSteps() {
  const isCompact = useCompactMode()
  // orientation باید STRING باشه — Chakra Steps شیٔ responsive رو "[object Object]" می‌کنه و خط‌ها می‌شکنه
  const bpOrientation = useBreakpointValue({ base: 'vertical', lg: 'horizontal' } as const) ?? 'horizontal'
  const orientation = isCompact ? 'vertical' : bpOrientation

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
        orientation={orientation}
      >
        <Steps.List>
          {ORDER_STEPS.map((s, i) => (
            <Steps.Item key={i} index={i} flex="1" title={s.title}>
              <Steps.Indicator>
                <Steps.Status
                  incomplete={<>{STEP_NUMS[i]}</>}
                  complete={<Check size={14} />}
                />
              </Steps.Indicator>
              <Box>
                <Steps.Title>{s.title}</Steps.Title>
                <Steps.Description fontSize="xs">{s.description}</Steps.Description>
              </Box>
              <Steps.Separator />
            </Steps.Item>
          ))}
        </Steps.List>
      </Steps.Root>
    </Box>
  )
}
