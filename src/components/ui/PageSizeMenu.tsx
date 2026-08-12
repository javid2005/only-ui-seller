import { Button, Menu, Portal } from '@chakra-ui/react'
import { ChevronDown } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

interface PageSizeMenuProps {
  value: number
  onValueChange: (v: number) => void
}

/**
 * انتخاب تعداد ردیف هر صفحه — کنار متن «نمایش X تا Y از Z محصول».
 * Menu.RadioItemGroup (chakra-ui.com/docs/components/menu#radio-items)، هم‌الگو با
 * منوی «ترتیب نمایش» موبایل در FilterBar. RTL: متن FIRST=راست، chevron بعدش=چپ (مثل
 * الگوی Select.Trigger/Indicator چاکرا — indicator همیشه بعد از متن میاد).
 */
export function PageSizeMenu({ value, onValueChange }: PageSizeMenuProps) {
  return (
    <Menu.Root>
      <Menu.Trigger asChild>
        <Button variant="outline" size="xs" flexShrink={0}>
          {toPersianDigits(value)} در صفحه
          <ChevronDown size={14} />
        </Button>
      </Menu.Trigger>
      <Portal>
        <Menu.Positioner dir="rtl">
          <Menu.Content minW="120px" p="1">
            <Menu.RadioItemGroup value={String(value)} onValueChange={(e) => onValueChange(Number(e.value))}>
              {PAGE_SIZE_OPTIONS.map((n) => (
                <Menu.RadioItem key={n} value={String(n)}>
                  <Menu.ItemText>{toPersianDigits(n)}</Menu.ItemText>
                  <Menu.ItemIndicator />
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}
