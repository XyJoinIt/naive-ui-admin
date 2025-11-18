import { Menu } from '@/router/types';
import { Alova } from '@/utils/http/alova/index';
/**
 * @description: 根据用户id获取用户菜单
 */
export function adminMenus() {
  return Alova.Get('/sys/menu/loginMenu');
}

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuList(params?: any) {
  return Alova.Get<Menu[]>('/sys/menu/list', { params });
  //return Alova.Get<Menu[]>('/sys/menu/list');
}
