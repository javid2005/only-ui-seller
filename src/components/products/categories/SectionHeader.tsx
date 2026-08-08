import { Box, Text } from '@chakra-ui/react'

/**
 * SectionHeader — هدر آبی گروه دسته‌ها.
 * Figma: bg blue.subtle، border blue.emphasized، rounded sm(4px)، عنوان lg semibold.
 */
export function SectionHeader({ title }: { title: string }) {
  return (
    <Box
      w="full"
      bg="blue.subtle"
      borderWidth="1px"
      borderColor="blue.emphasized"
      rounded="md"
      px="2"
      py="2"
    >
      <Text fontSize="lg" fontWeight="semibold" color="fg" textAlign="start" lineHeight="1.555">
        {title}
      </Text>
    </Box>
  )
}
