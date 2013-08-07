

start
  = (statement)* 


statement =
 (w newline)* value:(binding/ additive  ) (w newline)*
 {return {token:'statement', value:value}}

binding =
  w left:symbol w ':' w right:(additive) {return {token:'binding', left:left, right:right}}

additive
  = left:multiplicative op:("+" / "-") right:additive { return {token:'additive', left:left, right:right, op:op}; }
  / multiplicative 

multiplicative
  = left:primary op:("*" / "/" / "%") right:multiplicative { return {token:'multiplicative', left:left, right:right, op:op}; }
  / primary

primary
  = (area / symbol )  
  / w "(" w additive:additive w ")" w { return additive; }

area =
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