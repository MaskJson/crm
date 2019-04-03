<template>
  <div>
    <div>
      <SearchItem>
        <Input placeholder="姓名" class="w200"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="部门" class="w200"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="单位" class="w200"/>
      </SearchItem>
      <SearchItem>
        <Input placeholder="手机号" class="w200"/>
      </SearchItem>
      <SearchItem>
        <Button type="primary" :disabled="!id">查询</Button>
      </SearchItem>
      <SearchItem>
        <Button type="primary" :disabled="!id">重置查询条件</Button>
      </SearchItem>
    </div>
    <div class="mt-10">
      <SearchItem>
        <Button type="primary" @click="showModalDepartment">添加</Button>
      </SearchItem>
      <SearchItem>
        <Button type="error">批量删除</Button>
      </SearchItem>
    </div>
    <Table class="mt-5" :columns="columns" :data="list" border></Table>
    <!--  添加编辑联系人 -->
    <ModalUtil ref="modal_contact" :title="contact.id ? '修改联系人' : '添加联系人'" @reset="resetContact" @on-ok="saveContact" :loading="show">
      <Form ref="saveContact" :model="contact" :rules="contactRule" :label-width="80">
        <FormItem label="姓名：" prop="name">
          <Input v-model="contact.name" class="w300"/>
        </FormItem>
        <FormItem label="部门：" prop="department">
          <Input v-model="contact.department" @on-focus="focusHandler" @on-change="findDepartment" class="w300" @on-blur="blurHandler"/>
          <div class="borderB nameList" v-if="showDepartment">
            <li class="border bgfff company-item" v-if="departmentsFilter.length == 0">暂无数据</li>
            <li class="border bgfff company-item cursor" v-for="(department, index) of departmentsFilter" :key="'department' + index" @click="setName(department.name)">
              {{department.name}}
            </li>
          </div>
        </FormItem>
        <FormItem label="岗位：" prop="position">
          <Input v-model="contact.position" class="w300"/>
        </FormItem>
        <FormItem label="重要性：" prop="important">
          <Select v-model="contact.important" class="w300">
            <Option :value="1">非常重要</Option>
            <Option :value="2">重要</Option>
            <Option :value="3">一般</Option>
            <Option :value="4">较弱</Option>
            <Option :value="5">离职</Option>
          </Select>
        </FormItem>
        <FormItem label="手机号：">
          <Input v-model="contact.phone" class="w300"/>
        </FormItem>
      </Form>
    </ModalUtil>
    <SpinUtil :show="show"/>
  </div>
</template>

<script>
  import {getUserId, toggleShow} from "../../../../libs/tools";
  import { getCustomerContact, saveContact, addContactRemark, getCustomerDepartments } from "../../../../api/customer";

  export default {
    name: "concat",
    props: {
      id: {
        type: Number
      }
    },
    data() {
      return {
        show: false,
        showDepartment: false,
        departments: [],
        departmentsFilter: [],
        list: [],
        searchData: {
          name: null,
          departmentId: null,
          position: null,
          phone: null
        },
        columns: [
          {
            type: 'selection',
            width: 60,
            align: 'center'
          },
          {
            title: '姓名',
            key: 'name',
            align: 'center',
          },
          {
            title: '部门',
            key: 'department',
            align: 'center',
          },
          {
            title: '岗位',
            key: 'position',
            align: 'center',
          },
          {
            title: '重要性',
            key: 'important',
            align: 'center',
            render: (h, params) => {
              let text;
              switch (params.row.important) {
                case 1: text = '非常重要';break;
                case 2: text = '重要';break;
                case 3: text = '一般';break;
                case 4: text = '较弱';break;
                case 5: text = '离职';break;
              }
              return h('span', text);
            }
          },
          {
            title: '手机',
            key: 'phone',
            align: 'center',
          },
          {
            title: '创建者',
            key: 'createUser',
            align: 'center',
          },
          {
            title: '最新联系记录',
            key: 'remark',
            render: (h, params) => {
              const remarks = params.row.remarks || [];
              const text = remarks && remarks.length ? remarks[0].remark : '--'
            }
          },
          {
            title: '操作',
            align: 'center',
            width: 180,
            render: (h, params) => {
              return h('div', [
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  class: {
                    'mr-5': true
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '删除'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  class: {
                    'mr-5': true
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '编辑'),
                h('Button', {
                  props: {
                    type: 'error',
                    size: 'small'
                  },
                  class: {
                    'mr-5': true
                  },
                  on: {
                    click: () => {

                    }
                  }
                }, '备注记录'),
              ]);
            }
          }
        ],
        contact: {
          name: null,
          department: null,
          position: null,
          important: 1,
          phone: null,
        },
        contactRule: {
          name: [
            { required: true, type: 'string', message: '请输入姓名', trigger: 'change' }
          ],
          department: [
            { required: true, type: 'string', message: '请输入部门', trigger: 'change' }
          ],
          position: [
            { required: true, type: 'string', message: '请输入岗位', trigger: 'change' }
          ],
          important: [
            { required: true, type: 'number', message: '请选择重要性', trigger: 'blur' }
          ]
        },
        remark: {
          remark: null,
          nextContactTime: null
        }
      }
    },
    methods: {
      showModalDepartment() {
        toggleShow(this, 'modal_contact');
      },
      setName(department) {
        this.contact.department = department;
      },
      focusHandler() {
        this.showDepartment = true;
        this.findDepartment();
      },
      blurHandler() {
        setTimeout(() => {
          this.showDepartment = false;
        }, 150);
      },
      findDepartment() {
        const department = (this.contact.department || '').trim();
        if (!department) {
          this.$set(this.departmentsFilter, this.departments);
          this.departmentsFilter = this.departments;
        } else {
          this.$set(this.departmentsFilter, this.departments.filter(item => item.name.indexOf(department) > -1));
          this.departmentsFilter = this.departments.filter(item => item.name.indexOf(department) > -1);
        }
      },
      getContact() {
        getCustomerContact({id: this.id}).then(data => {
          this.list = data;
        }).catch(data => {});
      },
      getDepartments() {
        getCustomerDepartments({id: this.id}).then(data => {
          this.departments = data;
        }).catch(data => {});
      },
      resetContact() {
        this.contact = {
          name: null,
          department: null,
          position: null,
          important: 1,
          phone: null,
        }
      },
      saveContact() {
        this.$refs['saveContact'].validate(valid => {
          if (valid) {
            this.show = true;
            const params = this.contact;
            if (!params.id) {
              params.createUserId = getUserId();
            }
            params.customerId = this.id;
            saveContact(this.contact).then(data => {
              this.show = false;
              toggleShow(this, 'modal_contact', false);
              this.getContact();
              this.getDepartments();
            }).catch(data => { this.show = false; })
          }
        });
      },
    },
    watch: {
      id() {
        this.getContact();
        this.getDepartments();
      },
      list(list) {
        this.$emit('on-change', this.list.length);
      },
      departments() {
        console.log('adfadfadfasfads')
      }
    },
    mounted() {
      document.addEventListener('click', (event) => {
        const e = event || window.event;
        if (e.srcElement.className.indexOf('input') < 0) {
          setTimeout(() => {
            this.showDepartment = false
          }, 100);
        }
      });
    }
  }
</script>

<style scoped>
  .company-item {
    list-style: none;
    border-bottom: none;
    padding: 3px 6px;
    font-size: 12px;
  }
  .company-item:hover {
    background: #f2f2f2;
  }
  .nameList {
    position: absolute;
    left: 0px;
    top: 35px;
    width: 300px;
    border-radius: 4px;
    overflow: hidden;
    z-index: 10;
    border: solid 1px #9ea7b4 !important;
  }
</style>
