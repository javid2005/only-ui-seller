'use client'

import { useEffect, useState } from 'react'
import { Badge, Box, Button, Flex, Input, Text } from '@chakra-ui/react'
import { CircleQuestionMark, Globe, Plus } from 'lucide-react'
import { useCompactMode } from '@/contexts/CompactModeContext'
import { toPersianDigits } from '@/utils/numbers'
import { Header } from '@/components/layout/Header'
import { TitleBar } from '@/components/ui/TitleBar'
import { VitrinaLinkCard } from '@/components/settings/domain/VitrinaLinkCard'
import { DomainCard } from '@/components/settings/domain/DomainCard'
import { AddDomainDialog } from '@/components/settings/domain/AddDomainDialog'
import { DomainCheckResultDialog } from '@/components/settings/domain/DomainCheckResultDialog'
import { EditVitrinaAddressDialog } from '@/components/settings/domain/EditVitrinaAddressDialog'
import {
  activateDomain,
  addDomain,
  cancelDomainRequest,
  checkDomain,
  deactivateDomain,
  deleteDomain,
  getDomains,
  getVitrinaSubdomain,
  updateVitrinaSubdomain,
  validateDomainFormat,
  type Domain as DomainRecord,
} from '@/services/domain'

const START_STEPS = [
  { title: 'دامنه را وارد و بررسی کنید.', description: 'فقط دامنهٔ ریشه — بدون www یا ساب‌دامنه.' },
  {
    title: 'تنظیم DNS دامنه شخصی',
    description: 'این دو نیم‌سرور را در پنل ثبت کننده دامنه‌تان (بخش DNS / Nameservers) ثبت کنید:',
    nsBadges: ['ns2.vitrina.ir', 'ns1.vitrina.ir'],
  },
  { title: 'تأیید کنید و منتظر بمانید.', description: 'اتصال طی حداکثر ۴۸ ساعت بررسی و فعال می‌شود؛ نتیجه با نوتیفیکیشن و پیامک اطلاع داده می‌شود.' },
]

type DialogState =
  | { type: 'edit-address' }
  | { type: 'add-domain' }
  | { type: 'check-result'; domainName: string; ns: { ns1: string; ns2: string } }
  | null

export function Domain() {
  const isCompact = useCompactMode()
  const [domains, setDomains] = useState<DomainRecord[]>([])
  const [subdomain, setSubdomain] = useState(getVitrinaSubdomain())
  const [dialog, setDialog] = useState<DialogState>(null)

  const [inlineValue, setInlineValue] = useState('')
  const [inlineError, setInlineError] = useState('')
  const [inlineLoading, setInlineLoading] = useState(false)

  useEffect(() => {
    setDomains(getDomains())
  }, [])

  const refreshDomains = () => setDomains(getDomains())

  const runCheck = async (domainName: string) => {
    const { ns } = await checkDomain(domainName)
    setDialog({ type: 'check-result', domainName, ns })
  }

  const handleInlineCheck = async () => {
    if (!validateDomainFormat(inlineValue)) {
      setInlineError('فرمت دامنه نامعتبر است — فقط دامنهٔ ریشه (مثل example.com) مجاز است.')
      return
    }
    setInlineError('')
    setInlineLoading(true)
    await runCheck(inlineValue.trim().toLowerCase())
    setInlineLoading(false)
  }

  const handleConfirmDomain = async () => {
    if (dialog?.type !== 'check-result') return
    await addDomain(dialog.domainName)
    setInlineValue('')
    setDialog(null)
    refreshDomains()
  }

  const handleSaveSubdomain = async (newSlug: string) => {
    await updateVitrinaSubdomain(newSlug)
    setSubdomain(getVitrinaSubdomain())
  }

  return (
    <Flex direction="column" gap="4" alignItems="flex-end" w="full" maxW="1082px" mx="auto">
      <Header
        title="دامنه اختصاصی"
        breadcrumbs={[
          { label: 'داشبورد', href: '/' },
          { label: 'تنظیمات فروشگاه', href: '/settings' },
          { label: 'دامنه اختصاصی' },
        ]}
      />

      {/* No outer panel here — unlike Settings.tsx, Figma's Domain page Container has no bg/border
          of its own (confirmed via get_metadata on node 4784:77342). Each section is its own
          independently-bordered Card (VitrinaLinkCard, the check-domain Card, each DomainCard). */}
      <Flex direction="column" gap={isCompact ? '8' : { base: '8', sm: '10' }} w="full" alignItems="flex-end">
          <VitrinaLinkCard
            slug={subdomain.slug}
            editLabel={domains.length > 0 ? 'ویرایش آدرس' : 'ویرایش'}
            onEdit={() => setDialog({ type: 'edit-address' })}
          />

          {domains.length === 0 ? (
            <Flex direction="column" gap="4" alignItems="flex-end" w="full">
              <TitleBar title="اتصال دامنه اختصاصی" subtitle="یک قابلیت تکمیلی و اختیاری — مستقل از آدرس ویترینای بالا" size="xl" />

              <Box bg="bg.panel" borderWidth="1px" borderColor="border" rounded="2xl" p="6" w="full">
                <Flex direction="column" gap="10" alignItems="flex-end" w="full">
                  <Flex direction="column" gap="4" alignItems="flex-end" w="full">
                    <TitleBar
                      title="قبل از شروع بدانید چه می‌کنید"
                      icon={<CircleQuestionMark size={16} color="var(--chakra-colors-brand-solid)" />}
                      size="md"
                    />
                    <Flex direction={isCompact ? 'column' : { base: 'column', lg: 'row' }} gap="4" alignItems="stretch" w="full">
                      {START_STEPS.map((s, i) => (
                        <Flex key={s.title} flex="1" gap="4" align="flex-start" justify="flex-end" bg="bg.subtle" borderWidth="1px" borderColor="border" rounded="lg" p="4">
                          {/* Indicator circle — FIRST in DOM = rightmost in RTL (per x-coordinate check: indicator sits at the card's right edge in Figma) */}
                          <Flex
                            flexShrink={0}
                            align="center"
                            justify="center"
                            boxSize="24px"
                            rounded="full"
                            bg="brand.muted"
                            borderWidth="2px"
                            borderColor="brand.solid"
                          >
                            <Text fontSize="xs" fontWeight="medium" color="brand.fg">{toPersianDigits(i + 1)}</Text>
                          </Flex>
                          {/* Text block — SECOND = leftmost */}
                          <Flex flex="1" direction="column" gap="1" alignItems="flex-start">
                            <Text fontSize="sm" fontWeight="semibold" color="fg" textAlign="right" w="full">{s.title}</Text>
                            <Text fontSize="sm" color="fg.muted" textAlign="right" w="full">{s.description}</Text>
                            {s.nsBadges && (
                              <Flex gap="4" mt="2">
                                {s.nsBadges.map((ns) => (
                                  <Badge key={ns} colorPalette="purple" variant="subtle" size="md">{ns}</Badge>
                                ))}
                              </Flex>
                            )}
                          </Flex>
                        </Flex>
                      ))}
                    </Flex>
                  </Flex>

                  <Flex direction="column" gap="4" alignItems="flex-end" w="full">
                    <TitleBar
                      title="بررسی و اتصال دامنه شخصی"
                      subtitle="دامنهٔ اختصاصی خود (مثل yourshop.com) را به فروشگاه متصل کنید تا مشتریان با آدرس برند خودتان وارد شوند."
                      icon={<Globe size={16} color="var(--chakra-colors-brand-solid)" />}
                      size="md"
                    />
                    {/* Input FIRST = rightmost, Button SECOND = leftmost — evidence: Figma metadata
                        shows Button x=0 (left) and Input x=133..1034 (right) in both the desktop
                        and 512px compact frames; matches the same left-actions/right-content pattern
                        already confirmed on VitrinaLinkCard's URL container.
                        Figma itself uses flexWrap (not a column/row breakpoint switch) here — same
                        technique reused for both real narrow mobile and the 512px compact simulator. */}
                    <Flex flexWrap="wrap" gap="4" align="flex-start" justify="center" w="full">
                      <Flex flex="1" direction="column" gap="1.5" alignItems="flex-end" minW="200px" w="full">
                        <Input
                          dir="ltr"
                          placeholder="example.com"
                          value={inlineValue}
                          onChange={(e) => setInlineValue(e.target.value)}
                          size="lg"
                        />
                        <Text fontSize="xs" color={inlineError ? 'red.fg' : 'fg.muted'} textAlign="right" w="full">
                          {inlineError || 'فقط دامنه ریشه قابل اتصال است (بدون www یا ساب‌دامنه)'}
                        </Text>
                      </Flex>
                      <Button
                        w={{ base: 'full', sm: 'auto' }}
                        colorPalette="brand"
                        size="lg"
                        onClick={handleInlineCheck}
                        loading={inlineLoading}
                      >
                        بررسی دامنه
                      </Button>
                    </Flex>
                  </Flex>
                </Flex>
              </Box>
            </Flex>
          ) : (
            <Flex direction="column" gap="4" alignItems="flex-end" w="full">
              <TitleBar
                title="دامنه‌های من"
                subtitle="می‌توانید چند دامنه ثبت کنید و یکی را فعال کنید. در هر زمان فقط یک دامنه فعال است."
                cta={
                  <Button colorPalette="brand" size="sm" onClick={() => setDialog({ type: 'add-domain' })}>
                    <Plus size={16} />
                    افزودن دامنه
                  </Button>
                }
                size="xl"
              />
              <Flex direction="column" gap="4" w="full">
                {domains.map((d) => (
                  <DomainCard
                    key={d.id}
                    domain={d}
                    onCancelRequest={async (id) => { await cancelDomainRequest(id); refreshDomains() }}
                    onActivate={async (id) => { await activateDomain(id); refreshDomains() }}
                    onDeactivate={async (id) => { await deactivateDomain(id); refreshDomains() }}
                    onDelete={async (id) => { await deleteDomain(id); refreshDomains() }}
                  />
                ))}
              </Flex>
            </Flex>
          )}
      </Flex>

      <EditVitrinaAddressDialog
        open={dialog?.type === 'edit-address'}
        currentSlug={subdomain.slug}
        lastChangedAt={subdomain.lastChangedAt}
        nextChangeAt={subdomain.nextChangeAt}
        onClose={() => setDialog(null)}
        onSave={handleSaveSubdomain}
      />

      <AddDomainDialog
        open={dialog?.type === 'add-domain'}
        onClose={() => setDialog(null)}
        onCheck={runCheck}
      />

      <DomainCheckResultDialog
        open={dialog?.type === 'check-result'}
        ns={dialog?.type === 'check-result' ? dialog.ns : null}
        onConfirm={handleConfirmDomain}
        onCancel={() => setDialog(null)}
      />
    </Flex>
  )
}
