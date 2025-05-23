class Promise {
    //构造方法
    constructor(executor) {
        //同步调用(执行器函数),也就是(resolve,reject)=>{}
        //执行器函数的用于执行异步操作,并在操作完成时决定Promise的状态,执行器函数接收两个参数,分别是resolve和reject函数
        //添加属性
        this.PromiseState = 'pending';
        this.PromiseResult = null;
        //声明属性
        this.callbacks = [];
        //保存实例对象的this的值 
        const self = this;
        //resolve函数 
        function resolve(data) {
            //直接调用this指向windows 
            //判断状态
            if (self.PromiseState !== 'pending') return;
            //1.修改对象的状态(promiseState)
            self.PromiseState = 'fulfilled';
            //2.设置对象结果值(promiseResult)
            self.PromiseResult = data;
            //调用成功的回调函数
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onResolved(data);
                });
            });

        }
        //reject函数
        function reject(data) {
            //判断状态
            if (self.PromiseState !== 'pending') return;
            //1.修改对象的状态(promiseState)
            self.PromiseState = 'rejected';
            //2.设置对象结果值(promiseResult)
            self.PromiseResult = data;
            //执行失败的回调
            setTimeout(() => {
                self.callbacks.forEach(item => {
                    item.onRejected(data);
                });
            });
        }
        try {
            //同步调用[执行器函数]
            executor(resolve, reject);
        } catch (e) {
            //修改promise 对象状态为[失败]
            reject(e);
        }

    }

    //then 方法封装
    then(onResolved, onRejected) {
        const self = this;
        //判断回调函数参数 如果传递的不是一个函数,就抛出一个默认值
        if (typeof onRejected !== 'function') {
            //抛出默认值函数
            onRejected = reason => {
                throw reason;
            };
        }
        //处理如果.then如果没有传回调函数 
        if (typeof onResolved !== 'function') {
            //抛出默认值函数 return value
            onResolved = value => value;
        }
        //.then方法的返回值
        return new Promise((resolve, reject) => {
            //封装函数
            function callback(type) {
                try {
                    //取到实例对象.then的返回值
                    let result = type(self.PromiseResult);
                    //判断
                    if (result instanceof Promise) {
                        //如果是Promise 类型的对象
                        result.then(v => {
                            resolve(v);
                        }, r => {
                            reject(r);
                        });

                    } else {
                        //结果的对象状态为成功
                        resolve(result);
                    }
                } catch (e) {
                    reject(e);
                }
            }
            //调用回调函数  
            if (this.PromiseState === 'fulfilled') {
                setTimeout(() => {
                    callback(onResolved);
                });

            }
            if (this.PromiseState === 'rejected') {
                setTimeout(() => {
                    callback(onRejected);
                });

            }
            //判断pending状态
            if (this.PromiseState == 'pending') {
                //保存回调函数 
                this.callbacks.push({
                    //当成功的时候会调用(.then的回调函数)
                    onResolved: function () {
                        callback(onResolved);
                    },
                    //当失败的时候会调用
                    onRejected: function () {
                        //执行成功回调函数
                        callback(onRejected);
                    },
                });
            }
        });
    }

    //catch方法
    catch(onRejected) {
        return this.then(undefined, onRejected);
    }

    //resolve方法 
    static resolve(value) {
        //返回Promise对象
        return new Promise((resolve, reject) => {
            //传入的value进行判断
            if (value instanceof Promise) {
                value.then(v => {
                    resolve(v);
                }, r => {
                    reject(r);
                });
            } else {
                //状态设置为成功
                resolve(value);
            }
        });
    }

    //添加reject 方法 
    static reject(reson) {
        return new Promise((resolve, reject) => {
            reject(reson);
        });
    }

    //添加all方法 
    static all(promises) {
        return new Promise((resolve, reject) => {
            let count = 0;
            //存放成功结果
            let arr = [];
            //存放成功结果
            for (let i = 0; i < promises.length; i++) {
                //遍历
                promises[i].then(v => {
                    //的值对象的状态是成功
                    //每个promise对象都是成功
                    count++;
                    //将当前的promise对象成功的结果,存入到数组中
                    arr[i] = v;
                    //判断
                    if (count === promises.length) {
                        //都成功
                        resolve(arr);
                    }
                }, r => {
                    reject();
                });

            }
        });
    }

    //race方法
    static race(promises) {
        return new Promise((resolve, reject) => {
            for (let i = 0; i < promises.length; i++) {
                promises[i].then(v => {
                    //修改返回对象的状态为成功
                    resolve(v);
                }, r => {
                    //修改返回对象的状态为失败
                    reject(r);
                });
            }

        });
    }
}
