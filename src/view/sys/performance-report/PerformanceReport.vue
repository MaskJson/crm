<template>
  <Card>
    <div style="min-height: 400px;">
      <h3>{{title.replace('报','')}}绩效</h3>
      <DatePicker v-model="time" :type="flag == 3 ? 'month' : 'date'" placeholder="请选择日期" clearable/>
      <Button type="primary" class="ml-10" @click="getData(flag, time)">查询</Button>
      <div class="mt-10 mb-20">
        <div v-show="progressFilter.length > 0">
          <h5>进展跟踪</h5>
          <Progress :list="progressFilter"/>
        </div>
        <div v-show="talentFilter.length > 0">
          <h5>人才常规跟踪</h5>
          <Talent :list="talentFilter"/>
        </div>
        <div v-show="customerFilter.length > 0">
          <h5>客户常规跟踪</h5>
          <Customer :list="customerFilter"/>
        </div>
        <div v-show="reportFilter.length > 0">
          <h5>报告</h5>
          <Report :list="reportFilter"/>
        </div>
      </div>
    </div>
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
    props: ['flag'],
    components: {
      Progress,
      Talent,
      Customer,
      Report
    },
    computed: {
      title() {
        return this.flag == 1 ? '日报' : this.flag == 2 ? '周报' : '月报';
      },
      progressFilter() {
        const arr = this.projectList;
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
        const arr = this.talentList;
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
        const arr = this.customerList;
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
        const arr = this.reportList;
        return arr;
      }
    },
    data() {
      return {
        time: null,
        projectList: [],
        talentList: [],
        customerList: [],
        reportList: [],

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
          this.projectList = v;
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
          this.talentList = v;
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
          this.customerList = v;
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
          this.reportList = v;
        })
      },
      filterReports(v) {
        const {members, reports} = v || {};
        return members.map(item => {
          item.children = reports.filter(r => r.createUserId == item.createUserId);
          return item;
        })
      },
    },
    created() {
      this.getData(this.flag, this.time);
    }
  }
</script>

<style scoped>

</style>
