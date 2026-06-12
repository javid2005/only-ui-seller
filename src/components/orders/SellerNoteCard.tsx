import { useState } from 'react'
import { Box, Button, Flex, Text, Textarea } from '@chakra-ui/react'
import { Pencil } from 'lucide-react'
import { TitleBar } from '@/components/ui/TitleBar'

/**
 * SellerNoteCard — یادداشت فروشنده (فقط برای فروشنده قابل مشاهده).
 * empty state → کلیک «ویرایش» یا روی placeholder، Textarea باز می‌شود.
 */
export function SellerNoteCard() {
  const [editing, setEditing] = useState(false)
  const [note, setNote] = useState('')

  return (
    <Box
      bg="bg.panel"
      borderWidth="1px"
      borderColor="border"
      rounded="2xl"
      p="6"
      w="full"
    >
      <TitleBar
        title="یادداشت فروشنده"
        subtitle="فقط برای شما قابل مشاهده می باشد."
        size="md"
        cta={
          <Button
            size="sm"
            variant="outline"
            colorPalette="brand"
            onClick={() => setEditing((v) => !v)}
          >
            <Pencil size={16} />
            ویرایش
          </Button>
        }
      />

      <Box pt="4">
        {editing ? (
          <Textarea
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="یادداشت خود را بنویسید..."
            minH="24"
            onBlur={() => { if (!note.trim()) setEditing(false) }}
          />
        ) : note.trim() ? (
          <Text fontSize="sm" color="fg" whiteSpace="pre-wrap">{note}</Text>
        ) : (
          <Flex
            as="button"
            onClick={() => setEditing(true)}
            w="full"
            minH="16"
            align="center"
            justify="center"
            rounded="lg"
            borderWidth="1px"
            borderStyle="dashed"
            borderColor="border"
            color="fg.muted"
            _hover={{ bg: 'bg.subtle', color: 'fg' }}
            transition="all 0.15s"
          >
            <Text fontSize="sm">یادداشتی ثبت نشده. برای افزودن کلیک کنید.</Text>
          </Flex>
        )}
      </Box>
    </Box>
  )
}
