/*
 *  Location utilities for checking current environment
 */
import amplifyConfig from '../../amplifyconfiguration.json';

/**
 *  Checks for LocalHost (based on URL)
 */
export const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    window.location.hostname === "[::1]" || // IPv6 localhost address.
    window.location.hostname.match( // 127.0.0.0/8 is IPv4 localhost
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

/**
 *  Checks for Test (based on lack of URL, or source(local))
 */
export const isTest = Boolean(
   window.location.hostname === "" || window.location.hostname === null ||
   window.location.hostname === undefined ||
   window.location.hostname === "[::]" || // IPv6 source address.
   window.location.hostname === "[]" || // empty IPv6 (invalid)
   window.location.hostname.match( // 0.0.0.0/8 source IPv4
      /^0(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
   )
);

const ignoreCase = { sensitivity: 'accent' } as Intl.CollatorOptions;

/**
 *  Helper function to verify a host name, in a case-insensitive manner
 *  @param hostname host to check
 */
const isHost = (hostname: string): boolean =>
{ return 0 === window.location.hostname.localeCompare(hostname, undefined, ignoreCase); }

/** Enum of the possible environments. */
export enum Environments {
    local     = "local",
    dev       = "dev",
    prod      = "prod",
    published = "published"
}

/** Return an enum of the Environment. (based on URL) */
const getSafeEnv = (): Environments | null =>
{
    if ( isHost("Smalgyax-Files.org") ) { return Environments.published }
    if ( isHost("prod.d1nnyhcu0aulq5.amplifyapp.com") ) { return Environments.prod }
    if ( isHost("dev.d1nnyhcu0aulq5.amplifyapp.com") ) { return Environments.dev }
    if ( isLocalhost ) { return Environments.local }
    if ( isTest ) { return Environments.local }

    return null;
}

/** Return an enum of the Environment. (based on URL) */
export const getEnv = (): Environments =>
{
    const env = getSafeEnv();
    if ( env !== null ) { return env; }

    //redirect to Prod for safety (this should probably error)
    return Environments.published;
}

/** @returns true if the current environment is running in Development */
export const isDevLocation = (env :  Environments = getEnv()): boolean => {
    return Environments.dev === env || Environments.local === env;
}

/** @returns true if the current environment is running in Production */
export const isProdLocation = (env :  Environments = getEnv()): boolean => {
  return Environments.prod === env || Environments.published === env;
}

/** Return an enum of the Environment. (Based on AWS Resource Names) */
export const getAmplifyEnv = (): Environments => {
    const userPoolId = amplifyConfig.aws_user_pools_id;
    const s3Bucket = amplifyConfig.aws_user_files_s3_bucket;
    const oauthDomain = amplifyConfig.oauth.domain;

    if ( userPoolId.includes('-dev-')
      || s3Bucket.includes('-dev')
      || oauthDomain.includes('-dev') )
    { return Environments.dev; }
    if ( userPoolId.includes('-prod-')
      || s3Bucket.includes('-prod')
      || oauthDomain.includes('-prod') )
    { return Environments.prod; }
    //follow app.tsx, default to published for safety
    return Environments.published;
};

/** @returns true if the current environment is running in Amplify Development */
export const isAmplifyDev = (env : Environments = getAmplifyEnv()) => {
  return Environments.dev === env;
}

/** @returns true if the current environment is running in Amplify Production */
export const isAmplifyProd = (env : Environments = getAmplifyEnv()) => {
  return Environments.prod === env;
}

/** @returns true if the current environment is running in Development */
export const isDev = () => {
    const env = getSafeEnv();
    if ( env !== null ) { return isDevLocation(env); }
    return isAmplifyDev();
}

/** @returns true if the current environment is running in Production */
export const isProd = () => {
    const env = getSafeEnv();
    if ( env !== null ) { return isProdLocation(env); }
    return isAmplifyProd();
}
