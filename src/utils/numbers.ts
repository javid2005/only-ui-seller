const FA = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹']
const EN = ['0','1','2','3','4','5','6','7','8','9']

export function toPersianDigits(n: number | string): string {
  return String(n).replace(/[0-9]/g, d => FA[+d])
}

export function toLatinDigits(s: string): string {
  return s.replace(/[۰-۹]/g, d => String(EN[FA.indexOf(d)]))
}
