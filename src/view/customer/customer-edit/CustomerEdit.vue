<template>
  <Card>
    <Form :label-width="100" ref="form" :model="entity" :rules="rules">
      <FormItem label="公司名称：" prop="name">
        <Input v-model="entity.name" placeholder="请输入公司名称" @on-blur="getCustomer(false, entity.name)"/>
        <span class="ml5 cl-error" v-if="checkCustomerStatus">该客户已存在</span>
      </FormItem>
      <FormItem label="公司网址：">
        <Input v-model="entity.website" placeholder="请输入公司网址"/>
      </FormItem>
      <FormItem label="行业：" prop="industry" class="ivu-form-item-required">
        <industry-select :model="entity.industry" :industry-list="industryList" @on-select="selectHandle"></industry-select>
      </FormItem>
      <FormItem label="公司手机号：" prop="telephone">
        <Input v-model="entity.telephone" placeholder="请输入公司联系手机号" :maxlength="11" @on-blur="checkPhone(entity.telephone)"/>
        <span class="ml5 cl-error" v-if="phoneError">手机号格式错误</span>
      </FormItem>
      <FormItem label="城市：" prop="city">
        <Cascader v-model="entity.city" :data="cityList"></Cascader>
      </FormItem>
      <FormItem label="邮箱：">
        <Input v-model="entity.email" placeholder="请输入公司邮箱" @on-blur="checkEmail(entity.email)"/>
        <span class="ml5 cl-error" v-if="emailError">邮箱格式错误</span>
      </FormItem>
      <FormItem label="公司规模：">
        <Input v-model="entity.scale" placeholder="公司规模"/>
      </FormItem>
      <FormItem label="福利：">
        <Input v-model="entity.welfare" placeholder="公司福利"/>
      </FormItem>
      <FormItem label="公司简介：">
        <Input type="textarea" :rows="5" :maxlength="500" v-model="entity.description" placeholder="请输入公司简介(500字以内)"/>
      </FormItem>
      <FormItem label="上传合同：" v-if="entity.type == 6">
        <Upload
          v-if="!entity.contractUrl"
          action="/api/common/upload"
          :on-success="resumeSuccess"
          :on-error="resumeError"
          :format="['doc', 'docx', 'pdf']"
          :show-upload-list="false"
          :max-size="5120"
          :on-format-error="formatErrorResume"
          :on-exceeded-size="sizeError"
        >
          <Button icon="ios-cloud-upload-outline">上传合同</Button>
        </Upload>
        <div class="demo-upload-list" v-if="entity.resume">
          <Icon type="ios-list-box" class="img block" size="60"/>
          <div class="demo-upload-list-cover">
            <Icon type="ios-trash-outline" @click.native="handleRemove2"></Icon>
          </div>
        </div>
        <Input v-model="entity.contractUrl" class="hide"/>
      </FormItem>
    </Form>
    <div class="center mt-20">
      <Button type="primary" @click="addCustomer" class="w120" :disabled="unableSubmit || checkCustomerStatus">提交</Button>
    </div>
    <SpinUtil :show="show"/>
  </Card>
</template>

<script>
  import { save, get } from "../../../api/customer";
  import { industryList } from "../../../libs/constant";
  import { getUserId, getUserInfoByKey } from "../../../libs/tools";
  import { getCustomerInfoUtil } from "../../../libs/tools";
  import cityList from '../../../libs/cityList';
  import IndustrySelect from '@/view/components/industry-select/industry-select.vue';

  export default {
    name: "CustomerEdit",
    components: {
      IndustrySelect,
    },
    data() {
      return {
        show: false,
        unableSubmit: false,
        checkCustomerStatus: false, // name去重
        emailError: false,
        phoneError: false,
        industryList: industryList,
        cityList: cityList,
        oldName: null,
        entity: {
          id: null,
          name: null, // 名称
          type: 0, // 类型
          city: [], // 所在城市
          industry: [], // 行业
          phone: '', // 手机
          website: null, // 网址
          scale: null, // 规模
          email: '', // 邮箱
          welfare: null, // 福利
          description: null, // 简介
          contractUrl: null, // 合同
          roleId: getUserInfoByKey('roleId')
        },
        rules: {
          name: [
            { required: true, type: 'string', message: '请输入客户名称', trigger: 'blur' }
          ],
          email: [
            { required: false, type: 'email', message: '邮箱格式有误', trigger: 'blur' }
          ],
          website: [
            { required: false, type: 'url', message: '网址格式有误', trigger: 'blur' }
          ],
          phone: [
            { required: false, regexp: /^[1][3,4,5,7,8][0-9]{9}$/, message: '手机号格式有误', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      handleRemove2() {
        this.entity.contractUrl = null;
      },
      resumeSuccess(res) {
        if (res.code == 200) {
          this.entity.contractUrl = res.data;
        }
      },
      resumeError(res) {

      },
      formatErrorResume() {
        this.$Message.error('请上传doc,docx,pdf等格式的文件');
      },
      sizeError() {
        this.$Message.error('请上传5M以内的文件');
      },
      addCustomer() {
        this.$refs.form.validate(valid => {
          if (valid) {
            const entity = JSON.parse(JSON.stringify(this.entity));
            entity.city = JSON.stringify(entity.city);
            entity.industry = JSON.stringify(entity.industry);
            if (!entity.id) {
              entity.createUserId = getUserId();
            }
            entity.roleId = getUserInfoByKey('roleId');
            save(entity).then(data => {
              this.$router.push('/customer/customer-manage');
            }).catch(data => {

            })
          }
        })
      },
      getCustomer(flag, keyValue) {
        if (!flag) {
          if (!this.entity.name.trim() || this.entity.id && this.entity.name == this.oldName) {
            return;
          }
        }
        this.show = true;
        const params = flag ? { id: keyValue } : { name: keyValue };
        get(params).then(data => {
          this.show = false;
          if (flag) {
            this.entity = getCustomerInfoUtil(data || {});
          } else if (data) {
            this.checkCustomerStatus = true;
          } else {
            this.checkCustomerStatus = false;
          }
        }).catch(data => {
          this.show = false;
          this.checkCustomerStatus = false;
        })
      },
      selectHandle (value) {
        this.entity.industry = value;
      },
      checkEmail(val) {
        const reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
        if (val.trim() && !reg.test(val)) {
          this.$Message.warning('邮箱格式错误');
          this.emailError = true;
        } else {
          this.emailError = false;
        }
      },
      checkPhone(val) {
        const reg=/^[1][3,4,5,7,8][0-9]{9}$/;
        if (val.trim() && !reg.test(val.trim())) {
          this.$Message.warning('手机号格式错误');
          this.phoneError = true;
        } else {
          this.phoneError = false;
        }
      },
    },
    created() {
      const query = this.$route.query || {};
      if (query.id) {
        this.getCustomer(true, query.id);
      }
    }
  }
</script>

<style scoped>
  .demo-upload-list{
    display: inline-block;
    width: 60px;
    height: 60px;
    text-align: center;
    line-height: 60px;
    border: 1px solid transparent;
    border-radius: 4px;
    overflow: hidden;
    background: #fff;
    position: relative;
    box-shadow: 0 1px 1px rgba(0,0,0,.2);
    margin-right: 4px;
  }
  .demo-upload-list img, .demo-upload-list .img{
    width: 100%;
    height: 100%;
  }
  .demo-upload-list-cover{
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0,0,0,.6);
  }
  .demo-upload-list:hover .demo-upload-list-cover{
    display: block;
  }
  .demo-upload-list-cover i{
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
</style>
