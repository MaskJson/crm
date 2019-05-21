<template>
  <Card>
    <Tabs v-model="status" :animated="false">
      <TabPane :label="`我的人才地图（${list.length}）`" name="0"></TabPane>
      <TabPane :label="`收藏的人才地图（${folderList.length}）`" name="2"></TabPane>
      <TabPane :label="`推荐的人才地图（${statusList.filter(item => item.status == 1).length}）`" name="1"></TabPane>
      <TabPane :label="`面试的人才地图（${statusList.filter(item => item.status == 3).length}）`" name="3"></TabPane>
      <TabPane :label="`offer人才地图（${statusList.filter(item => item.status == 4).length}）`" name="4"></TabPane>
      <TabPane :label="`成功人才地图（${statusList.filter(item => item.status == 7).length}）`" name="7"></TabPane>
    </Tabs>
    <div class="mt-20">
      <Collapse v-if="treeMap.length > 0">
        <Panel v-for="(c, indexC) of treeMap" :name="'customer' + indexC" :key="'customer' + indexC">
          {{c.name}}{{` (${c.zsCount}/${c.allCount})`}}
          <div slot="content">
            <Collapse :key="'collapse' + indexC">
              <Panel v-for="(d, indexD) of c.children" :name="'department' + indexD" :key="'department' + indexD">
                {{d.name}}{{` (${d.zsCount}/${d.allCount})`}}
                <div slot="content">
                  <Table class="talent-manager " :columns="columns" :data="d.children" border></Table>
                </div>
              </Panel>
            </Collapse>
          </div>
        </Panel>
      </Collapse>
      <div class="center pd-40" v-else>暂无相关人才</div>
    </div>
    <SpinUtil :show="show"/>
    <TalentRemind ref="remind" :talentProjects="talentProjects" :talentType="talentType" :talentId="talentId" :offerCount="offerCount" :followRemindId="followRemindId" @on-ok="okHandler"/>
  </Card>
</template>

<script>
  import { talentMap, folderTalent, statusTalent } from "../../../api/count";
  import { toggleType } from "../../../api/talent";
  import { getUserId, getStatusRender, getRenderList, getDateTime, toggleShow } from "../../../libs/tools";
  import TalentRemind from './../../components/TalentRemind';
  export default {
    name: "TalentMap",
    components: {
      TalentRemind
    },
    data() {
      return {
        show: false,
        userId: getUserId(),
        status: '0',
        offerCount: 0,
        talentProjects: [],
        talentType: null,
        talentId: null,
        followRemindId: null,
        list: [], // 所有相关人才
        statusList: [], // 经历过各个状态的
        folderList: [], // 收藏的人才,
        columns: [
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
                      this.$router.push('/talent/talent-detail?id=' + params.row.talentId);
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
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '职位',
            align: 'center',
            render: (h, params) => {
              return h('span', (params.row.info || {}).position)
            }
          },
          {
            title: '最近跟踪记录',
            align: 'center',
            render: (h, params) => {
              const remind = params.row.remind;
              if (remind && remind.type){
                let str = '';
                switch (remind.type) {
                  case 1:
                    str = `${remind.remark}--${getDateTime(remind.createUser)}`;
                    break;
                  case 2:
                    str = `${remind.situation}--${remind.cause}--${remind.salary}--${getDateTime(remind.createUser)}`;
                    break;
                  case 3:
                    str = `${getDateTime(remind.meetTime)}--${remind.meetAddress}--${remind.situation}--${remind.cause}${remind.salary}--${getDateTime(remind.createUser)}`;
                    break;
                }
                return h('span', str);
              } else {
                return h('span', '');
              }
            }
          },
          {
            title: '跟踪时间',
            align: 'center',
            render: (h, params) => {
              const remind = params.row.remind;
              if (remind && remind.type){
                return h('span', getDateTime(remind.createTime));
              }
            }
          },
          {
            title: '操作',
            align: 'center',
            render: (h, params) => {
              const {projects, progress, followUserId, talentId, talentType, offerCount} = params.row;
              const btn = [];
              btn.push(
                h('Button', {
                  props: {
                    type: 'primary',
                    size: 'small',
                    disabled: progress>0 && (!!followUserId && followUserId != getUserId())
                  },
                  on: {
                    click: () => {
                      this.talentProjects = projects;
                      this.talentId = talentId;
                      this.talentType = talentType;
                      this.offerCount = offerCount;
                      if (!!params.row.followRemind) {
                        this.followRemindId = params.row.followRemind.id;
                      } else {
                        this.followRemindId = null;
                      }
                      toggleShow(this, 'remind');
                    }
                  }
                }, '常规跟踪')
              );
              if (!followUserId) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.show = true;
                        toggleType({
                          id: params.row.id,
                          userId: this.userId,
                          flag: true
                        }).then(data => {
                          this.show = false;
                          params.row.followUserId = this.userId;
                          this.toggleCallBack(params.row.id, true);
                        }).catch(data => {
                          this.show = false;
                        });
                      }
                    }
                  }, '设为专属')
                )
              }
              if (followUserId == this.userId) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        toggleType({
                          id: params.row.id,
                          userId: this.userId,
                          flag: false
                        }).then(data => {
                          this.show = false;
                          params.row.followUserId = null;
                          this.toggleCallBack(params.row.id, false);
                        }).catch(data => {
                          this.show = false;
                        });
                      }
                    }
                  }, '取消专属')
                )
              }
              return h('div', btn);
            }
          }
        ],
        projectColumns: [

        ]
      }
    },
    // 根据状态从数据中过滤出树状所需数据
    computed: {
      map() {
        if (this.status == 0) {
          return this.list;
        } else if (this.status == 2) {
          return this.folderList;
        } else {
          return this.statusList.filter(item => item.remindStatus == Number(this.status));
        }
      },
      treeMap() {
        const mapCustomers = [];
        this.map.forEach(item => {
          const info = item.info || {};
          const index = mapCustomers.findIndex(c => c.id == info.customerId);
          if (index < 0) {
            const id = info.customerId;
            const cusDepartments = this.map.filter(item => (item.info || {}).customerId == id).map(item => {return {departmentId: item.departmentId, departmentName: item.departmentName }});
            const departmentsSet = [];
            // 公司部门去重
            cusDepartments.forEach(item => {
              let flag = true;
              departmentsSet.forEach(d => {
                if (d.departmentId == item.departmentId) {
                  flag = false;
                }
              });
              if (flag) {
                departmentsSet.push(item);
              }
            });
            let custAllCount = 0;
            let custZsCount = 0;
            const departments = departmentsSet.map(item => {
              const children = this.map.filter(talent => (talent.info || {}).departmentId == item.departmentId);
              const allCount = children.length;
              const zsCount = children.filter(item => !!item.followUserId).length;
              custAllCount = custAllCount + allCount;
              custZsCount = custZsCount + zsCount;
              return {
                name: item.departmentName,
                allCount,
                zsCount,
                children
              }
            });
            mapCustomers.push({
              id,
              allCount: custAllCount,
              zsCount: custZsCount,
              name: item.customerName,
              children: departments
            })
          }
        });
        return mapCustomers;
      }
    },
    methods: {
      toggleCallBack(id, flag) {
        const arr = this.status == 0 ? this.list : this.status == 2 ? this.folderList : this.statusList;
        const len = arr.length;
        for (let i=0; i<len; i++) {
          if (arr[i].talentId == id) {
            const obj = {...arr[i]};
            obj.followUserId = flag ? this.userId : null
            arr.splice(i, 1, obj);
            break;
          }
        }
      },
      okHandler() {
        switch (this.status) {
          case '0': this.getTalentMap();break;
          case '2': this.getFolderTalentMap();break;
          case '1':
          case '3':
          case '4':
          case '7': this.getProjectTalentMap();break;
        }
      },
      getTalentMap() {
        this.show = true;
        talentMap({ userId: getUserId() }).then(data => {
          this.show = false;
          data = data || [];
          data.forEach(item => {
            item.talentId = item.id;
            Object.assign(item, item.info);
          });
          this.list = data;
        }).catch(data => {this.show = false;})
      },
      getFolderTalentMap() {
        folderTalent({ userId: getUserId() }).then(data => {
          data = data || [];
          data.forEach(item => {
            item.talentId = item.id;
            Object.assign(item, item.info);
          });
          this.folderList = data;
        }).catch(data => {})
      },
      getProjectTalentMap() {
        statusTalent({userId: getUserId()}).then(data => {
          data = data || [];
          data.forEach(item => {
            Object.assign(item, item.info);
          });
          this.statusList = data;
        }).catch(data => {});
      }
    },
    created() {
      this.getTalentMap();
      this.getFolderTalentMap();
      this.getProjectTalentMap();
    }
  }
</script>

<style scoped>

</style>
