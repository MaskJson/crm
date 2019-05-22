<template>
  <div class="mt-10">
    <Collapse v-if="list.length > 0">
      <Panel v-for="(item, index) of list" :key="'progress1'+index">
        <span>{{item.name}}-{{item.children.length}}</span>
        <div slot="content">
          <TalentProgress flag="yes" performance="yes" hone="yes" :project-talents="item.children"/>
        </div>
      </Panel>
    </Collapse>
    <div class="center mt-30" v-else>暂无数据</div>
  </div>
</template>

<script>
  import TalentProgress from './../../../project/project-detail/components/TalentProcess';
  export default {
    name: "Progress",
    props: ['list'],
    components: {
      TalentProgress
    }
  }
</script>

<style scoped>

</style>
