class Scoreboard{
    constructor(obj){
        this.problems = getAttribute(obj, 'problems', []);
        this.rows = getAttribute(obj, 'rows', []);
    }
}