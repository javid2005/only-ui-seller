// ─── Mock Domain Service ──────────────────────────────────────────────────────
// تا وصل‌شدن به API واقعی: همهٔ توابع شبیه‌سازی‌شده‌اند (delay مصنوعی + localStorage).

const MOCK_DELAY = 600

function delay<T>(value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), MOCK_DELAY))
}

// ─── لینک اختصاصی ویترینا (ساب‌دامنه خودکار) ────────────────────────────────────

export interface VitrinaSubdomain {
  slug: string
  lastChangedAt: string
  nextChangeAt: string
}

const VITRINA_SUBDOMAIN_KEY = 'vitrina-subdomain'
const DEFAULT_VITRINA_SUBDOMAIN: VitrinaSubdomain = {
  slug: 'mazbox',
  lastChangedAt: '۱۴۰۴/۱۲/۱۰',
  nextChangeAt: '۱۴۰۴/۱۲/۱۷',
}

export function getVitrinaSubdomain(): VitrinaSubdomain {
  if (typeof window === 'undefined') return DEFAULT_VITRINA_SUBDOMAIN
  const raw = window.localStorage.getItem(VITRINA_SUBDOMAIN_KEY)
  if (!raw) return DEFAULT_VITRINA_SUBDOMAIN
  try {
    return JSON.parse(raw) as VitrinaSubdomain
  } catch {
    return DEFAULT_VITRINA_SUBDOMAIN
  }
}

const persianDate = new Intl.DateTimeFormat('fa-IR-u-ca-persian')

export function updateVitrinaSubdomain(slug: string): Promise<{ success: true }> {
  if (typeof window !== 'undefined') {
    const now = new Date()
    const nextChange = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
    const next: VitrinaSubdomain = {
      slug,
      lastChangedAt: persianDate.format(now),
      nextChangeAt: persianDate.format(nextChange),
    }
    window.localStorage.setItem(VITRINA_SUBDOMAIN_KEY, JSON.stringify(next))
  }
  return delay({ success: true })
}

// ─── دامنه اختصاصی ────────────────────────────────────────────────────────────

export type DomainStatus = 'pending' | 'active' | 'inactive'

export interface Domain {
  id: string
  name: string
  status: DomainStatus
  connectedAt: string
}

const DOMAINS_KEY = 'vitrina-domains'

const DEFAULT_DOMAINS: Domain[] = [
  { id: 'domain_demo_active', name: 'mazbox-shop.com', status: 'active', connectedAt: '۱۴۰۴/۱۱/۰۵' },
  { id: 'domain_demo_inactive', name: 'old-mazbox.com', status: 'inactive', connectedAt: '۱۴۰۴/۰۹/۱۸' },
]

function getDomainsRaw(): Domain[] {
  if (typeof window === 'undefined') return DEFAULT_DOMAINS
  const raw = window.localStorage.getItem(DOMAINS_KEY)
  if (!raw) return DEFAULT_DOMAINS
  try {
    return JSON.parse(raw) as Domain[]
  } catch {
    return DEFAULT_DOMAINS
  }
}

function saveDomains(domains: Domain[]): void {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(DOMAINS_KEY, JSON.stringify(domains))
}

export function getDomains(): Domain[] {
  return getDomainsRaw()
}

// فقط دامنهٔ ریشه — بدون www، ساب‌دامنه، پروتکل یا مسیر
const ROOT_DOMAIN_PATTERN = /^(?!www\.)[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.[a-z]{2,}$/i

export function validateDomainFormat(input: string): boolean {
  return ROOT_DOMAIN_PATTERN.test(input.trim())
}

const NS_RECORDS = { ns1: 'ns1.vitrina.ir', ns2: 'ns2.vitrina.ir' }

export function checkDomain(name: string): Promise<{ ns: { ns1: string; ns2: string } }> {
  void name
  return delay({ ns: NS_RECORDS })
}

export function addDomain(name: string): Promise<Domain> {
  const domain: Domain = {
    id: `domain_${Date.now()}`,
    name,
    status: 'pending',
    connectedAt: new Intl.DateTimeFormat('fa-IR-u-ca-persian').format(new Date()),
  }
  saveDomains([...getDomainsRaw(), domain])
  return delay(domain)
}

export function cancelDomainRequest(id: string): Promise<void> {
  saveDomains(getDomainsRaw().filter((d) => d.id !== id))
  return delay(undefined)
}

export function deleteDomain(id: string): Promise<void> {
  saveDomains(getDomainsRaw().filter((d) => d.id !== id))
  return delay(undefined)
}

export function activateDomain(id: string): Promise<void> {
  saveDomains(
    getDomainsRaw().map((d) => ({
      ...d,
      status: d.id === id ? 'active' : d.status === 'active' ? 'inactive' : d.status,
    })),
  )
  return delay(undefined)
}

export function deactivateDomain(id: string): Promise<void> {
  saveDomains(
    getDomainsRaw().map((d) => (d.id === id ? { ...d, status: 'inactive' as const } : d)),
  )
  return delay(undefined)
}
