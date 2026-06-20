import { addCart } from '../db/carts'
import { addLoan } from '../db/loans'
import { STATUS } from '../constants'

const sampleCarts = [
  {
    name: '魂斗罗',
    platform: 'fc',
    condition: 'good',
    hasBox: true,
    hasManual: true,
    status: STATUS.OWNED,
    note: '经典中的经典，经常拿出来回味',
  },
  {
    name: '超级马里奥兄弟 3',
    platform: 'fc',
    condition: 'mint',
    hasBox: true,
    hasManual: true,
    status: STATUS.OWNED,
    note: '收藏级品相',
  },
  {
    name: '双截龙 2',
    platform: 'fc',
    condition: 'fair',
    hasBox: false,
    hasManual: false,
    status: STATUS.OWNED,
    note: '裸卡，标签有点翘',
  },
  {
    name: '魂斗罗 铁血兵团',
    platform: 'md',
    condition: 'good',
    hasBox: true,
    hasManual: false,
    status: STATUS.LENT,
    note: '',
  },
  {
    name: '索尼克 2',
    platform: 'md',
    condition: 'good',
    hasBox: true,
    hasManual: true,
    status: STATUS.OWNED,
    note: '',
  },
  {
    name: '光明与黑暗',
    platform: 'md',
    condition: 'mint',
    hasBox: true,
    hasManual: true,
    status: STATUS.OWNED,
    note: 'RPG 神作',
  },
  {
    name: '口袋妖怪 红宝石',
    platform: 'gba',
    condition: 'good',
    hasBox: false,
    hasManual: false,
    status: STATUS.LENT,
    note: '电池还没换过',
  },
  {
    name: '马里奥赛车 超级巡回赛',
    platform: 'gba',
    condition: 'mint',
    hasBox: true,
    hasManual: true,
    status: STATUS.OWNED,
    note: '',
  },
  {
    name: '塞尔达传说 缩小帽',
    platform: 'gba',
    condition: 'good',
    hasBox: true,
    hasManual: true,
    status: STATUS.OWNED,
    note: '',
  },
  {
    name: '星之卡比 梦之泉',
    platform: 'gba',
    condition: 'fair',
    hasBox: false,
    hasManual: false,
    status: STATUS.SOLD,
    note: '大学时出掉了，有点后悔',
  },
  {
    name: '超级马里奥世界',
    platform: 'sfc',
    condition: 'good',
    hasBox: true,
    hasManual: true,
    status: STATUS.OWNED,
    note: '超任首发游戏',
  },
  {
    name: '最终幻想 6',
    platform: 'sfc',
    condition: 'poor',
    hasBox: false,
    hasManual: false,
    status: STATUS.OWNED,
    note: '卡带外壳有点裂，但能玩',
  },
]

const sampleLoans = [
  {
    cartIndex: 3,
    borrower: '小明',
    lendDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    note: '他说想重温一下童年',
  },
  {
    cartIndex: 6,
    borrower: '小红',
    lendDate: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
    note: '借了快半年了，得催催',
  },
]

export async function loadSampleData() {
  const cartIds = []
  for (const cart of sampleCarts) {
    const id = await addCart(cart)
    cartIds.push(id)
  }

  for (const loan of sampleLoans) {
    const cartId = cartIds[loan.cartIndex]
    await addLoan({
      cartId,
      borrower: loan.borrower,
      lendDate: loan.lendDate,
      note: loan.note,
    })
  }

  return cartIds.length
}
