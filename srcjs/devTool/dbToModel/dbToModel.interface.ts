export interface Options {
    user:string,
    password:string,
    server:string,
    database:string
}

declare class dbToModel {
    private readonly dry;
    private readonly verbose;
    private readonly cleanStaleWebpackAssets;
    private readonly protectWebpackAssets;
    private readonly cleanAfterEveryBuildPatterns;
    private readonly cleanOnceBeforeBuildPatterns;
    private readonly dangerouslyAllowCleanPatternsOutsideProject;
    private currentAssets;
    private initialClean;
    



    private readonly options:Options;
    private outputPath;

    constructor(options?: Options);
    apply(): void;
}
export { dbToModel };