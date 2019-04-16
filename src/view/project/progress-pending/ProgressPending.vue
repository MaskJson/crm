<template>
  <Card>
    <Tabs v-model="status">
      <TabPane label="启动阶段" name="1" class="pt-20">
        <div>
          <SearchItem>
            <Select class="w200" clearable placeholder="选择阶段状态" v-model="startSearch.status">
              <Option :value="1">进展中</Option>
              <Option :value="2">停滞中</Option>
              <Option :value="3">缓慢</Option>
            </Select>
          </SearchItem>
          <SearchItem>
            <Button type="primary" @click="search('first')">查询</Button>
          </SearchItem>
        </div>
        <ManagerView class="talent-manager" ref="first" :columns="columns.concat(startStatus)" :searchData="startSearch" :del="false" :save="null"/>
      </TabPane>
      <TabPane label="攻坚阶段" name="2" class="pt-20">
        <div>
          <SearchItem>
            <Select class="w200" clearable placeholder="选择阶段状态" v-model="gongJianSearch.status">
              <Option :value="1">进展中</Option>
              <Option :value="2">缓慢</Option>
            </Select>
          </SearchItem>
          <SearchItem>
            <Button type="primary" @click="search('second')">查询</Button>
          </SearchItem>
        </div>
        <ManagerView class="talent-manager" ref="second" :columns="columns.concat(gongJianStatus)" :searchData="gongJianSearch" :del="false" :save="null"/>
      </TabPane>
      <TabPane label="收尾阶段" name="3" class="pt-20">
        <div>
          <SearchItem>
            <Select class="w200" clearable placeholder="选择阶段状态" v-model="shouWeiSearch.status">
              <Option :value="4">签订offer</Option>
              <Option :value="5">客户面试</Option>
              <Option :value="6">保证期</Option>
            </Select>
          </SearchItem>
          <SearchItem>
            <Button type="primary" @click="search('third')">查询</Button>
          </SearchItem>
        </div>
        <ManagerView class="talent-manager" ref="third" :columns="columns" :searchData="shouWeiSearch" :del="false" :save="null"/>
      </TabPane>
      <TabPane label="项目结束" name="4" class="pt-20">
        <div>
          <SearchItem>
            <Select class="w200" clearable placeholder="选择阶段状态" v-model="finishSearch.status">
              <Option :value="7">通过保证期</Option>
              <Option :value="8">淘汰</Option>
            </Select>
          </SearchItem>
          <SearchItem>
            <Button type="primary" @click="search('fourth')">查询</Button>
          </SearchItem>
        </div>
        <ManagerView class="talent-manager" ref="fourth" :columns="columns" :searchData="finishSearch" :del="false" :save="null"/>
      </TabPane>
    </Tabs>
  </Card>
</template>

<script>
  import { getUserInfoByKey, getUserId, getStatusRender, getProjectTalentStatus, getDateTime } from "../../../libs/tools";
  import { progressList } from "../../../api/count";

  export default {
    name: "ProgressRemind",
    data() {
      return {
        status: '1',
        startSearch: {
          type: 1,
          status: null,
          roleId: getUserInfoByKey('roleId'),
          userId: getUserId()
        },
        gongJianSearch: {
          type: 2,
          status: null,
          roleId: getUserInfoByKey('roleId'),
          userId: getUserId()
        },
        shouWeiSearch: {
          type: 3,
          status: null,
          roleId: getUserInfoByKey('roleId'),
          userId: getUserId()
        },
        finishSearch: {
          type: 4,
          status: null,
          roleId: getUserInfoByKey('roleId'),
          userId: getUserId()
        },
        columns: [
          {
            title: '项目名称',
            align: 'center',
            key: 'projectName',
            render: (h, params) => {
              if (getUserInfoByKey('roleId') == 3) {
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
                      this.$router.push({ path: '/project/project-detail', query: {id: params.row.projectId}});
                    }
                  }
                }, params.row.projectName);
              } else {
                return h('span', params.row.projectName);
              }
            }
          },
          {
            title: '人才名称',
            key: 'talentName',
            align: 'center',
            render: (h, params) => {
              return h('div', {
                class: {
                  talent: !!params.row.followUserId
                }
              }, [
                h('Button', {
                  props: {
                    type: 'text',
                    size: 'small'
                  },
                  class: {
                    'cl-primary': true,
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/talent/talent-detail', query: {id: params.row.talentId}});
                    }
                  }
                }, params.row.talentName)
              ]);
            }
          },
          {
            title: '人才状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.talentStatus);
            }
          },
          {
            title: '项目进展状态',
            align: 'center',
            render: (h, params) => {
              return getProjectTalentStatus(h, params.row.projectStatus);
            },
          },
          {
            title: '首推时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.firstApplyTime));
            }
          },
          {
            title: '预计完成时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.finishTime));
            }
          },
          {
            title: '建立人',
            align: 'center',
            key: 'createUser'
          },
          {
            title: '建立时间',
            align: 'center',
            render: (h, params) => {
              return h('span', getDateTime(params.row.createTime));
            }
          }
        ],
        startStatus: [{
          title: '阶段状态',
          align: 'center',
          render: (h, params) => {
            return h('span', new Date(params.row.firstApplyTime) > new Date() ? !!params.row.remindCount ? '进展中' : '停滞中' : '缓慢')
          }
        }],
        gongJianStatus: [{
          title: '阶段状态',
          align: 'center',
          render: (h, params) => {
            return h('span', new Date(params.row.finishTime) > new Date() ? '进展中' : '缓慢');
          }
        }]
      }
    },
    methods: {
      search(refKey) {
        this.$refs[refKey].emitManagerHandler(3, {
          unFresh: false
        })
      }
    },
    created() {
      const {type, status} = this.$route.query || {};
      if (type) this.status = type;
      if (status) {
        switch (Number(type)) {
          case 1: this.startSearch.status = Number(status); break;
          case 2: this.gongJianSearch.status = Number(status); break;
          case 3: this.shouWeiSearch.status = Number(status); break;
          case 4: this.finishSearch.status = Number(status); break;
        }
      }
    },
    provide() {
      return {
        handlers: {
          search: progressList
        }
      }
    }
  }
</script>

<style scoped>

</style>
