import { getRequest, postRequest } from "../libs/axios";

/**
 * 公共模块
 * @param params
 */

// 根据表名和name按需获取模块列表
export const getListByTableName = (params) => {
  return getRequest('/common/list', params);
};

// 下载文件
export const uploadFile = (params) => {
  return getRequest('/common/file', params);
};

// 下载文件64
export const base64 = (params) => {
  return getRequest('/common/base64', params);
};

