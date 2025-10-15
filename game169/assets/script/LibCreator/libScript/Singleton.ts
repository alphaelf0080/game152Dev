import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

// Singleton 是泛型基類，不需要註冊為 Cocos 組件
export class Singleton<T> {
  private static inst = null;
  public static getInstance<T>(c: { new(): T }): T {
    // 如果沒有被初始化過，就初始化一個
    if (!this.inst) this.inst = new c();
    return this.inst;
  }
}

