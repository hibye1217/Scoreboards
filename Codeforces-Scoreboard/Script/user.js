class User{
    constructor(obj){
        this.handle = getAttribute(obj, 'handle', "");
        this.rating = getAttribute(obj, 'rating', 0);
    }
}