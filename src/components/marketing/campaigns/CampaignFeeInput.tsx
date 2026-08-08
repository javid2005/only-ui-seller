'use client'

import { Field, Flex, SegmentGroup, Text } from '@chakra-ui/react'
import { Percent } from 'lucide-react'
import { NumberField } from '@/components/ui/NumberField'

export type CampaignFeeType = 'value' | 'percent'

interface CampaignFeeInputProps {
  feeType: CampaignFeeType
  onFeeTypeChange: (type: CampaignFeeType) => void
  /** مبلغ کارمزد (تومان) — لاتینِ تمیز */
  amount: string
  onAmountChange: (value: string) => void
  /** درصد کارمزد — لاتینِ تمیز */
  percent: string
  onPercentChange: (value: string) => void
}

/**
 * CampaignFeeInput — «کارمزد فروش» (Figma local component CampaignFee, node 2778:87741).
 * RTL DOM order (بر اساس x-metadata طرح، نه ترتیب خام Figma که LTR است):
 *   toggle کارمزد بازاریاب (راست‌ترین) → فیلد مبلغ/درصد کارمزد (چپ‌ترین)
 * داخل toggle: مقداری (راست) → درصدی (چپ).
 */
export function CampaignFeeInput({
  feeType,
  onFeeTypeChange,
  amount,
  onAmountChange,
  percent,
  onPercentChange,
}: CampaignFeeInputProps) {
  const isPercent = feeType === 'percent'

  return (
    <Flex direction={{ base: 'column', sm: 'row' }} gap="4" align="start" justify="start" w="full">
      {/* toggle — FIRST = راست‌ترین (زیر sm: بالا) */}
      <Field.Root flex="1" minW="0" w="full">
        <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
          کارمزد بازاریاب
        </Field.Label>
        <SegmentGroup.Root
          value={feeType}
          onValueChange={(e) => onFeeTypeChange((e.value ?? 'value') as CampaignFeeType)}
          w="full"
          size="md"
        >
          <SegmentGroup.Indicator bg="bg.panel" />
          {/* مقداری FIRST = راست‌ترین */}
          <SegmentGroup.Item value="value" flex="1" justifyContent="center">
            <SegmentGroup.ItemText>مقداری</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
          <SegmentGroup.Item value="percent" flex="1" justifyContent="center">
            <SegmentGroup.ItemText>درصدی</SegmentGroup.ItemText>
            <SegmentGroup.ItemHiddenInput />
          </SegmentGroup.Item>
        </SegmentGroup.Root>
      </Field.Root>

      {/* فیلد مبلغ/درصد — LAST = چپ‌ترین (زیر sm: پایین) */}
      <Field.Root flex="1" minW="0" w="full">
        <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
          {isPercent ? 'درصد کارمزد' : 'مبلغ کارمزد'}
        </Field.Label>
        {isPercent ? (
          <NumberField
            value={percent}
            onChange={onPercentChange}
            placeholder="درصد را وارد کنید"
            max={100}
            endElement={<Percent size={16} />}
          />
        ) : (
          <NumberField
            value={amount}
            onChange={onAmountChange}
            placeholder="مبلغ را وارد کنید"
            endElement={<Text fontSize="sm" color="fg.muted" px="2">تومان</Text>}
          />
        )}
        {isPercent && (
          <Field.HelperText>
            پیشنهاد پلتفرم: بین ۱۰ تا ۲۰ درصد
          </Field.HelperText>
        )}
      </Field.Root>
    </Flex>
  )
}
