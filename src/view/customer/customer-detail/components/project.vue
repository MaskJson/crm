<template>
  <div>
    <div>
      <SearchItem>
        <Button type="primary" @click="search">刷新</Button>
      </SearchItem>
    </div>
    <ManagerView ref="manager" :del="false" :save="null" :init="false" :columns="columns" :searchData="searchData" @on-success="successHandler"/>
  </div>
</template>

<script>
  import { getProjects } from "../../../../api/customer";
  import { getDateTime, globalSearch } from "../../../../libs/tools";

  export default {
    name: "project",
    props: ['id'],
    data() {
      return {
        searchData: {
          id: null
        },
        columns: [
          {
            title: '项目名称',
            key: 'projectName',
            align: 'center',
            render: (h, params) => {
              return h('Button', {
                props: {
                  type: 'text',
                  size: 'small'
                },
                class: {
                  'cl-primary': true
                },
                on: {
                  click: () => {
                    this.$router.push({ path: '/project/project-detail', query: {id: params.row.id}});
                  }
                }
              }, params.row.projectName);
            }
          },
          {
            title: '创建者',
            align: 'center',
            key: 'createUser'
          },
          {
            title: '创建时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime));
            }
          },
        ]
      }
    },
    methods: {
      search() {
        globalSearch(this);
      },
      successHandler() {
        this.$emit('on-change', this.$refs['manager'].page.total);
      }
    },
    provide() {
      return {
        handlers: {
          search: getProjects
        }
      }
    },
    watch: {
      id(v) {
        this.searchData.id = v;
        globalSearch(this);
      }
    }
  }
</script>

<style scoped>

</style>
