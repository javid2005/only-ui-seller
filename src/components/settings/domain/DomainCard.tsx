import { useEffect, useState } from 'react'
import { Badge, Box, Button, Flex, IconButton, Steps, Text } from '@chakra-ui/react'
import { Check, Copy } from 'lucide-react'
import type { ReactNode } from 'react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { TitleBar } from '@/components/ui/TitleBar'
import { toaster } from '@/components/ui/toaster'
import { toPersianDigits } from '@/utils/numbers'
import type { Domain } from '@/services/domain'
import { ConfirmDomainDialog, type ConfirmDomainVariant } from './ConfirmDomainDialog'

interface DomainCardProps {
  domain: Domain
  onCancelRequest: (id: string) => Promise<void>
  onActivate: (id: string) => Promise<void>
  onDeactivate: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

const STATUS_BADGE: Record<Domain['status'], { label: string; colorPalette: string }> = {
  pending: { label: 'درحال بررسی', colorPalette: 'orange' },
  active: { label: 'فعال', colorPalette: 'green' },
  inactive: { label: 'غیر فعال', colorPalette: 'gray' },
}

const NS_STEPS = [
  { title: 'ثبت نیم سرورها', description: 'نیم سرورهای ns1.vitrina.ir و ns2.vitrina.ir در رجیسترر روی دامنه ثبت شدند.' },
  { title: 'اتصال لینک اختصاصی به دامنه', description: 'اعمال تغییرات و اتصال ممکن است تا ۴۸ ساعت طول بکشد.' },
]

function NsField({ label, value }: { label: string; value: string }) {
  return (
    <Flex
      flex="1"
      align="center"
      justify="space-between"
      gap="2"
      bg="bg.muted"
      borderWidth="1px"
      borderColor="border"
      rounded="lg"
      px="4"
      py="1"
    >
      <IconButton
        size="xs"
        variant="ghost"
        colorPalette="brand"
        aria-label="کپی"
        onClick={() => {
          navigator.clipboard?.writeText(value)
          toaster.create({ id: 'copy-link-toast', title: 'کپی شد', type: 'success', duration: 2000 })
        }}
      >
        <Copy size={16} />
      </IconButton>
      <Text flex="1" fontSize="md" color="fg" textAlign="center" dir="ltr" minW="0">{value}</Text>
      <Text flexShrink={0} fontSize="md" fontWeight="medium" color="fg.subtle">{label}</Text>
    </Flex>
  )
}

export function DomainCard({ domain, onCancelRequest, onActivate, onDeactivate, onDelete }: DomainCardProps) {
  const isCompact = useCompactMode()
  const badge = STATUS_BADGE[domain.status]
  const [confirmVariant, setConfirmVariant] = useState<ConfirmDomainVariant | null>(null)

  // real-viewport check (نه isCompact) — چون این جابه‌جاییِ CTA یه تغییر رفتاری/ساختاریه
  // (نه فقط style)، باید روی موبایل واقعی هم کار کنه، نه فقط شبیه‌ساز 512px دسکتاپ.
  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 480)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleConfirm = async () => {
    if (confirmVariant === 'cancel-request') await onCancelRequest(domain.id)
    else if (confirmVariant === 'delete') await onDelete(domain.id)
    else if (confirmVariant === 'activate') await onActivate(domain.id)
    setConfirmVariant(null)
  }

  // fullWidth=true → نسخهٔ ردیف پایین کارت در media<sm (هر دکمه flex=1، تمام عرض کارت)
  // fullWidth=false → نسخهٔ اینلاین کنار TitleBar در sm+ (عرض طبیعی دکمه‌ها)
  const renderActions = (fullWidth: boolean): ReactNode => {
    if (domain.status === 'pending') {
      return (
        <Button variant="outline" colorPalette="red" size="sm" w={fullWidth ? 'full' : undefined} onClick={() => setConfirmVariant('cancel-request')}>
          لغو درخواست
        </Button>
      )
    }
    if (domain.status === 'active') {
      return (
        <Flex gap="2" w={fullWidth ? 'full' : undefined}>
          <Button variant="ghost" colorPalette="red" size="sm" flex={fullWidth ? '1' : undefined} onClick={() => setConfirmVariant('delete')}>
            حذف
          </Button>
          <Button variant="outline" colorPalette="brand" size="sm" flex={fullWidth ? '1' : undefined} onClick={() => onDeactivate(domain.id)}>
            غیرفعال کن
          </Button>
        </Flex>
      )
    }
    return (
      <Flex gap="2" w={fullWidth ? 'full' : undefined}>
        <Button variant="ghost" colorPalette="red" size="sm" flex={fullWidth ? '1' : undefined} onClick={() => setConfirmVariant('delete')}>
          حذف
        </Button>
        <Button colorPalette="brand" size="sm" flex={fullWidth ? '1' : undefined} onClick={() => setConfirmVariant('activate')}>
          فعال کن
        </Button>
      </Flex>
    )
  }

  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
      <Flex direction="column" gap="4" alignItems="center" w="full">
        <TitleBar
          title={domain.name}
          subtitle={`متصل شده: ${toPersianDigits(domain.connectedAt)}`}
          badge={<Badge colorPalette={badge.colorPalette} variant="subtle" size="sm">{badge.label}</Badge>}
          cta={isMobile ? undefined : renderActions(false)}
          size="md"
        />

        {domain.status === 'pending' ? (
          <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4" w="full">
            {/* orientation switches to vertical in compact/narrow — confirmed via Figma's 512px
                mobile frame (steps stack top-to-bottom with a rotated separator). Same logical
                child order (Indicator/Title) works for both — Steps handles RTL internally
                per orientation, per the project's Chakra-namespace-component exception. */}
            <Steps.Root
              step={1}
              count={2}
              colorPalette="brand"
              size="sm"
              w="full"
              h="auto"
              orientation={isCompact ? 'vertical' : { base: 'vertical', md: 'horizontal' }}
            >
              <Steps.List>
                {NS_STEPS.map((s, i) => (
                  <Steps.Item key={i} index={i} flex="1">
                    <Steps.Indicator>
                      <Steps.Status
                        complete={<Check size={16} />}
                        current={toPersianDigits(i + 1)}
                        incomplete={toPersianDigits(i + 1)}
                      />
                    </Steps.Indicator>
                    <Box>
                      <Steps.Title fontSize="sm">{s.title}</Steps.Title>
                      <Steps.Description fontSize="xs">{s.description}</Steps.Description>
                    </Box>
                    <Steps.Separator />
                  </Steps.Item>
                ))}
              </Steps.List>
            </Steps.Root>
          </Box>
        ) : (
          <Box bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4" w="full">
            <Flex direction="column" gap="4" alignItems="flex-start" w="full">
              <Text fontSize="sm" color="fg.muted">نیم سرورهای تنظیم شده روی دامنه در رجیسترر</Text>
              {/* NS1 first in DOM = rightmost in row layout, top in stacked layout —
                  matches the same reversal applied to DomainCheckResultDialog.tsx (evidence:
                  reference screenshot shows NS2 on the left / NS1 on the right in row layout). */}
              <Flex
                gap={isCompact ? '2' : { base: '2', sm: '4' }}
                align={isCompact ? 'stretch' : { base: 'stretch', sm: 'start' }}
                direction={isCompact ? 'column' : { base: 'column', sm: 'row' }}
                w="full"
              >
                <Box flex="1">
                  <NsField label="NS1" value="ns1.vitrina.ir" />
                </Box>
                <Box flex="1">
                  <NsField label="NS2" value="ns2.vitrina.ir" />
                </Box>
              </Flex>
            </Flex>
          </Box>
        )}

        {/* media<sm: CTA به‌جای کنار TitleBar (که باعث wrap شدن نام دامنه می‌شد)
            به‌عنوان آخرین المان در ستون کارت می‌آید — نام دامنه کل عرض کارت را می‌گیرد. */}
        {isMobile && <Box w="full">{renderActions(true)}</Box>}
      </Flex>

      <ConfirmDomainDialog
        open={confirmVariant !== null}
        variant={confirmVariant}
        domainName={domain.name}
        onConfirm={handleConfirm}
        onCancel={() => setConfirmVariant(null)}
      />
    </Box>
  )
}
