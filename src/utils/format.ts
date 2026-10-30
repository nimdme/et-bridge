/**
 * Safely parses percentages from number or string format (e.g. 77, "77%", "77.5")
 */
export function parsePercent(value: unknown, fallback = 0): number {
  if (typeof value === 'number') {
    return isNaN(value) ? fallback : value
  }
  if (typeof value === 'string') {
    const cleaned = value.replace('%', '').trim()
    const parsed = parseFloat(cleaned)
    return isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

/**
 * Safely parses any number or string to number
 */
export function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number') {
    return isNaN(value) ? fallback : value
  }
  if (typeof value === 'string') {
    const parsed = parseFloat(value)
    return isNaN(parsed) ? fallback : parsed
  }
  return fallback
}

/**
 * Formats a percentage value safely to 1 decimal place
 */
export function formatPercent(value: unknown, fallback = '0.0'): string {
  const num = parsePercent(value, NaN)
  if (isNaN(num)) return fallback
  return num.toFixed(1)
}

const MONTHS_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const DAYS_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

/**
 * Safely parses any date string (ISO, ETLab format, DD/MM/YYYY, etc.) into a local Date object.
 * Avoids UTC timezone shifts where 2026-10-31 would show as Oct 30 in negative offsets or early morning.
 */
export function parseDateSafe(input: unknown): Date | null {
  if (!input) return null
  if (input instanceof Date) return isNaN(input.getTime()) ? null : input
  const str = String(input).trim()
  if (!str) return null

  // 1. Match YYYY-MM-DD or YYYY-MM-DD HH:mm:ss
  const matchYMD = str.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/)
  if (matchYMD) {
    return new Date(Number(matchYMD[1]), Number(matchYMD[2]) - 1, Number(matchYMD[3]))
  }

  // 2. Match DD/MM/YYYY or DD-MM-YYYY
  const matchDMY = str.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/)
  if (matchDMY) {
    return new Date(Number(matchDMY[3]), Number(matchDMY[2]) - 1, Number(matchDMY[1]))
  }

  // 3. Fallback standard parsing
  const parsed = new Date(str.replace(' ', 'T'))
  return isNaN(parsed.getTime()) ? null : parsed
}

/**
 * Formats a date using Indian standard conventions (DD/MM/YYYY, DD MMM YYYY, etc.).
 *
 * @param input Date object, ISO string, or timestamp
 * @param style
 *   - 'numeric' (default): "31/10/2026"
 *   - 'short': "31 Oct 2026"
 *   - 'day-short': "Sat, 31 Oct 2026"
 *   - 'long': "31 October 2026"
 *   - 'day-long': "Saturday, 31 October 2026"
 */
export function formatIndianDate(
  input: unknown,
  style: 'numeric' | 'short' | 'day-short' | 'long' | 'day-long' = 'numeric',
  fallback = ''
): string {
  const dt = parseDateSafe(input)
  if (!dt) {
    if (typeof input === 'string') return input
    return fallback
  }

  const d = dt.getDate()
  const dd = String(d).padStart(2, '0')
  const mm = String(dt.getMonth() + 1).padStart(2, '0')
  const yyyy = dt.getFullYear()
  const mShort = MONTHS_SHORT[dt.getMonth()]
  const mLong = MONTHS_LONG[dt.getMonth()]
  const dayShort = DAYS_SHORT[dt.getDay()]
  const dayLong = DAYS_LONG[dt.getDay()]

  switch (style) {
    case 'numeric':
      return `${dd}/${mm}/${yyyy}`
    case 'short':
      return `${d} ${mShort} ${yyyy}`
    case 'day-short':
      return `${dayShort}, ${d} ${mShort} ${yyyy}`
    case 'long':
      return `${d} ${mLong} ${yyyy}`
    case 'day-long':
      return `${dayLong}, ${d} ${mLong} ${yyyy}`
    default:
      return `${dd}/${mm}/${yyyy}`
  }
}

/**
 * Computes remaining days from last date string
 */
export function getDaysRemaining(lastDateStr: string): { 
  text: string
  isUrgent: boolean 
  isOverdue: boolean
} {
  if (!lastDateStr) {
    return { text: '', isUrgent: false, isOverdue: false }
  }

  try {
    const dt = parseDateSafe(lastDateStr)
    if (!dt) {
      return { text: formatIndianDate(lastDateStr, 'numeric'), isUrgent: false, isOverdue: false }
    }

    const dueTime = dt.getTime()
    const now = new Date()
    const nowTime = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
    
    const diffMs = dueTime - nowTime
    const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 0) {
      return { text: 'Overdue', isUrgent: true, isOverdue: true }
    }
    if (diffDays === 0) {
      return { text: 'Due today', isUrgent: true, isOverdue: false }
    }
    if (diffDays === 1) {
      return { text: '1 day left', isUrgent: true, isOverdue: false }
    }
    return { 
      text: `${diffDays} days left`, 
      isUrgent: diffDays <= 3, 
      isOverdue: false 
    }
  } catch {
    return { text: '', isUrgent: false, isOverdue: false }
  }
}

/**
 * Safely formats semester values from ETLab into clean, consistent text.
 * Prevents redundant outputs like "Semester Ist Semester" or "Sem 1st Semester".
 * Handles formats: "Ist Semester", "1st Semester", "S1", "1", 1, "First Semester", etc.
 * 
 * @example
 * formatSemester("Ist Semester", "Semester") => "Semester 1"
 * formatSemester("Ist Semester", "Sem") => "Sem 1"
 * formatSemester("1", "Semester") => "Semester 1"
 */
export function formatSemester(value: unknown, prefix = 'Semester'): string {
  if (!value && value !== 0) return prefix ? `${prefix} 1` : '1'
  const str = String(value).trim()

  // 1. Check Roman numerals: "Ist", "IInd", "IIIrd", "IVth", "Vth", "VIth", "VIIth", "VIIIth"
  const romanMatch = str.match(/^(viii|vii|vi|v|iv|iii|ii|i)(?:st|nd|rd|th)?(?:\s+semester)?/i)
  if (romanMatch) {
    const roman = romanMatch[1].toLowerCase()
    const romanMap: Record<string, number> = { i: 1, ii: 2, iii: 3, iv: 4, v: 5, vi: 6, vii: 7, viii: 8 }
    const num = romanMap[roman]
    if (num) return prefix ? `${prefix} ${num}` : String(num)
  }

  // 2. Check word numerals: "First", "Second", "Third", etc.
  const wordMatch = str.match(/^(first|second|third|fourth|fifth|sixth|seventh|eighth)/i)
  if (wordMatch) {
    const wordMap: Record<string, number> = { first: 1, second: 2, third: 3, fourth: 4, fifth: 5, sixth: 6, seventh: 7, eighth: 8 }
    const num = wordMap[wordMatch[1].toLowerCase()]
    if (num) return prefix ? `${prefix} ${num}` : String(num)
  }

  // 3. Check digit extraction: "1st Semester", "S1", "Semester 1", "1"
  const digitMatch = str.match(/(\d+)/)
  if (digitMatch) {
    return prefix ? `${prefix} ${digitMatch[1]}` : digitMatch[1]
  }

  // 4. Fallback: clean any existing "semester" words to avoid repetition
  const cleaned = str.replace(/semester/gi, '').trim()
  return prefix ? `${prefix} ${cleaned}` : cleaned
}

