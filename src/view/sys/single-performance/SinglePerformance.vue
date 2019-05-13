<template>
  <Card>
    <div>
      <Tabs>
        <TabPane label="进展跟踪">
          <Tabs style="min-height: 400px;">
            <TabPane label="单日绩效">
              <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getPerformance(1, dayTime)">查询</Button>
              <TalentProgress flag="yes" performance="yes" :project-talents="dayList"/>
            </TabPane>
            <TabPane label="周绩效">
              <DatePicker v-model="dayTime" placeholder="请选择日期" clearable/>
              <Button type="primary" class="ml-10" @click="getPerformance(2, weekTime)">查询</Button>
              <TalentProgress flag="yes" performance="yes" :project-talents="weekList"/>
            </TabPane>
            <TabPane label="月绩效">
              <DatePicker v-model="dayTime" placeholder="请选择月份" clearable type="month"/>
              <Button type="primary" class="ml-10" @click="getPerformance(3, monthTime)">查询</Button>
              <TalentProgress flag="yes" performance="yes" :project-talents="monthList"/>
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
  import {getDateMonth, getDateTime2, getUserId} from "../../../libs/tools";
  import {getPerformance} from "../../../api";

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
        userId: getUserId(),
        show: false
      }
    },
    methods: {
      getPerformance(flag, time) {
        getPerformance({
          userId: this.userId,
          flag,
          time: flag != 3 ? getDateTime2(time) : getDateMonth(time)
        }).then(data => {
          const v = data || [];
          switch (flag) {
            case 1:this.dayList = v;break;
            case 2:this.weekList = v;break;
            case 3:this.monthList = v;break;
          }
        })
      },
    },
    created() {
      this.getPerformance(1, this.dayTime);
      this.getPerformance(2, this.weekTime);
      this.getPerformance(3, this.monthTime);
    }
  }
</script>

<style scoped>

</style>
