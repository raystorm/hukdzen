import { Links, Meta, Outlet, Scripts, ScrollRestoration, } from "react-router";

export function Layout({ children, }:
                       { children: React.ReactNode; })
{
   return (
      <html lang="en">
        <head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon.ico" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <meta name="theme-color" content="#222222" />
          <meta name="description"
                content="Smalgyax Language Learning Document Repository"
          />
          <meta name="google-site-verification"
                content="BHYARH27psO0Xzv7kthkhofm-CHTAp7iOrLC838pTbw" />
          <meta name="facebook-domain-verification"
                content="g4amy42klub4p2jp7r5xkzaflu4nrt" />
          <link rel="apple-touch-icon" href="/ovoid192.png" />
          <!--
               manifest.json provides metadata used when your web app
               is installed on a user's mobile device or desktop.
               See https://developers.google.com/web/fundamentals/web-app-manifest/
          -->
          <link rel="manifest" href="/manifest.json" />

          <title>Smalgyax-Files.org | Algyax ada amwaal</title>
          <Meta />
          <Links />
        </head>
        <body>
          {children}
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
   );
}

export default function Root() {
   return <Outlet />;
}
