let watcherId = 0;

class Watcher {
    constructor(vm, expOrFn, cb) {
        //为每个watcher分配唯一id(用于优化)
        this.id = watcherId++;
        //当前组件实例 
        this.vm = vm;
        this.getter = expOrFn; //表达式函数或渲染函数,比如render或某个计算属性getter 
        this.cb = cb;//数据更新后调用的回调,比如更新DOM 
        this.deps = [];//当前Watcher依赖了哪些Dep 
        this.get(); //初次执行getter,触发依赖收集 
    }
    get() {
        Dep.target = this; //当前正在求值的watcher(静态属性)
        this.getter.call(this.vm); //执行getter,触发data的getter,从而进行依赖收集 
        Dep.target = null; //清空target,避免污染其他依赖收集
    }
    //每个响应式数据(通过defineReactive实现)在getter被触发时,会把Dep.target添加到自己的subs(订阅者列表)中,
    //最终完成Dep记录Watcher,也就是Watcher鼎娱乐Dep 

    //添加依赖 
    addDep(dep) {
        dep.addSub(this); //将当前watcher添加到Dep的订阅者列表中
        this.deps.push(dep); //记录依赖了哪个Dep(用于后续取消依赖)
    }
    update() {
        //这里执行视图更新逻辑,调用回调 
        this.cb();
    }
    //当某个响应式数据发生变化,它的dep.notify()方法会被调用
    //notify() 会遍历所有订阅它的Watcher,执行他们的update()方法
    //a1功能

    //在家里写的功能


    //在公司开发了一半的功能,有人来找我吃饭 撒撒

}

