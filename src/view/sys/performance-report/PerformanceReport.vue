<template>
  <Card>
    <Tabs>
      <TabPane label="进展跟踪">
        <Tabs v-model="progress" style="min-height: 400px;">
          <TabPane label="单日报表" name="0">
            <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
            <Button type="primary" class="ml-10" @click="getProjectProgressInfos(1, dayTime)">查询</Button>
            <Progress :list="progressFilter"/>
          </TabPane>
          <TabPane label="周报表" name="1">
            <DatePicker v-model="weekTime" placeholder="请选择日期" clearable/>
            <Button type="primary" class="ml-10" @click="getProjectProgressInfos(2, weekTime)">查询</Button>
            <Progress :list="progressFilter"/>
          </TabPane>
          <TabPane label="月报表" name="2">
            <DatePicker type="month" v-model="monthTime" placeholder="请选择月份" clearable/>
            <Button type="primary" class="ml-10" @click="getProjectProgressInfos(3, monthTime)">查询</Button>
            <Progress :list="progressFilter"/>
          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane label="人才常规跟踪">
        <Tabs style="min-height: 400px;">
          <TabPane label="单日报表">

          </TabPane>
          <TabPane label="周报表">

          </TabPane>
          <TabPane label="月报表">

          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane label="客户常规跟踪">
        <Tabs style="min-height: 400px;">
          <TabPane label="单日报表">

          </TabPane>
          <TabPane label="周报表">

          </TabPane>
          <TabPane label="月报表">

          </TabPane>
        </Tabs>
      </TabPane>
      <TabPane label="报告">
        <Tabs style="min-height: 400px;">
          <TabPane label="单日报表">

          </TabPane>
          <TabPane label="周报表">

          </TabPane>
          <TabPane label="月报表">

          </TabPane>
        </Tabs>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
  import Progress from './components/Progress';
  import {getUserId, getUserInfoByKey, getDateTime2, getDateMonth} from "../../../libs/tools";
  import {getProjectProgressInfos} from "../../../api";

  export default {
    name: "PerformanceReport",
    components: {
      Progress
    },
    computed: {
      progressFilter() {
        const arr = this.progress == '0' ? this.dayList : this.progress == '1' ? this.weekList : this.monthList;
        const result = [];
        arr.forEach(item => {
          if (result.indexOf(rs => rs.userId == item.createUserId) < 0) {
            const obj = {name: item.createUser, children: arr.filter(filter => filter.createUserId == item.createUserId)};
            result.push(obj);
          }
        });
        return result;
      },
      talentFilter() {

      },
      customerFilter() {

      },
      reportFilter() {

      }
    },
    data() {
      return {
        // 进展报表
        progress: '0',
        dayTime: null,
        weekTime: null,
        monthTime: null,
        dayList: [],
        weekList: [],
        monthList: [],
        // 人才常规跟踪
        talent: '0',
        dayTimeTalent: null,
        weekTimeTalent: null,
        monthTimeTalent: null,
        dayListTalent: [],
        weekListTalent: [],
        monthListTalent: [],
        // 客户常规跟踪
        customer: '0',
        dayTimeCustomer: null,
        weekTimeCustomer: null,
        monthTimeCustomer: null,
        dayListCustomer: [],
        weekListCustomer: [],
        monthListCustomer: [],
        userId: getUserId(),
        roleId: getUserInfoByKey('roleId')
      }
    },
    methods: {
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
      }
    },
    created() {
      this.getProjectProgressInfos(1, this.dayTime);
      this.getProjectProgressInfos(2, this.weekTime);
      this.getProjectProgressInfos(3, this.monthTime);
    }
  }
</script>

<style scoped>

</style>
