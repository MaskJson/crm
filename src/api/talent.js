import { getRequest, postRequest, postJson } from "../libs/axios";

/**
 *  人才管理
 */

// 手机号验证重复
export const checkByPhone = (params) => {
  return getRequest('/talent/check', params);
};
