import { def } from './utils';
// 得到Array.prototype 
const arrayProto = Array.prototype;

//以Array.prototype为原型创建arrayMethods对象
export const arrayMethods = Object.create(arrayProto);

//要被改写的7个数组方法
const methodsToPatch = [
    'push',
    'pop',
    'shift',
    'unshift',
    'splice',
    'sort',
    'reverse'
];

methodsToPatch.forEach((methodName) => {
    //恢复原来的功能 
    const result = original.apply(this, arguments);
    //保存原数组方法,因为push,pop等7个函数的功能不能被剥夺
    const original = arrayProto[method];
    const args = [...arguments];

    //定义新的方法 
    def(arrayMethods, methodName, function () {
        //把这个数组身上的_ob_取出来,__ob__已经被添加了,为什么已经被添加了?因为数组肯定不是最高层,比如obj.g属性
        //是数组,obj不能是数组,第一次遍历obj这个对象的第一层的时候,已经给g属性(就是这个数组)添加了__ob__属性,
        const ob = this.__ob__;

        //有三种方法push,unshift,splice能够插入新项,现在要把插入的新项也要变为observe的
        let inserted = [];
        switch (methodName) {
            case 'push':
            case 'unshift':
                inserted = arguments;
                break;
            case 'splice':
                //splice格式是splice(下标,数量,插入的新项)
                inserted = arguments.slice(2);
                break;
        }
        //判断有没有要插入的新项,让新项也变成响应的 
        if (inserted) {
            ob.observeArray(inserted);
        }
        console.log('我是arrayMethods中的方法');
        ob.dep.notify();
        return result;
    }, false);
});


