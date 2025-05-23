/*
 data: 目标对象, 你要让哪个对象变成响应式的 
 key: 目标对象的属性

 给对象某个属性添加了监听器,从而可以追踪这个属性的读取和赋值行为
\*/
import { observe } from './observe.js';
import Dep from './Dep.js';

export default function defineReactive(data, key, val) {
    const dep = new Dep();
    //如果只传了两个参数data和key,那么就自动从data[key]中取出当前值作为val的初始值 
    if (arguments.length === 2) {
        val = data[key];
    }
    //子元素要进行oberve,至此形成了递归,这个递归不是函数自己调用自己,而是多个函数,类循环调用
    let childOb = observe(val);
    Object.defineProperty(data, key, {
        //可枚举
        enumerable: true,
        //可以被配置
        configurable: true,
        get: function () {
            console.log(`你在访问${key}属性`);
            //如果现在处于依赖收集阶段
            if (Dep.target) {
                dep.depend();
                if (childOb) {
                    childOb.dep.depend();
                }
            }
            return val;
        },
        set: function (newValue) {
            console.log('set');
            if (val === newValue) return;
            val = newValue;
            //当设置了新值,这个新值也要被observe 
            childOb = observe(newValue);

            //发布订阅模式,通知dep 
            dep.notify();
        }
    });
}

