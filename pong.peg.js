

start
  = (statement)* 


statement =
 (w newline)* value:(binding / high / low / primary  ) (w newline)*
 {return {token:'statement', value:value}}

binding =
  w left:symbol w ':' w right:(high / low / primary) {return {token:'binding', left:left, right:right}}



high
  = first:primary rest:highpair+ {return {token: 'high', first:first, rest:rest}}

low
  = first:(high / primary) rest:lowpair+ {return {token: 'low', first:first, rest:rest}}

primary
  = (literal / symbol  )  


highpair = ( w op:highop w val:primary ) {return {op:op, val:val}}
lowpair = (w op:lowop w val:(high / primary) ) {return {op:op, val:val}}

highop = ("*" / "/" / "%")
lowop = ("+" /  "-" )

literal =
 w vals:(dval)+ w {
  rect = {};

  for (i=0; i<vals.length; i++){
    v = vals[i];
    rect[v.attr] = v.val;
  }
  return {token:'literal', value:rect}
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