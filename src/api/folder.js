import { getRequest, postRequest, postJson } from "../libs/axios";

/**
 * 收藏夹
 */

// 获取所有收藏夹 1：客户 2：人才 3：项目
export const list = (params) => {
  return getRequest('/folder/list', params);
};

// 添加-编辑
export const save = (params) => {
  return postJson('/folder/save', params);
};

// 启用-禁用删除
export const remove = (params) => {
  return postRequest('/folder/remove', params);
};

// 启用-禁用
export const toggle = (params) => {
  return postRequest('/folder/toggle', params);
};

// 关联收藏夹
export const bindFolder = (params) => {
  return postJson('/folder/bind', params);
};
