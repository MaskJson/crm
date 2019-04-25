<template>
  <div class="bgf5 mB15 pd10">

  </div>
</template>

<script>
  import {getTalentProjects} from "../../../../api/talent";

  export default {
    name: "project",
    data() {
      return {
        projectList: [],// 项目经历
      }
    },
    methods: {
      // 获取项目经历
      getProjectList(id) {
        getTalentProjects({id}).then(data => {
          this.projectList = data || [];
          this.$emit('input', this.projectList.length);
        }).catch(data => {});
      },
    },
    created() {
      const id = (this.$route.query || {}).id;
      if (id) {
        this.getProjectList(Number(id));
      }
    }
  }
</script>

<style scoped>

</style>
