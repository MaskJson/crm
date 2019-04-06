<template>
  <Card>
    <div>
      <SearchItem>
        <Input v-model="searchParams.name" placeholder="总监姓名" :clearable="true" class="w200"/>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="search">搜索</Button>
      </SearchItem>
    </div>
    <ManagerView
      ref="manager"
      :del="false"
      :save="null"
      :searchData="searchParams"
      :columns="columns"
      @on-success="successHandler"
      @on-error="errorHandler"
    />
    <ModalUtil ref="info" title="查看团队成员" :footerHide="true">
      <Tree :data="tree"/>
    </ModalUtil>
    <ModalUtil ref="edit" title="编辑团队" :width="720" @on-ok="save" :loading="show" @reset="resetEntity">
      <Form :label-width="80">
        <FormItem label="项目经理：" class="mb-5">
          <Checkbox v-for="(item, index) of pms" :key="'pm' + index" :label="item.checked" v-model="item.checked">{{ item.nickName }}</Checkbox>
        </FormItem>
        <FormItem label="高级顾问：" class="mb-5">
          <Checkbox v-for="(item, index) of ipls" :key="'ipl' + index" :label="item.checked" v-model="item.checked">{{ item.nickName }}</Checkbox>
        </FormItem>
        <FormItem label="中级顾问：" class="mb-5">
          <Checkbox v-for="(item, index) of mpls" :key="'mpl' + index" :label="item.checked" v-model="item.checked">{{ item.nickName }}</Checkbox>
        </FormItem>
        <FormItem label="兼职：" class="mb-5">
          <Checkbox v-for="(item, index) of pts" :key="'pt' + index" :label="item.checked" v-model="item.checked">{{ item.nickName }}</Checkbox>
        </FormItem>
        <p class="mt-5 mb-5 cl-error">中级顾问和兼职没有下级成员</p>
        <p class="cl-primary" v-show="pms.filter(item => item.checked).length">项目经理：</p>
        <FormItem v-show="item.checked" v-for="(item, index) of pms" :key="'pm_check' + index" :label="item.nickName + '：'" class="mb-5">
          <CheckboxGroup v-model="item.children">
            <Checkbox v-for="(item, index) of pls" :key="'pl1' + index" :label="item.id">{{ item.nickName }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
        <p class="cl-primary" v-show="ipls.filter(item => item.checked).length">高级顾问：</p>
        <FormItem v-show="item.checked" v-for="(item, index) of ipls" :key="'ipl_check' + index" :label="item.nickName + '：'" class="mb-5">
          <CheckboxGroup v-model="item.children">
            <Checkbox v-for="(item, index) of pls" :key="'pl1' + index" :label="item.id">{{ item.nickName }}</Checkbox>
          </CheckboxGroup>
        </FormItem>
      </Form>
    </ModalUtil>
  </Card>
</template>

<script>
  import { globalSearch, toggleShow, getRoleName } from "../../../libs/tools";
  import { getTeamList, getTeamManagerUsers, getTeamMembers, save, getTeamMembersWithInfo } from "../../../api/team";

  export default {
    name: "TeamManage",
    data() {
      return {
        show: false,
        searchParams: {
          name: ''
        },
        // 编辑提交使用列表
        pms: [],
        ipls: [],
        mpls: [],
        pts: [],
        // 顾问和助理
        pls: [],
        // 树形结构
        tree: [],
        entity: {
          id: null, // teamId,
          userId: null // userId
        },
        modalType: true, // 默认为编辑 false 为查看详情
        columns: [
          {
            title: '用户ID',
            align: 'center',
            key: 'id'
          },
          {
            title: '团队总监',
            align: 'center',
            key: 'nickName'
          },
          {
            title: '团队人数',
            align: 'center',
            render: (h, params) => {
              const count = params.row.count;
              return h('span', count ? count : '暂无团队');
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              if (params.row.teamId) {
                return h('div', [
                  h('Button', {
                    props: {
                      size: 'small'
                    },
                    class: {
                      'mr-5': true
                    },
                    on: {
                      click: () => {
                        this.searchInfo(false, params.row.teamId);
                      }
                    }
                  }, '查看团队详情'),
                  h('Button', {
                    props: {
                      size: 'small',
                      type: 'primary'
                    },
                    on: {
                      click: () => {
                        this.entity = {
                          id: params.row.teamId,
                          userId: params.row.id
                        };
                        this.searchInfo(true, params.row.teamId);
                      }
                    }
                  }, '编辑团队'),
                ])
              } else {
                return h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.entity = {
                        id: null,
                        userId: params.row.id
                      };
                      toggleShow(this, 'edit');
                    }
                  }
                }, '创建团队');
              }
            }
          }
        ]
      }
    },
    methods: {
      search() {
        globalSearch(this);
      },
      // 重置数据
      resetEntity() {
        this.entity = {
          id: null,
          userId: null,
        };
        const brr = ['pms', 'ipls', 'mpls', 'pts'];
        brr.forEach(key => {
          this[key].forEach(item => {
            item.checked = false;
            item.children = [];
          });
        });
      },
      searchInfo(flag, id) {
        const handlerKey = flag ? 'getInfo' : 'tree';
        this.$refs['manager'].emitManagerHandler(handlerKey, { unFresh: true, params: {id}});
      },
      // 编辑提交
      save() {
        const keys = ['pms', 'ipls', 'mpls', 'pts'];
        const teamObj = {};
        keys.forEach((key, index) => {
          teamObj[key] = this[key].filter(item => item.checked).map(item => {
            if (index < 2) {
              return {
                userId: item.id,
                children: JSON.stringify(item.children)
              };
            } else {
              return item.id;
            }
          })
        });
        if (!teamObj['pms'].length && !teamObj['ipls'].length && !teamObj['mpls'].length && !teamObj['pts'].length) {
          this.$Message.error('团队成员不能为空');
          return;
        }
        this.show = true;
        this.$refs['manager'].emitManagerHandler('save', {
          params: {
            ...this.entity,
            ...teamObj
          }
        });
      },
      successHandler(type, data) {
        this.show = false;
        if (type == 'getInfo') {
          // 团队编辑操作
          const members = data || [];
          const keys = ['pms', 'ipls', 'mpls', 'pts'];
          keys.forEach((key, index) => {
            const arr = members.filter(item => item.level == (index + 2));
            // 过滤团队成员，显示复选框
            this[key].forEach(item => {
              const index = arr.findIndex(item2 => item2.userId == item.id);
              // 若存在
              if (index > -1) {
                item.checked = true;
                item.children = members.filter(m => m.parentId == arr[index].id).map(item => item.userId);
              }
            });
          });
          toggleShow(this, 'edit');
        } else if (type == "tree") {
          const arr = data || [];
          const members = arr.filter(item => !!item.level);
          members.forEach(item => {
            item.title = item.nickName + '--' + getRoleName(item.level);
            item.expand = true;
            if (item.level < 4) {
              item.children = arr.filter(child => child.parentId == item.id).map(item => {
                return {
                  title: item.nickName
                }
              });
            }
          });
          this.tree = [
            {
              title: '项目经理+高级顾问+中级顾问+兼职',
              expand: true,
              children: members
            }
          ];
          toggleShow(this, 'info');
        } else if (type == 'save') {
          toggleShow(this, 'edit', false);
        }
      },
      errorHandler() {
        this.show = false;
      }
    },
    provide() {
      return {
        handlers: {
          search: getTeamList,
          getInfo: getTeamMembers,
          save: save,
          tree: getTeamMembersWithInfo
        }
      }
    },
    created() {
      getTeamManagerUsers({}).then(data => {
        const users = data || [];
        users.forEach(item => {
          item.checked = false;
          item.children = [];
        });
        this.pms = users.filter(item => item.roleId == 2);
        this.ipls = users.filter(item => item.roleId == 6);
        this.mpls = users.filter(item => item.roleId == 7);
        this.pts = users.filter(item => item.roleId == 8);
        this.pls = users.filter(item => item.roleId == 4 || item.roleId == 5);
      }).catch(data => {})
    }
  }
</script>

<style scoped>

</style>
