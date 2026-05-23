import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { Global } from '@emotion/react'
import { Box, Flex, IconButton, Separator } from '@chakra-ui/react'
import { Bold, Italic, Underline, List, ListOrdered, Undo, Redo } from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface RichTextEditorProps {
  value?: string
  onChange?: (html: string) => void
  placeholder?: string
  minH?: string
}

// ─── Global ProseMirror styles ────────────────────────────────────────────────

function ProseMirrorGlobal() {
  return (
    <Global
      styles={{
        '.vitrina-editor.ProseMirror': {
          outline: 'none',
          boxShadow: 'none',
          border: 'none',
        },
        '.vitrina-editor.ProseMirror p.is-editor-empty:first-of-type::before': {
          content: 'attr(data-placeholder)',
          color: 'var(--chakra-colors-fg-subtle)',
          pointerEvents: 'none',
          float: 'right',
        },
        '.vitrina-editor.ProseMirror ul': {
          paddingInlineStart: '1.5rem',
          listStyleType: 'disc',
        },
        '.vitrina-editor.ProseMirror ol': {
          paddingInlineStart: '1.5rem',
          listStyleType: 'decimal',
        },
        '.vitrina-editor.ProseMirror strong': {
          fontWeight: '600',
        },
        '.vitrina-editor.ProseMirror em': {
          fontStyle: 'italic',
        },
        '.vitrina-editor.ProseMirror p': {
          margin: '0',
        },
      }}
    />
  )
}

// ─── Toolbar Button ───────────────────────────────────────────────────────────

function ToolBtn({
  label,
  icon,
  onClick,
  isActive,
}: {
  label: string
  icon: React.ReactNode
  onClick: () => void
  isActive?: boolean
}) {
  return (
    <IconButton
      size="xs"
      variant={isActive ? 'subtle' : 'ghost'}
      aria-label={label}
      onClick={(e) => { e.preventDefault(); onClick() }}
      color={isActive ? 'brand.fg' : 'fg.muted'}
      _hover={{ bg: 'bg.muted', color: 'fg' }}
    >
      {icon}
    </IconButton>
  )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'درباره فروشگاه خود بنویسید...',
  minH = '156px',
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: value ?? '',
    onUpdate({ editor }) {
      onChange?.(editor.getHTML())
    },
    editorProps: {
      attributes: {
        dir: 'rtl',
        class: 'vitrina-editor',
        style: [
          'outline: none',
          'box-shadow: none',
          `min-height: ${minH}`,
          'padding: 12px',
          `font-size: var(--chakra-fontSizes-sm)`,
          `color: var(--chakra-colors-fg)`,
          'line-height: 1.625',
          'direction: rtl',
        ].join('; '),
      },
    },
  })

  if (!editor) return null

  return (
    <>
      <ProseMirrorGlobal />
      <Box
        w="full"
        borderWidth="1px"
        borderColor="border"
        rounded="md"
        overflow="hidden"
        _focusWithin={{ borderColor: 'border', outline: 'none', boxShadow: 'none' }}
      >
        {/* ── Toolbar ─────────────────────────────────────── */}
        <Flex
          px="2"
          py="1.5"
          gap="0.5"
          bg="bg.subtle"
          borderBottomWidth="1px"
          borderColor="border"
          flexWrap="wrap"
          align="center"
        >
          <ToolBtn
            label="bold"
            icon={<Bold size={14} />}
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive('bold')}
          />
          <ToolBtn
            label="italic"
            icon={<Italic size={14} />}
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive('italic')}
          />
          <ToolBtn
            label="underline"
            icon={<Underline size={14} />}
            onClick={() => editor.chain().focus().toggleUnderline?.().run()}
            isActive={editor.isActive('underline')}
          />

          <Separator orientation="vertical" h="4" mx="1" />

          <ToolBtn
            label="bullet list"
            icon={<List size={14} />}
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive('bulletList')}
          />
          <ToolBtn
            label="ordered list"
            icon={<ListOrdered size={14} />}
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive('orderedList')}
          />

          <Separator orientation="vertical" h="4" mx="1" />

          <ToolBtn
            label="undo"
            icon={<Undo size={14} />}
            onClick={() => editor.chain().focus().undo().run()}
          />
          <ToolBtn
            label="redo"
            icon={<Redo size={14} />}
            onClick={() => editor.chain().focus().redo().run()}
          />
        </Flex>

        {/* ── Editor area ─────────────────────────────────── */}
        <Box>
          <EditorContent editor={editor} />
        </Box>
      </Box>
    </>
  )
}
