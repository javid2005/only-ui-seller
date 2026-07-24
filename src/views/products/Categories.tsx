import { useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Box, Button, Flex, Input, InputGroup, Text,
} from '@chakra-ui/react'
import { Search } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { SectionHeader } from '@/components/products/categories/SectionHeader'
import { CategoryMngAccordion } from '@/components/products/categories/CategoryMngAccordion'
import { SubCategoryDialog } from '@/components/products/categories/SubCategoryDialog'
import { INITIAL_SECTIONS, type CategorySection, type SubCategory } from '@/components/products/categories/data'

let _sid = 1000
const newSub = (name: string): SubCategory => ({ id: `s${++_sid}`, name })

export function ProductCategories() {
  const router = useRouter()
  const isCompact = useCompactMode()

  const [sections, setSections] = useState<CategorySection[]>(INITIAL_SECTIONS)
  const [searchQuery, setSearchQuery] = useState('')
  const [openIds, setOpenIds] = useState<Set<string>>(new Set())
  const [dialog, setDialog] = useState<
    { catId: string; mode: 'add' | 'edit'; subId?: string; initialName?: string } | null
  >(null)
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id ?? '')

  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({})

  // ─── Search filter ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return sections
    return sections
      .map((sec) => ({
        ...sec,
        categories: sec.categories.filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.subcategories.some((s) => s.name.toLowerCase().includes(q)),
        ),
      }))
      .filter((sec) => sec.categories.length > 0)
  }, [sections, searchQuery])

  // ─── Handlers ─────────────────────────────────────────────────────────────
  function toggle(id: string) {
    setOpenIds((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function updateCategory(catId: string, fn: (subs: SubCategory[]) => SubCategory[]) {
    setSections((prev) =>
      prev.map((sec) => ({
        ...sec,
        categories: sec.categories.map((c) =>
          c.id === catId ? { ...c, subcategories: fn(c.subcategories) } : c,
        ),
      })),
    )
  }

  const addSub = (catId: string, name: string) =>
    updateCategory(catId, (subs) => [...subs, newSub(name)])

  const removeSub = (catId: string, subId: string) =>
    updateCategory(catId, (subs) => subs.filter((s) => s.id !== subId))

  const reorderSub = (catId: string, from: number, to: number) =>
    updateCategory(catId, (subs) => {
      const next = [...subs]
      const [moved] = next.splice(from, 1)
      next.splice(to, 0, moved)
      return next
    })

  const editSub = (catId: string, subId: string, name: string) =>
    updateCategory(catId, (subs) => subs.map((s) => (s.id === subId ? { ...s, name } : s)))

  function scrollToSection(id: string) {
    setActiveSection(id)
    sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const dialogCat = dialog
    ? sections.flatMap((s) => s.categories).find((c) => c.id === dialog.catId)
    : undefined

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <Flex direction="column" gap="4" w="full">

      {/* ─── Page header ─────────────────────────────────────────────────── */}
      <Header
        title="دسته بندی محصولات"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'محصولات', href: '/products' },
          { label: 'دسته بندی محصولات' },
        ]}
      />

      {/* ─── Panel (Two Columns Right Center) ────────────────────────────── */}
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        rounded="2xl"
        pt={isCompact ? '4' : { base: '4', sm: '6' }}
        pb="6"
        px={isCompact ? '4' : { base: '4', sm: '6' }}
        w="full"
      >
        <Flex gap="10" align="flex-start">

          {/* FIRST = rightmost در RTL: ستون Start — Vertical tabs (lg+، non-compact) */}
          {!isCompact && (
            <Box
              display={{ base: 'none', lg: 'block' }}
              w="256px"
              flexShrink={0}
              position="sticky"
              top="20"
              alignSelf="flex-start"
            >
              <Flex direction="column" gap="2" pt="6">
                {filtered.map((sec) => (
                  <Button
                    key={sec.id}
                    variant="ghost"
                    onClick={() => scrollToSection(sec.id)}
                    h="10"
                    px="4"
                    w="full"
                    justifyContent="flex-start"
                    fontSize="sm"
                    fontWeight={activeSection === sec.id ? 'semibold' : 'normal'}
                    color={activeSection === sec.id ? 'brand.fg' : 'fg.muted'}
                    _hover={{ color: 'fg', bg: 'bg.subtle' }}
                  >
                    {sec.title}
                  </Button>
                ))}
              </Flex>
            </Box>
          )}

          {/* SECOND: ستون Middle (مرکز) — max 960 */}
          <Flex direction="column" gap="4" maxW="960px" flex="1" minW="0">

            {/* TitleBar */}
            <TitleBar
              title="مدیریت دسته بندی محصولات"
              subtitle="افزودن و مدیریت زیردسته‌های جدید"
              size="lg"
            />

            {/* SearchBar */}
            <InputGroup startElement={<Search size={16} />}>
              <Input
                placeholder="جستجو در دسته‌ها و زیردسته‌ها..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="md"
              />
            </InputGroup>

            {/* Sections */}
            {filtered.length > 0 ? (
              filtered.map((sec) => (
                <Box
                  key={sec.id}
                  ref={(el: HTMLDivElement | null) => { sectionRefs.current[sec.id] = el }}
                  scrollMarginTop="24"
                >
                  <Flex direction="column" gap="3">
                    <SectionHeader title={sec.title} />

                    {/* Category list */}
                    <Box borderWidth="1px" borderColor="border" rounded="2xl" overflow="hidden">
                      {sec.categories.map((cat, idx) => (
                        <CategoryMngAccordion
                          key={cat.id}
                          category={cat}
                          isOpen={openIds.has(cat.id)}
                          onToggle={() => toggle(cat.id)}
                          onAddSub={() => setDialog({ catId: cat.id, mode: 'add' })}
                          onRemoveSub={(subId) => removeSub(cat.id, subId)}
                          onEditSub={(subId, currentName) =>
                            setDialog({ catId: cat.id, mode: 'edit', subId, initialName: currentName })
                          }
                          onReorderSub={(from, to) => reorderSub(cat.id, from, to)}
                          isLast={idx === sec.categories.length - 1}
                        />
                      ))}
                    </Box>
                  </Flex>
                </Box>
              ))
            ) : (
              <Flex align="center" justify="center" py="16">
                <Text fontSize="sm" color="fg.subtle">
                  دسته‌بندی‌ای با این عنوان یافت نشد.
                </Text>
              </Flex>
            )}

            {/* ButtonFooter */}
            <ButtonFooter
              primary={{ label: 'ذخیره', onClick: () => { /* TODO: save */ } }}
              back={{ label: 'بازگشت', onClick: () => router.push('/products') }}
            />

          </Flex>
        </Flex>
      </Box>

      {/* ─── Add / Edit subcategory dialog ───────────────────────────────── */}
      <SubCategoryDialog
        open={dialog !== null}
        mode={dialog?.mode}
        parentName={dialogCat?.name}
        initialName={dialog?.initialName}
        onClose={() => setDialog(null)}
        onSubmit={(name) => {
          if (!dialog) return
          if (dialog.mode === 'add') addSub(dialog.catId, name)
          else if (dialog.subId) editSub(dialog.catId, dialog.subId, name)
        }}
      />

    </Flex>
  )
}
