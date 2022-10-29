class Problem{
    constructor(obj){
        this.index = getAttribute(obj, 'index', "");
        this.difficulty = getAttribute(obj, 'difficulty', 0);
        this.score = getAttribute(obj, 'score', 0);
    }
}