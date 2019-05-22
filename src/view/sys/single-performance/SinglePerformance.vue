<template>
  <Card>
    <div style="min-height: 400px;">
      <h3>{{title.replace('报','')}}绩效</h3>
      <DatePicker v-model="time" :type="flag == 3 ? 'month' : 'date'" placeholder="请选择日期" clearable/>
      <Button type="primary" class="ml-10" @click="getData(flag, time)">查询</Button>
      <div class="mt-10 mb-20">
        <div v-show="projectList.length > 0">
          <h5>进展跟踪</h5>
          <TalentProgress flag="yes" performance="yes" home="yes" :project-talents="projectList"/>
        </div>
        <div v-show="talentList.length > 0">
          <h5>人才常规跟踪</h5>
          <TalentRemind :list="talentList"/>
        </div>
        <div v-show="customerList.length > 0">
          <h5>客户常规跟踪</h5>
          <CustomerRemind :list="customerList"/>
        </div>
      </div>

      <Row>
        <Col span="24" class="pd-5" v-if="flag == 1 && (roleId == 4 || roleId == 5)">
          <p>{{title}}</p>
          <Input type="textarea" :rows="3" v-model="content" :placeholder="'请填写' + title" :readonly="!!report && report.length > 0"/>
          <Button class="mt-10" type="primary" v-if="report != null && report.length == 0" @click="saveReport(flag, content)">提交{{title}}</Button>
        </Col>
      </Row>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import TalentProgress from './../../project/project-detail/components/TalentProcess';
  import TalentRemind from './../TalentRemind';
  import CustomerRemind from './../CustomerRemind';
  import {getDateMonth, getDateTime2, getUserId, getUserInfoByKey} from "../../../libs/tools";
  import {getProjectProgressInfo, getTalentRemindInfo, getCustomerRemindInfo, getReportInfo, saveReport} from "../../../api";

  export default {
    name: "SinglePerformance",
    props: ['flag'],
    components: {
      TalentProgress,
      TalentRemind,
      CustomerRemind
    },
    computed: {
      title() {
        return this.flag == 1 ? '日报' : this.flag == 2 ? '周报' : '月报';
      }
    },
    data() {
      return {
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId'),
        show: false,
        time: null,
        projectList: [],
        talentList: [],
        customerList: [],
        report: [],
        content: '',
      }
    },
    methods: {
      saveReport(type, content) {
        if (content.trim().length == 0) {
          this.$Message.error('请填写报告内容');
          return false;
        }
        this.show = true;
        const params = {
          createUserId: this.userId,
          type,
          content
        };
        saveReport(params).then(data => {
          this.report.push(params);
          this.show = false;
        }).catch(data => {
          this.show = false;
        })
      },
      getData(flag, time, b) {
        this.getReport(flag, time, b);
        this.getProjectProgressInfo(flag, time);
        this.getTalentRemindInfo(flag, time);
        this.getCustomerRemindInfo(flag, time);
      },
      getReport(flag, time, b) {
        getReportInfo({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          const report = v.length > 0 ? v[0] : {userId: getUserId(), content: ''};
          if(b) {
            this.report = v;
            this.content = report.content;}
        })
      },
      getProjectProgressInfo(flag, time) {
        getProjectProgressInfo({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          this.projectList = v;
        })
      },
      getTalentRemindInfo(flag, time) {
        getTalentRemindInfo({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          this.talentList = v;
        })
      },
      getCustomerRemindInfo(flag, time) {
        getCustomerRemindInfo({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : (getDateMonth(time) || '').replace('-', '')
        }).then(data => {
          const v = data || [];
          this.customerList = v;
        })
      }
    },
    created() {
      this.getData(1, this.time, true);
    }
  }
</script>

<style scoped>

</style>
