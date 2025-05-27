import { def } from './utils.js';
import defineReactive from "./defineReactive.js";
import { arrayMethods } from './array.js';
import Dep from './Dep.js';

//作用:  将一个正常的object转换为每个层级的属性都是响应式(可以被侦测的object)
export default class Observer {
    constructor(value) {
        //每一个Observer的实例身上,都有一个dep
        this.dep = new Dep();
        // 给实例(this,一定要注意,构造函数中的this不是表示类本身,而是表示实例)添加了__ob__属性,只是这次new的实例
        def(value, '__ob__', this, false);
        console.log('我是Observer构造器', value);
        //检查是数组还是对象
        if (Array, isArray(value)) {
            //如果是数组,要非常强行的蛮干: 将这个数组的原型,指向arrayMethods
            Object.setPrototypeOf(value, arrayMethods);
            //让这个数组变得observe 
            this.ObserverArray(value);
        }
    }

    //遍历
    walk(value) {
        for (let k in value) {
            defineReactive(value, k);
        }
    }

    ObserverArray(arr) {
        for (let i = 0; i < arr.length; i++) {
            //逐项进行observe
            observe(arr[i]);
        }
    }
};

class Observer {
    constructor(value) {

        //要被观察的数据对象或数组
        this.value = value;
        //实例化一个依赖收集器Dep,用于在这个对象本身发生变化时通知依赖更新
        this.dep = new Dep();

        //标记这个对象已经被响应式处理过,防止重复处理
        object.defineProperty(value, '__ob__', {
            value: this,
            enumerable: false,
        });
        //如果是数组
        if (Array.isArray(value)) {
            //重写数组方法实现响应式
            this.augmentArray(value);
            //递归监听数组元素 
            this.observeArray(value);
        } else {
            //如果是普通对象,给对象的所有袁术添加getter.setter 
            this.walk(value);
        }

    }

    //对象属性递归响应式处理
    walk(obj) {
        Object.keys(obj).forEach(key => {
            defineReactive(obj, key, obj[key]);
        });
    }
    //重写数组原型方法 
    augmentArray(arr) {
        arr.__proto__ = arrayMethods;
    }
}

