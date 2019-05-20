<template>
  <Card>
    <Tabs v-model="type">
      <TabPane label="单日报表" name="0">
        <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
        <Button type="primary" class="ml-10" @click="getData(1, dayTime)">查询</Button>
        <Tabs style="min-height: 400px;">
          <TabPane label="进展功能">
            <!--<DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getProjectProgressInfos(1, dayTime)">查询</Button>-->
            <Progress :list="progressFilter"/>
          </TabPane>
          <TabPane label="人才常规跟踪">
            <!--<DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getProjectProgressInfos(2, weekTime)">查询</Button>-->
            <Talent :list="talentFilter"/>
          </TabPane>
          <TabPane label="客户常规跟踪">
            <!--<DatePicker type="month" v-model="monthTime" placeholder="请选择月份" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getProjectProgressInfos(3, monthTime)">查询</Button>-->
            <Customer :list="customerFilter"/>
          </TabPane>
          <TabPane label="报告">
            <Report :list="reportFilter"/>
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane label="周报表" name="1">
        <DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>
        <Button type="primary" class="ml-10" @click="getData(2, weekTime)">查询</Button>
        <Tabs style="min-height: 400px;">
          <TabPane label="进展功能">
            <!--<DatePicker v-model="dayTimeTalent" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getTalentRemindInfos(1, dayTimeTalent)">查询</Button>-->
            <Progress :list="progressFilter"/>
          </TabPane>
          <TabPane label="人才常规跟踪">
            <!--<DatePicker v-model="weekTimeTalent" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getTalentRemindInfos(2, weekTimeTalent)">查询</Button>-->
            <Talent :list="talentFilter"/>
          </TabPane>
          <TabPane label="客户常规跟踪">
            <!--<DatePicker v-model="monthTimeTalent" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getTalentRemindInfos(3, monthTimeTalent)">查询</Button>-->
            <Customer :list="customerFilter"/>
          </TabPane>
          <TabPane label="报告">
            <Report :list="reportFilter"/>
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane label="月报表" name="2">
        <DatePicker v-model="monthTime" type="month" placeholder="请选择月份" clearable/>
        <Button type="primary" class="ml-10" @click="getData(3, monthTime)">查询</Button>
        <Tabs style="min-height: 400px;">
          <TabPane label="进展功能">
            <!--<DatePicker v-model="dayTimeCustomer" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getCustomerRemindInfos(1, dayTimeCustomer)">查询</Button>-->
            <Progress :list="progressFilter"/>
          </TabPane>
          <TabPane label="人才常规跟踪">
            <!--<DatePicker v-model="dayTimeCustomer" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getCustomerRemindInfos(1, dayTimeCustomer)">查询</Button>-->
            <Talent :list="talentFilter"/>
          </TabPane>
          <TabPane label="客户常规跟踪">
            <!--<DatePicker v-model="dayTimeCustomer" placeholder="请选择日期" clearable/>-->
            <!--<Button type="primary" class="ml-10" @click="getCustomerRemindInfos(1, dayTimeCustomer)">查询</Button>-->
            <Customer :list="customerFilter"/>
          </TabPane>
          <TabPane label="报告">
            <Report :list="reportFilter"/>
          </TabPane>
        </Tabs>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
  import Progress from './components/Progress';
  import Talent from './components/Talent';
  import Customer from './components/Customer';
  import Report from './components/Report';
  import {getUserId, getUserInfoByKey, getDateTime2, getDateMonth} from "../../../libs/tools";
  import {getProjectProgressInfos, getTalentRemindInfos, getCustomerRemindInfos, getReportInfos} from "../../../api";

  export default {
    name: "PerformanceReport",
    components: {
      Progress,
      Talent,
      Customer,
      Report
    },
    computed: {
      progressFilter() {
        const arr = this.type == '0' ? this.dayList : this.type == '1' ? this.weekList : this.monthList;
        const result = [];
        arr.forEach(item => {
          if (result.findIndex(rs => rs.createUserId == item.createUserId) < 0) {
            const obj = {name: item.createUser, createUserId: item.createUserId, children: arr.filter(filter => filter.createUserId == item.createUserId)};
            result.push(obj);
          }
        });
        return result;
      },
      talentFilter() {
        const arr = this.type == '0' ? this.dayListTalent : this.type == '1' ? this.weekListTalent : this.monthListTalent;
        const result = [];
        arr.forEach(item => {
          if (result.findIndex(rs => rs.createUserId == item.createUserId) < 0) {
            const obj = {name: item.createUser, createUserId: item.createUserId, children: arr.filter(filter => filter.createUserId == item.createUserId)};
            result.push(obj);
          }
        });
        return result;
      },
      customerFilter() {
        const arr = this.type == '0' ? this.dayListCustomer : this.type == '1' ? this.weekListCustomer : this.monthListCustomer;
        const result = [];
        arr.forEach(item => {
          if (result.findIndex(rs => rs.createUserId == item.createUserId) < 0) {
            const obj = {name: item.createUser, createUserId: item.createUserId, children: arr.filter(filter => filter.createUserId == item.createUserId)};
            result.push(obj);
          }
        });
        return result;
      },
      reportFilter() {
        const arr = this.type == '0' ? this.dayListReport : this.type == '1' ? this.weekListReport : this.monthListReport;
        return arr;
      }
    },
    data() {
      return {
        type: '0',
        // 进展报表
        // progress: '0',
        dayTime: null,
        weekTime: null,
        monthTime: null,
        dayList: [],
        weekList: [],
        monthList: [],
        // 人才常规跟踪
        // talent: '0',
        // dayTimeTalent: null,
        // weekTimeTalent: null,
        // monthTimeTalent: null,
        dayListTalent: [],
        weekListTalent: [],
        monthListTalent: [],
        // 客户常规跟踪
        // customer: '0',
        // dayTimeCustomer: null,
        // weekTimeCustomer: null,
        // monthTimeCustomer: null,
        dayListCustomer: [],
        weekListCustomer: [],
        monthListCustomer: [],
        // 报告
        dayListReport: [],
        weekListReport: [],
        monthListReport: [],
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId')
      }
    },
    methods: {
      getData(flag, time) {
        this.getProjectProgressInfos(flag, time);
        this.getTalentRemindInfos(flag, time);
        this.getCustomerRemindInfos(flag, time);
        this.getReportInfos(flag, time);
      },
      getProjectProgressInfos(flag, time) {
        getProjectProgressInfos({
          userId: this.userId,
          roleId: this.roleId,
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
      getTalentRemindInfos(flag, time) {
        getTalentRemindInfos({
          userId: this.userId,
          roleId: this.roleId,
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
      getCustomerRemindInfos(flag, time) {
        getCustomerRemindInfos({
          userId: this.userId,
          roleId: this.roleId,
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
      },
      getReportInfos(flag, time) {
        getReportInfos({
          userId: this.userId,
          roleId: this.roleId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = this.filterReports(data);
          switch (flag) {
            case 1:this.dayListReport = v.filter(item => item.roleId == 4 || item.roleId == 5);break;
            case 2:this.weekListReport = v.filter(item => item.roleId != 4 && item.roleId != 5);break;
            case 3:this.monthListReport = v.filter(item => item.roleId != 4 && item.roleId != 5);break;
          }
        })
      },
      filterReports(v) {
        const {members, reports} = v || {};
        return members.map(item => {
          item.children = reports.filter(r => r.createUserId == item.createUserId);
          return item;
        })
      }
    },
    created() {
      this.getData(1, this.dayTime);
      this.getData(2, this.weekTime);
      this.getData(3, this.monthTime);
    }
  }
</script>

<style scoped>

</style>
