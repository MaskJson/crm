import { getRequest, postRequest, postJson } from "../libs/axios";

/**-
 * 待办、统计等数据
 */

// 获取人才待办列表
export const talentPendingList = (params) => {
  return getRequest('/count/talent/pending', params);
};

// 获取客户待办列表
export const customerPendingList = (params) => {
  return getRequest('/count/customer/pending', params);
};

// 获取人才地图
export const talentMap = (params) => {
  return getRequest('/count/talent/map', params);
};

// 获取各个状态的人才
export const statusTalent = (params) => {
  return getRequest('/count/talent/map/status', params);
};

// 获取收藏的人才
export const folderTalent = (params) => {
  return getRequest('/count/talent/map/folder', params);
};
