import React, { useContext } from "react";
import { useRouter } from "next/router";

/*------------------Styles------------------ */
import "react-dropdown-tree-select/dist/styles.css"; //styles for react dropdown tree select
import "react-grid-layout/css/styles.css";
import "../styles/asset_tree_select.css";
import "../styles/globals.css"; // These are not read for some reason, asset_tree_select and 3D may or may not be read either
import "../styles/3D.css";

/*----------------------------Components---------------------------- */
import Layout from "../components/global/layout/layout";
import AuthCheck from "@/Global/auth/auth_check";

/*-----------------Context------------------- */
import { AppProvider } from "@/Context/app_context";
import { AssetProvider } from "@/Context/asset_context";
import { Hydrate, QueryClientProvider } from "@tanstack/react-query";
import { get_user_settings } from "hooks/endpoints/settings_services";

/*-------------------Auth/API--------------------------------*/
import { SessionProvider } from "next-auth/react";
import queryClient from "@/Queries/index";

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const router = useRouter();

  return (
    <SessionProvider session={session}>
      {/*Query client provider, context for @tanstack/react-query */}
      <QueryClientProvider client={queryClient}>
        {/*
            Re-hydrate server-side cached data.
            */}
        <Hydrate state={pageProps.dehydratedState}>
          {router.pathname === "/" ? (
            <Component {...pageProps} />
          ) : (
            <AuthCheck>
              <AppProvider>
                <AssetProvider>
                  <Layout>
                    <Component {...pageProps} />
                  </Layout>
                </AssetProvider>
              </AppProvider>
            </AuthCheck>
          )}
        </Hydrate>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default MyApp;
