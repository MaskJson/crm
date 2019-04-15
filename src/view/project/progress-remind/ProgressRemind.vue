<template>
  <Card>
    <Tabs v-model="status">
      <TabPane label="启动阶段" name="1">
        <ManagerView />
      </TabPane>
      <TabPane label="攻坚阶段" name="2">

      </TabPane>
      <TabPane label="收尾阶段" name="3">

      </TabPane>
      <TabPane label="项目结束" name="4">

      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
  export default {
    name: "ProgressRemind",
    data() {
      return {

      }
    }
  }
</script>

<style scoped>

</style>
