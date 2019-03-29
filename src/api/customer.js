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
