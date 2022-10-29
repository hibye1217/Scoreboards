function getAttribute(obj, attr, val){
    if (typeof obj !== "object"){ return val; }
    if (attr in obj){ return obj[attr]; } else{ return val; }
}