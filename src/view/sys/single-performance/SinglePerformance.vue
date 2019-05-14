<template>
  <Card>
    <div>
      <Tabs>
        <TabPane label="单日绩效">
          <Tabs>
            <TabPane label="进展跟踪">
              <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getProjectProgressInfo(1, dayTime)">查询</Button>
              <TalentProgress flag="yes" performance="yes" :project-talents="dayList"/>
            </TabPane>
            <TabPane label="人才常规跟踪">
              <DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getTalentRemindInfo(1, dayTimeTalent)">查询</Button>
            </TabPane>
            <TabPane label="客户常规跟踪">
              <DatePicker v-model="monthTime" placeholder="请选择月份" clearable type="month"/>
              <Button type="primary" class="ml-10" @click="getCustomerRemindInfo(1, dayTimeCustomer)">查询</Button>
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane label="周绩效">
          <Tabs>
            <TabPane label="进展跟踪">
              <DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getProjectProgressInfo(2, weekTime)">查询</Button>
              <TalentProgress flag="yes" performance="yes" :project-talents="weekList"/>
            </TabPane>
            <TabPane label="人才常规跟踪">
              <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getTalentRemindInfo(2, weekTimeTalent)">查询</Button>
            </TabPane>
            <TabPane label="客户常规跟踪">
              <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getCustomerRemindInfo(2, weekTimeCustomer)">查询</Button>
            </TabPane>
          </Tabs>
        </TabPane>
        <TabPane label="月绩效">
          <Tabs>
            <TabPane label="进展跟踪">
              <DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getProjectProgressInfo(3, monthTime)">查询</Button>
              <TalentProgress flag="yes" performance="yes" :project-talents="monthList"/>
            </TabPane>
            <TabPane label="人才常规跟踪">
              <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getTalentRemindInfo(3, monthTimeTalent)">查询</Button>
            </TabPane>
            <TabPane label="客户常规跟踪">
              <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getCustomerRemindInfo(3, monthTimeCustomer)">查询</Button>
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
      <SpinUtil :show="show"/>
    </div>
  </Card>
</template>

<script>
  import TalentProgress from './../../project/project-detail/components/TalentProcess';
  import {getDateMonth, getDateTime2, getUserId, getDateTime, getRenderList, getCustomerType} from "../../../libs/tools";
  import {getProjectProgressInfo, getTalentRemindInfo, getCustomerRemindInfo} from "../../../api";

  export default {
    name: "SinglePerformance",
    components: {
      TalentProgress
    },
    data() {
      return {
        dayTime: null,
        weekTime: null,
        monthTime: null,
        dayList: [],
        weekList: [],
        monthList: [],
        // 人才常规跟踪
        dayTimeTalent: null,
        weekTimeTalent: null,
        monthTimeTalent: null,
        dayListTalent: [],
        weekListTalent: [],
        monthListTalent: [],
        // 客户常规跟踪
        dayTimeCustomer: null,
        weekTimeCustomer: null,
        monthTimeCustomer: null,
        dayListCustomer: [],
        weekListCustomer: [],
        monthListCustomer: [],
        userId: getUserId(),
        show: false,
        talentColumns: [
          {
            title: '人选',
            key: 'talentName',
            align: 'center',
            render: (h, params) => {
              const name = params.row.name || params.row.talentName;
              return h('div', {
              }, [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  class: {
                    'cl-primary': true,
                  },
                  on: {
                    click: () => {
                      this.$router.push('/talent/talent-detail?id=' + params.row.talentId);
                    }
                  }
                }, name)
              ]);
            }
          },
          {
            title: '岗位',
            align: 'center',
            render: (h, params) => {
              return h('span', (params.row.info || {}).position)
            }
          },
          {
            title: '公司',
            align: 'center',
            render: (h, params) => {
              return h('span', (params.row.info || {}).customerName)
            }
          },
          {
            title: '沟通方式',
            align: 'center',
            key: ''
          },
          {
            title: '沟通记录',
            align: 'center',
            render: (h, params) => {
              const remind = params.row;
              if (remind && remind.type){
                let arr = [];
                switch (remind.type) {
                  case 1:
                    arr = [ `跟踪记录：${remind.remark}`];
                    break;
                  case 2:
                    arr = [ `人才基本情况：${remind.situation}`, `离职原因：${remind.cause}`, `薪资架构：${remind.salary}`];
                    break;
                  case 3:
                    arr = [ `面试时间：${getDateTime(remind.meetTime)}`, `面试地点：${remind.meetAddress}`, `人才基本情况：${remind.situation}`, `离职原因：${remind.cause}`, `薪资架构：${remind.salary}`];
                    break;
                }
                return getRenderList(h, JSON.stringify(arr));
              } else {
                return h('span', '');
              }
            }
          },
          {
            title: '时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime))
            }
          },
        ],
        customerColumns: [
        {
          title: '公司',
          align: 'center',
          key: 'customerName'
        },
        {
          title: '联系人',
          align: 'center',
          key: 'contactName'
        },
        {
          title: '沟通方式',
          align: 'center',
          render: (h, params) => {
            const v = params.row.type;
            return h('span', v == 1 ? '电话沟通' : v == 3 ? '客户上门' : '拜访客户')
          }
        },
        {
          title: '沟通记录',
          align: 'center',
          render: (h, params) => {
            const arr = [];
            arr.push(`跟踪状态：${getCustomerType(false, params.row.status) || '列名未联系'}`);
            if (params.row.type == 1 || params.row.type == 3) {
              arr.push(`沟通内容：${params.row.remark}`)
            } else {
              arr.push(`拜访时间：${getDateTime(params.row.meetTime)}`, `拜访地点：${getDateTime(params.row.meetAddress)}`, `拜访记录：${getDateTime(params.row.meetNotice)}`)
            }
            if (params.row.status == 5) {
              arr.push(`合同期：${getDateTime2(params.row.contactTimeStart)}-${getDateTime2(params.row.contactTimeEnd)}`)
            }
          }
        },
        {
          title: '时间',
          align: 'center',
          render: (h, params) => {
            return h('span', getDateTime(params.row.createTime));
          }
        },
      ]
      }
    },
    methods: {
      getProjectProgressInfo(flag, time) {
        getProjectProgressInfo({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          switch (flag) {
            case 1:this.dayList = v;break;
            case 2:this.weekList = v;break;
            case 3:this.monthList = v;break;
          }
        })
      },
      getTalentRemindInfo(flag, time) {
        getTalentRemindInfo({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          switch (flag) {
            case 1:this.dayListTalent = v;break;
            case 2:this.weekListTalent = v;break;
            case 3:this.monthListTalent = v;break;
          }
        })
      },
      getCustomerRemindInfo(flag, time) {
        getCustomerRemindInfo({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          switch (flag) {
            case 1:this.dayListCustomer = v;break;
            case 2:this.weekListCustomer = v;break;
            case 3:this.monthListCustomer = v;break;
          }
        })
      }
    },
    created() {
      this.getProjectProgressInfo(1, this.dayTime);
      this.getProjectProgressInfo(2, this.weekTime);
      this.getProjectProgressInfo(3, this.monthTime);
    }
  }
</script>

<style scoped>

</style>
