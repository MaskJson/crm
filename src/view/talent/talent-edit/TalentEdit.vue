<template>
  <Card>
    <Form ref="entity" :model="entity" :rules="entityRule" :label-width="120">
      <Row>
        <Col span="8"></Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="姓名：" prop="name">
            <Input v-model="entity.name"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="性别：">
            <RadioGroup v-model="entity.sex">
              <Radio :label="0">男</Radio>
              <Radio :label="1">女</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="居住城市：">
            <Cascader v-model="entity.city" :data="cityList"></Cascader>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="国籍：">
            <Select v-model="entity.country">
              <Option v-for="(item, index) of countries" :value="item.value" :key="'country' + index">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="出生日期：">
            <DatePicker type="datetime" v-model="entity.birthday"></DatePicker>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="身份证：">
            <Input v-model="entity.card" :maxlength="20"/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="身高（cm）：">
            <Input v-model="entity.height"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="婚姻：">
            <RadioGroup v-model="entity.marry">
              <Radio :label="0">未婚</Radio>
              <Radio :label="1">已婚</Radio>
            </RadioGroup>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col span="8">
          <FormItem label="学校：">
            <Input v-model="entity.school"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="学历：">
            <Select v-model="entity.education">
              <Option v-for="(item, index) of educationList" :value="item.value" :key="'education' + index">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="语言能力：">
            <Select v-model="entity.language">
              <Option v-for="(item, index) of language" :value="item.value" :key="'language' + index">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="意向行业：">
        <industry-select :model="entity.industry" :industry-list="industryList" @on-select="selectHandle"></industry-select>
      </FormItem>
      <FormItem label="职能：">
        <aptness-select :model="entity.aptness" :aptness-list="aptnessList" @on-select="selectHandle2"></aptness-select>
      </FormItem>
      <FormItem label="手机号：" prop="phone">
        <Input v-model="entity.phone" @on-blur="checkPhone(entity.phone)"/>
        <p class="ml5 cl-error" v-if="phoneError">手机号格式错误</p>
      </FormItem>
      <FormItem label="邮箱：" prop="email">
        <Input v-model="entity.email"/>
      </FormItem>
      <FormItem label="标签：">
        <Input v-model="entity.tag"/>
      </FormItem>
      <Row>
        <Col span="8">
          <FormItem label="工作意向城市：">
            <Cascader v-model="entity.intentionCity" :data="cityList"></Cascader>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="当前年薪（万元）：">
            <InputNumber v-model="entity.salary" :min="0"/>
          </FormItem>
        </Col>
        <Col span="8">
          <FormItem label="意向职位：">
            <Input v-model="entity.position"/>
          </FormItem>
        </Col>
      </Row>
      <FormItem label="工作经历：">
        <div class="border">
          <div>
            <div class="borderB pd-10" v-for="(item, index) in entity.experienceList" :key="'form' + index">
              <Form :model="item" :rules="experienceRules" :label-width="80" :ref="'itemForm' + index">
                <FormItem label="公司名称" class="mt-10 myItem relative left80" prop="company" style="margin-bottom: 20px;">
                  <Input v-model="entity.experienceList[index].company" placeholder="请输入公司名称" @on-focus="showList(index, 0, true)" @on-blur="" @on-change="findCustomerByName(index, 0, true)" class="w500"></Input>
                  <div class="borderB nameList" v-if="item.showList && actionIndex == index && actionType === true">
                    <li class="border bgfff company-item" v-if="customers && customers.length == 0">暂无数据</li>
                    <li class="border bgfff company-item cursor" v-for="(customer, index2) of customers" :key="'customer1' + index2" @click="setName(customer.name, index, 0)">
                      {{customer.name}}
                    </li>
                  </div>
                </FormItem>
                <div>
                  <div class="inline-block w240">
                    <FormItem label="部门" class="mt-10 myItem left80" prop="department" style="margin-bottom: 20px;">
                      <Input v-model="entity.experienceList[index].department" :disabled="!entity.experienceList[index].company" placeholder="请输入部门" @on-focus="showList(index, 0, false)" @on-blur="" @on-change="findCustomerByName(index, 0, false)" class="w200" style="width: 180px;" />
                      <div class="borderB nameList" style="width: 180px; z-index: 99999999;" v-if="item.showList2 && actionIndex == index && actionType === false">
                        <li class="border bgfff company-item" v-if="departments && departments.length == 0">暂无数据</li>
                        <li class="border bgfff company-item cursor" v-for="(department, index2) of departments" :key="'department1' + index2" @click="setName2(department.name, index, 0)">
                          {{ department.name }}
                        </li>
                      </div>
                    </FormItem>
                  </div>
                  <div class="inline-block w240">
                    <FormItem label="职位" class="mt-10 myItem left80" prop="position" style="margin-bottom: 20px;">
                      <Input v-model="entity.experienceList[index].position" :disabled="!entity.experienceList[index].department" placeholder="请输入职位" class="w200"></Input>
                    </FormItem>
                  </div>
                </div>
                <FormItem label="任职时间">
                  <DatePicker type="datetime" placeholder="开始时间" v-model="entity.experienceList[index].startTime" class="w200"></DatePicker>
                  <DatePicker type="datetime" placeholder="结束时间" v-model="entity.experienceList[index].endTime" class="w200 ml-10"></DatePicker>
                  <Checkbox class="ml-5" v-model="entity.experienceList[index].status" @on-change="statusChange(index)">至今</Checkbox>
                </FormItem>
                <FormItem label="工作职责" class="mt-10">
                  <Input v-model="entity.experienceList[index].remark" type="textarea" :rows="3" placeholder="" class="w500" />
                </FormItem>
                <FormItem label="工作业绩" class="mt-10">
                  <Input v-model="entity.experienceList[index].performance" placeholder="" class="w500" />
                </FormItem>
                <FormItem class="mt-20">
                  <Button v-if="index > 0" type="error" @click="removeExperience(index)" class="ml-20">删除</Button>
                </FormItem>
              </Form>
            </div>
            <div class="bgf2 pd-10"><Button type="primary" @click="addExperience">继续新增工作经历</Button></div>
          </div>
        </div>
      </FormItem>
      <FormItem label="教育经历：">
        <Input type="textarea" :rows="3" placeholder="请输入教育经历" v-model="entity.educationExperience"/>
      </FormItem>
      <FormItem label="项目经历：">
        <Input type="textarea" :rows="3" placeholder="请输入项目经历" v-model="entity.projectExperience"/>
      </FormItem>
      <FormItem label="职业技能：">
        <Input type="textarea" :rows="3" placeholder="请输入职业技能" v-model="entity.occupationSkill"/>
      </FormItem>
      <FormItem label="评价：">
        <Input type="textarea" :rows="3" placeholder="请输入评价" v-model="entity.remark"/>
      </FormItem>
      <FormItem label="来源类型">
        <div>
          <RadioGroup v-model="entity.sourceType">
            <Radio :label="1">搜库</Radio>
            <Radio :label="2">CC</Radio>
            <Radio :label="3">转介绍</Radio>
          </RadioGroup>
        </div>
        <Select v-model="entity.sourceFrom" class="w300" v-if="entity.sourceType == 1">
          <Option v-for="(item, index) of talentSource" :value="item.value" :key="'source' + index">{{ item.label }}</Option>
        </Select>
        <Select v-model="entity.sourceFrom" class="w300" v-if="entity.sourceType == 2" clearable filterable>
          <Option v-for="(item, index) of allCustomers" :value="item.id" :key="'customerS' + index">{{ item.name }}</Option>
        </Select>
      </FormItem>
      <h2 class="ml100">沟通记录</h2>
      <FormItem label="朋友介绍：">
        <div class="border mt-10">
          <div class="bgf2 pd-10"><Button type="primary" @click="addFriendDesc">新增朋友介绍</Button></div>
          <div>
            <div class="borderB pd-10" v-for="(item, index) in friends" :key="'friend' + index">
              <Form :model="item" :rules="friendRule" :label-width="80" :ref="'friend' + index">
                <FormItem label="名字" prop="name" class="myItem left80" style="margin-bottom: 20px;">
                  <Input v-model="friends[index].name" placeholder="请输入名字" class="w300" />
                </FormItem>
                <FormItem label="公司名称" class="mT10 myItem left80" prop="company" style="margin-bottom: 20px;">
                  <Input v-model="friends[index].company" placeholder="请输入公司名称" @on-focus="showList(index, 1, true)" @on-blur="" @on-change="findCustomerByName(index, 1, true)" class="w300" />
                  <div class="borderB nameList" style="width: 300px;" v-if="item.showList && actionFriendIndex == index && actionType === true">
                    <li class="border bgfff company-item" v-if="customers && customers.length == 0">暂无数据</li>
                    <li class="border bgfff company-item cursor" v-for="(customer, index2) of customers" :key="'customer2' + index2" @click="setName(customer.name, index, 1)">
                      {{customer.name}}
                    </li>
                  </div>
                </FormItem>
                <FormItem label="部门" class="mt-10 myItem left80" prop="department" style="margin-bottom: 20px;">
                  <Input v-model="friends[index].department" placeholder="请输入部门" class="w300" @on-focus="showList(index, 1, false)" @on-blur="" @on-change="findCustomerByName(index, 1, false)" />
                  <div class="borderB nameList" style="width: 300px;" v-if="item.showList2 && actionFriendIndex == index && actionType === false">
                    <li class="border bgfff company-item" v-if="departments && departments.length == 0">暂无数据</li>
                    <li class="border bgfff company-item cursor" v-for="(department, index2) of departments" :key="'department2' + index2" @click="setName2(department.name, index, 1)">
                      {{department.name}}
                    </li>
                  </div>
                </FormItem>
                <FormItem label="手机号" class="mt-10 myItem" style="margin-bottom: 20px;">
                  <Input v-model="friends[index].phone" placeholder="请输入手机号" class="w300"/>
                </FormItem>
                <FormItem>
                  <Button type="error" @click="removeFriendDesc(index)" class="ml-20">删除</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem label="接触机会：">
        <div class="border mt-10">
          <div class="bgf2 pd-10"><Button type="primary" @click="addChance">新增接触机会</Button></div>
          <div>
            <div class="borderB pd-10" v-for="(item, index) in chances" :key="'chance' + index">
              <Form :model="item" :rules="chanceRule" :label-width="80" :ref="'chance' + index">
                <FormItem label="公司名称" class="mt-10 myItem left80" prop="company" style="margin-bottom: 20px;">
                  <Input v-model="chances[index].company" placeholder="请输入公司名称" @on-focus="showList(index, 2, true)" @on-blur="" @on-change="findCustomerByName(index, 2, true)" class="w300" />
                  <div class="borderB nameList" style="width: 300px;" v-if="item.showList && actionChanceIndex == index && actionType === true">
                    <li class="border bgfff company-item" v-if="customers && customers.length == 0">暂无数据</li>
                    <li class="border bgfff company-item cursor" v-for="(customer, index2) of customers" :key="'customer' + index2" @click="setName(customer.name, index, 2)">
                      {{ customer.name }}
                    </li>
                  </div>
                </FormItem>
                <FormItem label="接触职位" class="mt-10 myItem left80" prop="position" style="margin-bottom: 20px;">
                  <Input v-model="chances[index].position" placeholder="请输入职位信息" class="w300" />
                </FormItem>
                <FormItem>
                  <Button type="error" @click="removeChance(index)" class="ml-20">删除</Button>
                </FormItem>
              </Form>
            </div>
          </div>
        </div>
      </FormItem>
      <FormItem label="人才状态：" prop="status">
        <Select v-model="entity.status" :disabled="!!projectId">
          <Option v-for="(item, index) of talentStatus" :key="'status' + index" :value="item.value">{{ item.label }}</Option>
        </Select>
      </FormItem>
      <FormItem label="关联项目" v-if="entity.status == 10 && !projectId">
        <Select v-model="entity.projectId">
          <Option v-for="(item, index) of projectList" :key="'project' + index" :value="item.projectId">{{ item.name }}</Option>
        </Select>
      </FormItem>
    </Form>

    <!--  添加跟踪记录 -->
    <Form ref="addRemind" :model="remind" :rules="remindRule" :label-width="120" v-if="entity.status != 10 && !entity.id && !projectId">
      <FormItem label="本次跟踪类别" prop="remindTypeId">
        <Select v-model="remind.type">
          <Option :value="0">请选择</Option>
          <Option :value="1">电话</Option>
          <Option :value="2">顾问面试（内）</Option>
          <Option :value="3">顾问面试（外）</Option>
        </Select>
      </FormItem>
      <FormItem label="沟通记录" v-if="remind.type == 1">
        <Input type="textarea" :rows="3" v-model="remind.remark"/>
      </FormItem>
      <div v-if="remind.type == 2">
        <FormItem label="候选人基本情况">
          <Input type="textarea" :rows="3" v-model="remind.situation"/>
        </FormItem>
        <FormItem label="求职方向不离职原因">
          <Input type="textarea" :rows="3" v-model="remind.cause"/>
        </FormItem>
        <FormItem label="薪资架构">
          <Input v-model="remind.salary"/>
        </FormItem>
      </div>
      <div v-if="remind.type == 3">
        <FormItem label="面试时间" prop="meetTime">
          <DatePicker type="datetime" placeholder="日期" v-model="remind.meetTime"></DatePicker>
        </FormItem>
        <FormItem label="面试地点" prop="meetAddress" v-if="[2,3].indexOf(remind.type) > -1">
          <Input v-model="remind.meetAddress"/>
        </FormItem>
      </div>
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
    <div class="center mt-10">
      <Button type="primary" class="w120" :disabled="checkPhoneStatus || phoneError || (!!entity.followUserId && entity.followUserId != userId)" @click="checkSubmit">提交</Button>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import IndustrySelect from '@/view/components/industry-select/industry-select.vue';
  import AptnessSelect from '@/view/components/industry-select/aptness-select.vue';
  import cityList from '../../../libs/cityList';
  import { getTalentInfoUtil, getUserId } from "../../../libs/tools";
  import { industryList, aptnessList, language, talentSource, talentStatus, educationList, countries } from "../../../libs/constant";
  import { allCustomer, allDepartment } from "../../../api/customer";
  import { getListByTableName } from "../../../api/common";
  import { checkByPhone, getDetail, save } from "../../../api/talent";

  export default {
    name: "TalentEdit",
    components: {
      IndustrySelect,
      AptnessSelect
    },
    data() {
      return {
        userId: null,
        projectId: null, // 添加项目人才
        phoneError: false,
        show: false,
        status: null,
        checkPhoneStatus: false, // 手机号是否重复
        timeoutHandler: null,
        cityList: cityList,
        industryList: industryList,
        aptnessList: aptnessList,
        language: language,
        talentSource: talentSource,
        talentStatus: talentStatus,
        educationList: educationList,
        countries: countries,
        customers: [], // 查询匹配的客户
        departments: [], // 查询匹配的部门
        allCustomers: [], // 所有客户
        allDepartment: [], // 所有部门
        projectList: [], // 所有项目
        teamUserList: [], // 团队
        actionIndex: null, // 聚焦的经历下标
        actionFriendIndex: null, // 好友推荐公司聚焦
        actionChanceIndex: null, // 接触机会公司聚焦
        actionType: true,
        entity: {
          resume: null,
          header: null,
          name: null,
          sex: 0,
          type: 0,
          city: [],
          country: null,
          birthday: null,
          card: null,
          height: null,
          marry: 0,
          school: null,
          education: null,
          language: null,
          industry: [],
          aptness: [],
          phone: '',
          intentionCity: [],
          salary: null,
          position: null,
          tag: null,
          educationExperience: null,
          projectExperience: null,
          occupationSkill: null,
          sourceType: 1,
          sourceFrom: null,
          remark: null,
          createUerId: null,
          experienceList: [
            {
              company: '', // 公司名称
              startTime: null, // 开始时间
              endTime: null, // 结束时间
              status: false, // 至今
              position: '', // 职位
              department: '', // 部门
              remark: '', // 职责
              performance: '', // 业绩
              showList: false,
              showList2: false
            }
          ],
        },
        entityRule: {
          name: [
            { required: true, type: 'string', message: '请输入姓名', trigger: 'blur' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择状态', trigger: 'change' }
          ],
          email: [
            { required: false, type: 'email', message: '邮箱格式有误', trigger: 'blur' }
          ],
          phone: [
            { required: false, regexp: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号格式有误', trigger: 'blur' }
          ]
        },
        experienceRules: {
          company: [
            { required: true, type: 'string', message: '请输入公司名称', trigger: 'change' }
          ],
          department: [
            { required: true, type: 'string', message: '请输入部门', trigger: 'change' }
          ],
          position: [
            { required: true, type: 'string', message: '请输入职位', trigger: 'change' }
          ],
        },
        friends: [

        ],
        chances: [

        ],
        friendRule: {
          name: [
            { required: true, type: 'string', message: '请输入名字', trigger: 'change' }
          ],
          company: [
            { required: true, type: 'string', message: '请输入公司名称', trigger: 'change' }
          ],
          department: [
            { required: true, type: 'string', message: '请输入部门', trigger: 'change' }
          ]
        },
        chanceRule: {
          company: [
            { required: true, type: 'string', message: '请输入公司名称', trigger: 'change' }
          ],
          position: [
            { required: true, type: 'string', message: '请输入接触职位', trigger: 'blur' }
          ]
        },
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
          adviserId: null,
          followRemindId: null
        },
        remindRule: {
          type: [
            { required: true, type: 'number', message: '请选择类型', trigger: 'change' }
          ],
          status: [
            { required: true, type: 'number', message: '请选择状态', trigger: 'change' }
          ],
        }
      }
    },
    methods: {
      // 添加工作经历
      addExperience () {
        this.entity.experienceList.push({
          company: '',
          startTime: null,
          endTime: null,
          status: '',
          position: '',
          department: '',
          remark: '',
          performance: '',
          showList: false,
          showList2: false
        })
      },
      removeExperience (index) {
        this.entity.experienceList.splice(index, 1)
      },
      selectHandle (value) {
        this.entity.industry = value;
      },
      selectHandle2 (value) {
        this.entity.aptness = value;
      },
      checkPhone(val) {
        const reg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (val.trim() && !reg.test(val.trim())) {
          this.$Message.warning('手机号格式错误');
          this.phoneError = true;
        } else {
          if (!this.entity.id) {
            this.show = true;
            checkByPhone({ phone: val.trim() }).then(data => {
              this.show = false;
              this.checkPhoneStatus = !!data;
            }).catch(data => { this.show = false; })
          }
          this.phoneError = false;
        }
      },
      statusChange(flag) {
        if (this.entity.experienceList[flag].status) {
          this.entity.experienceList.forEach((item, index) => {
            if (flag != index) {
              item.status = false;
            }
          })
        }
      },
      // 工作经历公司去重
      findCustomerByName(index, flag, bool, init) {
        this.actionType = bool;
        let name;
        switch (flag) {
          case 0:
            name = bool ? this.entity.experienceList[index].company : this.entity.experienceList[index].department;
            if (bool && !init) {
              this.entity.experienceList[index].department = this.entity.experienceList[index].position = '';
            } else if (!init) {
              this.entity.experienceList[index].position = '';
            }
            break;
          case 1:
            name = bool ? this.friends[index].company : this.friends[index].department;
            if (bool && !init) {
              this.entity.experienceList[index].department = '';
            }
            break;
          case 2:
            name = this.chances[index].company;
            break;
        }
        if (bool) {
          if (name) {
            this.customers = this.allCustomers.filter(item => item.name.indexOf(name) > -1);
          } else {
            this.customers = this.allCustomers;
          }
        } else {
          const k = this.allCustomers.findIndex(item => item.name == (flag == 0 ? this.entity.experienceList[index].company : this.friends[index].company));
          if (k > -1) {
            this.departments = this.allDepartment.filter(item => item.customerId == this.allCustomers[k].id);
          }
        }
      },
      setName(name, index, flag) {
        switch (flag) {
          case 0:
            this.entity.experienceList[index].company = name;
            this.entity.experienceList[index].showList = false;
            break;
          case 1:
            this.friends[index].company = name;
            this.friends[index].showList = false;
            break;
          case 2:
            this.chances[index].company = name;
            this.chances[index].showList = false;
            break;
        }
      },
      setName2(name, index, flag) {
        switch (flag) {
          case 0:
            this.entity.experienceList[index].department = name;
            this.entity.experienceList[index].showList2 = false;
            break;
          case 1:
            this.friends[index].department = name;
            this.friends[index].showList2 = false;
            break;
        }
      },
      showList(index, flag, bool) {
        this.actionType = bool;
        this.customers = [];
        this.departments = [];
        switch (flag) {
          case 0:
            this.actionIndex = index;
            if (bool) {
              this.entity.experienceList[index].showList = true;
            } else {
              this.entity.experienceList[index].showList2 = true;
            }
            break;
          case 1:
            this.actionFriendIndex = index;
            if (bool) {
              this.friends[index].showList = true;
            } else  {
              this.friends[index].showList2 = true;
            }
            break;
          case 2:
            this.actionChanceIndex = index;
            this.chances[index].showList = true;
            break;
        }
        this.findCustomerByName(index, flag, bool, true);
      },
      hideShowList(index) {
        this.entity.experienceList[index].showList = false;
        this.customers = [];
      },
      // 新增朋友介绍
      addFriendDesc() {
        this.friends.push({
          name: '', // 名字
          company: '', // 公司
          department: '', // 部门
          phone: '', // 手机
          showList: false,
          showList2: false
        })
      },
      removeFriendDesc(index) {
        this.friends.splice(index, 1);
      },
      // 新增接触机会
      addChance() {
        this.chances.push({
          company: '',  // 公司
          position: '', // 职位
          showList: false
        })
      },
      removeChance(index) {
        this.chances.splice(index, 1);
      },
      // 提交验证
      checkSubmit() {
        if (this.remind.type && this.entity.status != 10) {
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
          if (params.type == 3 && (!params.meetTime || !params.meetAddress)) {
            this.$Message.warning('室外面试需要填写面试时间和地点');
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
        }
        if (this.entity.status == 10 && !this.entity.projectId) {
          this.$Message.warning('推荐给客户必须关联项目');
          return false;
        }
        let flag = true;
        this.$refs['entity'].validate((valid) => {
          if (!valid) {
            flag = false
          }
        });
        if (this.entity.type && (this.entity.sex == null || !this.entity.phone || !this.entity.position)) {
          this.$Message.warning("专属人才必须完善性别、手机号、意向职位等信息");
          return false;
        }
        this.entity.experienceList.forEach((item, index) => {
          this.$refs['itemForm' + index][0].validate((valid) => {
            if (!valid) {
              flag = false;
            }
          });
        });
        this.friends.forEach((item, index) => {
          this.$refs['friend' + index][0].validate((valid => {
            if (!valid) {
              flag = false;
            }
          }))
        });
        this.chances.forEach((item, index) => {
          this.$refs['chance' + index][0].validate((valid => {
            if (!valid) {
              flag = false;
            }
          }))
        });
        if (!flag) {
          this.$Message.error('请检查选项是否按要求填写');
        } else {
          if (this.entity.status != 10) {
            this.entity.projectId = null;
          }
          this.submit();
        }
      },
      submit() {
        const entity = {...this.entity};
        if (!entity.intentionCity.length) {
          entity.intentionCity = entity.city;
        }
        if (!entity.id) {
          entity.createUserId = getUserId();
        }
        entity.city = JSON.stringify(entity.city);
        entity.industry = JSON.stringify(entity.industry);
        entity.aptness = JSON.stringify(entity.aptness);
        entity.intentionCity = JSON.stringify(entity.intentionCity);
        entity.friends = this.friends;
        entity.chances = this.chances;
        entity.actionUserId = getUserId();
        if (!entity.id && entity.status != 10 && this.remind.type) {
          this.remind.status = entity.status;
          this.remind.createUserId = getUserId();
          entity.remind = this.remind;
        }
        this.show = true;
        save(entity).then(data => {
          this.show = false;
          this.$Message.success('提交成功');
          this.$router.push('/talent/talent-manage');
        }).catch(data => { this.show = false; })
      },
      init(id) {
        this.show = true;
        getDetail({ id }).then(data => {
          this.show = false;
          const entity = getTalentInfoUtil(data);
          this.entity = entity;
          this.friends = entity.friends || [];
          this.chances = entity.chances;
        }).catch(data => { this.show = false; })
      }
    },
    mounted() {
      document.addEventListener('click', (event) => {
        // this.customers = [];
        // this.departments = [];
        const e = event || window.event;
        if (e.srcElement.className.indexOf('input') < 0) {
          this.entity.experienceList.forEach((item, index, array) => {
            if (index == this.actionIndex) {
              setTimeout(() => {
                this.actionIndex = null;
                item.showList = false;
                item.showList2 = false;
              }, 100);
            }
          });
          this.friends.forEach((item, index, array) => {
            if (this.actionFriendIndex == index) {
              setTimeout(() => {
                this.actionFriendIndex = null;
                item.showList = false;
                item.showList2 = false;
              }, 100);
            }
          });
          this.chances.forEach((item, index, array) => {
            if (this.actionChanceIndex == index) {
              setTimeout(() => {
                this.actionChanceIndex = false;
                item.showList = false;
                item.showList2 = false;
              }, 100);
            }
          });
          setTimeout(() => {
            this.actionType = null;
          }, 100);
        }
      });
    },
    created() {
      this.userId = getUserId();
      const query = this.$route.query || {};
      const {id, projectId} = query;
      if (projectId) {
        this.projectId = Number(projectId);
        this.entity.status = 10;
        this.entity.projectId = Number(projectId);
      }
      if (id) {
        this.init(Number(id));
      }
      getListByTableName({type: 1}).then(data => {
        this.allCustomers = data || [];
      }).catch(data => {});
      getListByTableName({type: 3}).then(data => {
        this.projectList = data || [];
      }).catch(data => {});
      allDepartment({}).then(data => {
        this.allDepartment = data;
      }).catch(data => {});
    }
  }
</script>

<style scoped>
  .pl120 {
    padding-left: 120px;
  }
  .ml100 {
    margin-left: 120px;
  }
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
    left: 80px;
    top: 35px;
    width: 500px;
    border-radius: 4px;
    overflow: hidden;
    z-index: 10;
    border: solid 1px #9ea7b4 !important;
  }
  .w240 {
    width: 280px;
  }
</style>
