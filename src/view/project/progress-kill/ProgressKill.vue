<template>
  <Card>
    <ManagerView :del="false" :save="null" :columns="columns" :searchData="searchData"/>
  </Card>
</template>

<script>
  import {getUserId, getDateTime} from "../../../libs/tools";
  import {getKill} from "../../../api/project";

  export default {
    name: "ProgressKill",
    data() {
      return {
        searchData: {
          userId: getUserId()
        },
        columns: [
          {
            title: '项目',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                class: 'cl-primary',
                on: {
                  click: () => {
                    this.$router.push('/project/project-detail?id=' + params.row.projectId);
                  }
                }
              }, params.row.projectName);
            }
          },
          {
            title: '人才',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                class: 'cl-primary',
                on: {
                  click: () => {
                    this.$router.push('/talent/talent-detail?id=' + params.row.talentId);
                  }
                }
              }, params.row.talentName);
            }
          },
          {
            title: '淘汰理由',
            align: 'center',
            key: 'killRemark'
          },
          {
            title: '操作时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.updateTime))
            }
          }
        ]
      }
    },
    provide() {
      return {
        handlers: {
          search: getKill
        }
      }
    }
  }
</script>

<style scoped>

</style>
