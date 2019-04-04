<template>
  <Card>
    <Form ref="form">

    </Form>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  export default {
    name: "ProjectEdit",
    data() {
      return {
        show: false,
        entity: {

        }
      }
    }
  }
</script>

<style scoped>

</style>
