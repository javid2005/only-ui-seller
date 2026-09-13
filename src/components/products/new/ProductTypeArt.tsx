import { Box } from '@chakra-ui/react'
import type { BoxProps } from '@chakra-ui/react'
import type { ProductTypeId } from './data'

// ─── ProductTypeArt ─────────────────────────────────────────────────────────────
/**
 * تصویر انتزاعیِ هر نوع محصول در دیالوگ انتخاب نوع.
 *
 * عیناً همان دو تصویر طرح تأییدشده است (از data-URI داخل پروتوتایپ استخراج شد):
 * یک اسکلتِ کالا روی زمینهٔ گرادیانی — «ساده» با تهِ خاکستریِ برند و «متنوع» با
 * تهِ آبی، تا حتی بدون خواندن عنوان هم دو گزینه از هم تفکیک شوند.
 *
 * چرا inline SVG و نه فایل: رنگ‌ها **دادهٔ تصویرند** نه سطح theme-able، حجمش ناچیز
 * است، و inline بودن یعنی در خروجی استاتیک هم بدون درخواست شبکه رندر می‌شود.
 */
export interface ProductTypeArtProps extends Omit<BoxProps, 'children'> {
  type: ProductTypeId
}

const PALETTE: Record<ProductTypeId, { accent: string; ink: string }> = {
  simple: { accent: '#52bda4', ink: '#3a4348' },
  varied: { accent: '#6bd2bd', ink: '#447bab' },
}

export function ProductTypeArt({ type, ...rest }: ProductTypeArtProps) {
  const { accent, ink } = PALETTE[type]
  const gid = `pta-g-${type}`
  const bid = `pta-bg-${type}`

  return (
    <Box overflow="hidden" lineHeight="0" {...rest}>
      <svg viewBox="0 0 256 256" width="100%" height="100%" role="img" aria-label={`نمونه ${type === 'simple' ? 'محصول ساده' : 'محصول متنوع'}`}>
        <defs>
          <linearGradient id={gid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={accent} />
            <stop offset="1" stopColor="#d8f4ed" />
          </linearGradient>
          <linearGradient id={bid} x1="0" y1="0" x2="1" y2="1">
            <stop stopColor={accent} stopOpacity=".24" />
            <stop offset=".52" stopColor="#f9fcfb" />
            <stop offset="1" stopColor={ink} stopOpacity=".12" />
          </linearGradient>
        </defs>
        <rect width="256" height="256" fill={`url(#${bid})`} />
        <circle cx="213" cy="44" r="54" fill={accent} opacity=".10" />
        <circle cx="37" cy="211" r="62" fill={ink} opacity=".08" />
        <rect x="82" y="34" width="91" height="176" rx="18" fill={ink} />
        <rect x="89" y="43" width="77" height="151" rx="12" fill={`url(#${gid})`} />
        <rect x="113" y="199" width="29" height="4" rx="2" fill="#fff" opacity=".55" />
        <ellipse cx="128" cy="219" rx="67" ry="10" fill="#607078" opacity=".16" />
      </svg>
    </Box>
  )
}
