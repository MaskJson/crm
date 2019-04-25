<template>
  <SearchItem>
    <span>{{title}}</span>
    <DatePicker type="date" placeholder="开始时间" v-model="start" @on-change="startTimeChange" :options="startTimeOptions"></DatePicker>
    <span class="mlr5">-</span>
    <DatePicker type="date" placeholder="结束时间" v-model="end" @on-change="endTimeChange" :options="endTimeOptions"></DatePicker>
  </SearchItem>
</template>

<script>
  import SearchItem from '@/view/components/global-util/SearchItem';
  export default {
    name: "DateUtil",
    components: {
      SearchItem
    },
    props: ['startTime', 'endTime', 'title', 'index'],
    data() {
      return {
        startTimeOptions: {},
        endTimeOptions: {},
        start: this.startTime,
        end: this.endTime
      }
    },
    methods: {
      startTimeChange: function(e) { //设置开始时间
        this.$emit('change', !!this.start ? this.start : null, !!this.end ? this.end : null, this.index);
        if (!this.start) { // 当开始时间为为空，重置结束时间option
          this.endTimeOptions = {};
        }
        this.endTimeOptions = {
          disabledDate:(date) => {
            let startTime = this.start ? new Date(this.start).valueOf() : '';
            return date && (date.valueOf() < startTime);
          }
        }
      },
      endTimeChange: function(e) { //设置结束时间
        this.$emit('change', !!this.start ? this.start : null, !!this.end ? this.end : null);
        let endTime = this.end ? new Date(e).valueOf() - 1 * 24 * 60 * 60 * 1000 : '';
        if (!this.end) { // 结束时间为空，重置开始时间option
          this.startTimeOptions = {};
        } else {
          this.startTimeOptions = {
            disabledDate(date) {
              return date && date.valueOf() > endTime;
            }
          }
        }
      }
    },
    watch: {
      startTime(val) {
        this.start = val;
      },
      endTime(val) {
        this.end = val;
      }
    }
  }
</script>

<style scoped>

</style>
