export default {
    ensure: function ensure(target, item) {
        //只有当前数组不存在此元素时只添加它
        if (target.indexOf(item) === -1) {
            return target.push(item);
        }
    },
    removeAt: function removeAt(target, index) {
        //移除数组中指定位置的元素，返回布尔表示成功与否
        return !!target.splice(index, 1).length;
    },
    remove: function remove(target, item) {
        //移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否
        var index = target.indexOf(item);
        if (~index) return this.removeAt(target, index);
        return false;
    }
};