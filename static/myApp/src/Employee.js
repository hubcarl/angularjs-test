define(function(require, exports, module) {
  var add = require('./math').add;
  exports.increment = function(val) {
    return add(val, 1);
  };

  
  function Employee(id,name)
  {
    console.log('Employee init Start!');

  	this.id = id;
  	this.name = name;
    this.wage =0;
     
    this.init=function(wage)
    {
      this.wage = wage;
    },

    this.getWage=function()
    {
      return this.name + 'wage is:' +  this.wage;
    }
    
    this.Company = 
    {
        ID: 1,
        Name: "UC",
        showMessage: function()
        {
            return ("ID: " + this.ID + "  Name: " + this.Name);
        }
    }

    console.log('Employee init End!');
    //this.Company = Company;
  }

  Employee.prototype.toString=function()
  {
  	return "id:" + this.id +", name:" + this.name;
  }

  Employee.increment2 = function(val) {
    return add(val, 1);
  };

  Employee.prototype.constructor();

  //exports.Employee = Employee;
  module.exports=Employee;
});