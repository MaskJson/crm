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
