"use strict";


//     Underscore.js 1.8.3
//     http://underscorejs.org
//     (c) 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){function n(n){function t(t,r,e,u,i,o){for(;i>=0&&o>i;i+=n){var a=u?u[i]:i;e=r(e,t[a],a,t)}return e}return function(r,e,u,i){e=b(e,i,4);var o=!k(r)&&m.keys(r),a=(o||r).length,c=n>0?0:a-1;return arguments.length<3&&(u=r[o?o[c]:c],c+=n),t(r,e,u,o,c,a)}}function t(n){return function(t,r,e){r=x(r,e);for(var u=O(t),i=n>0?0:u-1;i>=0&&u>i;i+=n)if(r(t[i],i,t))return i;return-1}}function r(n,t,r){return function(e,u,i){var o=0,a=O(e);if("number"==typeof i)n>0?o=i>=0?i:Math.max(i+a,o):a=i>=0?Math.min(i+1,a):i+a+1;else if(r&&i&&a)return i=r(e,u),e[i]===u?i:-1;if(u!==u)return i=t(l.call(e,o,a),m.isNaN),i>=0?i+o:-1;for(i=n>0?o:a-1;i>=0&&a>i;i+=n)if(e[i]===u)return i;return-1}}function e(n,t){var r=I.length,e=n.constructor,u=m.isFunction(e)&&e.prototype||a,i="constructor";for(m.has(n,i)&&!m.contains(t,i)&&t.push(i);r--;)i=I[r],i in n&&n[i]!==u[i]&&!m.contains(t,i)&&t.push(i)}var u=this,i=u._,o=Array.prototype,a=Object.prototype,c=Function.prototype,f=o.push,l=o.slice,s=a.toString,p=a.hasOwnProperty,h=Array.isArray,v=Object.keys,g=c.bind,y=Object.create,d=function(){},m=function(n){return n instanceof m?n:this instanceof m?void(this._wrapped=n):new m(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=m),exports._=m):u._=m,m.VERSION="1.8.3";var b=function(n,t,r){if(t===void 0)return n;switch(null==r?3:r){case 1:return function(r){return n.call(t,r)};case 2:return function(r,e){return n.call(t,r,e)};case 3:return function(r,e,u){return n.call(t,r,e,u)};case 4:return function(r,e,u,i){return n.call(t,r,e,u,i)}}return function(){return n.apply(t,arguments)}},x=function(n,t,r){return null==n?m.identity:m.isFunction(n)?b(n,t,r):m.isObject(n)?m.matcher(n):m.property(n)};m.iteratee=function(n,t){return x(n,t,1/0)};var _=function(n,t){return function(r){var e=arguments.length;if(2>e||null==r)return r;for(var u=1;e>u;u++)for(var i=arguments[u],o=n(i),a=o.length,c=0;a>c;c++){var f=o[c];t&&r[f]!==void 0||(r[f]=i[f])}return r}},j=function(n){if(!m.isObject(n))return{};if(y)return y(n);d.prototype=n;var t=new d;return d.prototype=null,t},w=function(n){return function(t){return null==t?void 0:t[n]}},A=Math.pow(2,53)-1,O=w("length"),k=function(n){var t=O(n);return"number"==typeof t&&t>=0&&A>=t};m.each=m.forEach=function(n,t,r){t=b(t,r);var e,u;if(k(n))for(e=0,u=n.length;u>e;e++)t(n[e],e,n);else{var i=m.keys(n);for(e=0,u=i.length;u>e;e++)t(n[i[e]],i[e],n)}return n},m.map=m.collect=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=Array(u),o=0;u>o;o++){var a=e?e[o]:o;i[o]=t(n[a],a,n)}return i},m.reduce=m.foldl=m.inject=n(1),m.reduceRight=m.foldr=n(-1),m.find=m.detect=function(n,t,r){var e;return e=k(n)?m.findIndex(n,t,r):m.findKey(n,t,r),e!==void 0&&e!==-1?n[e]:void 0},m.filter=m.select=function(n,t,r){var e=[];return t=x(t,r),m.each(n,function(n,r,u){t(n,r,u)&&e.push(n)}),e},m.reject=function(n,t,r){return m.filter(n,m.negate(x(t)),r)},m.every=m.all=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(!t(n[o],o,n))return!1}return!0},m.some=m.any=function(n,t,r){t=x(t,r);for(var e=!k(n)&&m.keys(n),u=(e||n).length,i=0;u>i;i++){var o=e?e[i]:i;if(t(n[o],o,n))return!0}return!1},m.contains=m.includes=m.include=function(n,t,r,e){return k(n)||(n=m.values(n)),("number"!=typeof r||e)&&(r=0),m.indexOf(n,t,r)>=0},m.invoke=function(n,t){var r=l.call(arguments,2),e=m.isFunction(t);return m.map(n,function(n){var u=e?t:n[t];return null==u?u:u.apply(n,r)})},m.pluck=function(n,t){return m.map(n,m.property(t))},m.where=function(n,t){return m.filter(n,m.matcher(t))},m.findWhere=function(n,t){return m.find(n,m.matcher(t))},m.max=function(n,t,r){var e,u,i=-1/0,o=-1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],e>i&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(u>o||u===-1/0&&i===-1/0)&&(i=n,o=u)});return i},m.min=function(n,t,r){var e,u,i=1/0,o=1/0;if(null==t&&null!=n){n=k(n)?n:m.values(n);for(var a=0,c=n.length;c>a;a++)e=n[a],i>e&&(i=e)}else t=x(t,r),m.each(n,function(n,r,e){u=t(n,r,e),(o>u||1/0===u&&1/0===i)&&(i=n,o=u)});return i},m.shuffle=function(n){for(var t,r=k(n)?n:m.values(n),e=r.length,u=Array(e),i=0;e>i;i++)t=m.random(0,i),t!==i&&(u[i]=u[t]),u[t]=r[i];return u},m.sample=function(n,t,r){return null==t||r?(k(n)||(n=m.values(n)),n[m.random(n.length-1)]):m.shuffle(n).slice(0,Math.max(0,t))},m.sortBy=function(n,t,r){return t=x(t,r),m.pluck(m.map(n,function(n,r,e){return{value:n,index:r,criteria:t(n,r,e)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={};return r=x(r,e),m.each(t,function(e,i){var o=r(e,i,t);n(u,e,o)}),u}};m.groupBy=F(function(n,t,r){m.has(n,r)?n[r].push(t):n[r]=[t]}),m.indexBy=F(function(n,t,r){n[r]=t}),m.countBy=F(function(n,t,r){m.has(n,r)?n[r]++:n[r]=1}),m.toArray=function(n){return n?m.isArray(n)?l.call(n):k(n)?m.map(n,m.identity):m.values(n):[]},m.size=function(n){return null==n?0:k(n)?n.length:m.keys(n).length},m.partition=function(n,t,r){t=x(t,r);var e=[],u=[];return m.each(n,function(n,r,i){(t(n,r,i)?e:u).push(n)}),[e,u]},m.first=m.head=m.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:m.initial(n,n.length-t)},m.initial=function(n,t,r){return l.call(n,0,Math.max(0,n.length-(null==t||r?1:t)))},m.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:m.rest(n,Math.max(0,n.length-t))},m.rest=m.tail=m.drop=function(n,t,r){return l.call(n,null==t||r?1:t)},m.compact=function(n){return m.filter(n,m.identity)};var S=function(n,t,r,e){for(var u=[],i=0,o=e||0,a=O(n);a>o;o++){var c=n[o];if(k(c)&&(m.isArray(c)||m.isArguments(c))){t||(c=S(c,t,r));var f=0,l=c.length;for(u.length+=l;l>f;)u[i++]=c[f++]}else r||(u[i++]=c)}return u};m.flatten=function(n,t){return S(n,t,!1)},m.without=function(n){return m.difference(n,l.call(arguments,1))},m.uniq=m.unique=function(n,t,r,e){m.isBoolean(t)||(e=r,r=t,t=!1),null!=r&&(r=x(r,e));for(var u=[],i=[],o=0,a=O(n);a>o;o++){var c=n[o],f=r?r(c,o,n):c;t?(o&&i===f||u.push(c),i=f):r?m.contains(i,f)||(i.push(f),u.push(c)):m.contains(u,c)||u.push(c)}return u},m.union=function(){return m.uniq(S(arguments,!0,!0))},m.intersection=function(n){for(var t=[],r=arguments.length,e=0,u=O(n);u>e;e++){var i=n[e];if(!m.contains(t,i)){for(var o=1;r>o&&m.contains(arguments[o],i);o++);o===r&&t.push(i)}}return t},m.difference=function(n){var t=S(arguments,!0,!0,1);return m.filter(n,function(n){return!m.contains(t,n)})},m.zip=function(){return m.unzip(arguments)},m.unzip=function(n){for(var t=n&&m.max(n,O).length||0,r=Array(t),e=0;t>e;e++)r[e]=m.pluck(n,e);return r},m.object=function(n,t){for(var r={},e=0,u=O(n);u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},m.findIndex=t(1),m.findLastIndex=t(-1),m.sortedIndex=function(n,t,r,e){r=x(r,e,1);for(var u=r(t),i=0,o=O(n);o>i;){var a=Math.floor((i+o)/2);r(n[a])<u?i=a+1:o=a}return i},m.indexOf=r(1,m.findIndex,m.sortedIndex),m.lastIndexOf=r(-1,m.findLastIndex),m.range=function(n,t,r){null==t&&(t=n||0,n=0),r=r||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=Array(e),i=0;e>i;i++,n+=r)u[i]=n;return u};var E=function(n,t,r,e,u){if(!(e instanceof t))return n.apply(r,u);var i=j(n.prototype),o=n.apply(i,u);return m.isObject(o)?o:i};m.bind=function(n,t){if(g&&n.bind===g)return g.apply(n,l.call(arguments,1));if(!m.isFunction(n))throw new TypeError("Bind must be called on a function");var r=l.call(arguments,2),e=function(){return E(n,e,t,this,r.concat(l.call(arguments)))};return e},m.partial=function(n){var t=l.call(arguments,1),r=function(){for(var e=0,u=t.length,i=Array(u),o=0;u>o;o++)i[o]=t[o]===m?arguments[e++]:t[o];for(;e<arguments.length;)i.push(arguments[e++]);return E(n,r,this,this,i)};return r},m.bindAll=function(n){var t,r,e=arguments.length;if(1>=e)throw new Error("bindAll must be passed function names");for(t=1;e>t;t++)r=arguments[t],n[r]=m.bind(n[r],n);return n},m.memoize=function(n,t){var r=function(e){var u=r.cache,i=""+(t?t.apply(this,arguments):e);return m.has(u,i)||(u[i]=n.apply(this,arguments)),u[i]};return r.cache={},r},m.delay=function(n,t){var r=l.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},m.defer=m.partial(m.delay,m,1),m.throttle=function(n,t,r){var e,u,i,o=null,a=0;r||(r={});var c=function(){a=r.leading===!1?0:m.now(),o=null,i=n.apply(e,u),o||(e=u=null)};return function(){var f=m.now();a||r.leading!==!1||(a=f);var l=t-(f-a);return e=this,u=arguments,0>=l||l>t?(o&&(clearTimeout(o),o=null),a=f,i=n.apply(e,u),o||(e=u=null)):o||r.trailing===!1||(o=setTimeout(c,l)),i}},m.debounce=function(n,t,r){var e,u,i,o,a,c=function(){var f=m.now()-o;t>f&&f>=0?e=setTimeout(c,t-f):(e=null,r||(a=n.apply(i,u),e||(i=u=null)))};return function(){i=this,u=arguments,o=m.now();var f=r&&!e;return e||(e=setTimeout(c,t)),f&&(a=n.apply(i,u),i=u=null),a}},m.wrap=function(n,t){return m.partial(t,n)},m.negate=function(n){return function(){return!n.apply(this,arguments)}},m.compose=function(){var n=arguments,t=n.length-1;return function(){for(var r=t,e=n[t].apply(this,arguments);r--;)e=n[r].call(this,e);return e}},m.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},m.before=function(n,t){var r;return function(){return--n>0&&(r=t.apply(this,arguments)),1>=n&&(t=null),r}},m.once=m.partial(m.before,2);var M=!{toString:null}.propertyIsEnumerable("toString"),I=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"];m.keys=function(n){if(!m.isObject(n))return[];if(v)return v(n);var t=[];for(var r in n)m.has(n,r)&&t.push(r);return M&&e(n,t),t},m.allKeys=function(n){if(!m.isObject(n))return[];var t=[];for(var r in n)t.push(r);return M&&e(n,t),t},m.values=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},m.mapObject=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=u.length,o={},a=0;i>a;a++)e=u[a],o[e]=t(n[e],e,n);return o},m.pairs=function(n){for(var t=m.keys(n),r=t.length,e=Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},m.invert=function(n){for(var t={},r=m.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},m.functions=m.methods=function(n){var t=[];for(var r in n)m.isFunction(n[r])&&t.push(r);return t.sort()},m.extend=_(m.allKeys),m.extendOwn=m.assign=_(m.keys),m.findKey=function(n,t,r){t=x(t,r);for(var e,u=m.keys(n),i=0,o=u.length;o>i;i++)if(e=u[i],t(n[e],e,n))return e},m.pick=function(n,t,r){var e,u,i={},o=n;if(null==o)return i;m.isFunction(t)?(u=m.allKeys(o),e=b(t,r)):(u=S(arguments,!1,!1,1),e=function(n,t,r){return t in r},o=Object(o));for(var a=0,c=u.length;c>a;a++){var f=u[a],l=o[f];e(l,f,o)&&(i[f]=l)}return i},m.omit=function(n,t,r){if(m.isFunction(t))t=m.negate(t);else{var e=m.map(S(arguments,!1,!1,1),String);t=function(n,t){return!m.contains(e,t)}}return m.pick(n,t,r)},m.defaults=_(m.allKeys,!0),m.create=function(n,t){var r=j(n);return t&&m.extendOwn(r,t),r},m.clone=function(n){return m.isObject(n)?m.isArray(n)?n.slice():m.extend({},n):n},m.tap=function(n,t){return t(n),n},m.isMatch=function(n,t){var r=m.keys(t),e=r.length;if(null==n)return!e;for(var u=Object(n),i=0;e>i;i++){var o=r[i];if(t[o]!==u[o]||!(o in u))return!1}return!0};var N=function(n,t,r,e){if(n===t)return 0!==n||1/n===1/t;if(null==n||null==t)return n===t;n instanceof m&&(n=n._wrapped),t instanceof m&&(t=t._wrapped);var u=s.call(n);if(u!==s.call(t))return!1;switch(u){case"[object RegExp]":case"[object String]":return""+n==""+t;case"[object Number]":return+n!==+n?+t!==+t:0===+n?1/+n===1/t:+n===+t;case"[object Date]":case"[object Boolean]":return+n===+t}var i="[object Array]"===u;if(!i){if("object"!=typeof n||"object"!=typeof t)return!1;var o=n.constructor,a=t.constructor;if(o!==a&&!(m.isFunction(o)&&o instanceof o&&m.isFunction(a)&&a instanceof a)&&"constructor"in n&&"constructor"in t)return!1}r=r||[],e=e||[];for(var c=r.length;c--;)if(r[c]===n)return e[c]===t;if(r.push(n),e.push(t),i){if(c=n.length,c!==t.length)return!1;for(;c--;)if(!N(n[c],t[c],r,e))return!1}else{var f,l=m.keys(n);if(c=l.length,m.keys(t).length!==c)return!1;for(;c--;)if(f=l[c],!m.has(t,f)||!N(n[f],t[f],r,e))return!1}return r.pop(),e.pop(),!0};m.isEqual=function(n,t){return N(n,t)},m.isEmpty=function(n){return null==n?!0:k(n)&&(m.isArray(n)||m.isString(n)||m.isArguments(n))?0===n.length:0===m.keys(n).length},m.isElement=function(n){return!(!n||1!==n.nodeType)},m.isArray=h||function(n){return"[object Array]"===s.call(n)},m.isObject=function(n){var t=typeof n;return"function"===t||"object"===t&&!!n},m.each(["Arguments","Function","String","Number","Date","RegExp","Error"],function(n){m["is"+n]=function(t){return s.call(t)==="[object "+n+"]"}}),m.isArguments(arguments)||(m.isArguments=function(n){return m.has(n,"callee")}),"function"!=typeof/./&&"object"!=typeof Int8Array&&(m.isFunction=function(n){return"function"==typeof n||!1}),m.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},m.isNaN=function(n){return m.isNumber(n)&&n!==+n},m.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"===s.call(n)},m.isNull=function(n){return null===n},m.isUndefined=function(n){return n===void 0},m.has=function(n,t){return null!=n&&p.call(n,t)},m.noConflict=function(){return u._=i,this},m.identity=function(n){return n},m.constant=function(n){return function(){return n}},m.noop=function(){},m.property=w,m.propertyOf=function(n){return null==n?function(){}:function(t){return n[t]}},m.matcher=m.matches=function(n){return n=m.extendOwn({},n),function(t){return m.isMatch(t,n)}},m.times=function(n,t,r){var e=Array(Math.max(0,n));t=b(t,r,1);for(var u=0;n>u;u++)e[u]=t(u);return e},m.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))},m.now=Date.now||function(){return(new Date).getTime()};var B={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},T=m.invert(B),R=function(n){var t=function(t){return n[t]},r="(?:"+m.keys(n).join("|")+")",e=RegExp(r),u=RegExp(r,"g");return function(n){return n=null==n?"":""+n,e.test(n)?n.replace(u,t):n}};m.escape=R(B),m.unescape=R(T),m.result=function(n,t,r){var e=null==n?void 0:n[t];return e===void 0&&(e=r),m.isFunction(e)?e.call(n):e};var q=0;m.uniqueId=function(n){var t=++q+"";return n?n+t:t},m.templateSettings={evaluate:/<#([\s\S]+?)#>/g,interpolate:/<#=([\s\S]+?)#>/g,escape:/<#-([\s\S]+?)#>/g};var K=/(.)^/,z={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\u2028|\u2029/g,L=function(n){return"\\"+z[n]};m.template=function(n,t,r){!t&&r&&(t=r),t=m.defaults({},t,m.templateSettings);var e=RegExp([(t.escape||K).source,(t.interpolate||K).source,(t.evaluate||K).source].join("|")+"|$","g"),u=0,i="__p+='";n.replace(e,function(t,r,e,o,a){return i+=n.slice(u,a).replace(D,L),u=a+t.length,r?i+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'":e?i+="'+\n((__t=("+e+"))==null?'':__t)+\n'":o&&(i+="';\n"+o+"\n__p+='"),t}),i+="';\n",t.variable||(i="with(obj||{}){\n"+i+"}\n"),i="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+i+"return __p;\n";try{var o=new Function(t.variable||"obj","_",i)}catch(a){throw a.source=i,a}var c=function(n){return o.call(this,n,m)},f=t.variable||"obj";return c.source="function("+f+"){\n"+i+"}",c},m.chain=function(n){var t=m(n);return t._chain=!0,t};var P=function(n,t){return n._chain?m(t).chain():t};m.mixin=function(n){m.each(m.functions(n),function(t){var r=m[t]=n[t];m.prototype[t]=function(){var n=[this._wrapped];return f.apply(n,arguments),P(this,r.apply(m,n))}})},m.mixin(m),m.each(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=o[n];m.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!==n&&"splice"!==n||0!==r.length||delete r[0],P(this,r)}}),m.each(["concat","join","slice"],function(n){var t=o[n];m.prototype[n]=function(){return P(this,t.apply(this._wrapped,arguments))}}),m.prototype.value=function(){return this._wrapped},m.prototype.valueOf=m.prototype.toJSON=m.prototype.value,m.prototype.toString=function(){return""+this._wrapped},"function"==typeof define&&define.amd&&define("underscore",[],function(){return m})}).call(this);

//https://github.com/blakeembrey/pluralize
!function(e,i){"function"==typeof require&&"object"==typeof exports&&"object"==typeof module?module.exports=i():"function"==typeof define&&define.amd?define(function(){return i()}):e.pluralize=i()}(this,function(){function e(e){return e.charAt(0).toUpperCase()+e.substr(1).toLowerCase()}function i(e){return"string"==typeof e?new RegExp("^"+e+"$","i"):e}function a(i,a){return i===i.toUpperCase()?a.toUpperCase():i[0]===i[0].toUpperCase()?e(a):a.toLowerCase()}function s(e,i){return e.replace(/\$(\d{1,2})/g,function(e,a){return i[a]||""})}function r(e,i){if(!e.length||l.hasOwnProperty(e))return e;for(var r=i.length;r--;){var o=i[r];if(o[0].test(e))return e.replace(o[0],function(e,i,r){var t=s(o[1],arguments);return""===e?a(r[i-1],t):a(e,t)})}return e}function o(e,i,s){return function(o){var t=o.toLowerCase();return i.hasOwnProperty(t)?a(o,t):e.hasOwnProperty(t)?a(o,e[t]):r(o,s)}}function t(e,i,a){var s=1===i?t.singular(e):t.plural(e);return(a?i+" ":"")+s}var n=[],u=[],l={},c={},$={};return t.plural=o($,c,n),t.singular=o(c,$,u),t.addPluralRule=function(e,a){n.push([i(e),a])},t.addSingularRule=function(e,a){u.push([i(e),a])},t.addUncountableRule=function(e){return"string"==typeof e?void(l[e.toLowerCase()]=!0):(t.addPluralRule(e,"$0"),void t.addSingularRule(e,"$0"))},t.addIrregularRule=function(e,i){i=i.toLowerCase(),e=e.toLowerCase(),$[e]=i,c[i]=e},[["I","we"],["me","us"],["he","they"],["she","they"],["them","them"],["myself","ourselves"],["yourself","yourselves"],["itself","themselves"],["herself","themselves"],["himself","themselves"],["themself","themselves"],["this","these"],["that","those"],["echo","echoes"],["dingo","dingoes"],["volcano","volcanoes"],["tornado","tornadoes"],["torpedo","torpedoes"],["genus","genera"],["viscus","viscera"],["stigma","stigmata"],["stoma","stomata"],["dogma","dogmata"],["lemma","lemmata"],["schema","schemata"],["anathema","anathemata"],["ox","oxen"],["axe","axes"],["die","dice"],["yes","yeses"],["foot","feet"],["eave","eaves"],["goose","geese"],["tooth","teeth"],["quiz","quizzes"],["human","humans"],["proof","proofs"],["carve","carves"],["valve","valves"],["thief","thieves"],["genie","genies"],["groove","grooves"],["pickaxe","pickaxes"],["whiskey","whiskies"]].forEach(function(e){return t.addIrregularRule(e[0],e[1])}),[[/s?$/i,"s"],[/([^aeiou]ese)$/i,"$1"],[/(ax|test)is$/i,"$1es"],[/(alias|[^aou]us|tlas|gas|ris)$/i,"$1es"],[/(e[mn]u)s?$/i,"$1s"],[/([^l]ias|[aeiou]las|[emjzr]as|[iu]am)$/i,"$1"],[/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1i"],[/(alumn|alg|vertebr)(?:a|ae)$/i,"$1ae"],[/(seraph|cherub)(?:im)?$/i,"$1im"],[/(her|at|gr)o$/i,"$1oes"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,"$1a"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,"$1a"],[/sis$/i,"ses"],[/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i,"$1$2ves"],[/([^aeiouy]|qu)y$/i,"$1ies"],[/([^ch][ieo][ln])ey$/i,"$1ies"],[/(x|ch|ss|sh|zz)$/i,"$1es"],[/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i,"$1ices"],[/(m|l)(?:ice|ouse)$/i,"$1ice"],[/(pe)(?:rson|ople)$/i,"$1ople"],[/(child)(?:ren)?$/i,"$1ren"],[/eaux$/i,"$0"],[/m[ae]n$/i,"men"],["thou","you"]].forEach(function(e){return t.addPluralRule(e[0],e[1])}),[[/s$/i,""],[/(ss)$/i,"$1"],[/((a)naly|(b)a|(d)iagno|(p)arenthe|(p)rogno|(s)ynop|(t)he)(?:sis|ses)$/i,"$1sis"],[/(^analy)(?:sis|ses)$/i,"$1sis"],[/(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,"$1fe"],[/(ar|(?:wo|[ae])l|[eo][ao])ves$/i,"$1f"],[/([^aeiouy]|qu)ies$/i,"$1y"],[/(^[pl]|zomb|^(?:neck)?t|[aeo][lt]|cut)ies$/i,"$1ie"],[/([^c][eor]n|smil)ies$/i,"$1ey"],[/(m|l)ice$/i,"$1ouse"],[/(seraph|cherub)im$/i,"$1"],[/(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|tlas|gas|(?:her|at|gr)o|ris)(?:es)?$/i,"$1"],[/(e[mn]u)s?$/i,"$1"],[/(movie|twelve)s$/i,"$1"],[/(cris|test|diagnos)(?:is|es)$/i,"$1is"],[/(alumn|syllab|octop|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,"$1us"],[/(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,"$1um"],[/(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,"$1on"],[/(alumn|alg|vertebr)ae$/i,"$1a"],[/(cod|mur|sil|vert|ind)ices$/i,"$1ex"],[/(matr|append)ices$/i,"$1ix"],[/(pe)(rson|ople)$/i,"$1rson"],[/(child)ren$/i,"$1"],[/(eau)x?$/i,"$1"],[/men$/i,"man"]].forEach(function(e){return t.addSingularRule(e[0],e[1])}),["advice","agenda","bison","bream","buffalo","carp","chassis","cod","cooperation","corps","digestion","debris","diabetes","energy","equipment","elk","excretion","expertise","flounder","gallows","garbage","graffiti","headquarters","health","herpes","highjinks","homework","information","jeans","justice","kudos","labour","machinery","mackerel","media","mews","moose","news","pike","plankton","pliers","pollution","premises","rain","rice","salmon","scissors","series","sewage","shambles","shrimp","species","staff","swine","trout","tuna","whiting","wildebeest","wildlife","you",/pox$/i,/ois$/i,/deer$/i,/fish$/i,/sheep$/i,/measles$/i,/[^aeiou]ese$/i].forEach(t.addUncountableRule),t});



(function() {

	var billi = {

		orgValStore: {},

		buildSearchArray : function(string){


			var ary = string.split(" ");

			for (var x in ary){ ary[x] = pluralize.singular(ary[x])}

			var searchAry = []

			var searchString = ""

			for (var x in ary){ 

				searchString = searchString + ary[x] + ' ';

				searchAry.push(searchString.trim());


			}

			return searchAry.reverse();

		},


		searchWikiData: function(term,cb){


			var request = new XMLHttpRequest();
			request.open('GET', '/api/wikidata/' + term, true);

			request.onload = function() {
			  if (request.status >= 200 && request.status < 400) {
			    // Success!
			    var data = JSON.parse(request.responseText);

			    var r = [];

			    if (data.search){
			    	for (var x in data.search){


			    		if (data.search[x].description){

			    			if (
			    				data.search[x].description.search('disambiguation')===-1 &&
			    				data.search[x].description.search('template page')===-1
			    				){
			    				r.push(data.search[x])
			    			}
			    			
			    		}else{
			    			r.push(data.search[x])
			    		}
			    		
			    	}
			    }

			    cb(r)

			  } else {
			    // We reached our target server, but it returned an error
			    cb([]);
			  }
			};

			request.onerror = function(err) {
			  // There was a connection error of some sort
			  console.error(err)
			};

			request.send();

		},


		buildConnectToWikipedia: function(search,exact){

			var self = this;

			if (!exact) exact = false;

			var s = [search];

			if (!exact){
				s = this.buildSearchArray(search);
			}


			for (var x in s){

				this.searchWikiData(s[x],function(results){

					document.getElementById("wikipedia-connect-header").innerHTML = "Select one of the Wikidata entities below as equivalent.";
					
					for (var x in results){

						var html = billi.wikipediaConnectTemplate({item: results[x], classmarkUri: classmarkUri });

						if (results[x].description){
							document.getElementById("wikipedia-connect-list-has-description").innerHTML = document.getElementById("wikipedia-connect-list-has-description").innerHTML + html;
						}else{
							document.getElementById("wikipedia-connect-list-no-description").innerHTML = document.getElementById("wikipedia-connect-list-no-description").innerHTML + html;
						}

					}

					self.bindWikipediaConnect();

					
					


				})

			}


			





		},


		//searching 
		//See if we are on the search home page
		bindSearch: function(){

			var self = this;

			var searchTimeout = null;

			var searchEl = document.getElementById('search-input');

			if (searchEl){
				searchEl.addEventListener('keyup', function(e) {

				    if (searchTimeout) window.clearTimeout(searchTimeout);
				    
				    if ( e.keyCode === 27){
						searchEl.value = "";
						document.getElementById('search-results').innerHTML = "";
						return false;
					}

				    searchTimeout = window.setTimeout(function(){
				    	if (searchEl.value.length<3) return false;				    	
				    	self.search(searchEl.value);
				    },300)

				}); 

			
			}


		},

		bindWikiDataSearch: function(){

			var self = this;

			var searchTimeout = null;

			var searchEl = document.getElementById('search-input');

			if (searchEl){
				searchEl.addEventListener('keyup', function(e) {

				    if (searchTimeout) window.clearTimeout(searchTimeout);
				   
				    searchTimeout = window.setTimeout(function(){
				    	if (searchEl.value.length<3) return false;				    	
				    	document.getElementById('wikipedia-connect-list-has-description').innerHTML = "";
				    	document.getElementById('wikipedia-connect-list-no-description').innerHTML = "";
				    	self.buildConnectToWikipedia(searchEl.value,true);
				    },300)

				}); 

			
			}


		},

		bindClassmarkWikiAbstractExpand: function(){


			var el = document.getElementById('wikidata-abstract-actions-expand-link');
			

			if (el){

				el.addEventListener("click", function(event){

					el.style.display='none';
					var elA = document.getElementById('wikidata-abstract');
					elA.style['max-height'] = '100000px';
					elA.style['min-height'] = '200px';

					var elI = document.getElementById('wikidata-image');

					if (elI){
						elI.style['height'] = '200px';
					}

					event.returnValue = false;

					return false;
				});

			}
		},

		bindWikipediaShow: function(){


			var el = document.getElementById('wikipedia-connect-show-link');
			

			if (el){

				el.addEventListener("click", function(event){

					

					var elI = document.getElementById('wikipedia-connect-show');

					if (elI){
						elI.style['display'] = 'block';
					}

					event.returnValue = false;


					el.parentNode.innerHTML = "";

					return false;
				});

			}
		},

		bindWikipediaConnect: function(){


			var els = document.getElementsByClassName('wikipedia-connect-row-connect');

			for (var i = 0; i < els.length; ++i) {

				var el = els[i];  

				el.addEventListener("click", function(event){

					

					var elA = document.getElementById('wikipedia-connect-container');
					elA.innerHTML = 'Making Wiki connection, please wait...';


				});

			}


		},







		search: function(query){


			var self = this;

			var request = new XMLHttpRequest();
			request.open('GET', '/api/search/' + query, true);

			request.onload = function() {
			  if (request.status >= 200 && request.status < 400) {
			    // Success!
			    var data = JSON.parse(request.responseText);

			    var template = _.template(self.searchTemplate);

			    self.searchResults.innerHTML = template({items: data.data });



			  } else {
			    // We reached our target server, but it returned an error

			  }
			};

			request.onerror = function() {
			  // There was a connection error of some sort
			};

			request.send();





		},

		findClassmarks: function(query){



			var self = this;

			var request = new XMLHttpRequest();
			request.open('GET', '/api/classmark/' + query, true);

			request.onload = function() {
			  if (request.status >= 200 && request.status < 400) {
			    // Success!
			    var data = JSON.parse(request.responseText);


			    var template = document.getElementById("sample-resources-template").innerHTML;
			   
			   


			    template = _.template(template);

				document.getElementById("sample-resources").innerHTML = template({items: data.data });



			  } else {
			    // We reached our target server, but it returned an error

			  }
			};

			request.onerror = function() {
			  // There was a connection error of some sort
			};

			request.send();


		},

		findLccRange: function(query){



			var self = this;

			var request = new XMLHttpRequest();
			request.open('GET', '/api/lccrange/' + query, true);

			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					// Success!
					var data = JSON.parse(request.responseText);


					var template = document.getElementById("sample-resources-template").innerHTML;

					template = _.template(template);

					document.getElementById("sample-resources").innerHTML = template({items: data.data });



				} else {
			    // We reached our target server, but it returned an error

				}
			};

			request.onerror = function() {
			  // There was a connection error of some sort
			};

			request.send();


		},


		bindHeroLabelEdit: function(){

			var self = this;


			var el = document.querySelectorAll('.classmark-hero-edit');
			if (el.length===0) el = null


			if (el){

				el= el[0]

				el.addEventListener("click", function(event){
					self.enableHtmlEditable("classmark-hero-edit-label",".classmark-hero",'skos:prefLabel')
					el.style.display = "none";
					return false;
				});

			}
		},

		bindNoteEdit: function(){

			var self = this;


			var el = document.querySelectorAll('.classmark-notes-edit');
			if (el.length===0) el = null


			if (el){

				el= el[0]

				el.addEventListener("click", function(event){
					self.enableHtmlEditable("classmark-notes-edit",".classmark-notes",'skos:note')
					el.style.display = "none";
					return false;
				});

			}
		},

		strip: function(html) {
		    var tempDiv = document.createElement("DIV");
		    tempDiv.innerHTML = html;
		    return tempDiv.innerText;
		},

		

		enableHtmlEditable: function(targetId,triggerClassBase,predicate){

			var self = this


			var targetEl = document.getElementById(targetId);

			var triggerEl = document.querySelectorAll(triggerClassBase+"-edit")			
			if (triggerEl) if (triggerEl[0]) triggerEl = triggerEl[0]
			
			var triggerCancelEl = document.querySelectorAll(triggerClassBase+"-cancel")
			if (triggerCancelEl) if (triggerCancelEl[0]) triggerCancelEl = triggerCancelEl[0]

			var triggerSaveEl = document.querySelectorAll(triggerClassBase+"-save")
			if (triggerSaveEl) if (triggerSaveEl[0]) triggerSaveEl = triggerSaveEl[0]

			var triggerStatusEl = document.querySelectorAll(triggerClassBase+"-status")
			if (triggerStatusEl) if (triggerStatusEl[0]) triggerStatusEl = triggerStatusEl[0]

			var save = function(){
				targetEl.classList.remove('edit-enabled');						
				targetEl.contentEditable='false';
				window.getSelection().removeAllRanges();
				triggerEl.style.display = "inline-block";
				if (triggerCancelEl) triggerCancelEl.style.display="none"
				if (triggerSaveEl) triggerSaveEl.style.display="none"
				triggerStatusEl.style.transition = "opacity 0s";
				triggerStatusEl.style.opacity = "1";
				triggerStatusEl.style.display = "inline-block";
				
				self.postTripleEditFirst(classmarkUri,predicate,self.strip(targetEl.innerHTML),function(err){



					if (err){
						triggerStatusEl.style.color = "#CC1A16";						
						triggerStatusEl.innerHTML = "ERROR: "+err;
					}else{
						
						triggerStatusEl.style.color = "greenyellow";						
						triggerStatusEl.innerHTML = "SAVED";
						triggerStatusEl.style.transition = "opacity 5s";
						setTimeout(function(){
							triggerStatusEl.style.opacity = "0";
						},100)

						setTimeout(function(){
							triggerStatusEl.style.display = "none";

						},5000)

						
					}
				})
				triggerSaveEl = null
			}

			var cancel = function(){
				targetEl.innerHTML = self.orgValStore[targetId];						
				targetEl.classList.remove('edit-enabled');						
				targetEl.contentEditable='false';
				window.getSelection().removeAllRanges();
				triggerEl.style.display = "inline-block";
				if (triggerCancelEl) triggerCancelEl.style.display="none"
				if (triggerSaveEl) triggerSaveEl.style.display="none"

			}



			if (targetEl){

				self.orgValStore[targetId] = targetEl.innerHTML;
				targetEl.contentEditable='true';
				var range = document.createRange();
				range.selectNodeContents(targetEl);
				var sel = window.getSelection();
				sel.removeAllRanges();
				sel.addRange(range);

				targetEl.classList.add('edit-enabled');

				targetEl.addEventListener('keydown', function(e) {

					if (targetEl){				    
						if (e.keyCode === 27){
							cancel()
							targetEl = null;

						}
						if (e.keyCode === 13){
							save()
							targetEl = null;
						}
					}

				});
			}

			if (triggerCancelEl){
				if (triggerCancelEl) triggerCancelEl.style.display="inline-block"
				triggerCancelEl.addEventListener("click", function(event){
					cancel()
					triggerCancelEl=null
				})

			}
			if (triggerSaveEl){
				if (triggerSaveEl) triggerSaveEl.style.display="inline-block"
				triggerSaveEl.addEventListener("click", function(event){
					if (triggerSaveEl){
						save()
						triggerSaveEl = null
					}
				})
			}


			
		},



		postTripleEditFirst: function(uri,predicate,value,callback){
			var request = new XMLHttpRequest();
			request.open('POST', '/api/editfirsttriple', true);
			request.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
			request.send(JSON.stringify({ uri: uri, predicate: predicate, value: value  }));
			request.onload = function() {
				if (this.status >= 200 && this.status < 400) {
					var resp = JSON.parse(this.response);
					if (!resp.success){
						if (callback) callback(resp.error)
					}else{
						if (callback) callback(null)
					}
				} else {
					if (callback) callback("There was an error.")
				}
			};


		}



	}





	document.addEventListener("DOMContentLoaded", function() {
	  
	  if (document.getElementById("search-results-template")) billi.searchTemplate = document.getElementById("search-results-template").innerHTML;
	  billi.searchResults = document.getElementById("search-results");
	  billi.bindSearch();


	if (document.getElementById("wikipedia-connect-list-has-description") && ( classmarkPrefLabel || classmarkHiddenLabel)){

	  	billi.wikipediaConnectTemplate = _.template(document.getElementById("wikipedia-connect-template").innerHTML);
	  	if (classmarkPrefLabel){
	  		billi.buildConnectToWikipedia(classmarkPrefLabel);
	  	}else{
	  		billi.buildConnectToWikipedia(classmarkHiddenLabel);
	  	}

	  	//bind the custom search
	  	billi.bindWikiDataSearch();


	}

	//check if the wikidata expand thing needs to happen
	billi.bindClassmarkWikiAbstractExpand();
	billi.bindWikipediaShow();


	billi.bindHeroLabelEdit();
	billi.bindNoteEdit();




	
	window.billi = billi;


	});




})();