<template>
  <Card>
    <ManagerView :del="false" :save="null" :columns="columns">
      <Button type="primary">批量结束跟踪</Button>
    </ManagerView>
  </Card>
</template>

<script>
  export default {
    name: "TalentPending",
    data() {
      return {
        columns: [

        ]
      }
    }
  }
</script>

<style scoped>

</style>
