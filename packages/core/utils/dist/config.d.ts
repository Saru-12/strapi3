import type { Config } from './types';
export declare const getConfigUrls: (config: Config, forAdminBuild?: boolean) => {
    serverUrl: string;
    adminUrl: string;
    adminPath: string;
};
export declare const getAbsoluteAdminUrl: (config: Config, forAdminBuild?: boolean) => string;
export declare const getAbsoluteServerUrl: (config: Config, forAdminBuild?: boolean) => string;
//# sourceMappingURL=config.d.ts.map