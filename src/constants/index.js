export const PLATFORMS = [
  { value: 'fc', label: '红白机 FC' },
  { value: 'md', label: '世嘉 MD' },
  { value: 'gba', label: 'GBA' },
  { value: 'sfc', label: '超任 SFC' },
  { value: 'gb', label: 'Game Boy' },
  { value: 'other', label: '其他' },
]

export const CONDITIONS = [
  { value: 'mint', label: '近全新' },
  { value: 'good', label: '良好' },
  { value: 'fair', label: '一般' },
  { value: 'poor', label: '较差' },
]

export const STATUS = {
  OWNED: 'owned',
  LENT: 'lent',
  SOLD: 'sold',
}

export const STATUS_LABELS = {
  [STATUS.OWNED]: '在库',
  [STATUS.LENT]: '借出中',
  [STATUS.SOLD]: '已出掉',
}
