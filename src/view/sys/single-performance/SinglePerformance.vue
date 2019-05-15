<template>
  <Card>
    <div>
      <Tabs style="min-height: 400px">
        <TabPane label="单日绩效">
          <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
          <Button type="primary" class="ml-10" @click="getData(1, dayTime)">查询</Button>
          <Tabs class="mt-10">
            <TabPane label="进展跟踪">
              <!--<DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getProjectProgressInfo(1, dayTime)">查询</Button>-->
              <TalentProgress flag="yes" performance="yes" :project-talents="dayList"/>
            </TabPane>
            <TabPane label="人才常规跟踪">
              <!--<DatePicker v-model="dayTimeTalent" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getTalentRemindInfo(1, dayTimeTalent)">查询</Button>-->
              <TalentRemind :list="dayListTalent"/>
            </TabPane>
            <TabPane label="客户常规跟踪">
              <!--<DatePicker v-model="monthTimeCustomer" placeholder="请选择日期" clearable type="month"/>-->
              <!--<Button type="primary" class="ml-10" @click="getCustomerRemindInfo(1, dayTimeCustomer)">查询</Button>-->
              <CustomerRemind :list="dayListCustomer"/>
            </TabPane>
          </Tabs>
          <div class="mt-10">
            <Input type="textarea" :rows="3" v-model="dayReport.content" readonly placeholder="当前选中日期日报"/>
          </div>
        </TabPane>
        <TabPane label="周绩效">
          <DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>
          <Button type="primary" class="ml-10" @click="getData(2, weekTime)">查询</Button>
          <Tabs class="mt-10">
            <TabPane label="进展跟踪">
              <!--<DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getProjectProgressInfo(2, weekTime)">查询</Button>-->
              <TalentProgress flag="yes" performance="yes" :project-talents="weekList"/>
            </TabPane>
            <TabPane label="人才常规跟踪">
              <!--<DatePicker v-model="weekTimeTalent" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getTalentRemindInfo(2, weekTimeTalent)">查询</Button>-->
              <TalentRemind :list="weekListTalent"/>
            </TabPane>
            <TabPane label="客户常规跟踪">
              <!--<DatePicker v-model="weekTimeCustomer" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getCustomerRemindInfo(2, weekTimeCustomer)">查询</Button>-->
              <CustomerRemind :list="weekListCustomer"/>
            </TabPane>
          </Tabs>
          <div class="mt-10">
            <Input type="textarea" :rows="3" v-model="weekReport.content" readonly placeholder="当前选中日期周报"/>
          </div>
        </TabPane>
        <TabPane label="月绩效">
          <DatePicker v-model="monthTime" type="month" placeholder="请选择月份" clearable/>
          <Button type="primary" class="ml-10" @click="getData(3, monthTime)">查询</Button>
          <Tabs>
            <TabPane label="进展跟踪">
              <!--<DatePicker v-model="monthTime" type="month" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getProjectProgressInfo(3, monthTime)">查询</Button>-->
              <TalentProgress flag="yes" performance="yes" :project-talents="monthList"/>
            </TabPane>
            <TabPane label="人才常规跟踪">
              <!--<DatePicker v-model="monthTimeTalent" type="month" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getTalentRemindInfo(3, monthTimeTalent)">查询</Button>-->
              <TalentRemind :list="monthListTalent"/>
            </TabPane>
            <TabPane label="客户常规跟踪">
              <!--<DatePicker v-model="monthTimeCustomer" type="month" placeholder="请选择日期" clearable/>-->
              <!--<Button type="primary" class="ml-10" @click="getCustomerRemindInfo(3, monthTimeCustomer)">查询</Button>-->
              <CustomerRemind :list="monthListCustomer"/>
            </TabPane>
          </Tabs>
          <div class="mt-10">
            <Input type="textarea" :rows="3" v-model="monthReport.content" readonly placeholder="当前选中日期月报"/>
          </div>
        </TabPane>
        <TabPane label="报告填写">
          <Row>
            <Col span="8" class="pd-5">
              <p>日报</p>
              <Input type="textarea" :rows="3" v-model="d" placeholder="请填写日报" :readonly="!!dr && dr.length > 0"/>
              <Button class="mt-10" type="primary" v-if="dr != null && dr.length == 0" @click="saveReport(1, d)">提交日报</Button>
            </Col>
            <Col span="8" class="pd-5">
              <p>周报</p>
              <Input type="textarea" :rows="3" v-model="w" placeholder="请填写周报" :readonly="!!wr && wr.length > 0"/>
              <Button class="mt-10" type="primary" v-if="wr != null && wr.length == 0" @click="saveReport(2, w)">提交周报</Button>
            </Col>
            <Col span="8" class="pd-5">
              <p>月报</p>
              <Input type="textarea" :rows="3" v-model="m" placeholder="请填写月报" :readonly="!!mr && mr.length > 0"/>
              <Button class="mt-10" type="primary" v-if="mr != null && mr.length == 0" @click="saveReport(3, m)">提交月报</Button>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
      <SpinUtil :show="show"/>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import TalentProgress from './../../project/project-detail/components/TalentProcess';
  import TalentRemind from './../TalentRemind';
  import CustomerRemind from './../CustomerRemind';
  import {getDateMonth, getDateTime2, getUserId,} from "../../../libs/tools";
  import {getProjectProgressInfo, getTalentRemindInfo, getCustomerRemindInfo, getReportInfo, saveReport} from "../../../api";

  export default {
    name: "SinglePerformance",
    components: {
      TalentProgress,
      TalentRemind,
      CustomerRemind
    },
    data() {
      return {
        show: false,
        dayTime: null,
        weekTime: null,
        monthTime: null,
        dayList: [],
        weekList: [],
        monthList: [],
        // 人才常规跟踪
        // dayTimeTalent: null,
        // weekTimeTalent: null,
        // monthTimeTalent: null,
        dayListTalent: [],
        weekListTalent: [],
        monthListTalent: [],
        // 客户常规跟踪
        // dayTimeCustomer: null,
        // weekTimeCustomer: null,
        // monthTimeCustomer: null,
        dayListCustomer: [],
        weekListCustomer: [],
        monthListCustomer: [],
        userId: getUserId(),
        show: false,
        dayReport: {
          userId: getUserId(),
          content: null,
        },
        weekReport: {
          id: null,
          userId: getUserId(),
          content: null,
        },
        monthReport: {
          userId: getUserId(),
          content: null,
        },
        // 当前报告
        dr: null,
        wr: null,
        mr: null,
        d: '',
        w: '',
        m: ''
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
          switch (type) {
            case 1:this.dr.push(params);break;
            case 2:this.wr.push(params);break;
            case 3:this.mr.push(params);break;
          }
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
          switch (flag) {
            case 1:this.dayReport = report;if(b) {this.dr = v;this.d = report.content;}break;
            case 2:this.weekReport = report;if(b) {this.wr = v;this.w = report.content;}break;
            case 3:this.monthReport = report;if(b) {this.mr = v;this.m = report.content;}break;
          }
        })
      },
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
      this.getData(1, this.dayTime, true);
      this.getData(2, this.weekTime, true);
      this.getData(3, this.monthTime, true);
    }
  }
</script>

<style scoped>

</style>
