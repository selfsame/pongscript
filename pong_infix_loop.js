start
  = (statement)* 


statement =
 (w newline)* value:(binding / low / high / primary  ) (w newline)*
 {return {token:'statement', value:value}}

binding =
  w left:symbol w ':' w right:(low / high / primary) {return {token:'binding', left:left, right:right}}



high
  = first:primary rest:highpair+ {return {token: 'high', first:first, rest:rest}}

low
  = first:(high / primary) rest:lowpair+ {return {token: 'low', first:first, rest:rest}}

primary
  = (vector / symbol / parenthesis_group  )  

parenthesis_group = w "(" w value:(low / high / primary  ) w ")" w {return {token: 'group', value:value}}

highpair = ( w op:highop w val:primary ) {return {op:op, value:val}}
lowpair = (w op:lowop w val:(high / primary) ) {return {op:op, value:val}}

highop = (mult / div / mod)
lowop = (add /  sub )

mod = "%" {return "mod"}
div = "/" {return "div"}
mult= "*" {return "mult"}
add = "+" {return "add"}
sub = "-" {return "sub"}

vector =
 w vals:(dval)+ w {
  rect = {};

  for (i=0; i<vals.length; i++){
    v = vals[i];
    rect[v.attr] = v.val;
  }
  return {token:'vector', value:rect}
}


dval
 = w val:number symbol:symbol  w {return {val:val, attr:symbol.value} }

symbol = w v:[a-z_]+ w {return {token:'symbol', value:v.join('')}}

core = w v:[A-Z_]+ w {return {token:'core', value:v.join('')}}

number
  = w number:(float / integer) w
    {return number}

float
  = sign:"-"?
    before:[0-9]* "." after:[0-9]+ {
      return parseFloat(sign+before.join("") + "." + after.join(""));
    }

integer
  = sign:"-"?
    digits:[0-9]+ {
      return parseInt(sign+digits.join(""), 10);
    }

w
  = string:(" " / tab )* {return string.join('')}

newline =
  [\n] {return "\n" }

tab =
  [\t] {return "\t" }