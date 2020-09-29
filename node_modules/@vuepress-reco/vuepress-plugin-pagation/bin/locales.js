const zhHans = {
  prev: '上一页',
  next: '下一页',
  go: '前往',
  jump: '跳转至'
}

const zhHant = {
  prev: '上壹頁',
  next: '下壹頁',
  go: '前往',
  jump: '跳轉至'
}

const en = {
  prev: 'Prev',
  next: 'Next',
  go: 'Go',
  jump: 'Jump To'
}

const ja = {
  prev: '前のページ',
  next: '次のページ',
  go: 'へ',
  jump: 'ジャンプ'
}

const ko = {
  prev: '이전 페이지',
  next: '다음 페이지',
  go: '행',
  jump: '건너뛰기'
}

export default function pagationLocales (ctx) {
  const { $lang, $recoLocales: { pagation } = {} } = ctx
  if (pagation) {
    return pagation
  }
  if (/^zh\-(CN|SG)$/.test($lang)) {
    return zhHans
  }
  if (/^zh\-(HK|MO|TW)$/.test($lang)) {
    return zhHant
  }
  if (/^ja\-JP$/.test($lang)) {
    return ja
  }
  if (/^ko\-KR$/.test($lang)) {
    return ko
  }
  return en
}
