const lunarInfo = [
  0x04bd8, 0x04ae0, 0x0a570, 0x054d5, 0x0d260, 0x0d950, 0x16554, 0x056a0, 0x09ad0, 0x055d2,
  0x04ae0, 0x0a5b6, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b540, 0x0b6a0, 0x195a6, 0x095b0,
  0x049b0, 0x0a4b8, 0x0a4b0, 0x0b27a, 0x0aea0, 0x0d5c0, 0x0ab5b, 0x0ab50, 0x0536a, 0x03a4e,
  0x0a580, 0x0a6a3, 0x089a1, 0x0ada8, 0x084a0, 0x02ca7, 0x0b25d, 0x04bd0, 0x0d440, 0x0d5a6,
  0x0d250, 0x0d558, 0x0aa60, 0x0b6a4, 0x195b2, 0x049b0, 0x0a497, 0x0a4b0, 0x0b27b, 0x06a6a,
  0x0ad50, 0x055d2, 0x04bd0, 0x0a4b2, 0x0a572, 0x0d160, 0x0e968, 0x0d520, 0x0dab5, 0x0056d,
  0x04ae0, 0x0a9d4, 0x0a4d0, 0x0d4d4, 0x0d250, 0x0d558, 0x0b54b, 0x0b6a0, 0x195a6, 0x095b0,
  0x049b0, 0x0a6c1, 0x0a4d0, 0x0d464, 0x0d4c0, 0x0d558, 0x0aa60, 0x0b5a2, 0x0b6a4, 0x195b6,
];

const solarMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
const Gan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const Zhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const Animals = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const solarTerm = [
  '小寒', '大寒', '立春', '雨水', '惊蛰', '春分', '清明', '谷雨',
  '立夏', '小满', '芒种', '夏至', '小暑', '大暑', '立秋', '处暑',
  '白露', '秋分', '寒露', '霜降', '立冬', '小雪', '大雪', '冬至',
];

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  isLeap: boolean;
}

function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getLunarLeapMonth(year: number): number {
  return (lunarInfo[year - 1900] & 0xf00000) >> 20;
}

function getLunarMonthDays(year: number, month: number): number {
  if ((lunarInfo[year - 1900] & (0x10000 >> month)) === 0) {
    return 29;
  } else {
    return 30;
  }
}

export function gregorianToLunar(date: Date): LunarDate {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  if (year < 1900 || year > 2100) {
    throw new Error('Year must be between 1900 and 2100');
  }

  let lunarYear = 0;
  let lunarMonth = 0;
  let lunarDay = 0;

  let isLeap = false;

  const baseDate = new Date(1900, 0, 31);
  const currentDate = new Date(year, month - 1, day);
  let offset = Math.floor((currentDate.getTime() - baseDate.getTime()) / 86400000);

  for (let i = 1900; i < 2101 && offset > 0; i++) {
    let yearDays = 0;
    for (let j = 1; j <= 12; j++) {
      yearDays += getLunarMonthDays(i, j);
    }

    if (offset - yearDays < 1) {
      lunarYear = i;
      for (let j = 1; j <= 12; j++) {
        const monthDays = getLunarMonthDays(i, j);
        if (offset - monthDays < 1) {
          lunarMonth = j;
          lunarDay = offset + 1;
          break;
        }
        offset -= monthDays;
      }
      break;
    } else {
      offset -= yearDays;
    }
  }

  const leapMonth = getLunarLeapMonth(lunarYear);
  if (leapMonth === lunarMonth && isLeap === false) {
    isLeap = true;
  } else if (lunarMonth > leapMonth) {
    lunarMonth -= 1;
  }

  return { year: lunarYear, month: lunarMonth, day: lunarDay, isLeap };
}

export function lunarToGregorian(lunar: LunarDate): Date {
  const { year, month, day, isLeap } = lunar;

  if (year < 1900 || year > 2100) {
    throw new Error('Year must be between 1900 and 2100');
  }

  let days = 0;

  for (let i = 1900; i < year; i++) {
    for (let j = 1; j <= 12; j++) {
      days += getLunarMonthDays(i, j);
    }
  }

  const leapMonth = getLunarLeapMonth(year);
  for (let j = 1; j < month; j++) {
    if (j === leapMonth) {
      days += 30;
    } else {
      days += getLunarMonthDays(year, j);
    }
  }

  if (isLeap && leapMonth === month) {
    days += 30;
  }

  days += day;

  const baseDate = new Date(1900, 0, 31);
  const gregorianDate = new Date(baseDate.getTime() + days * 86400000);

  return gregorianDate;
}

export function formatLunarDate(lunar: LunarDate): string {
  const monthName = lunar.month === 1 ? '正' :
                    lunar.month <= 9 ? lunar.month.toString() :
                    lunar.month === 10 ? '十' :
                    lunar.month === 11 ? '十一' : '十二';

  const dayNames = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  const leapStr = lunar.isLeap ? '闰' : '';

  return `${lunar.year}年${leapStr}${monthName}月${dayNames[lunar.day]}`;
}

export function formatLunarDateShort(lunar: LunarDate): string {
  const monthName = lunar.month === 1 ? '正' :
                    lunar.month <= 9 ? lunar.month.toString() :
                    lunar.month === 10 ? '十' :
                    lunar.month === 11 ? '十一' : '十二';

  const dayNames = ['', '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
                    '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
                    '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

  const leapStr = lunar.isLeap ? '闰' : '';

  return `${leapStr}${monthName}月${dayNames[lunar.day]}`;
}
