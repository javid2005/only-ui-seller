import { Box, Flex, Text, Select, createListCollection } from '@chakra-ui/react'
import {
  LayoutDashboard, Boxes, ClipboardList, DollarSign,
  LayoutTemplate, Headset, BadgePercent, Settings, LockKeyhole, Megaphone, Users,
} from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import type { NavGroup } from '@/types/nav'

const NAV_GROUPS: NavGroup[] = [
  {
    group: 'مدیریت',
    items: [
      {
        label: 'داشبورد',
        icon: LayoutDashboard,
        path: '/',
        subItems: [
          { label: 'نمای کلی', path: '/dashboard/overview' },
          { label: 'ویجت های گزارش گیری', path: '/dashboard/widgets' },
          { label: 'کارهای ضروری', path: '/dashboard/tasks' },
        ],
      },
      {
        label: 'محصولات',
        icon: Boxes,
        path: '/products',
        subItems: [
          { label: 'لیست محصولات', path: '/products/list' },
          { label: 'دسته بندی محصولات', path: '/products/categories' },
          { label: 'نظرات کاربران', path: '/products/reviews' },
        ],
      },
      {
        label: 'سفارشات',
        icon: ClipboardList,
        path: '/orders',
        subItems: [
          { label: 'لیست سفارشات', path: '/orders/list' },
          { label: 'ایجاد سفارش دستی', path: '/orders/new' },
        ],
      },
      {
        label: 'امور مالی',
        icon: DollarSign,
        path: '/finance',
        subItems: [
          { label: 'کیف پول و تراکنش ها', path: '/finance/wallet' },
          { label: 'درخواست وجه', path: '/finance/withdrawal' },
          { label: 'اشتراک پانل', path: '/finance/subscription' },
        ],
      },
      {
        label: 'محتوا و ظاهر فروشگاه',
        icon: LayoutTemplate,
        path: '/theme',
        subItems: [
          { label: 'پوسته (تم)', path: '/theme/skin' },
          { label: 'وبلاگ', path: '/theme/blog' },
        ],
      },
      {
        label: 'پشتیبانی',
        icon: Headset,
        path: '/support',
        subItems: [
          { label: 'تیکت ها', path: '/support/tickets' },
          { label: 'ویترینا هاب', path: '/support/hub' },
        ],
      },
      {
        label: 'مشتریان',
        icon: Users,
        path: '/customers',
        subItems: [
          { label: 'لیست مشتریان', path: '/customers/list' },
          { label: 'باشگاه مشتریان', path: '/customers/club' },
        ],
      },
    ],
  },
  {
    group: 'بازاریابی و پروموشن ها',
    items: [
      {
        label: 'بازاریابی و تبلیغات',
        icon: Megaphone,
        path: '/marketing',
        subItems: [
          { label: 'کانال‌های تبلیغاتی', path: '/marketing/channels' },
          { label: 'کمپین ها', path: '/marketing/campaigns' },
        ],
      },
      {
        label: 'پروموشن و تخفیف ها',
        icon: BadgePercent,
        path: '/promotions',
        subItems: [
          { label: 'کدهای تخفیف', path: '/promotions/codes' },
          { label: 'پروموشن و آگهی', path: '/promotions/ads' },
          { label: 'سبدهای خرید رها شده', path: '/promotions/abandoned-carts' },
        ],
      },
    ],
  },
  {
    group: 'تنظیمات',
    items: [
      { label: 'تنظیمات فروشگاه', icon: Settings, path: '/settings' },
      {
        label: 'کاربران و دسترسی ها',
        icon: LockKeyhole,
        path: '/users',
        subItems: [
          { label: 'لیست کارمندان', path: '/users/employees' },
          { label: 'نقش ها', path: '/users/roles' },
        ],
      },
    ],
  },
]

const storeCollection = createListCollection({
  items: [{ label: 'پیج مزباکس', value: 'mazbox' }],
})

export function Sidebar() {
  return (
    <Box
      as="aside"
      w="64"
      h="full"
      bg="bg.subtle"
      overflow="hidden"
      flexShrink={0}
    >
      <Flex direction="column" gap="4" pt="6" pb="4" px="4" h="full" overflowY="auto">

        {/* Store selector */}
        <Box flexShrink={0}>
          <Text fontSize="xs" fontWeight="medium" color="fg.muted" mb="1" textAlign="right">
            فروشگاه
          </Text>
          <Select.Root
            collection={storeCollection}
            size="sm"
            variant="outline"
            defaultValue={['mazbox']}
          >
            <Select.HiddenSelect />
            <Select.Control>
              <Select.Trigger>
                <Select.ValueText />
              </Select.Trigger>
              <Select.IndicatorGroup>
                <Select.Indicator />
              </Select.IndicatorGroup>
            </Select.Control>
            <Select.Positioner>
              <Select.Content>
                {storeCollection.items.map((item) => (
                  <Select.Item key={item.value} item={item}>
                    <Select.ItemText>{item.label}</Select.ItemText>
                    <Select.ItemIndicator />
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Positioner>
          </Select.Root>
        </Box>

        {/* Nav groups */}
        <Flex direction="column" gap="6" flex="1" overflowY="auto" pt="2">
          {NAV_GROUPS.map((group) => (
            <Box key={group.group} flexShrink={0}>
              <Text
                fontSize="xs"
                fontWeight="medium"
                color="fg.muted"
                textAlign="right"
                mb="0"
                lineHeight="4"
              >
                {group.group}
              </Text>
              <Flex direction="column" gap="1">
                {group.items.map((item) => (
                  <SidebarItem key={item.path} {...item} />
                ))}
              </Flex>
            </Box>
          ))}
        </Flex>

      </Flex>
    </Box>
  )
}
