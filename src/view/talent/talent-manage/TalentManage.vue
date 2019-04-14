<template>
  <Card>
    <div>
      <SearchItem>
        <Cascader placeholder="城市" v-model="searchData.city" :data="cityList" class="w200"></Cascader>
      </SearchItem>
      <SearchItem>
        <Input placeholder="姓名" class="w200" v-model="searchData.name"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="行业" class="w200" v-model="searchData.industry"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="职能" class="w200" v-model="searchData.aptness"/>
      </SearchItem>
      <SearchItem>
        <Select placeholder="收藏夹" class="w200" v-model="searchData.folderId">
          <Option v-for="(item, index) of folders" :value="item.id" :key="index">{{`${item.name}(${item.remark})`}}</Option>
        </Select>
      </SearchItem>
      <SearchItem>
        关注状态：
        <RadioGroup v-model="searchData.follow">
          <Radio :label="0">全部</Radio>
          <Radio :label="1">已关注</Radio>
          <Radio :label="2">未关注</Radio>
        </RadioGroup>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="search">查询</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="resetSearch">重置查询条件</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" @click="showFavoriteSetting = true">客户收藏夹管理</Button>
      </SearchItem>
    </div>
    <ManagerView class="talent-manager" ref="manager" :del="false" :save="{save: true}" route="/talent/talent-edit" :columns="columns" :searchData="searchParams"/>
    <Drawer :width="360" title="人才收藏夹管理" :closable="false" v-model="showFavoriteSetting">
      <favorite-setting :type="2" @on-change="setFolders"/>
    </Drawer>
    <!--  添加跟踪记录 -->
    <ModalUtil ref="remind" title="添加跟踪记录" @reset="resetRemind" @on-ok="addRemind" :loading="show">
      <Form ref="addRemind" :model="remind" :rules="remindRule" :label-width="120">
        <FormItem label="本次跟踪类别" prop="type">
          <Select v-model="remind.type">
            <Option :value="1">电话</Option>
            <Option :value="2">顾问面试（内）</Option>
            <Option :value="3">顾问面试（外）</Option>
          </Select>
        </FormItem>
        <FormItem label="沟通记录" v-if="remind.type == 1" class="ivu-form-item-required">
          <Input type="textarea" :rows="3" v-model="remind.remark"/>
        </FormItem>
        <div v-if="remind.type == 2">
          <FormItem label="候选人基本情况" class="ivu-form-item-required">
            <Input type="textarea" :rows="3" v-model="remind.situation"/>
          </FormItem>
          <FormItem label="求职方向不离职原因" class="ivu-form-item-required">
            <Input type="textarea" :rows="3" v-model="remind.cause"/>
          </FormItem>
          <FormItem label="薪资架构" class="ivu-form-item-required">
            <Input v-model="remind.salary"/>
          </FormItem>
        </div>
        <div v-if="remind.type == 3">
          <FormItem label="面试时间" prop="meetTime" class="ivu-form-item-required">
            <DatePicker type="datetime" placeholder="日期" v-model="remind.meetTime"></DatePicker>
          </FormItem>
          <FormItem label="面试地点" prop="meetAddress" v-if="[2,3].indexOf(remind.type) > -1" class="ivu-form-item-required">
            <Input v-model="remind.meetAddress"/>
          </FormItem>
        </div>
        <FormItem label="人才状态：" prop="status">
          <Select v-model="remind.status">
            <Option v-for="(item, index) of talentStatus" :key="'status' + index" :value="item.value">{{ item.label }}</Option>
          </Select>
        </FormItem>
        <FormItem label="下次跟踪类别" prop="remindTypeId">
          <Select v-model="remind.nextType">
            <Option :value="0">请选择</Option>
            <Option :value="1">电话</Option>
            <Option :value="2">顾问面试（内）</Option>
            <Option :value="3">顾问面试（外）</Option>
          </Select>
        </FormItem>
        <FormItem label="下次联系时间" prop="remindTime" >
          <DatePicker type="datetime" placeholder="日期" v-model="remind.nextRemindTime"></DatePicker>
        </FormItem>
        <!--<FormItem label="提醒对象" prop="adviserId">-->
        <!--<Select v-model="remind.adviserId" placeholder="请选择">-->
        <!--<Option v-for="(user, index) of teamUserList" :value="user.id" :key="'user'+index">{{user.name}}</Option>-->
        <!--</Select>-->
        <!--</FormItem>-->
      </Form>
    </ModalUtil>
    <!--  推荐到项目  -->
    <ModalUtil ref="project" title="推荐项目" @reset="resetProjectTalent" @on-ok="addProjectTalent" :loading="show">
      <Form ref="projectTalent" :model="projectTalent" :rules="projectTalentRule" :label-width="100">
        <FormItem label="人才：">
          {{ talentName }}
        </FormItem>
        <FormItem label="项目：">
          <Select v-model="projectTalent.projectId" placeholder="请选择项目">
            <Option v-for="(item, index) of projectFilter" :value="item.id" :key="'project' + index">{{ item.name }}</Option>
          </Select>
        </FormItem>
      </Form>
    </ModalUtil>
  </Card>
</template>

<script>
  import { jsonArray, getCity, globalSearch, getStatusRender, getUserId, toggleShow } from "../../../libs/tools";
  import { list, toggleFollow, toggleType, addRemind } from "../../../api/talent";
  import cityList from '../../../libs/cityList';
  import FavoriteSetting from '../../components/favorite-setting';
  import { addProjectTalent } from "../../../api/project";
  import { getListByTableName } from "../../../api/common";

  export default {
    name: "TalentManage",
    components: {
      FavoriteSetting
    },
    computed: {
      searchParams() {
        const { name, industry, aptness, folderId, city, follow } = this.searchData;
        return {
          aptness,
          name,
          industry,
          folderId,
          city: city.length ? JSON.stringify(city) : null,
          follow: follow == 0 ? null : follow == 1
        }
      },
      projectFilter() {
        return this.projects.filter(item => this.talentProjects.indexOf(item.id) < 0);
      }
    },
    data() {
      return {
        userId: null,
        show: false,
        showFavoriteSetting: false,
        cityList: cityList,
        folders: [],
        searchData: {
          aptness: null,
          name: null,
          folderId: null,
          industry: null,
          city: [],
          follow: 0
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
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
                }, params.row.name)
              ]);
            }
          },
          {
            title: '职能',
            align: 'center',
            key: 'aptness',
            render: (h, params) => {
              const aptness = jsonArray(params.row.aptness);
              return h('span', aptness ? aptness.join('、'): '--')
            }
          },
          {
            title: '行业',
            align: 'center',
            key: 'industry',
            render: (h, params) => {
              const industry = jsonArray(params.row.industry);
              return h('span', industry ? industry.join('、'): '--')
            }
          },
          {
            title: '城市',
            align: 'center',
            key: 'city',
            render: (h, params) => {
              return getCity(h, params.row.city);
            }
          },
          {
            title: '年薪',
            align: 'center',
            key: 'salary'
          },
          {
            title: '手机号',
            align: 'center',
            key: 'phone'
          },
          {
            title: '标签',
            align: 'center',
            key: 'tag'
          },
          {
            title: '状态',
            align: 'center',
            render: (h, params) => {
              return getStatusRender(h, params.row.status);
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 300,
            render: (h, params) => {
              const { followUserId } = params.row;
              const btn = [
                h('Button', {
                  class: {
                    'mr-5': true
                  },
                  props: {
                    size: 'small'
                  },
                  on: {
                    click: () => {
                      this.$router.push({ path: '/talent/talent-detail', query: {id: params.row.id}});
                    }
                  }
                }, '查看详情'),
              ];
              if (!followUserId || followUserId == this.userId) {
                btn.push(
                  h('Button', {
                    class: {
                      'mr-5': true
                    },
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$router.push({ path: '/talent/talent-edit', query: {id: params.row.id}});
                      }
                    }
                  }, '编辑'),
                  h('Button', {
                    class: {
                      'mr-5': true
                    },
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$refs['manager'].emitManagerHandler('toggle', {
                          params: {
                            id: params.row.id,
                            follow: !params.row.follow
                          }
                        });
                      }
                    }
                  }, params.row.follow ? '取消关注' : '关注'),
                )
              }
              if (!followUserId) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'warning',
                      size: 'small'
                    },
                    on: {
                      click: () => {
                        this.$refs['manager'].emitManagerHandler('toggleType', {
                          params: {
                            id: params.row.id,
                            userId: this.userId,
                            flag: true
                          }
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
                        this.$refs['manager'].emitManagerHandler('toggleType', {
                          params: {
                            id: params.row.id,
                            userId: this.userId,
                            flag: false
                          }
                        });
                      }
                    }
                  }, '取消专属')
                )
              }
              if (!followUserId || followUserId == this.userId || !params.row.projects || !params.row.projects.length) {
                btn.push(
                  h('Button', {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    class: {
                      'ml-5': true
                    },
                    on: {
                      click: () => {
                        this.remind.talentId = params.row.id;
                        toggleShow(this, 'remind');
                      }
                    }
                  }, '常规跟踪')
                )
              }
              btn.push(
                h('Button',{
                  props: {
                    size: 'small'
                  },
                  class: {
                    'ml-5': true
                  },
                  on: {
                    click: () => {
                      this.talentProjects = params.row.projects || [];
                      this.projectTalent.talentId = params.row.id;
                      this.talentName = params.row.name;
                      toggleShow(this, 'project');
                    }
                  }
                }, '推荐')
              );
              return h('div', btn);
            }
          }
        ],
        talentName: null,
        remind: { // 添加提醒条件
          type: null, // 本次跟踪类别
          status: null, // 人才状态
          remark: '', // 跟踪记录
          nextType: null, // 下次跟踪类别
          nextRemindTime: null, // 下次沟通时间
          situation: '', // 候选人基本情况
          cause: '', // 不离职原因
          salary: '', // 薪资架构
          meetTime: null, // 面试时间
          meetAddress: null, // 面试地点
          talentId: null,
          followRemindId: null,
          customerId: null
        },
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择类型', trigger: 'change' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择状态', trigger: 'change' }
          ],
        },
        projectTalent: {
          createUserId: getUserId(),
          talentId: null,
          projectId: null,
          status: 0,
          type: 1
        },
        projectTalentRule: {
          projectId: [
            { required: true, type: 'number', message: '请选择项目', trigger: 'change' }
          ],
        },
        projects: [], // 所有项目
        talentProjects: [], // 当前人才已关联的项目
      }
    },
    methods: {
      resetProjectTalent() {
        this.projectTalent = {
          createUserId: getUserId(),
          talentId: null,
          projectId: null,
          status: 0,
          type: 1
        }
        this.$refs['projectTalent']
      },
      resetRemind() {
        this.remind = {
          type: null, // 本次跟踪类别
          status: null, // 人才状态
          remark: '', // 跟踪记录
          nextType: null, // 下次跟踪类别
          nextRemindTime: null, // 下次沟通时间
          situation: '', // 候选人基本情况
          cause: '', // 不离职原因
          salary: '', // 薪资架构
          meetTime: null, // 面试时间
          meetAddress: null, // 面试地点
          talentId: null,
          followRemindId: null,
          customerId: null
        };
      },
      setFolders(list) {
        this.folders = list;
      },
      resetSearch() {
        this.searchData = {
          aptness: null,
          name: null,
          folderId: null,
          industry: null,
          city: [],
          follow: 0
        }
      },
      search() {
        globalSearch(this);
      },
      addRemind() {
        this.$refs['addRemind'].validate(valid => {
          if (valid) {
            const talentType = this.entity.type;
            const params = this.remind;
            if (params.type == 1 && !params.remark) {
              this.$Message.warning('电话面试需要填写沟通记录');
              return false;
            }
            if (params.type == 2 && (!params.salary || !params.situation || !params.cause)) {
              this.$Message.warning('室内面试需要填写候选人基本情况、不离职原因和薪资架构');
              return false;
            }
            if (params.type == 3 && (!params.meetTime || !params.meetAddress || !params.salary || !params.situation || !params.cause)) {
              this.$Message.warning('室外面试需要填写面试时间、地点、基本情况、离职原因和薪资架构');
              return false;
            }
            if ((params.nextRemindTime || params.nextType) && (!params.nextRemindTime || !params.nextType)) {
              this.$Message.warning('设置下次跟踪，类别和时间需填写完整');
              return false;
            }
            if (talentType == 1 && (!params.nextType || !params.nextRemindTime)) {
              this.$Message.warning('专属人才必须选择下次跟踪类别和时间');
              return false;
            }
            params.talentId = this.entity.id;
            params.createUserId = getUserId();
            this.show = true;
            addRemind(params).then(data => {
              this.show = false;
              toggleShow(this, 'remind', false);
              this.getAllRemind(this.entity.id);
            }).catch(data => { this.show = false; })
          }
        })
      },
      addProjectTalent() {
        this.$refs['projectTalent'].validate(valid => {
          if (valid) {
            this.show = true;
            addProjectTalent(this.projectTalent).then(data => {
              this.show = false;
              toggleShow(this, 'project', false);
            }).catch(data => {this.show = false});
          }
        })
      }
    },
    provide() {
      return {
        handlers: {
          search: list,
          toggle: toggleFollow,
          toggleType: toggleType
        }
      }
    },
    created() {
      this.userId = getUserId();
      getListByTableName({ type: 3 }).then(data => {
        this.projects = data || [];
      }).catch(data => {});
    }
  }
</script>

<style scoped>

</style>
