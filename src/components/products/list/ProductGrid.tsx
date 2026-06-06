import { SimpleGrid } from '@chakra-ui/react'
import { ProductCard } from './ProductCard'
import type { Product } from './data'

interface ProductGridProps {
  products: Product[]
  selection: string[]
  onToggleOne: (id: string) => void
}

/** view کارت — grid ریسپانسیو (mobile ۱ ستون · tablet ۲ · desktop ۳). */
export function ProductGrid({ products, selection, onToggleOne }: ProductGridProps) {
  return (
    <SimpleGrid columns={{ base: 1, md: 2, lg: 3, xl: 4 }} gap="4">
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
