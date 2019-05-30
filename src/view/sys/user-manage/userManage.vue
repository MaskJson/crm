<template>
  <div class="search">
    <Row>
      <Col>
        <Card>
          <Row>
            <Form ref="searchForm" :model="searchForm" inline :label-width="70" class="search-form">
              <Form-item label="用户名" prop="username">
                <Input type="text" v-model="searchForm.username" clearable placeholder="请输入用户名" style="width: 200px"/>
              </Form-item>

                <!--<Form-item label="用户类型" prop="type">-->
                  <!--<Select v-model="searchForm.type" placeholder="请选择" clearable style="width: 200px">-->
                    <!--<Option value="0">普通用户</Option>-->
                    <!--<Option value="1">管理员</Option>-->
                  <!--</Select>-->
                <!--</Form-item>-->
                <!--<Form-item label="用户状态" prop="status">-->
                  <!--<Select v-model="searchForm.status" placeholder="请选择" clearable style="width: 200px">-->
                    <!--<Option value="0">正常</Option>-->
                    <!--<Option value="-1">禁用</Option>-->
                  <!--</Select>-->
                <!--</Form-item>-->
                <Form-item label="创建时间">
                  <DatePicker v-model="selectDate" type="daterange" format="yyyy-MM-dd" clearable
                    @on-change="selectDateRange" placeholder="选择起始时间"
                    style="width: 200px"></DatePicker>
                </Form-item>
              <Button @click="handleSearch" type="primary" icon="ios-search" class="mr-10">搜索</Button>
              <Button @click="handleReset">重置</Button>
            </Form>
          </Row>
          <Row class="operation">
            <Button @click="add" type="primary" icon="md-add">添加用户</Button>
            <!--<Button @click="delAll" icon="md-trash">批量删除</Button>-->
            <circleLoading v-if="operationLoading"/>
          </Row>
          <Row>
            <Alert show-icon>
              已选择 <span class="select-count">{{selectCount}}</span> 项
              <a class="select-clear" @click="clearSelectAll">清空</a>
            </Alert>
          </Row>
          <Row>
            <Table :loading="loading" border :columns="columns" :data="data" sortable="custom"
                   @on-sort-change="changeSort" @on-selection-change="showSelect" ref="table"></Table>
            <Table :columns="columns" :data="exportData" ref="exportTable" style="display:none"></Table>
          </Row>
          <Row type="flex" justify="end" class="page">
            <Page :current="searchForm.page" :total="total" :page-size="searchForm.size"
                  @on-change="changePage" @on-page-size-change="changePageSize" :page-size-opts="[10,20,50]"
                  size="small" show-total show-elevator show-sizer></Page>
          </Row>
        </Card>
      </Col>
    </Row>
    <Modal :title="modalTitle" v-model="userModalVisible" :mask-closable='false' :width="500" :styles="{top: '30px'}">
      <Form ref="userForm" :model="userForm" :label-width="70" :rules="userFormValidate">
        <FormItem label="用户名" prop="username">
          <Input v-model="userForm.username" autocomplete="off"/>
        </FormItem>
        <FormItem label="姓名" prop="nickName">
          <Input v-model="userForm.nickName" autocomplete="off"/>
        </FormItem>
        <FormItem label="密码" prop="password" v-if="modalType===0" :error="errorPass">
          <Input type="password" v-model="userForm.password" autocomplete="off"/>
        </FormItem>
        <!--<FormItem label="用户类型" prop="type">-->
          <!--<Select v-model="userForm.type" placeholder="请选择">-->
            <!--<Option :value="0">普通用户</Option>-->
            <!--<Option :value="1">管理员</Option>-->
          <!--</Select>-->
        <!--</FormItem>-->
        <!--:disabled="!!userForm.id"-->
        <FormItem label="角色分配" prop="roleId" v-show="!!userForm.id">
          <Select v-model="userForm.roleId" >
            <Option v-for="item in roleList" :value="item.id" :key="'role-' + item.id" :label="item.roleName">
              <!-- <div style="display:flex;flex-direction:column"> -->
              <span style="margin-right:10px;">{{ item.roleName }}</span>
              <span style="color:#9c9c9c;">{{ item.description }}</span>
              <!-- </div> -->
            </Option>
          </Select>
        </FormItem>
      </Form>
      <div slot="footer">
        <Button type="text" @click="cancelUser">取消</Button>
        <Button type="primary" :loading="submitLoading" @click="submitUser">提交</Button>
      </div>
    </Modal>
    <Modal title="图片预览" v-model="viewImage" :styles="{top: '30px'}" draggable>
      <img :src="userForm.avatar" alt="无效的图片链接" style="width: 100%;margin: 0 auto;display: block;">
      <div slot="footer">
        <Button @click="viewImage=false">关闭</Button>
      </div>
    </Modal>
    <ModalUtil ref="connect" title="人员交接" @on-ok="connectHandler" :loading="show" @reset="resetConnect">
      <Form ref="connectForm" :label-width="120">
        <FormItem label="离职人："><span>{{leaveUserName}}</span></FormItem>
        <FormItem label="交接人：" class="ivu-form-item-required">
          <Select placeholder="请选择交接人" v-model="connect.connectUserId">
            <Option v-for="(item, index) of userFileter" :value="item.id" :key="'user' + index">{{item.nickName}}</Option>
          </Select>
        </FormItem>
      </Form>
    </ModalUtil>
    <ModalUtil ref="password" title="修改密码" @on-ok="changePassword" :loading="show">
      <Form ref="changePassword" :label-width="100" :model="password" :rules="passwordRule">
        <FormItem label="用户：">
          <span>{{changePasswordNickName}}</span>
        </FormItem>
        <FormItem label="密码：" prop="password1">
          <Input placeholder="请输入密码" v-model="password.password1"/>
        </FormItem>
        <FormItem label="密码确认：" prop="password2">
          <Input placeholder="请再次确认密码" v-model="password.password2"/>
        </FormItem>
      </Form>
    </ModalUtil>
  </div>
</template>

<script>
  import {
    addUser,
    deleteUser,
    disableUser,
    editUser,
    enableUser,
    getAllRoleList,
    getAllUserData,
    getUserListData,
    initDepartment,
    loadDepartment,
    changePassword2
  } from '@/api/index'
  import { toggleShow } from "../../../libs/tools";
  import circleLoading from '../../my-components/circle-loading.vue'
  import moment from 'moment'
  import md5 from 'js-md5';
  import { getTeamManagerUsers, connectMember} from "../../../api/team";

  export default {
    name: 'user-manage',
    components: {
      circleLoading
    },
    data () {
      const validatePassword = (rule, value, callback) => {
        if (value.length < 6) {
          callback(new Error('密码长度不得小于6位'))
        } else {
          callback()
        }
      }
      return {
        show: false,
        accessToken: {},
        loading: true,
        operationLoading: false,
        loadingExport: true,
        modalExportAll: false,
        drop: false,
        dropDownContent: '展开',
        dropDownIcon: 'ios-arrow-down',
        selectList: [],
        viewImage: false,
        // department: [],
        // selectDep: [],
        // dataDep: [],
        searchForm: {
          username: null,
          departmentId: '',
          type: null,
          status: null,
          page: 1,
          size: 10,
          sort: 'createTime',
          order: 'desc',
          startDate: '',
          endDate: ''
        },
        selectDate: null,
        modalType: 0,
        userModalVisible: false,
        modalTitle: '',
        userForm: {
          // sex: 1,
          type: 0,
          status: 1,
          nickName: '',
          avatar: 'https://s1.ax1x.com/2018/05/19/CcdVQP.png',
          roleId: null,
          // departmentId: "",
          // departmentTitle: ""
        },
        userRoles: [],
        roleList: [],
        errorPass: '',
        userFormValidate: {
          username: [
            { required: true, message: '账号不能为空', trigger: 'blur' }
          ],
          roleId: [
            { required: true, type: 'number', message: '角色不能为空', trigger: 'change' }
          ]
          // mobile: [
          //   {required: true, message: "手机号不能为空", trigger: "blur"},
          //   {validator: validateMobile, trigger: "blur"}
          // ]
        },
        submitLoading: false,
        columns: [
          // {
          //   type: 'selection',
          //   width: 60,
          //   align: 'center',
          // },
          {
            key: 'id',
            align: 'center',
          },
          {
            title: '用户名',
            key: 'username',
            sortable: true,
          },
          {
            title: '姓名',
            key: 'nickName',
          },
          {
            title: '头像',
            key: 'avatar',
            align: 'center',
            render: (h, params) => {
              return h('Avatar', {
                props: {
                  src: params.row.avatar
                }
              })
            }
          },
          {
            title: '用户角色',
            key: 'role',
            align: 'center',
            render: (h, params) => {
              const role = params.row.role || {};
              return h('span',`${role.roleName}(${role.description})`)
            }
          },
          {
            title: '状态',
            key: 'status',
            align: 'center',
            width: 200,
            render: (h, params) => {
              let re = ''
              if (params.row.status) {
                return h('div', [
                  h(
                    'Tag',
                    {
                      props: {
                        type: 'dot',
                        color: 'success'
                      },
                      on: {
                        click: () => {

                        }
                      }
                    },
                    '正常启用'
                  )
                ])
              } else {
                return h('div', [
                  h(
                    'Tag',
                    {
                      props: {
                        type: 'dot',
                        color: 'error'
                      }
                    },
                    '禁用'
                  )
                ])
              }
            },
          },
          {
            title: '创建时间',
            key: 'createTime',
            sortable: true,
            sortType: 'desc',
            render: (h, params) => {
              if (params.row.createTime) {
                return h('div', moment(params.row.createTime).format('YYYY-MM-DD HH:mm:ss'))
              }
            }
          },
          {
            title: '操作',
            key: 'action',
            // width: 250,
            align: 'center',
            render: (h, params) => {
              const children = [
                h(
                  'Button',
                  {
                    props: {
                      type: 'primary',
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.edit(params.row)
                      }
                    }
                  },
                  '编辑'
                ),
                h(
                  'Button',
                  {
                    props: {
                      size: 'small'
                    },
                    style: {
                      marginRight: '5px'
                    },
                    on: {
                      click: () => {
                        this.enable(params.row.id, !!params.row.status ? 0 : 1, params.row.nickName)
                      }
                    }
                  },
                  !!params.row.status ? '禁用' : '启用'
                ),
                h('Button', {
                  props: {
                    size: 'small',
                    type: 'primary'
                  },
                  on: {
                    click: () => {
                      this.changePasswordNickName = params.row.nickName;
                      this.password = {
                        userId: params.row.id,
                        password1: '',
                        password2: ''
                      };
                      toggleShow(this, 'password');
                    }
                  }
                }, '修改密码')
                // h(
                //   'Button',
                //   {
                //     props: {
                //       type: 'error',
                //       size: 'small'
                //     },
                //     on: {
                //       click: () => {
                //         this.remove([params.row.id])
                //       }
                //     }
                //   },
                //   '删除'
                // )
              ]
              const roleId = params.row.roleId;
              if (roleId != 1 && roleId != 3) {
                children.push(
                  h('Button', {
                    props: {
                      size: 'small',
                      type: 'warning'
                    },
                    on: {
                      click: () => {
                        this.$Modal.confirm({
                          title: '交接确认',
                          content: '确认要交接吗？交接后此用户所有相关操作将转移给交接人，该用户将被禁用！',
                          onOk: () => {
                            this.leaveUserName = params.row.nickName;
                            this.connect.userId = params.row.id;
                            this.connectRoleId = roleId;
                            toggleShow(this, 'connect');
                          }
                        });
                      }
                    }
                  }, '离职交接')
                )
              }
              return h('div', children)
            }
          }
        ],
        data: [],
        exportData: [],
        total: 0,
        leaveUserName: '',
        connect: {
          userId: null,
          connectUserId: null
        },
        changePasswordNickName: '',
        password: {
          password1: '',
          password2: '',
        },
        passwordRule: {
          password1: [
            { required: true, type: 'string', message: '请输入新密码', trigger: 'blur' }
          ],
          password2: [
            { required: true, type: 'string', message: '请确认新密码', trigger: 'blur' }
          ]
        },
        users: [],
        connectRoleId: null
      }
    },
    computed: {
      selectCount() {
        return this.selectList.length;
      },
      userFileter() {
        return this.users.filter(item => item.roleId == this.connectRoleId);
      }
    },
    methods: {
      changePassword() {
        this.$refs['changePassword'].validate(valid => {
          if (valid) {
            const password = this.password;
            if (password.password1 != password.password2) {
              this.$Message.error('密码不一致，请重新出入');
              return;
            }
            this.show = true;
            changePassword2({
              userId: password.userId,
              password: md5(password.password1).toUpperCase()
            }).then(data => {
              this.show = false;
              toggleShow(this, 'password', false);
            }).catch(data => {this.show = false})
          }
        });
      },
      connectHandler() {
        if (!this.connect.connectUserId) {
          this.$Message.error('请选择交接人');
          return false;
        }
        this.show = true;
        connectMember(this.connect).then(data => {
          this.show = false;
          toggleShow(this, 'connect', false);
        }).catch(data => {this.show = false;})
      },
      init () {
        this.accessToken = {
          accessToken: this.getStore('accessToken')
        }
        // this.initDepartmentData();
        this.getUserList()
        // this.initDepartmentTreeData();
      },
      resetConnect() {
        this.connect = {
          userId: null,
          connectUserId: null
        }
      },
      changePage (v) {
        this.searchForm.page = v;
        this.getUserList();
        this.clearSelectAll();
      },
      changePageSize (v) {
        this.searchForm.size = v;
        this.getUserList();
      },
      selectDateRange (v) {
        if (v) {
          this.searchForm.startDate = v[0];
          this.searchForm.endDate = v[1];
        }
      },
      getUserList () {
        // 多条件搜索用户列表
        this.loading = true;
        const params = {...this.searchForm};
        params.page--;
        getUserListData(params).then(data => {
          this.loading = false;
          this.data = data.content;
          this.total = data.totalElements;
        }).catch(data => {
          this.loading = false;
        })
      },
      handleSearch () {
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.getUserList()
      },
      handleReset () {
        this.$refs.searchForm.resetFields();
        this.searchForm.pageNumber = 1;
        this.searchForm.pageSize = 10;
        this.selectDate = null;
        this.searchForm.startDate = '';
        this.searchForm.endDate = '';
        this.selectDep = [];
        this.searchForm.departmentId = '';
        // 重新加载数据
        this.getUserList()
      },
      changeSort (e) {
        this.searchForm.sort = e.key;
        this.searchForm.order = e.order;
        if (e.order === 'normal') {
          this.searchForm.order = ''
        }
        this.getUserList()
      },
      getAllRoleList () {
        let self = this;
        getAllRoleList().then(data => {
          self.roleList = data;
        }).catch(data => {})
      },
      cancelUser () {
        this.userModalVisible = false;
      },
      submitUser () {
        this.$refs.userForm.validate(valid => {
          if (valid) {
            if (this.modalType === 0) {
              // 添加用户 避免编辑后传入id
              delete this.userForm.id;
              delete this.userForm.avatar;
              delete this.userForm.permissions;
              if (this.userForm.password == '' || this.userForm.password == undefined) {
                this.errorPass = '密码不能为空';
                return;
              }
              if (this.userForm.password.length < 6) {
                this.errorPass = '密码长度不得少于6位';
                return;
              }
              const params = JSON.parse(JSON.stringify(this.userForm));
              params.password = md5(params.password).toUpperCase();
              this.submitLoading = true;
              addUser(params).then(res => {
                this.submitLoading = false;
                this.$Message.success('操作成功');
                this.getUserList();
                this.userModalVisible = false;
              }).catch(data => {
                this.submitLoading = false;
              })
            } else {
              // 编辑
              this.submitLoading = true;
              const params = JSON.parse(JSON.stringify(this.userForm));
              delete params.permissions;
              delete params.other;
              delete params.password;
              editUser(params).then(res => {
                this.submitLoading = false;
                this.$Message.success('操作成功');
                this.getUserList();
                this.userModalVisible = false;
              }).catch(data => {
                this.submitLoading = false;
              })
            }
          }
        })
      },
      viewPic () {
        this.viewImage = true;
      },
      handleFormatError (file) {
        this.$Notice.warning({
          title: '不支持的文件格式',
          desc:
            '所选文件‘ ' +
            file.name +
            ' ’格式不正确, 请选择 .jpg .jpeg .png .gif格式文件'
        })
      },
      handleMaxSize (file) {
        this.$Notice.warning({
          title: '文件大小过大',
          desc: '所选文件‘ ' + file.name + ' ’大小过大, 不得超过 5M.'
        });
      },
      beforeUpload () {
        if (!this.$route.meta.permTypes.includes('upload')) {
          this.$Message.error('此处您没有上传权限(为演示功能，该按钮未配置隐藏)');
          return false;
        }
        return true;
      },
      handleSuccess (res, file) {
        if (res.success === true) {
          file.url = res.result;
          this.userForm.avatar = res.result;
        } else {
          this.$Message.error(res.message);
        }
      },
      handleError (error, file, fileList) {
        this.$Message.error(error.toString());
      },
      add () {
        this.modalType = 0;
        this.modalTitle = '添加用户';
        this.$refs.userForm.resetFields();
        this.userModalVisible = true;
      },
      edit (v) {
        this.modalType = 1;
        this.modalTitle = '编辑用户';
        this.$refs.userForm.resetFields();
        // 转换null为""
        for (let attr in v) {
          if (v[attr] === null) {
            v[attr] = '';
          }
        }

        let str = JSON.stringify(v);
        let userInfo = JSON.parse(str);
        this.userForm = userInfo;
        this.userModalVisible = true;
      },
      enable (id, status, nickName) {
        this.$Modal.confirm({
          title: `确认${status ? '启用' : '禁用'}`,
          content: `您确认要${status ? '启用' : '禁用'}用户 ` + nickName + ' ?',
          onOk: () => {
            this.operationLoading = true;
            enableUser({
              id: id,
              status: status
            }).then(data => {
              this.operationLoading = false;
              this.$Message.success('操作成功');
              this.getUserList();
            }).catch(data => {
              this.operationLoading = false;
            })
          }
        })
      },
      remove (ids) {
        this.$Modal.confirm({
          title: '确认删除',
          content: '您确认要删除用户吗？',
          onOk: () => {
            this.operationLoading = true;
            deleteUser(ids).then(data => {
              this.operationLoading = false;
              this.$Message.success('删除成功');
              this.getUserList();
            }).catch(data => {
              this.operationLoading = false;
            })
          }
        })
      },
      showSelect (e) {
        this.selectList = e;
      },
      clearSelectAll () {
        this.$refs.table.selectAll(false);
      },
      delAll () {
        if (this.selectCount <= 0) {
          this.$Message.warning('您还未选择要删除的数据');
          return;
        }
        this.remove(this.selectList.map(item => item.id));
      },
      allUser() {
        // getTeamManagerUsers({}).then(data => {
        //   this.users = data || [];
        // }).catch(data => {})
      },
    },
    mounted () {
      this.init();
      this.getAllRoleList();
      // this.allUser();
    }
  }
</script>
<style lang="less">
  @import "./userManage.less";
</style>
