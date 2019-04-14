import { getRequest, postRequest, postJson } from "../libs/axios";

/**
 * 客户管理
 * @param params
 */

// 编辑
export const save = (params) => {
  return postJson('/customer/save', params);
};

// 列表
export const list = (params) => {
  return getRequest('/customer/list', params);
};

// 通过key获取customer
export const get = (params) => {
  return getRequest('/customer/get', params);
};

// 修改关注状态
export const toggleFollow = (params) => {
  return postRequest('/customer/toggle-follow', params);
};

// 添加客户跟踪
export const addRemind = (params) => {
  return postJson('/customer/add-remind', params);
};

// 获取客户跟踪记录
export const remindList = (params) => {
  return getRequest('/customer/remind-list', params);
};

// 获取所有客户
export const allCustomer = (params) => {
  return getRequest('/customer/customer-all', params);
};

// 获取所有客户
export const allDepartment = (params) => {
  return getRequest('/customer/department-all', params);
};

// 获取公司下所有人才
export const getCustomerTalent = (params) => {
  return getRequest('/customer/talent-all', params);
};

// 获取联系人
export const getCustomerContact = (params) => {
  return getRequest('/customer/contact/all', params);
};

// 添加联系人
export const saveContact = (params) => {
  return postJson('/customer/contact/save', params);
};

// 添加联系记录
export const addContactRemark = (params) => {
  return postJson('/customer/contact/remark/save', params);
};

// 列名或取消列名
export const toggleBindFollowUser = (params) => {
  return postRequest('/customer/contact/bindFollowUser-toggle', params);
};

// 获取客户下所有部门
export const getCustomerDepartments = (params) => {
  return getRequest('/customer/department/byId', params);
};

// 删除客户下的联系人
export const removeCustomerContact = (params) => {
  return postJson('/customer/contact/del', params);
};

// 结束跟进
export const finishRemind = (params) => {
  return postJson('/customer/finish-remind', params);
};

// 获取公司项目列表
export const getProjects = (params) => {
  return getRequest('/customer/project/page', params);
};

// 获取可创建项目的公司
export const findProjectCustomers = (params) => {
  return getRequest('/customer/customerOfProject', params);
};
