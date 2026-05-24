import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Box, Flex, IconButton, Input, InputGroup, Text } from '@chakra-ui/react'
import { CirclePlus, ChevronsDownUp, ChevronsUpDown, Search } from 'lucide-react'
import { Header }           from '@/components/layout/Header'
import { ButtonFooter }     from '@/components/ui/ButtonFooter'
import { CategoryAccordion } from '@/components/settings/categories/CategoryAccordion'
import type { CategoryData } from '@/components/settings/categories/CategoryAccordion'

// ─── Icon imports ─────────────────────────────────────────────────────────────

import applianceIcon  from '@/assets/Icons/Category/appliance.svg'
import babyIcon       from '@/assets/Icons/Category/baby.svg'
import carIcon        from '@/assets/Icons/Category/car.svg'
import cosmoticsIcon  from '@/assets/Icons/Category/cosmotics.svg'
import educationIcon  from '@/assets/Icons/Category/education.svg'
import fabricIcon     from '@/assets/Icons/Category/fabric.svg'
import fashionIcon    from '@/assets/Icons/Category/fashion.svg'
import foodIcon       from '@/assets/Icons/Category/food.svg'
import giftIcon       from '@/assets/Icons/Category/gift.svg'
import jewelleryIcon  from '@/assets/Icons/Category/jewellery.svg'
import kitchenIcon    from '@/assets/Icons/Category/kitchen.svg'
import medicineIcon   from '@/assets/Icons/Category/medicine.svg'
import petsIcon       from '@/assets/Icons/Category/pets.svg'
import servicesIcon   from '@/assets/Icons/Category/services.svg'
import shoeBagIcon    from '@/assets/Icons/Category/shoe bag.svg'
import sportsIcon     from '@/assets/Icons/Category/sports.svg'
import toolsIcon      from '@/assets/Icons/Category/tools.svg'
import travelIcon     from '@/assets/Icons/Category/travel.svg'

// ─── Mock data ────────────────────────────────────────────────────────────────

const ALL_CATEGORIES: CategoryData[] = [
  {
    id: '1',
    name: 'کالای دیجیتال و لوازم الکترونیکی',
    iconSrc: applianceIcon,
    subcategories: ['موبایل', 'لپتاپ', 'تبلت', 'هدفون', 'دوربین', 'اسپیکر', 'ساعت هوشمند'],
  },
  {
    id: '2',
    name: 'مد و پوشاک',
    iconSrc: fashionIcon,
    subcategories: ['پیراهن', 'شلوار', 'کت و شلوار', 'لباس زنانه', 'لباس مردانه'],
  },
  {
    id: '3',
    name: 'کیف و کفش',
    iconSrc: shoeBagIcon,
    subcategories: ['کیف چرم', 'کفش ورزشی', 'کیف زنانه', 'صندل', 'نیم بوت'],
  },
  {
    id: '4',
    name: 'طلا و جواهرات',
    iconSrc: jewelleryIcon,
    subcategories: ['انگشتر', 'گردنبند', 'دستبند', 'گوشواره', 'النگو'],
  },
  {
    id: '5',
    name: 'لوازم آرایشی، بهداشتی و مراقبتی',
    iconSrc: cosmoticsIcon,
    subcategories: ['کرم پوست', 'رژلب', 'ادکلن', 'شامپو', 'ضد آفتاب'],
  },
  {
    id: '6',
    name: 'خانه و آشپزخانه',
    iconSrc: kitchenIcon,
    subcategories: ['ظروف', 'وسایل پخت', 'دکوراسیون', 'لوازم تمیزکاری'],
  },
  {
    id: '7',
    name: 'مواد غذایی و خوراکی',
    iconSrc: foodIcon,
    subcategories: ['خشکبار', 'برنج', 'روغن', 'قهوه و چای', 'شیرینی'],
  },
  {
    id: '8',
    name: 'ورزش و تناسب اندام',
    iconSrc: sportsIcon,
    subcategories: ['دمبل', 'کفش ورزشی', 'لباس ورزشی', 'تردمیل'],
  },
  {
    id: '9',
    name: 'ابزارآلات',
    iconSrc: toolsIcon,
    subcategories: ['دریل', 'پیچ‌گوشتی', 'پیچ و مهره', 'چکش'],
  },
  {
    id: '10',
    name: 'محصولات فرهنگی، هنری و آموزشی',
    iconSrc: educationIcon,
    subcategories: ['کتاب', 'موسیقی', 'نقاشی', 'اسباب‌بازی فکری'],
  },
  {
    id: '11',
    name: 'کودک و نوزاد',
    iconSrc: babyIcon,
    subcategories: ['اسباب‌بازی', 'لباس نوزاد', 'کالسکه', 'شیشه شیر'],
  },
  {
    id: '12',
    name: 'حیوانات خانگی',
    iconSrc: petsIcon,
    subcategories: ['غذای سگ', 'غذای گربه', 'قفس', 'اسباب‌بازی حیوان'],
  },
  {
    id: '13',
    name: 'خدمات',
    iconSrc: servicesIcon,
    subcategories: [],
  },
  {
    id: '14',
    name: 'هدایا و محصولات مناسبتی',
    iconSrc: giftIcon,
    subcategories: ['هدیه تولد', 'هدیه عروسی', 'بسته‌بندی هدیه'],
  },
  {
    id: '15',
    name: 'سفر',
    iconSrc: travelIcon,
    subcategories: ['چمدان', 'وسایل کمپ', 'اکسسوری سفر'],
  },
  {
    id: '16',
    name: 'کالای پزشکی',
    iconSrc: medicineIcon,
    subcategories: ['تجهیزات پزشکی', 'مکمل‌ها', 'ویلچر و عصا'],
  },
  {
    id: '17',
    name: 'خودرو و موتورسیکلت',
    iconSrc: carIcon,
    subcategories: ['قطعات یدکی', 'لوازم جانبی', 'روغن موتور'],
  },
  {
    id: '18',
    name: 'خرازی، پارچه و لوازم خیاطی',
    iconSrc: fabricIcon,
    subcategories: ['پارچه', 'نخ', 'دکمه', 'ریسمان'],
  },
]

// ─── InfoBox ──────────────────────────────────────────────────────────────────

function InfoBox() {
  return (
    <Flex
      direction="column"
      gap="2"
      px="6"
      py="4"
      bg="bg.subtle"
      borderWidth="1px"
      borderStyle="dashed"
      borderColor="border"
      rounded="lg"
    >
      {/* راهنمای زیردسته‌ها */}
      <Text fontSize="xs" color="fg" lineHeight="1.6" textAlign="right">
        برای مشاهده زیردسته‌ها روی علامت{' '}
        <Box as="span" display="inline-flex" verticalAlign="middle" color="fg" mx="0.5">
          <CirclePlus size={14} />
        </Box>
        {' '}کلیک کنید.
      </Text>

      {/* راهنمای پیش‌فرض */}
      <Text fontSize="xs" color="fg" lineHeight="1.6" textAlign="right">
        اولین دسته‌بندی انتخاب‌شده به عنوان{' '}
        <Box as="span" fontWeight="bold">دسته‌بندی پیش‌فرض</Box>
        {' '}در سایت نمایش داده می‌شود.
      </Text>
    </Flex>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export function Categories() {
  const navigate   = useNavigate()
  const isCompact  = useCompactMode()

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedIds, setSelectedIds] = useState<string[]>([])  // ترتیب = اولی پیش‌فرض
  const [openIds,     setOpenIds]     = useState<Set<string>>(new Set())

  // فیلتر جستجو
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return ALL_CATEGORIES
    return ALL_CATEGORIES.filter(
      (c) =>
        c.name.includes(q) ||
        c.subcategories?.some((s) => s.toLowerCase().includes(q))
    )
  }, [searchQuery])

  function handleAdd(id: string) {
    setSelectedIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
  }

  function handleRemove(id: string) {
    setSelectedIds((prev) => prev.filter((x) => x !== id))
  }

  function handleSetDefault(id: string) {
    // اولین آیتم = پیش‌فرض → جابه‌جا به اول
    setSelectedIds((prev) => [id, ...prev.filter((x) => x !== id)])
  }

  function handleOpenChange(id: string, isOpen: boolean) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      if (isOpen) next.add(id)
      else next.delete(id)
      return next
    })
  }

  function expandAll() {
    setOpenIds(new Set(filtered.map((c) => c.id)))
  }

  function collapseAll() {
    setOpenIds(new Set())
  }

  return (
    <Flex direction="column" gap="4" w="full">

      {/* ─── Page header ──────────────────────────────────────────────────── */}
      <Header
        title="دسته بندی ها"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'دسته بندی ها' },
        ]}
      />

      {/* ─── Panel wrapper (Two Columns Right Center) ────────────────────── */}
      <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" pt={isCompact ? '4' : { base: '4', sm: '6' }} pb="6" px={isCompact ? '4' : { base: '4', sm: '6' }} w="full">
        <Flex gap="10" align="flex-start">

          {/* FIRST = rightmost در RTL: sticky info panel — فقط lg+ و non-compact */}
          {!isCompact && (
            <Box
              display={{ base: 'none', lg: 'block' }}
              w="256px"
              flexShrink={0}
              position="sticky"
              top="20"
              alignSelf="flex-start"
            >
              <InfoBox />
            </Box>
          )}

          {/* SECOND: main content column — max 960px, no bg/padding */}
          <Flex direction="column" gap="4" maxW="960px" flex="1" minW="0">

            {/* InfoBox بالای Middle — وقتی ستون Start مخفی است (< lg یا compact) */}
            <Box display={isCompact ? 'block' : { base: 'block', lg: 'none' }}>
              <InfoBox />
            </Box>

            {/* SearchBar */}
            <Flex align="center" gap="2">
              {/* FIRST = rightmost در RTL: search input */}
              <InputGroup
                flex="1"
                startElement={<Search size={16} />}
              >
                <Input
                  placeholder="جستجو در دسته‌ها و زیردسته‌ها..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  size="md"
                />
              </InputGroup>

              {/* LAST: expand/collapse all buttons */}
              <IconButton
                variant="outline"
                size="md"
                aria-label="بستن همه"
                onClick={collapseAll}
                disabled={openIds.size === 0}
              >
                <ChevronsDownUp size={18} />
              </IconButton>
              <IconButton
                variant="outline"
                size="md"
                aria-label="باز کردن همه"
                onClick={expandAll}
                disabled={openIds.size === filtered.length}
              >
                <ChevronsUpDown size={18} />
              </IconButton>
            </Flex>

            {/* Description */}
            <Text fontSize="sm" color="fg.muted" textAlign="right">
              دسته‌بندی(های) مورد نظر خود را به فروشگاه اضافه کنید.
            </Text>

            {/* Accordion list — border only, bg comes from panel */}
            <Box
              borderWidth="1px"
              borderColor="border"
              rounded="2xl"
              overflow="hidden"
            >
              {filtered.length > 0 ? (
                filtered.map((category) => (
                  <CategoryAccordion
                    key={category.id}
                    category={category}
                    isSelected={selectedIds.includes(category.id)}
                    isDefault={selectedIds[0] === category.id}
                    isOpenControlled={openIds.has(category.id)}
                    onOpenChange={(isOpen) => handleOpenChange(category.id, isOpen)}
                    onAdd={handleAdd}
                    onRemove={handleRemove}
                    onSetDefault={handleSetDefault}
                  />
                ))
              ) : (
                <Flex
                  align="center"
                  justify="center"
                  py="16"
                >
                  <Text fontSize="sm" color="fg.subtle">
                    دسته‌بندی‌ای با این عنوان یافت نشد.
                  </Text>
                </Flex>
              )}
            </Box>

            {/* ButtonFooter */}
            <ButtonFooter
              back={{
                label: 'بازگشت به تنظیمات فروشگاه',
                onClick: () => navigate('/settings'),
              }}
            />

          </Flex>
        </Flex>
      </Box>

    </Flex>
  )
}
