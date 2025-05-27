var uid = 0;
export default class Dep {
    constructor() {
        console.log('我是Dep类的构造器');
        this.id = uid++;
        //用数组存储自己的订阅者,subs是英语subscribes订阅者的意思 
        //这个数组里面放的是Watcher的实例
        this.subs = [];
    }
    //添加订阅
    addSub(sub) {
        this.subs.push(sub);
    }
    //添加依赖 
    depend() {
        //Dep.target就是一个我们自己指定的全局的位置,你用window.target也行,
        //只要是全局唯一,没有歧义就行
        if (Dep.target) {
            this.addSub(Dep.target);
        }
    }
    //通知更新
    notify() {
        console.log('我是notify');
        //浅克隆一份 
        const subs = this.subs.slice();
        // 遍历
        for (let i = 0, l = subs.length; i < l; i++) {
            subs[i].update();
        }
    }

}

let uid = 0;
class Dep {
    //每个Deo实例代表一个"响应式属性"的依赖容器
    //每一个被defineReactive()包括的属性都会对应一个Dep实例
    //用于存放所有依赖这个属性Watcher(比如组件渲染函数,计算属性,侦听器)


    //用于给每个Dep实例生成唯一ID(调试用,无功能性作用)
    constructor() {
        this.id = uid++;
        //用于存放所有依赖这个属性的Watcher
        this.subs = [];
    }



}