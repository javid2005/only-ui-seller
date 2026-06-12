import { ButtonGroup, IconButton, Pagination } from '@chakra-ui/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { toPersianDigits } from '@/utils/numbers'

interface ListPaginationProps {
  count: number
  pageSize: number
  page: number
  onPageChange: (page: number) => void
}

/**
 * صفحه‌بندی مشترک صفحات لیست (سفارشات / محصولات) — کامپوننت Chakra Pagination.
 * RTL: «قبلی» = chevron راست، «بعدی» = chevron چپ. اعداد فارسی.
 */
export function ListPagination({ count, pageSize, page, onPageChange }: ListPaginationProps) {
  return (
    <Pagination.Root
      count={count}
      pageSize={pageSize}
      page={page}
      onPageChange={(e) => onPageChange(e.page)}
      dir="rtl"
    >
      <ButtonGroup variant="ghost" size="sm" gap="1">
        <Pagination.PrevTrigger asChild>
          <IconButton aria-label="صفحه قبل">
            <ChevronRight size={16} />
          </IconButton>
        </Pagination.PrevTrigger>

        <Pagination.Items
          render={(p) => (
            <IconButton
              key={p.value}
              variant={{ base: 'ghost', _selected: 'outline' }}
              aria-label={`صفحه ${p.value}`}
            >
              {toPersianDigits(p.value)}
            </IconButton>
          )}
        />

        <Pagination.NextTrigger asChild>
          <IconButton aria-label="صفحه بعد">
            <ChevronLeft size={16} />
          </IconButton>
        </Pagination.NextTrigger>
      </ButtonGroup>
    </Pagination.Root>
  )
}
