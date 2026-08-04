import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Flex, Text, Select, createListCollection, Badge, Button, IconButton,
  Tooltip as ChakraTooltip, Portal,
} from '@chakra-ui/react'
import {
  LayoutDashboard, Boxes, ClipboardList, DollarSign,
  LayoutTemplate, Headset, BadgePercent, Settings, LockKeyhole, Megaphone, Users,
  Star, Plus, CircleHelp,
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
          { label: 'پروموشن ها', path: '/promotions/ads' },
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
  items: [
    { label: 'مزباکس', value: 'mazbox' },
    { label: 'شیرینی کوک', value: 'cookie' },
    { label: 'پوشاک ۲۴', value: 'clothing24' },
  ],
})

export function Sidebar() {
  const router = useRouter()
  const [defaultStoreValue, setDefaultStoreValue] = useState('cookie')
  const [tipOpen, setTipOpen] = useState(false)

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
          {/* Label row — RTL: متن اول (راست) · آیکون راهنما دوم (چپ) */}
          <Flex align="center" gap="1" mb="1">
            <Text fontSize="xs" fontWeight="medium" color="fg.muted">
              محیط کسب و کار
            </Text>
            <ChakraTooltip.Root
              open={tipOpen}
              onOpenChange={(e) => setTipOpen(e.open)}
              openDelay={100}
              closeDelay={100}
              closeOnPointerDown={false}
              positioning={{ placement: 'bottom' }}
            >
              <ChakraTooltip.Trigger asChild>
                <IconButton
                  variant="ghost"
                  size="2xs"
                  boxSize="6"
                  minW="6"
                  p="0"
                  color="fg.muted"
                  aria-label="راهنمای محیط کسب و کار"
                  onClick={() => setTipOpen((v) => !v)}
                >
                  <CircleHelp size={16} />
                </IconButton>
              </ChakraTooltip.Trigger>
              <Portal>
                <ChakraTooltip.Positioner dir="rtl">
                  <ChakraTooltip.Content
                    dir="rtl"
                    maxW="240px"
                    fontSize="xs"
                    lineHeight="1.7"
                    textAlign="right"
                  >
                    از این منو بین کسب‌وکارهای خود جابه‌جا می‌شوید. با زدن ستاره کنار هر کسب‌وکار،
                    آن را «پیش‌فرض» کنید تا در هر ورود — فارغ از اینکه آخرین بار کجا بودید — مستقیم
                    وارد همان محیط شوید.
                  </ChakraTooltip.Content>
                </ChakraTooltip.Positioner>
              </Portal>
            </ChakraTooltip.Root>
          </Flex>
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
                {storeCollection.items.map((item) => {
                  const isDefault = item.value === defaultStoreValue
                  return (
                    <Select.Item key={item.value} item={item}>
                      {/* 1. ستاره → اول = راست‌ترین در RTL */}
                      <IconButton
                        aria-label={isDefault ? 'کسب‌وکار پیش‌فرض' : 'انتخاب به‌عنوان پیش‌فرض'}
                        variant="ghost"
                        size="xs"
                        color={isDefault ? 'brand.solid' : 'fg.muted'}
                        flexShrink={0}
                        onClick={(e) => {
                          e.stopPropagation()
                          setDefaultStoreValue(item.value)
                        }}
                      >
                        <Star size={14} />
                      </IconButton>

                      {/* 2. نام فروشگاه → پر می‌کند فضای وسط */}
                      <Select.ItemText flex="1">{item.label}</Select.ItemText>

                      {/* 3. Badge پیش‌فرض (اختیاری) */}
                      {isDefault && (
                        <Badge bg="brand.subtle" color="brand.fg" size="sm" flexShrink={0}>
                          پیش فرض
                        </Badge>
                      )}

                      {/* 4. Checkmark انتخاب‌شده → آخر = چپ‌ترین در RTL */}
                      <Select.ItemIndicator />
                    </Select.Item>
                  )
                })}

                <Box pt="2" w="full">
                  <Button
                    colorPalette="brand"
                    variant="solid"
                    size="xs"
                    w="full"
                    onClick={() => router.push('/signup')}
                  >
                    {/* متن → اول = راست‌ترین · آیکون + → آخر = چپ‌ترین (طبق طرح Figma) */}
                    ایجاد کسب و کار جدید
                    <Plus size={14} />
                  </Button>
                </Box>
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
