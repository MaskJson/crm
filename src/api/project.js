import { getRequest, postRequest, postJson } from "../libs/axios";


// 项目添加-编辑
export const saveProject = (params) => {
  return postJson('/project/save', params);
};

// 获取项目详情
export const getProjectInfo = (params) => {
  return getRequest('/project/info', params);
};

// 项目列表
export const projectList = (params) => {
  return getRequest('/project/list', params);
};

// 修改关注状态
export const toggleFollow = (params) => {
  return postRequest('/project/toggle-follow', params);
};

// 根据进展状态获取项目下的人才
export const getProjectTalentByStatus = (params) => {
  return getRequest('/project/talent/getByStatus', params);
};

// 添加项目人才跟踪
export const addProjectTalentRemind = (params) => {
  return postJson('/project/remind/add', params);
};

// 添加项目进展人才
export const addProjectTalent = (params) => {
  return postJson('/project/talent/add', params);
};

// 获取该项目的所有非淘汰人才
export const allProjectTalent = (params) => {
  return getRequest('/project/talent/all', params);
};

// 获取诊断报告所需数据
export const getReportData = (params) => {
  return getRequest('/project/report/data', params);
};

// 添加诊断报告
export const addReport = (params) => {
  return postJson('/project/report/add', params);
};

// 推荐客户二次审核
export const reviewTalent = (params) => {
  return postRequest('/project/talent/review', params);
};

// 获取对当前用户开放的项目
export const openByUserId = (params) => {
  return getRequest('/project/openByUserId', params);
};
