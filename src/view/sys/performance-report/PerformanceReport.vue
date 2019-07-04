<template>
  <Card>
    <div style="min-height: 400px;">
      <PerformanceCount ref="count" :memberId="memberId"/>
      <h3>{{title.replace('报','')}}绩效</h3>
      <DatePicker v-model="time" :type="flag == 3 ? 'month' : 'date'" placeholder="请选择日期" clearable/>
      <Select placeholder="请选择顾问" v-model="memberId" clearable class="w200 ml-10">
        <Option :value="-1" :key="-1">全部</Option>
        <Option v-for="(item, index) of memberList" :value="item.id" :key="'member'+index">{{item.nickName}}</Option>
      </Select>
      <Button type="primary" class="ml-10" @click="getData(flag, time)">查询</Button>
      <div class="mt-10 mb-20">
        <div v-show="progressFilter.length > 0">
          <h5>进展跟踪</h5>
          <Progress :list="progressFilter" :flag="flag"/>
        </div>
        <div v-show="talentFilter.length > 0">
          <h5 class="mt-10">人才常规跟踪</h5>
          <Talent :list="talentFilter" :flag="flag"/>
        </div>
        <div v-show="customerFilter.length > 0">
          <h5 class="mt-10">客户常规跟踪</h5>
          <Customer :list="customerFilter" :flag="flag"/>
        </div>
        <div v-show="reportFilter.length > 0">
          <h5 class="mt-10">报告</h5>
          <Report :list="reportFilter" :flag="flag"/>
        </div>
      </div>
      <div class="mt-10 center">
        <Button type="primary" @click="searchChange(true)">{{prevTxt}}</Button>
        <Button type="primary" class="ml-10" @click="searchChange(false)">{{nextTxt}}</Button>
      </div>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import Progress from './components/Progress';
  import Talent from './components/Talent';
  import Customer from './components/Customer';
  import Report from './components/Report';
  import PerformanceCount from './../PerformanceCount';
  import {getUserId, getUserInfoByKey, getDateTime2, getDateMonth} from "../../../libs/tools";
  import {getProjectProgressInfos, getTalentRemindInfos, getCustomerRemindInfos, getReportInfos, getMembers} from "../../../api";

  export default {
    name: "PerformanceReport",
    props: ['flag'],
    components: {
      Progress,
      Talent,
      Customer,
      Report,
      PerformanceCount
    },
    computed: {
      prevTxt() {
        return this.flag == 1 ? '前一天' : this.flag == 2 ? '上一周' : '上个月';
      },
      nextTxt() {
        return this.flag == 1 ? '后一天' : this.flag == 2 ? '下一周' : '下个月';
      },
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
        const arr = this.reportList.filter(item => item.children && item.children.length > 0);
        return arr;
      }
    },
    data() {
      return {
        show: false,
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
        let mills = 0;
        switch (this.flag) {
          case 1: mills = 3600*24*1000;break;
          case 2: mills = 3600*24*1000*7;break;
          case 3: mills = 3600*24*1000*30;break;
        }
        date = date +(flag ? (-mills) : mills);
        this.time = new Date(date);
        this.getData(this.flag, this.time);
      },
      getData(flag, time) {
        if (!time) {
          this.$Message.warning('请选择日期');
          return false;
        }
        if (flag == 1 && !this.memberId) {
          this.$Message.warning('请选择顾问');
          return false;
        }
        this.show = true;
        this.$refs['count'].init();
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
          memberId: this.memberId == -1 ? null : (this.memberId || null),
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          this.show = false;
          const v = data || [];
          this.projectList = v;
        }).catch(res => {this.show = false;})
      },
      getTalentRemindInfos(flag, time) {
        time = time || new Date();
        getTalentRemindInfos({
          userId: this.userId,
          roleId: this.roleId,
          flag,
          memberId: this.memberId == -1 ? null : (this.memberId || null),
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
          memberId: this.memberId == -1 ? null : (this.memberId || null),
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
          memberId: this.memberId == -1 ? null : (this.memberId || null),
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = this.filterReports(data);
          this.reportList = v;
        })
      },
      filterReports(v) {
        let {members, reports} = v || {};
        if (!!this.memberId) {
          members = members.filter(item => item.createUserId == this.memberId);
        }
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
