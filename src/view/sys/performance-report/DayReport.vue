<template>
  <PerformanceReport :flag="1"/>
</template>

<script>
  import PerformanceReport from './PerformanceReport';
  export default {
    name: "DayReport",
    components: {
      PerformanceReport
    }
  }
</script>

<style scoped>

</style>
