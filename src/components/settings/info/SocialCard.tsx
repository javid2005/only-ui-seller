import { Box, Flex, Text, Badge, Menu, IconButton, Portal } from '@chakra-ui/react'
import {
  EllipsisVertical, Pencil, Trash2,
  Send, Camera, PlayCircle, Globe, Hash, Briefcase, Users,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SocialCardProps {
  id: string
  /** نام نمایشی شبکه / عنوان */
  title: string
  /** پلتفرم: telegram | instagram | youtube | twitter | linkedin | facebook | other */
  platform: Platform
  /** آدرس / یوزرنیم */
  handle: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
}

export type Platform =
  | 'telegram'
  | 'instagram'
  | 'youtube'
  | 'twitter'
  | 'linkedin'
  | 'facebook'
  | 'other'

// ─── Platform config ──────────────────────────────────────────────────────────

const PLATFORM_CONFIG: Record<Platform, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  telegram:  { label: 'تلگرام',    bg: 'blue.subtle',   color: 'blue.fg',   icon: Send        },
  instagram: { label: 'اینستاگرام', bg: 'pink.subtle',  color: 'pink.fg',   icon: Camera      },
  youtube:   { label: 'یوتیوب',    bg: 'red.subtle',    color: 'red.fg',    icon: PlayCircle  },
  twitter:   { label: 'توییتر / X', bg: 'gray.subtle',  color: 'gray.fg',   icon: Hash        },
  linkedin:  { label: 'لینکدین',   bg: 'blue.subtle',   color: 'blue.fg',   icon: Briefcase   },
  facebook:  { label: 'فیسبوک',    bg: 'blue.subtle',   color: 'blue.fg',   icon: Users       },
  other:     { label: 'سایر',      bg: 'gray.subtle',   color: 'gray.fg',   icon: Globe       },
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
  const PlatformIcon = cfg.icon

  return (
    <Flex
      align="center"
      gap="4"
      p="4"
      bg="bg.subtle"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      w="full"
      minH="72px"
    >
      {/* FIRST = rightmost in RTL — آیکن پلتفرم */}
      <Box
        bg={cfg.bg}
        rounded="md"
        p="2"
        flexShrink={0}
        display="flex"
        alignItems="center"
        justifyContent="center"
        color={cfg.color}
        w="10"
        h="10"
      >
        <PlatformIcon size={20} />
      </Box>

      {/* Content — flex-start = RIGHT side in RTL column */}
      <Flex direction="column" gap="1" flex="1" minW="0" align="flex-start">
        {/* Title row with badge */}
        <Flex align="center" gap="2" w="full">
          <Text fontSize="sm" fontWeight="semibold" color="fg" noOfLines={1} lineHeight="1.428">
            {title}
          </Text>
          <Badge colorPalette="purple" variant="subtle" size="sm" flexShrink={0}>
            {cfg.label}
          </Badge>
        </Flex>
        {/* Handle */}
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
