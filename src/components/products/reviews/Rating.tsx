import { RatingGroup } from '@chakra-ui/react'

interface RatingProps {
  /** تعداد ستاره‌های پر (۰..۵) */
  value: number
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

/** نمایش امتیاز ۵ ستاره — Chakra RatingGroup، فقط‌خواندنی، طلایی. */
export function Rating({ value, size = 'sm' }: RatingProps) {
  return (
    <RatingGroup.Root readOnly count={5} defaultValue={value} size={size} colorPalette="yellow">
      <RatingGroup.HiddenInput />
      <RatingGroup.Control />
    </RatingGroup.Root>
  )
}
