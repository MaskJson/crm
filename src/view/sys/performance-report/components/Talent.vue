<template>
  <div class="mt-10">
    <Collapse v-if="list.length > 0">
      <Panel v-for="(item, index) of list" :key="'talent'+index">
        <span>{{item.name}}-{{item.children.length}}</span>
        <div slot="content">
          <TalentRemind :list="item.children"/>
        </div>
      </Panel>
    </Collapse>
    <div class="center mt-30" v-else>暂无数据</div>
  </div>
</template>

<script>
  import TalentRemind from './../../TalentRemind';
  export default {
    name: "Talent",
    props: ['list'],
    components: {
      TalentRemind
    }
  }
</script>

<style scoped>

</style>
