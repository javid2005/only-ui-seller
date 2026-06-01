/**
 * PasswordInput — Chakra UI v3 composition component (RTL-adapted for Vitrina)
 *
 * RTL layout:
 *   startElement = key icon   (راست — inline-start = right in RTL)
 *   endElement   = eye toggle (چپ  — inline-end   = left  in RTL)
 *
 * Chakra official snippet from MCP: endElement for eye toggle (matches RTL چپ)
 * https://www.chakra-ui.com/docs/components/password-input
 */

import * as React from 'react'
import type { GroupProps, InputProps } from '@chakra-ui/react'
import {
  Box, IconButton, Input, InputGroup,
  mergeRefs, useControllableState,
} from '@chakra-ui/react'
import { Eye, EyeOff, KeyRound } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PasswordVisibilityProps {
  defaultVisible?: boolean
  visible?: boolean
  onVisibleChange?: (visible: boolean) => void
  visibilityIcon?: { on: React.ReactNode; off: React.ReactNode }
}

export interface PasswordInputProps extends InputProps, PasswordVisibilityProps {
  rootProps?: GroupProps
}

// ─── VisibilityTrigger ────────────────────────────────────────────────────────

const VisibilityTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof IconButton>
>(function VisibilityTrigger(props, ref) {
  return (
    <IconButton
      tabIndex={-1}
      ref={ref}
      me="-2"
      aspectRatio="square"
      size="sm"
      variant="ghost"
      height="calc(100% - {spacing.2})"
      aria-label="نمایش/پنهان رمز عبور"
      {...props}
    />
  )
})

// ─── PasswordInput ────────────────────────────────────────────────────────────

export const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  function PasswordInput(props, ref) {
    const {
      rootProps,
      defaultVisible,
      visible: visibleProp,
      onVisibleChange,
      visibilityIcon = { on: <Eye size={16} />, off: <EyeOff size={16} /> },
      w,
      width,
      ...rest
    } = props

    const [visible, setVisible] = useControllableState({
      value: visibleProp,
      defaultValue: defaultVisible || false,
      onChange: onVisibleChange,
    })

    const inputRef = React.useRef<HTMLInputElement>(null)

    return (
      <InputGroup
        w={w ?? 'full'}
        width={width}
        startElement={
          /* RTL: startElement = inline-start = RIGHT side — key icon (decorative) */
          <Box
            display="flex"
            alignItems="center"
            color="fg.subtle"
            opacity={0.7}
            pointerEvents="none"
          >
            <KeyRound size={16} />
          </Box>
        }
        endElement={
          /* RTL: endElement = inline-end = LEFT side — eye toggle (Chakra official pattern) */
          <VisibilityTrigger
            disabled={rest.disabled}
            onPointerDown={(e) => {
              if (rest.disabled) return
              if (e.button !== 0) return
              e.preventDefault()
              setVisible(!visible)
            }}
          >
            {visible ? visibilityIcon.off : visibilityIcon.on}
          </VisibilityTrigger>
        }
        {...rootProps}
      >
        <Input
          {...rest}
          ref={mergeRefs(ref, inputRef)}
          type={visible ? 'text' : 'password'}
        />
      </InputGroup>
    )
  }
)
