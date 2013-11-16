define(function(require, exports) {
  //exports.foo = 'bar';
  //exports.doSomething = function() {alert('exports test')};

  
  console.log("start");
  
  var Emp = require('./Employee');
  var a = 1;
  var result = Emp.increment2(a); // 2
  
  console.log("a:"+a);
  console.log("result:"+result);

  // exports
  //var e = new Emp.Employee('001','carl');
  //console.log(e.toString());

  //module.exports
  var e = new Emp('001','carl');
  console.log(e.toString());

  console.log(e.getWage());

  console.log(e.Company.showMessage());
  
  var $ = require('jquery');
  console.log($("#container").val());

  console.log("and");
})