class Submission{
    static Verdict = {
        OK: 1,
        EXAMPLE: 0,
        WRONG: -1,
        HACKED: -2,
        SYSTEST: -3
    };
    constructor(obj){
        this.time = getAttribute(obj, 'time', 0);
        this.verdict = getAttribute(obj, 'verdict', Submission.Verdict.EXAMPLE);
    }
}