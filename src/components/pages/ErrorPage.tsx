import React from 'react'
import { useLocation, useRouteError } from 'react-router';

interface ErrorPageProps {
    errorProp?: Error;
    errorCodeProp?: number;
}

export const NotFound = <>404 - Page Not Found!<br /> (Akadi 'waask sa'winsk)</>;

const ErrorPage = (props: ErrorPageProps) =>
{
  const location = useLocation();
  let routerError: any;
  try { routerError = useRouteError() as any; }
  catch { routerError = null; }

  const url = location.pathname;

  const { errorProp, errorCodeProp } = props;

  const error = errorProp ?? routerError ?? null;
  //set in order (if exists):  errorCodeProp, error?.status
              // final fallback, if location exists, then assume 404, else assume 500 error
  const errorCode = errorCodeProp ?? error?.status ?? (location.pathname ? 404 : 500);
  const is404 = 404 === errorCode;

  // TODO: 404 image / 500 Image

  let header: JSX.Element;

  if ( is404 ) { header = <h1>{NotFound}</h1>; }
  else { header = <h1>Unexpect Server Error</h1>; }

  let messageBody: JSX.Element;
  if ( is404 )
  {
     messageBody = (
      <>
        <p>
          The Page you are trying to reach <strong><code>{url}</code></strong>,
          <br />
          does not appear to exist in our systems.
        </p>
        <p>We apologize for any inconvenience.</p>
      </>
    );
  }
  else
  {
     messageBody = (
      <>
        <p>
           An unexpected error occurred while processing your request. <br />
           { error?.message && <strong><code>{error.message}</code></strong> }
        </p>
        <p>
          Please try again later, or contact support if the problem persists.
        </p>
      </>
    );
  }

  return (
    <>
      {header}
      {messageBody}
    </>
  );
}

export default ErrorPage