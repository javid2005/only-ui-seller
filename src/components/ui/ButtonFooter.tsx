import { Box, Flex, Button, Separator } from '@chakra-ui/react'
import { ArrowRight } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface ActionBtn {
  label: string
  onClick: () => void
  loading?: boolean
  disabled?: boolean
}

interface BackBtn {
  label: string
  onClick: () => void
}

export interface ButtonFooterProps {
  /**
   * Primary action — solid button (سمت چپ / leftmost in RTL)
   * معمولاً «ذخیره»
   */
  primary?: ActionBtn
  /**
   * Secondary action — outline button
   * معمولاً «پیش‌نویس» یا عملیات دوم
   */
  secondary?: ActionBtn
  /**
   * Tertiary action — plain button
   * معمولاً «لغو» در سمت چپ
   */
  tertiary?: ActionBtn
  /**
   * Back/cancel — plain link با arrow (سمت راست / rightmost in RTL)
   * معمولاً «بازگشت به ...»
   */
  back?: BackBtn
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * ButtonFooter — فوتر دکمه‌های فرم
 *
 * ساختار RTL (چپ به راست در DOM → راست به چپ در نمایش):
 *   [back link — راست] ....spacer.... [tertiary | secondary | primary — چپ]
 *
 * Figma: https://www.figma.com/design/CfbQjlet5WMabrTfZt46iL/Vitrina?node-id=837-21271
 */
export function ButtonFooter({ primary, secondary, tertiary, back }: ButtonFooterProps) {
  return (
    <Box pt="4">
      <Separator mb="4" />
      <Flex align="center" gap="2">

        {/* RTL: FIRST = rightmost — back/cancel link */}
        {back && (
          <Button
            variant="plain"
            color="fg.muted"
            gap="1.5"
            px="0"
            onClick={back.onClick}
            _hover={{ color: 'fg' }}
          >
            <ArrowRight size={16} />
            {back.label}
          </Button>
        )}

        {/* Spacer */}
        <Box flex="1" />

        {/* RTL: LAST = leftmost — action buttons */}
        {tertiary && (
          <Button
            variant="plain"
            color="fg.muted"
            onClick={tertiary.onClick}
            loading={tertiary.loading}
            disabled={tertiary.disabled}
          >
            {tertiary.label}
          </Button>
        )}
        {secondary && (
          <Button
            variant="outline"
            onClick={secondary.onClick}
            loading={secondary.loading}
            disabled={secondary.disabled}
          >
            {secondary.label}
          </Button>
        )}
        {primary && (
          <Button
            colorPalette="brand"
            onClick={primary.onClick}
            loading={primary.loading}
            disabled={primary.disabled}
          >
            {primary.label}
          </Button>
        )}

      </Flex>
    </Box>
  )
}
