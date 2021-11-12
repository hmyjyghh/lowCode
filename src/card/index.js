const allComponents = require.context('./', false, /[^.]+\.vue/); //require.context返回一个函数对象

// console.log(allComponents.keys());

allComponents.keys().forEach(element => {
    // console.log(element, allComponents(element).default);
});
