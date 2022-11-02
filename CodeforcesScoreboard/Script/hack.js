class Hack{
    static Verdict = {
        SUCCESSFUL: 1,
        INVALID: 0,
        UNSUCCESSFUL: -1
    };
    constructor(obj){
        this.time = getAttribute(obj, 'time', 0);
        this.verdict = getAttribute(obj, 'verdict', Hack.Verdict.INVALID);
    }
}