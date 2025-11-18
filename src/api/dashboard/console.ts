import { Alova } from '@/utils/http/alova/index';
import { faker } from '@faker-js/faker';
export interface TypeVisits {
  dayVisits: number;
  rise: number;
  decline: number;
  amount: number;
}
export interface TypeSaleroom {
  weekSaleroom: number;
  amount: number;
  degree: number;
}

export interface TypeOrderLarge {
  weekLarge: number;
  rise: number;
  decline: number;
  amount: number;
}

export interface TypeConsole {
  visits: TypeVisits;
  //销售额
  saleroom: TypeSaleroom;
  //订单量
  orderLarge: TypeOrderLarge;
  //成交额度
  volume: TypeOrderLarge;
}

//获取主控台信息
export function getConsoleInfo() {
  const result = {
    //访问量
    visits: {
      dayVisits: getRandom({ min: 10000, max: 99999, dec: 2 }),
      rise: getRandom({ min: 10000, max: 99999, dec: 0 }),
      decline: getRandom({ min: 10000, max: 99999, dec: 0 }),
      amount: getRandom({ min: 10000, max: 99999, dec: 2 }),
    },
    //销售额
    saleroom: {
      weekSaleroom: getRandom({ min: 10000, max: 99999, dec: 2 }),
      amount: getRandom({ min: 10000, max: 99999, dec: 2 }),
      degree: getRandom({ min: 10000, max: 99999, dec: 0 }),
    },
    //订单量
    orderLarge: {
      weekLarge: getRandom({ min: 10000, max: 99999, dec: 2 }),
      rise: getRandom({ min: 10000, max: 99999, dec: 0 }),
      decline: getRandom({ min: 10000, max: 99999, dec: 0 }),
      amount: getRandom({ min: 10000, max: 99999, dec: 2 }),
    },
    //成交额度
    volume: {
      weekLarge: getRandom({ min: 10000, max: 99999, dec: 2 }),
      rise: getRandom({ min: 10000, max: 99999, dec: 0 }),
      decline: getRandom({ min: 10000, max: 99999, dec: 0 }),
      amount: getRandom({ min: 10000, max: 99999, dec: 2 }),
    },
  };
  return result;
  return Alova.Get<TypeConsole>('/dashboard/console');
}

function getRandom(options) {
  return Number(faker.commerce.price(options));
}
