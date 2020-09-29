const zhHans = {
  title: '公告'
}

const zhHant = {
  title: '公告'
}

const en = {
  title: 'Bulletin'
}

const ja = {
  bulletin: '公告'
}

const ko = {
  title: '공고'
}

export default function bulletinLocales (ctx) {
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
