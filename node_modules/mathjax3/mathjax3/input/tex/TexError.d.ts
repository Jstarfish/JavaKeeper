export default class TexError {
    id: string;
    private static pattern;
    message: string;
    private static processString(str, args);
    constructor(id: string, message: string, ...rest: string[]);
}
