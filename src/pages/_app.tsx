import "@/styles/globals.css";
import { Amplify } from "aws-amplify";
import awsExports from "../aws-exports";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
Amplify.configure(awsExports);

import type { AppProps } from "next/app";
function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}

export default withAuthenticator(App, { loginMechanisms: ["email"] });
