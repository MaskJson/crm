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
