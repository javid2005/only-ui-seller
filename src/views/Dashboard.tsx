import { Box } from '@chakra-ui/react'
import { Header } from '@/components/layout/Header'

export function Dashboard() {
  return (
    <Box display="flex" flexDirection="column" gap="4" h="full">
      <Header
        title="داشبورد"
        breadcrumbs={[
          { label: 'خانه', href: '/' },
          { label: 'داشبورد' },
        ]}
      />
      <Box
        flex="1"
        bg="bg"
        border="1px solid"
        borderColor="border"
        borderRadius="2xl"
      />
    </Box>
  )
}
