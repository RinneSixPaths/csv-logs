function extend(object)
{
    var mixins = Array.prototype.slice.call(arguments, 1);
    for (var i = 0; i < mixins.length; ++i)
    {
        for (var prop in mixins[i])
        {
            if (typeof object.prototype[prop] === "undefined")
            {
                bindMethod = function (mixin, prop)
                {
                    return function () { mixin[prop].apply(this, arguments) }
                }

                object.prototype[prop] = bindMethod(mixins[i], prop);
            }
        }
    }
}

var Mixin_Babbler =  
{
    say: function () { 
        console.log("Name is " + this.name + " and i think:'" + this.THOUGHTS + "'"); 
        console.log(arguments); 
    },
    argue: function() { 
        console.log("wrong"); 
    }
};

function Man(name)
{
    this.name = name;
}

Man.prototype =
{
    constructor: Man,
     
    THOUGHTS: "Something"
}

extend(Man, Mixin_Babbler);

var man = new Man("Bob");

console.log(man.say);
man.argue();

Mixin_Babbler.say = function() {
    console.log('changed');
}

console.log(man.say);