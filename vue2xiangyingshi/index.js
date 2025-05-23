
import {
    observe
} from './observe.js';

console.log(111111111);

var obj = {
    a: {
        m: {
            n: 5
        }
    },
    b: 10,
    c: {
        d: {
            e: {
                f: 5
            }

        }
    },
    g: [22, 33, 44, 55]
};

observe(obj);
obj.g.splice(2, 1, [88, 99]);
obj.g.push(66);