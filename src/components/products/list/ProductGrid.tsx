import { SimpleGrid } from '@chakra-ui/react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { ProductCard } from './ProductCard'
import type { Product } from './data'

interface ProductGridProps {
  products: Product[]
  selection: string[]
  onToggleOne: (id: string) => void
}

/**
 * view کارت — grid ریسپانسیو.
 * isCompact=true → همیشه ۱ ستون (viewport wide ولی container 512px).
 * isCompact=false → base:1 / md:2 / lg:3 / xl:4
 */
export function ProductGrid({ products, selection, onToggleOne }: ProductGridProps) {
  const isCompact = useCompactMode()
  return (
    <SimpleGrid columns={isCompact ? 1 : { base: 1, md: 2, lg: 3, xl: 4 }} gap="4">
      {products.map((p) => (
        <ProductCard
          key={p.id}
          product={p}
          isSelected={selection.includes(p.id)}
          onToggle={onToggleOne}
        />
      ))}
    </SimpleGrid>
  )
}
