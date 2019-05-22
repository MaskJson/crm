<template>
  <PerformanceReport :flag="3"/>
</template>

<script>
  import PerformanceReport from './PerformanceReport';
  export default {
    name: "MonthReport",
    components: {
      PerformanceReport
    }
  }
</script>

<style scoped>

</style>
