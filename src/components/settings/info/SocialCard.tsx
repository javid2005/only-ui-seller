import { Box, Flex, Text, Badge, Menu, IconButton, Portal } from '@chakra-ui/react'
import { EllipsisVertical, Pencil, Trash2, PlayCircle, Globe } from 'lucide-react'

import telegramSvg    from '@/assets/icons/Messenger/telegram.svg'
import whatsappSvg    from '@/assets/icons/Messenger/whatsapp.svg'
import discordSvg     from '@/assets/icons/Messenger/discord.svg'
import instagramSvg   from '@/assets/icons/Social Network/instagram.svg'
import twitterSvg     from '@/assets/icons/Social Network/twitter.svg'
import facebookSvg    from '@/assets/icons/Social Network/Facebook.svg'
import linkedinSvg    from '@/assets/icons/Social Network/linkedin.svg'
import tiktokSvg      from '@/assets/icons/Social Network/tiktok.svg'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SocialCardProps {
  id: string
  title: string
  platform: Platform
  handle: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export type Platform =
  | 'telegram'
  | 'whatsapp'
  | 'instagram'
  | 'twitter'
  | 'facebook'
  | 'linkedin'
  | 'tiktok'
  | 'discord'
  | 'youtube'
  | 'other'

// ─── Platform config ──────────────────────────────────────────────────────────

type PlatformConfig = {
  label: string
  svgSrc?: string
  LucideIcon?: React.ElementType
  lucideBg?: string
  lucideColor?: string
}

const PLATFORM_CONFIG: Record<Platform, PlatformConfig> = {
  telegram:  { label: 'تلگرام',     svgSrc: telegramSvg  },
  whatsapp:  { label: 'واتساپ',     svgSrc: whatsappSvg  },
  instagram: { label: 'اینستاگرام', svgSrc: instagramSvg },
  twitter:   { label: 'توییتر / X', svgSrc: twitterSvg   },
  facebook:  { label: 'فیسبوک',     svgSrc: facebookSvg  },
  linkedin:  { label: 'لینکدین',    svgSrc: linkedinSvg  },
  tiktok:    { label: 'تیک‌تاک',    svgSrc: tiktokSvg    },
  discord:   { label: 'دیسکورد',    svgSrc: discordSvg   },
  youtube:   { label: 'یوتیوب',     LucideIcon: PlayCircle, lucideBg: 'red.subtle',  lucideColor: 'red.fg'  },
  other:     { label: 'سایر',       LucideIcon: Globe,      lucideBg: 'gray.subtle', lucideColor: 'gray.fg' },
}

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * SocialCard — نمایش یک شبکه اجتماعی در لیست
 *
 * RTL DOM order (first=rightmost):
 *   [platform icon]  [title + badge + handle]  [⋮ menu]
 */
export function SocialCard({ id, title, platform, handle, onEdit, onDelete }: SocialCardProps) {
  const cfg = PLATFORM_CONFIG[platform] ?? PLATFORM_CONFIG.other
  const { LucideIcon } = cfg

  return (
    <Flex
      data-group=""
      align="center"
      gap="4"
      p="4"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      rounded="xl"
      w="full"
      overflow="hidden"
      _hover={{ bg: 'bg.teal', borderColor: 'teal.focusRing' }}
    >
      {/* FIRST = rightmost in RTL — آیکن پلتفرم */}
      {cfg.svgSrc ? (
        <Box flexShrink={0} w="10" h="10">
          <img src={cfg.svgSrc} width={40} height={40} alt={cfg.label} />
        </Box>
      ) : (
        <Box
          bg={cfg.lucideBg}
          rounded="lg"
          p="2"
          flexShrink={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          color={cfg.lucideColor}
          w="10"
          h="10"
          _groupHover={{ bg: 'teal.muted', color: 'teal.fg' }}
        >
          {LucideIcon && <LucideIcon size={20} />}
        </Box>
      )}

      {/* Content — flex-start = RIGHT side in RTL column */}
      <Flex direction="column" gap="1" flex="1" minW="0" align="flex-start">
        <Flex align="center" gap="2" w="full">
          <Text fontSize="sm" fontWeight="semibold" color="fg" noOfLines={1} lineHeight="1.428">
            {title}
          </Text>
          <Badge colorPalette="purple" variant="subtle" size="sm" flexShrink={0}>
            {cfg.label}
          </Badge>
        </Flex>
        <Text fontSize="xs" color="fg.muted" noOfLines={1} lineHeight="1.333">
          {handle}
        </Text>
      </Flex>

      {/* LAST = leftmost in RTL — منوی سه‌نقطه */}
      <Menu.Root>
        <Menu.Trigger asChild>
          <IconButton
            variant="ghost"
            size="sm"
            flexShrink={0}
            aria-label="گزینه‌ها"
          >
            <EllipsisVertical size={20} />
          </IconButton>
        </Menu.Trigger>
        <Portal>
          <Menu.Positioner dir="rtl">
            <Menu.Content minW="40">
              <Menu.Item value="edit" onClick={() => onEdit?.(id)}>
                <Pencil size={14} />
                ویرایش
              </Menu.Item>
              <Menu.Item
                value="delete"
                onClick={() => onDelete?.(id)}
                color="fg.error"
                _hover={{ bg: 'bg.error', color: 'fg.error' }}
              >
                <Trash2 size={14} />
                حذف
              </Menu.Item>
            </Menu.Content>
          </Menu.Positioner>
        </Portal>
      </Menu.Root>
    </Flex>
  )
}
