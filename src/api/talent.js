import { getRequest, postRequest, postJson } from "../libs/axios";

/**
 *  人才管理
 */

// 手机号验证重复
export const checkByPhone = (params) => {
  return getRequest('/talent/check', params);
};

// 添加-编辑
export const save = (params) => {
  return postJson('/talent/save', params);
};

// 获取详情
export const getDetail = (params) => {
  return getRequest('/talent/get', params);
};

// 列表
export const list = (params) => {
  return getRequest('/talent/list', params);
};

// 修改关注状态
export const toggleFollow = (params) => {
  return postRequest('/talent/toggle-follow', params);
};

// 获取所有跟踪记录
export const getAllRemind = (params) => {
  return getRequest('/talent/remind-all', params);
};

// 添加跟踪记录
export const addRemind = (params) => {
  return postJson('/talent/remind-add', params);
};

// 专属人才变动
export const toggleType = (params) => {
  return postRequest('/talent/toggleType', params);
};

// 批量结束跟进
export const finishRemind = (params) => {
  return postJson('/talent/remind/finish', params);
};

// 获取人才的项目经历
export const getTalentProjects = (params) => {
  return getRequest('/talent/project', params);
};
