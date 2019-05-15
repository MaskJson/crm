<template>
  <div class="mt-10">
    <Collapse v-if="list.length > 0">
      <Panel v-for="(item, index) of list" :key="'customer'+index">
        <span>{{item.name}}-{{item.children.length}}</span>
        <div slot="content">
          <CustomerRemind :list="item.children"/>
        </div>
      </Panel>
    </Collapse>
    <div class="center mt-30" v-else>暂无数据</div>
  </div>
</template>

<script>
  import CustomerRemind from './../../CustomerRemind';
  export default {
    name: "Customer",
    props: ['list'],
    components: {
      CustomerRemind
    }
  }
</script>

<style scoped>

</style>
