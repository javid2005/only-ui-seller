import { Tooltip as ChakraTooltip, Portal } from '@chakra-ui/react'
import { forwardRef, type ReactNode, type RefObject } from 'react'

// ─── Tooltip ────────────────────────────────────────────────────────────────────
// Chakra v3 `Tooltip` یک namespace است (Root / Trigger asChild / Positioner / Content).
// این wrapper همان snippet استاندارد DS است + دو adaptation ویترینا:
//   ۱. `dir="rtl"` روی Positioner — Portal بیرون درخت React است و باید صریح جهت بگیرد.
//   ۲. پیش‌فرض `openDelay` کوتاه تا روی rail استپر تولتیپ «کار کند» و کند حس نشود.

export interface TooltipProps extends ChakraTooltip.RootProps {
  /** متن/محتوای تولتیپ */
  content: ReactNode
  showArrow?: boolean
  portalled?: boolean
  portalRef?: RefObject<HTMLElement | null>
  contentProps?: ChakraTooltip.ContentProps
  /** غیرفعال → children بدون wrapper رندر می‌شود (بدون listener اضافه) */
  disabled?: boolean
  children: ReactNode
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(function Tooltip(props, ref) {
  const {
    content,
    showArrow = true,
    portalled = true,
    portalRef,
    contentProps,
    disabled,
    children,
    openDelay = 150,
    closeDelay = 80,
    ...rest
  } = props

  if (disabled || !content) return <>{children}</>

  return (
    <ChakraTooltip.Root openDelay={openDelay} closeDelay={closeDelay} {...rest}>
      <ChakraTooltip.Trigger asChild>{children}</ChakraTooltip.Trigger>
      <Portal disabled={!portalled} container={portalRef}>
        <ChakraTooltip.Positioner dir="rtl">
          <ChakraTooltip.Content ref={ref} fontSize="xs" {...contentProps}>
            {showArrow && (
              <ChakraTooltip.Arrow>
                <ChakraTooltip.ArrowTip />
              </ChakraTooltip.Arrow>
            )}
            {content}
          </ChakraTooltip.Content>
        </ChakraTooltip.Positioner>
      </Portal>
    </ChakraTooltip.Root>
  )
})
