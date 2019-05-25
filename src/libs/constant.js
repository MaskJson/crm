export const talentType = [
  {value: 0, label: '普通人才'},
  {value: 1, label: '专属人才'}
];

export const talentSource = [
  {value: 0, label: '猎聘网'},
  {value: 1, label: '51job'},
  {value: 2, label: '51精英'},
  {value: 3, label: '智联招聘'},
  {value: 4, label: '智联卓聘'},
  {value: 5, label: '中华英才'},
  {value: 6, label: 'linkedin'},
  {value: 7, label: '脉脉'},
  {value: 8, label: '微博'},
  {value: 9, label: '论坛'},
  {value: 10, label: 'QQ群'},
  {value: 11, label: '转推荐'},
  {value: 12, label: '主动投递'},
  {value: 13, label: '内部推荐'},
  {value: 14, label: '其他'}
];

export const talentStatus = [
  {value: 1, label: '不在职看机会'},
  {value: 2, label: '在职不看机会'},
  {value: 3, label: '在职看机会'},
  {value: 4, label: '在职急换工作'},
  {value: 5, label: '半年后看机会'},
  {value: 6, label: '1年后看机会'},
  {value: 7, label: '2年后看机会'},
  {value: 8, label: '新入职，暂时不看机会'},
  // {value: 9, label: '推荐给客户总监'},
  {value: 10, label: '推荐给客户'}
];

export const matches = [
  {value: 1, label: '城市'},
  {value: 2, label: '行业'},
  {value: 3, label: '职能'},
  {value: 4, label: '学历'},
  {value: 5, label: '语言能力'},
];

export const projectStatus = [
  {value: 1, label: '启动阶段'},
  {value: 2, label: '攻坚阶段'},
  {value: 3, label: '收尾阶段'},
  {value: 4, label: '项目结束'},
  {value: 5, label: '项目暂停'},
  {value: 6, label: '项目结束'}
];

export const projectPass = [
  {value: 1, label: '1个月'},
  {value: 2, label: '2个月'},
  {value: 3, label: '3个月'},
  {value: 4, label: '6个月'},
  {value: 5, label: '转正时'},
  {value: 6, label: '低于1个月'}
];

// 项目人才跟踪状态
export const projectProgress = [
  {id: 99, name: '补充跟踪'},
  {id:100, name: '推荐给客户', status: '0'},
  {id:2, name: '通知人才面试', status: ['1','2']},
  {id:3, name: '确认面试', status: '1'},
  {id:4, name: '面试改期', status: '2'},
  {id:5, name: '放弃面试', status: '2'},
  {id:6, name: '人才确认面试', status: '2'},
  {id:7, name: '面试待定', status: '3'},
  {id:8, name: '复试', status: '3'},
  {id:9, name: 'offer谈判', status: '3'},
  {id:10, name: '签订offer确认入职', status: '3'},
  {id:11, name: '辞职中，确定入职时间', status: '4'},
  {id:12, name: '确认入职，选择保证期', status: '4'},
  {id:13, name: '进入保证期', status: '5'},
  {id:14, name: '通过保证期', status: '6'},
  {id:15, name: '淘汰', status: '7'},
  {id: 16, name: '面试反馈'}
];

// 项目人才进展状态
export const projectTalentStatus = [
  {value: '0', label: '加入项目'},
  {value: '1', label: '推荐给客户'},
  // {value: '2', label: '通知人才面试'},
  {value: '3', label: '面试阶段'},
  {value: '4', label: 'offer待定'},
  {value: '5', label: 'offer签订待入职'},
  {value: '6', label: '保证期间人才'},
  {value: '7', label: '通过保证期'},
  {value: '8', label: '已淘汰'}
];

export const countries = [
  {value: 0, label: '中国大陆'},
  {value: 1, label: '中国香港'},
  {value: 2, label: '中国台湾'},
  {value: 3, label: '中国澳门'},
  {value: 4, label: '新加坡'},
  {value: 5, label: '日本'},
  {value: 6, label: '美国'},
  {value: 7, label: '荷兰'},
  {value: 8, label: '德国'},
  {value: 9, label: '澳大利亚'},
  {value: 10, label: '加拿大'},
  {value: 11, label: '法国'},
  {value: 12, label: '英国'},
  {value: 13, label: '印度'},
  {value: 14, label: '印度尼西亚'},
  {value: 15, label: '马来西亚'},
  {value: 16, label: '亚太地区'},
  {value: 17, label: '澳洲'},
  {value: 18, label: '其他'}
];

export const language = [
  {value: 1, label: '英语熟练'},
  {value: 2, label: '英语良好'},
  {value: 3, label: '英语一般'},
  {value: 4, label: '日语熟练'},
  {value: 5, label: '日语良好'},
  {value: 6, label: '日语一般'},
  {value: 7, label: '日语二级'},
  {value: 8, label: '韩语熟练'},
  {value: 9, label: '韩语良好'},
  {value: 10, label: '韩语一般'},
  {value: 11, label: '法语熟练'},
  {value: 12, label: '法语良好'},
  {value: 13, label: '法语一般'},
  {value: 14, label: '德语熟练'},
  {value: 15, label: '德语良好'},
  {value: 16, label: '德语一般'},
  {value: 17, label: '粤语熟练'},
  {value: 18, label: '粤语一般'}
];
export const educationList = [
  {value: 1, label: '大专'},
  {value: 2, label: '本科'},
  {value: 3, label: '硕士'},
  {value: 4, label: '博士'},
  {value: 5, label: 'MBA'},
  {value: 6, label: '大专+MBA'},
  {value: 7, label: '本科+MBA'},
  {value: 8, label: '硕士+MBA'},
  {value: 9, label: '博士+MBA'},
  {value: 10, label: '博士后'}
];

export const background = [
  {value: 1, label: '无名企背景'},
  {value: 2, label: '行业前10强企业经理'},
  {value: 3, label: '行业前20强企业经理'},
  {value: 4, label: '行业前30强企业经理'},
  {value: 5, label: '行业前50强企业经理'},
  {value: 6, label: '行业前100强企业经理'},
  {value: 7, label: '行业前200强企业经理'},
  {value: 8, label: '行业前500强企业经理'},
  {value: 9, label: '其他'}
];

export const customerTypes = [
  {value: 0, label: '普通公司'},
  // {value: 1, label: '列名拓展'},
  {value: 2, label: '联系中'},
  {value: 3, label: '合作洽谈'},
  {value: 4, label: '先推人再签约'},
  {value: 5, label: '签约'},
  {value: 6, label: '客户'},
]

export const aptnessList = [
  {
    aptnessList: null,
    checked: null,
    id: 1001,
    name: "客服/售前/售后技术",
    parentId: "0"
  },
  {
    aptnessList: null,
    checked: null,
    id: 1012,
    name: "市场",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1041,
    name: "公关/媒介",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1050,
    name: "广告/会展",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1067,
    name: "财务/审计/税务",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1090,
    name: "人力资源",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1108,
    name: "行政/后勤/文秘",
    parentId: "0"
  },
  {
    aptnessList: null,
    checked: null,
    id: 1118,
    name: "项目管理/项目协调",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1142,
    name: "质量管理/安全防护",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1155,
    name: "高级管理",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1170,
    name: "软件/互联网开发/系统集成",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1193,
    name: "硬件开发",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1198,
    name: "互联网产品/运营管理",
    parentId: "0"
  },
  {
    aptnessList: null,
    checked: null,
    id: 1208,
    name: "IT质量管理/测试管理",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1217,
    name: "IT运维/技术支持",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1234,
    name: "IT管理/项目协调",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1242,
    name: "电信/通信技术开发及应用",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1255,
    name: "房地产开发/经纪/中介",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1268,
    name: "土木/建筑/装修/市政工程",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1294,
    name: "物业管理",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1302,
    name: "银行",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1324,
    name: "证券/期货/投资管理",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1343,
    name: "保险",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1358,
    name: "信托/担保/拍卖/典当",
    parentId: "0",
  },
  {
    aptnessList: null,
    checked: null,
    id: 1365,
    name: "采购/贸易",
    parentId: "0",
  }
];

export const industryList = JSON.parse('[{"id":1001,"name":"IT|通信|电子|互联网","parentId":"0","industryList":[{"id":1014,"name":"互联网/电子商务","parentId":"1001","industryList":null},{"id":1015,"name":"计算机软件","parentId":"1001","industryList":null},{"id":1016,"name":"IT服务(系统/数据/维护)","parentId":"1001","industryList":null},{"id":1017,"name":"电子技术/半导体/集成电路","parentId":"1001","industryList":null},{"id":1018,"name":"计算机硬件","parentId":"1001","industryList":null},{"id":1019,"name":"通信/电信/网络设备","parentId":"1001","industryList":null},{"id":1020,"name":"通信/电信运营、增值服务","parentId":"1001","industryList":null},{"id":1021,"name":"网络游戏","parentId":"1001","industryList":null}]},{"id":1002,"name":"金融业","parentId":"0","industryList":[{"id":1022,"name":"基金/证券/期货/投资","parentId":"1002","industryList":null},{"id":1023,"name":"保险","parentId":"1002","industryList":null},{"id":1024,"name":"银行","parentId":"1002","industryList":null},{"id":1025,"name":"信托/担保/拍卖/典当","parentId":"1002","industryList":null}]},{"id":1003,"name":"房地产|建筑业","parentId":"0","industryList":[{"id":1026,"name":"房地产/建筑/建材/工程","parentId":"1003","industryList":null},{"id":1027,"name":"家居/室内设计/装饰装潢","parentId":"1003","industryList":null},{"id":1028,"name":"物业管理/商业中心","parentId":"1003","industryList":null}]},{"id":1004,"name":"商业服务","parentId":"0","industryList":[{"id":1029,"name":"专业服务/咨询(财会/法律/人力资源等)","parentId":"1004","industryList":null},{"id":1030,"name":"广告/会展/公关","parentId":"1004","industryList":null},{"id":1031,"name":"中介服务","parentId":"1004","industryList":null},{"id":1032,"name":"检验/检测/认证","parentId":"1004","industryList":null},{"id":1033,"name":"外包服务","parentId":"1004","industryList":null}]},{"id":1005,"name":"贸易|批发|零售|租赁业","parentId":"0","industryList":[{"id":1034,"name":"快速消费品（食品/饮料/烟酒/日化）","parentId":"1005","industryList":null},{"id":1035,"name":"耐用消费品（服饰/纺织/皮革/家具/家电）","parentId":"1005","industryList":null},{"id":1036,"name":"贸易/进出口","parentId":"1005","industryList":null},{"id":1037,"name":"零售/批发","parentId":"1005","industryList":null},{"id":1038,"name":"租赁服务","parentId":"1005","industryList":null}]},{"id":1006,"name":"文体教育|工艺美术","parentId":"0","industryList":[{"id":1039,"name":"教育/培训/院校","parentId":"1006","industryList":null},{"id":1040,"name":"礼品/玩具/工艺美术/收藏品/奢侈品","parentId":"1006","industryList":null}]},{"id":1007,"name":"生产|加工|制造","parentId":"0","industryList":[{"id":1041,"name":"汽车/摩托车","parentId":"1007","industryList":null},{"id":1042,"name":"大型设备/机电设备/重工业","parentId":"1007","industryList":null},{"id":1043,"name":"加工制造（原料加工/模具）","parentId":"1007","industryList":null},{"id":1044,"name":"仪器仪表及工业自动化","parentId":"1007","industryList":null},{"id":1045,"name":"印刷/包装/造纸","parentId":"1007","industryList":null},{"id":1046,"name":"办公用品及设备","parentId":"1007","industryList":null},{"id":1047,"name":"医药/生物工程","parentId":"1007","industryList":null},{"id":1048,"name":"医疗设备/器械","parentId":"1007","industryList":null},{"id":1049,"name":"航空/航天研究与制造","parentId":"1007","industryList":null}]},{"id":1008,"name":"交通|运输|物流|仓储","parentId":"0","industryList":[{"id":1050,"name":"交通/运输","parentId":"1008","industryList":null},{"id":1051,"name":"物流/仓储","parentId":"1008","industryList":null}]},{"id":1009,"name":"服务业","parentId":"0","industryList":[{"id":1052,"name":"医疗/护理/美容/保健/卫生服务","parentId":"1009","industryList":null},{"id":1053,"name":"酒店/餐饮","parentId":"1009","industryList":null},{"id":1054,"name":"旅游/度假","parentId":"1009","industryList":null}]},{"id":1010,"name":"文化|传媒|娱乐|体育","parentId":"0","industryList":[{"id":1055,"name":"媒体/出版/影视/文化传播","parentId":"1010","industryList":null},{"id":1056,"name":"娱乐/体育/休闲","parentId":"1010","industryList":null}]},{"id":1011,"name":"能源|矿产|环保","parentId":"0","industryList":[{"id":1057,"name":"能源/矿产/采掘/冶炼","parentId":"1011","industryList":null},{"id":1058,"name":"石油/石化/化工","parentId":"1011","industryList":null},{"id":1059,"name":"电气/电力/水利","parentId":"1011","industryList":null},{"id":1060,"name":"环保","parentId":"1011","industryList":null}]},{"id":1012,"name":"政府|非盈利机构","parentId":"0","industryList":[{"id":1061,"name":"政府/公共事业/非盈利机构","parentId":"1012","industryList":null},{"id":1062,"name":"学术/科研","parentId":"1012","industryList":null}]},{"id":1013,"name":"农|林|牧|渔|其他","parentId":"0","industryList":[{"id":1063,"name":"农/林/牧/渔","parentId":"1013","industryList":null},{"id":1064,"name":"跨领域经营","parentId":"1013","industryList":null},{"id":1065,"name":"其他","parentId":"1013","industryList":null}]}]')
