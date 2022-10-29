class Row{
    constructor(obj){
        this.rank = getAttribute(obj, 'rank', 0);
        this.user = getAttribute(obj, 'user', User());
        this.score = getAttribute(obj, 'score', 0);
        this.hacks = getAttribute(obj, 'hacks', []);
        this.submissions = getAttribute(obj, 'submissions', []);
        this.performance = getAttribute(obj, 'performance', 0);
        this.delta = getAttribute(obj, 'delta', 0);
    }
}