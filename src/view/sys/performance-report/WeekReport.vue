<template>
  <PerformanceReport :flag="2"/>
</template>

<script>
  import PerformanceReport from './PerformanceReport';
  export default {
    name: "WeekReport",
    components: {
      PerformanceReport
    }
  }
</script>

<style scoped>

</style>
