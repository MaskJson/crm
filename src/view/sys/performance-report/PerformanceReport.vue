<template>
  <Card>
    <div style="min-height: 400px;">
      <h3>{{title.replace('报','')}}绩效</h3>
      <DatePicker v-model="time" :type="flag == 3 ? 'month' : 'date'" placeholder="请选择日期" clearable/>
      <Select placeholder="选择成员" v-model="memberId" clearable class="w200 ml-10">
        <Option v-for="(item, index) of memberList" :value="item.id" :key="'member'+index">{{item.nickName}}</Option>
      </Select>
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
      <div class="mt-10 center" v-if="flag == 1">
        <Button type="primary" @click="searchChange(true)">前一天</Button>
        <Button type="primary" class="ml-10" @click="searchChange(false)">后一天</Button>
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
  import {getProjectProgressInfos, getTalentRemindInfos, getCustomerRemindInfos, getReportInfos, getMembers} from "../../../api";

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
        memberList: [],
        memberId: null,
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId')
      }
    },
    methods: {
      searchChange(flag) {
        let date = (this.time || new Date()).getTime();
        date = date +(flag ? (-3600*24*1000) : 3600*24*1000);
        this.time = new Date(date);
        this.getData(this.flag, this.time);
      },
      getData(flag, time) {
        if (!time) {
          this.$Message.warning('请选择日期');
          return false;
        }
        this.getProjectProgressInfos(flag, time);
        this.getTalentRemindInfos(flag, time);
        this.getCustomerRemindInfos(flag, time);
        this.getReportInfos(flag, time);
      },
      getProjectProgressInfos(flag, time) {
        time = time || new Date();
        getProjectProgressInfos({
          userId: this.userId,
          roleId: this.roleId,
          flag,
          memberId: this.memberId || null,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          this.projectList = v;
        })
      },
      getTalentRemindInfos(flag, time) {
        time = time || new Date();
        getTalentRemindInfos({
          userId: this.userId,
          roleId: this.roleId,
          flag,
          memberId: this.memberId || null,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          this.talentList = v;
        })
      },
      getCustomerRemindInfos(flag, time) {
        time = time || new Date();
        getCustomerRemindInfos({
          userId: this.userId,
          roleId: this.roleId,
          flag,
          memberId: this.memberId || null,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          this.customerList = v;
        })
      },
      getReportInfos(flag, time) {
        time = time || new Date();
        getReportInfos({
          userId: this.userId,
          roleId: this.roleId,
          flag,
          memberId: this.memberId || null,
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
      getMembers({
        userId: this.userId,
        roleId: this.roleId,
        flag: this.flag
      }).then(data => {
        this.memberList = data || [];
      }).catch(res => {})
      // this.getData(this.flag, this.time);
    }
  }
</script>

<style scoped>

</style>
