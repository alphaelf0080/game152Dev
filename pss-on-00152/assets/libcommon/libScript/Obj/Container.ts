import { _decorator } from 'cc';
import { logCtrl, LogType } from '../Controller/LogController';

// 依賴注入容器
export class Container {
    private static instance: Container;
    private dependencies: Map<string, any> = new Map<string, any>();
    private keys: string[] = [];

    private constructor() { }

    static getInstance(): Container {
        if (!Container.instance) {
            Container.instance = new Container();
        }
        return Container.instance;
    }

    register(key: string, dependency: any): void {
        if(this.hasKey(key)) this.unregister(key);
        this.dependencies.set(key, dependency);
        this.keys.push(key);
    }

    unregister(key: string) {
        if (!this.hasKey(key)) return;
        this.dependencies.delete(key);
        this.keys = this.keys.filter(e => e !== key);
    }

    get(key: string): any {
        let dependency = this.dependencies.get(key);
        if (dependency) {
            return this.dependencies.get(key);
        }
        logCtrl.log(LogType.Normal, `Container -- No dependency found for identifier: ${key}`);
        return null;
    }

    hasKey(key: string): boolean {
        return this.dependencies.has(key);
    }

    getKeys() {
        return this.keys;
    }
}

// Injectable 裝飾器，用於不是instance的註冊，會自動建立物件
export function Injectable() {
    return function (constructor: any) {
        const container = Container.getInstance();
        container.register(constructor.name, new constructor());
    };
}

export function Inject(serviceIdentifier: string) {
    return function (target: any, propertyKey: string) {
        const container = Container.getInstance();

        // 定義屬性的 getter
        Object.defineProperty(target, propertyKey, {
            get: function () {
                return container.get(serviceIdentifier);
            }
        });
    };
}

// 注入所有腳本裡有用Inject注入的變數值
export function inject(target: any): void {
    const container = Container.getInstance();

    // 獲取所有屬性
    for (const propertyKey of Object.getOwnPropertyNames(target)) {
        // 檢查屬性是否有注入標記
        const token = Reflect.get(target, propertyKey);
        if (token) {
            // 從容器中解析服務並注入
            const service = container.get(token);
            target[propertyKey] = service;
        }
    }
}

