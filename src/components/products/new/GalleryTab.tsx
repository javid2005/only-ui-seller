import { useEffect, useState } from 'react'
import {
  Box, Flex, Grid, Text, Input, InputGroup, Button, IconButton, Checkbox, EmptyState,
} from '@chakra-ui/react'
import { Upload, Search, LayoutGrid, List, ImageOff, Trash2, Plus } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'
import { StepVideoButton } from './StepVideo'
import { ButtonFooter } from '@/components/ui/ButtonFooter'
import { Tooltip } from '@/components/ui/Tooltip'
import { toPersianDigits } from '@/utils/numbers'
import { SectionCard } from './SectionCard'
import { UploadedImageCard } from './UploadedImageCard'
import { MediaCard } from './MediaCard'
import { MediaThumb } from './MediaThumb'
import { MediaSeoDialog } from './MediaSeoDialog'
import { enterPanel } from './motion'
import { MediaUploadDialog } from './MediaUploadDialog'
import { VariantSelectDialog } from './VariantSelectDialog'
import { FolderPanel } from './FolderPanel'
import { FolderCreateDialog } from './FolderCreateDialog'
import { mediaName, MEDIA_EXTENSION } from './identity'
import { MediaRenameDialog } from './MediaRenameDialog'
import {
  GALLERY_MAX_IMAGES, isSmartFolder, libraryFor,
  type ProductForm, type GalleryImage, type MediaFolderId, type MediaFolderSource,
} from './data'

// ─── Props ───────────────────────────────────────────────────────────────────────

export interface GalleryTabProps {
  form: ProductForm
  onChange: (patch: Partial<ProductForm>) => void
  onSave: () => void
}

let _gid = 0
/**
 * `seq` از شمارندهٔ موجودِ رسانه‌ها گرفته می‌شود، نه از طول آرایه: با حذف یک رسانه
 * طول کم می‌شود ولی شمارهٔ بعدی نباید تکراری شود، وگرنه دو فایل هم‌نام می‌شوند.
 */
const newImage = (
  src: string, fileName: string, featured: boolean, folder: MediaFolderId, seq: number,
): GalleryImage => ({
  id: `img_${++_gid}`,
  seq,
  src,
  fileName,
  featured,
  variantTags: [],
  folder,
  alt: '',
  caption: '',
})

const nextSeq = (images: GalleryImage[]) =>
  images.reduce((max, img) => Math.max(max, img.seq), 0) + 1

let _fid = 0

// ─── Component ─────────────────────────────────────────────────────────────────
/**
 * GalleryTab — مرحلهٔ ۲: «گالری».
 *
 * فایل‌منیجر طرح تأییدشده: ستون پوشه‌ها (راست) + پنل رسانه (چپ) با نمای
 * شبکه‌ای/لیستی، جست‌وجوی نام فایل، انتخاب گروهی و مرتب‌سازی با کشیدن.
 *
 * فقط **یک** دکمهٔ افزودن داریم و هم تصویر هم ویدئو را می‌گیرد (بند ۶ دور
 * «چاکرا اصلاح»)؛ عملیات هر کارت پشت منوی سه‌نقطه است، نه ردیف دکمه.
 */
export function GalleryTab({ form, onChange, onSave }: GalleryTabProps) {
  // روی موبایلِ واقعی hover نداریم → دکمه‌های کارت همیشه نمایش
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const images = form.gallery
  const folders = form.folders
  const remaining = GALLERY_MAX_IMAGES - images.length

  const [folder, setFolder] = useState<MediaFolderId>(folders[0]?.id ?? 'products')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [query, setQuery] = useState('')
  const [selection, setSelection] = useState<string[]>([])
  const [dragId, setDragId] = useState<string | null>(null)
  const [uploadOpen, setUploadOpen] = useState(false)
  const [variantDialogImageId, setVariantDialogImageId] = useState<string | null>(null)
  const [seoDialogImageId, setSeoDialogImageId] = useState<string | null>(null)
  const [renameImageId, setRenameImageId] = useState<string | null>(null)
  const [folderDialogOpen, setFolderDialogOpen] = useState(false)

  const inFolder = images.filter((img) => img.folder === folder)
  const visible = query.trim()
    ? inFolder.filter((img) => img.fileName.toLowerCase().includes(query.trim().toLowerCase()))
    : inFolder

  const counts = folders.reduce(
    (acc, f) => ({ ...acc, [f.id]: images.filter((img) => img.folder === f.id).length }),
    {} as Record<MediaFolderId, number>,
  )
  const folderLabel = folders.find((f) => f.id === folder)?.label ?? ''
  const variantDialogImage = images.find((img) => img.id === variantDialogImageId) ?? null
  const seoDialogImage = images.find((img) => img.id === seoDialogImageId) ?? null
  const renameImage = images.find((img) => img.id === renameImageId) ?? null

  // پوشهٔ هوشمند محتوایش را از کتابخانه می‌گیرد، نه از رسانه‌های همین محصول
  const activeFolder = folders.find((f) => f.id === folder)
  const smartFolder = isSmartFolder(activeFolder)
  const libraryMedia = smartFolder
    ? libraryFor(activeFolder!.source, form.category)
        .filter((m) => query.trim() === '' || m.name.includes(query.trim()))
    : []

  /** «افزودن به این محصول» — رسانهٔ کتابخانه در پوشهٔ محصول کپی می‌شود */
  const addFromLibrary = (name: string) => {
    const seq = nextSeq(images)
    const hasFeatured = images.some((img) => img.featured)
    onChange({
      gallery: [...images, newImage('', `${name}.webp`, !hasFeatured, 'products', seq)],
    })
    setFolder('products')
  }

  // ─── Handlers ───────────────────────────────────────────────────────────────
  const addFiles = (files: File[]) => {
    if (files.length === 0) return
    Promise.all(
      files.map(
        (file) =>
          new Promise<{ src: string; name: string }>((resolve) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve({ src: reader.result as string, name: file.name })
            reader.readAsDataURL(file)
          }),
      ),
    ).then((loaded) => {
      const hasFeatured = images.some((img) => img.featured)
      const base = nextSeq(images)
      // نام فایل از همان ابتدا به فرمت مرجع درمی‌آید؛ نام اصلیِ فایلِ کاربر
      // (اغلب «IMG_2043» یا فارسی) در آدرس تصویر بی‌معنی است. کاربر بعداً از
      // «نام فایل» عوضش می‌کند و همان‌جا هم قواعد اعمال می‌شوند.
      const added = loaded.map((l, i) =>
        newImage(l.src, `${mediaName(base + i)}.${MEDIA_EXTENSION}`, !hasFeatured && i === 0, folder, base + i))
      onChange({ gallery: [...images, ...added] })
    })
  }

  const removeImages = (ids: string[]) => {
    const next = images.filter((img) => !ids.includes(img.id))
    // اگر تصویر شاخص حذف شد و تصویری باقی ماند → اولی شاخص می‌شود
    if (next.length > 0 && !next.some((img) => img.featured)) {
      next[0] = { ...next[0], featured: true }
    }
    onChange({ gallery: next })
    setSelection((prev) => prev.filter((id) => !ids.includes(id)))
  }

  const setFeatured = (id: string) =>
    onChange({ gallery: images.map((img) => ({ ...img, featured: img.id === id })) })

  const patchImage = (id: string, patch: Partial<GalleryImage>) =>
    onChange({ gallery: images.map((img) => (img.id === id ? { ...img, ...patch } : img)) })

  const createFolder = (label: string, source: MediaFolderSource) => {
    const id = `folder_${++_fid}`
    onChange({ folders: [...folders, { id, label, source }] })
    setFolder(id)
  }

  const renameFolder = (id: MediaFolderId, label: string) =>
    onChange({ folders: folders.map((f) => (f.id === id ? { ...f, label } : f)) })

  const removeFolder = (id: MediaFolderId) => {
    // رسانه‌های داخل پوشهٔ حذف‌شده به پوشهٔ محصول برمی‌گردند، نه اینکه ناپدید شوند
    onChange({
      folders: folders.filter((f) => f.id !== id),
      gallery: images.map((img) => (img.folder === id ? { ...img, folder: 'products' } : img)),
    })
    if (folder === id) setFolder('products')
  }

  /** جابه‌جایی پوشه در فهرست — پوشه‌های قفل‌شده سر جایشان می‌مانند */
  const moveFolder = (id: MediaFolderId, dir: -1 | 1) => {
    const i = folders.findIndex((f) => f.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= folders.length) return
    if (folders[i].locked || folders[j].locked) return
    const next = [...folders]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange({ folders: next })
  }

  /**
   * مرتب‌سازی با drag & drop — در **هر** پوشه، نه فقط پوشهٔ اصلی.
   *
   * ریشهٔ باگ پروتوتایپ: مرتب‌سازی مستقیم روی آرایهٔ سراسری کار می‌کرد و فقط برای
   * پوشهٔ محصول فعال بود. اینجا جابه‌جایی روی لیستِ همان پوشه انجام می‌شود و بعد
   * در جای‌های همان پوشه در آرایهٔ سراسری بازنویسی می‌شود.
   */
  const reorderTo = (targetId: string) => {
    if (!dragId || dragId === targetId) return
    const from = inFolder.findIndex((img) => img.id === dragId)
    const to = inFolder.findIndex((img) => img.id === targetId)
    if (from === -1 || to === -1) return

    const nextInFolder = [...inFolder]
    const [moved] = nextInFolder.splice(from, 1)
    nextInFolder.splice(to, 0, moved)

    let cursor = 0
    onChange({
      gallery: images.map((img) => (img.folder === folder ? nextInFolder[cursor++] : img)),
    })
  }

  const allSelected = visible.length > 0 && visible.every((img) => selection.includes(img.id))

  const dragProps = (img: GalleryImage) => ({
    draggable: !query.trim(), // با فیلتر فعال، ترتیب معنا ندارد
    isDragging: dragId === img.id,
    onDragStart: () => setDragId(img.id),
    onDragOver: (e: React.DragEvent) => { e.preventDefault(); reorderTo(img.id) },
    onDrop: () => setDragId(null),
    onDragEnd: () => setDragId(null),
  })

  return (
    <Flex direction="column" gap="5" w="full">

      <TitleBar
        title="گالری"
        cta={<StepVideoButton step="gallery" title="گالری" />}
        subtitle="تصاویر، کتابخانه و ویرایش رسانه‌ها"
        size="xl"
        divider
      />

      <SectionCard
        title="گالری و فایل‌منیجر"
        subtitle="تصویر اصلی، ویدئو، ترتیب نمایش و تصویر اختصاصی مدل‌ها را مدیریت کنید"
        helpTopic="گالری و کتابخانه رسانه"
        helpVideo
        actions={
          <Button
            size="sm"
            colorPalette="brand"
            onClick={() => setUploadOpen(true)}
            disabled={remaining <= 0}
          >
            {/* FIRST = rightmost: آیکن */}
            <Upload size={15} />افزودن تصویر/ویدئو
          </Button>
        }
      >
        {/* FIRST = rightmost در RTL: ستون پوشه‌ها (۲۶۴px طبق طرح) */}
        <Grid
          templateColumns={{ base: '1fr', lg: '228px minmax(0, 1fr)', xl: '264px minmax(0, 1fr)' }}
          gap="3.5"
          w="full"
          alignItems="start"
        >
          <FolderPanel
            folders={folders}
            active={folder}
            onSelect={(id) => { setFolder(id); setSelection([]); setQuery('') }}
            counts={counts}
            onCreate={() => setFolderDialogOpen(true)}
            onRename={renameFolder}
            onRemove={removeFolder}
            onMove={moveFolder}
          />

          {/* پنل رسانه — در طرح مثل ستون پوشه‌ها یک کادر مستقل است، نه ناحیهٔ باز */}
          <Flex
            data-field="gallery"
            direction="column"
            gap="4"
            minW="0"
            w="full"
            borderWidth="1px"
            borderColor="border.muted"
            rounded="xl"
            bg="bg.panel"
            p="2.5"
          >

            {/* نوار ابزار: عنوان و شمارش راست · تغییر نما چپ */}
            <Flex align="center" justify="space-between" gap="3" w="full" wrap="wrap">
              <Box minW="0">
                <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="start">
                  {folderLabel}
                </Text>
                <Text fontSize="xs" color="fg.muted" textAlign="start">
                  {toPersianDigits(inFolder.length)} رسانه • قابل مرتب‌سازی با کشیدن
                </Text>
              </Box>
              <Flex gap="1" bg="bg.subtle" rounded="l2" p="1" flexShrink={0}>
                {/* FIRST = rightmost: شبکه‌ای */}
                <Tooltip content="نمای شبکه‌ای">
                  <IconButton
                    size="xs" rounded="l1" aria-label="نمای شبکه‌ای" aria-pressed={view === 'grid'}
                    variant={view === 'grid' ? 'solid' : 'ghost'}
                    colorPalette={view === 'grid' ? 'brand' : 'gray'}
                    onClick={() => setView('grid')}
                  >
                    <LayoutGrid size={14} />
                  </IconButton>
                </Tooltip>
                <Tooltip content="نمای لیستی">
                  <IconButton
                    size="xs" rounded="l1" aria-label="نمای لیستی" aria-pressed={view === 'list'}
                    variant={view === 'list' ? 'solid' : 'ghost'}
                    colorPalette={view === 'list' ? 'brand' : 'gray'}
                    onClick={() => setView('list')}
                  >
                    <List size={14} />
                  </IconButton>
                </Tooltip>
              </Flex>
            </Flex>

            {/* جست‌وجوی نام فایل در همین پوشه */}
            <InputGroup startElement={<Search size={15} />} w="full">
              <Input
                placeholder="جست‌وجوی نام فایل در این پوشه…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="جست‌وجوی نام فایل"
              />
            </InputGroup>

            {/* نوار انتخاب گروهی — فقط وقتی رسانه‌ای هست */}
            {visible.length > 0 && (
              <Flex align="center" gap="3" w="full" wrap="wrap">
                {/* FIRST = rightmost: انتخاب همه */}
                <Checkbox.Root
                  size="sm"
                  checked={allSelected}
                  onCheckedChange={(e) =>
                    setSelection(e.checked === true ? visible.map((img) => img.id) : [])
                  }
                >
                  <Checkbox.HiddenInput />
                  <Checkbox.Control />
                  <Checkbox.Label fontSize="xs" color="fg.muted">انتخاب همه</Checkbox.Label>
                </Checkbox.Root>

                <Text fontSize="xs" color="fg.muted" flex="1" textAlign="start">
                  {toPersianDigits(selection.length)} رسانه انتخاب شده
                </Text>

                {selection.length > 0 && (
                  <Button
                    size="xs"
                    variant="outline"
                    colorPalette="red"
                    rounded="l2"
                    onClick={() => removeImages(selection)}
                  >
                    <Trash2 size={13} />حذف انتخاب‌ها
                  </Button>
                )}
              </Flex>
            )}

            {/* پوشهٔ هوشمند: محتوایش محاسبه می‌شود، پس نه انتخاب گروهی دارد نه
                مرتب‌سازی — فقط «به این محصول اضافه کن». */}
            {smartFolder ? (
              libraryMedia.length === 0 ? (
                <EmptyState.Root size="sm">
                  <EmptyState.Content>
                    <EmptyState.Indicator><ImageOff /></EmptyState.Indicator>
                    <EmptyState.Title>رسانه‌ای با این شرط پیدا نشد</EmptyState.Title>
                    <EmptyState.Description>
                      این پوشه خودکار پر می‌شود؛ با آپلود رسانه‌های تازه اینجا دیده می‌شوند.
                    </EmptyState.Description>
                  </EmptyState.Content>
                </EmptyState.Root>
              ) : (
                <Grid
                  templateColumns="repeat(auto-fill, minmax(192px, 1fr))"
                  gap="2.5"
                  w="full"
                  {...enterPanel}
                >
                  {libraryMedia.map((m) => (
                    <Flex
                      key={m.id}
                      direction="column"
                      gap="2"
                      p="2"
                      rounded="12px"
                      borderWidth="1px"
                      borderColor="border.muted"
                      bg="bg.panel"
                    >
                      <MediaThumb aspectRatio="1.24" w="full" rounded="10px" />
                      <Box minW="0">
                        <Text fontSize="xs" color="fg" textAlign="start" truncate dir="ltr">
                          {m.name}
                        </Text>
                        <Text fontSize="2xs" color="fg.muted" textAlign="start" truncate>
                          {m.productLabel}
                        </Text>
                      </Box>
                      <Button
                        size="xs"
                        variant="subtle"
                        colorPalette="brand"
                        rounded="l2"
                        gap="1.5"
                        onClick={() => addFromLibrary(m.name)}
                      >
                        {/* FIRST = rightmost: آیکن (leading) */}
                        <Plus size={13} />
                        افزودن به این محصول
                      </Button>
                    </Flex>
                  ))}
                </Grid>
              )
            ) : visible.length === 0 ? (
              <EmptyState.Root size="sm">
                <EmptyState.Content>
                  <EmptyState.Indicator><ImageOff /></EmptyState.Indicator>
                  <EmptyState.Title>
                    {query.trim() ? 'فایلی با این نام پیدا نشد' : 'این پوشه خالی است'}
                  </EmptyState.Title>
                </EmptyState.Content>
              </EmptyState.Root>
            ) : view === 'grid' ? (
              <Grid
                templateColumns="repeat(auto-fill, minmax(192px, 1fr))"
                gap="2.5"
                w="full"
                {...enterPanel}
              >
                {visible.map((img, i) => (
                  <MediaCard
                    key={img.id}
                    src={img.src}
                    label={`تصویر ${toPersianDigits(i + 1)}`}
                    featured={img.featured}
                    variantTags={img.variantTags}
                    alt={img.alt}
                    folder={img.folder}
                    folders={folders}
                    selected={selection.includes(img.id)}
                    onSelect={(checked) =>
                      setSelection((prev) =>
                        checked ? [...prev, img.id] : prev.filter((id) => id !== img.id))
                    }
                    onRemove={() => removeImages([img.id])}
                    onSetFeatured={() => setFeatured(img.id)}
                    onSelectVariant={() => setVariantDialogImageId(img.id)}
                    onEditSeo={() => setSeoDialogImageId(img.id)}
                    onRename={() => setRenameImageId(img.id)}
                    onMoveToFolder={(target) => patchImage(img.id, { folder: target })}
                    {...dragProps(img)}
                  />
                ))}
              </Grid>
            ) : (
              <Grid templateColumns="1fr" gap="4" w="full">
                {visible.map((img, i) => (
                  <UploadedImageCard
                    key={img.id}
                    src={img.src}
                    label={`تصویر ${toPersianDigits(i + 1)}`}
                    featured={img.featured}
                    variantTags={img.variantTags}
                    alt={img.alt}
                    alwaysShowActions={isMobile}
                    folder={img.folder}
                    folders={folders}
                    onMoveToFolder={(target) => patchImage(img.id, { folder: target })}
                    onRemove={() => removeImages([img.id])}
                    onSetFeatured={() => setFeatured(img.id)}
                    onSelectVariant={() => setVariantDialogImageId(img.id)}
                    onEditSeo={() => setSeoDialogImageId(img.id)}
                    onRename={() => setRenameImageId(img.id)}
                    onRemoveTag={(tag) =>
                      patchImage(img.id, { variantTags: img.variantTags.filter((t) => t !== tag) })
                    }
                    {...dragProps(img)}
                  />
                ))}
              </Grid>
            )}

          </Flex>
        </Grid>
      </SectionCard>

      <ButtonFooter
        primary={{ label: 'ذخیره و ادامه', onClick: onSave }}
      />

      {/* ═══ آپلودگر چندگانه ════════════════════════════════════════════════════ */}
      <MediaUploadDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        remaining={remaining}
        folderLabel={folderLabel}
        onConfirm={addFiles}
      />

      {/* ═══ دیالوگ «انتخاب تنوع» ═══════════════════════════════════════════════ */}
      <VariantSelectDialog
        open={variantDialogImage !== null}
        onClose={() => setVariantDialogImageId(null)}
        selectedTags={variantDialogImage?.variantTags ?? []}
        onConfirm={(tags) => variantDialogImage && patchImage(variantDialogImage.id, { variantTags: tags })}
      />

      {/* ═══ پوشهٔ تازه ═════════════════════════════════════════════════════════ */}
      <FolderCreateDialog
        open={folderDialogOpen}
        onClose={() => setFolderDialogOpen(false)}
        onCreate={createFolder}
      />

      {/* ═══ تغییر نام فایل ═════════════════════════════════════════════════════ */}
      <MediaRenameDialog
        image={renameImage}
        onClose={() => setRenameImageId(null)}
        onConfirm={(fileName) => renameImage && patchImage(renameImage.id, { fileName })}
      />

      {/* ═══ دیالوگ «سئوی تصویر» — ALT و کپشن ════════════════════════════════════ */}
      <MediaSeoDialog
        image={seoDialogImage}
        onClose={() => setSeoDialogImageId(null)}
        onConfirm={(patch) => seoDialogImage && patchImage(seoDialogImage.id, patch)}
      />

    </Flex>
  )
}
