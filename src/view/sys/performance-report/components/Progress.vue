<template>
  <div class="mt-10">
    <div v-if="flag != 1">
      <Collapse v-if="list.length > 0">
        <Panel v-for="(item, index) of list" :key="'progress1'+index">
          <span>{{item.name}}-{{item.children.length}}</span>
          <div slot="content">
            <TalentProgress flag="yes" performance="yes" home="yes" :project-talents="item.children"/>
          </div>
        </Panel>
      </Collapse>
      <div class="center mt-30" v-else>暂无数据</div>
    </div>
    <div v-if="flag == 1 && list && list.length>0">
      <TalentProgress flag="yes" performance="yes" home="yes" :project-talents="list[0].children"/>
    </div>
  </div>
</template>

<script>
  import TalentProgress from './../../../project/project-detail/components/TalentProcess';
  export default {
    name: "Progress",
    props: ['list', 'flag'],
    components: {
      TalentProgress
    }
  }
</script>

<style scoped>

</style>
