'use client'

import { Field } from '@chakra-ui/react'
import { DatePicker } from '@/components/ui/DatePicker'

export function DateField({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  return (
    <Field.Root required flex="1" minW="0">
      <Field.Label fontSize="sm" fontWeight="semibold" color="fg">
        {label}<Field.RequiredIndicator />
      </Field.Label>
      <DatePicker value={value} onChange={onChange} placeholder={placeholder} />
    </Field.Root>
  )
}
