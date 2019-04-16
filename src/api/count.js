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

// 顾问获取诊断待办
export const reportPendingList = (params) => {
  return getRequest('/count/project/report/pending', params);
};

// 总监查看诊断记录
export const getReports = (params) => {
  return getRequest('/count/project/report/list', params);
};

// 总监查看未处理的推荐
export const getRecommends = (params) => {
  return getRequest('/count/recommend/pending', params);
};

// 首页统计
export const homeCount = (params) => {
  return getRequest('/count/home', params);
};

// 项目进展提醒列表
export const progressList = (params) => {
  return getRequest('/count/project/progress', params);
};
