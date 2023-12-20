/*
 *  Location utilities for checking current environment
 */


/**
 *  Checks for LocalHost
 */
export const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.1/8 is considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
);

const ignoreCase = { sensitivity: 'accent' };

/**
 *  Helper function to verify a host name, in a case-insensitive manner
 *  @param hostname host to check
 */
const isHost = (hostname: string): boolean =>
{ return 0 === window.location.hostname.localeCompare(hostname,undefined, ignoreCase); }

export enum Environments {
    local     = "local",
    dev       = "dev",
    prod      = "prod",
    published = "published"
}

/**
 *  Return an enum of the Environment.
 */
export const getEnv = (): Environments =>
{
    if ( isHost("Smalgyax-Files.org") ) { return Environments.published }
    if ( isHost("prod.d1nnyhcu0aulq5.amplifyapp.com") ) { return Environments.prod }
    if ( isHost("dev.d1nnyhcu0aulq5.amplifyapp.com") ) { return Environments.dev }
    if ( isLocalhost ) { return Environments.local }

    //redirect to Prod for safety (this should probably error)
    return Environments.published;
}