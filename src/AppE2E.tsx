import { AlertsProvider } from '@app/components/Alerts/Alerts';
import { AppLayout } from '@app/components/AppLayout/AppLayout';
import { Loading } from '@app/components/Loading/Loading';
import { AnalyticsProvider } from '@hooks/useAnalytics';
import i18n from '@i18n/i18n';
import React, { FunctionComponent, useCallback } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';

import { I18nextProvider } from '@rhoas/app-services-ui-components';
import {
  Auth,
  AuthContext,
  BasenameContext,
  Config,
  ConfigContext,
  useAuth,
  useConfig,
} from '@rhoas/app-services-ui-shared';

import { CosRoutes } from './CosRoutes';

/**
 * Initializes the COS UI with an app that mimicks the console.redhat.com
 * experience without any authentication, to allow E2E tests to be run by a CI
 * pipeline.
 *
 * The `baseUrl` for the API is statically set to `localhost`.
 */
export const AppE2E: FunctionComponent = () => {
  const getBasename = useCallback(() => '/', []);

  const config = {
    cos: {
      apiBasePath: 'localhost',
      configurators: {
        'debezium-mongodb-1.9.0.Alpha1': {
          remoteEntry:
            'https://qaprodauth.cloud.redhat.com/apps/dbz-ui-build/dbz-connector-configurator.remoteEntry.js',
          scope: 'debezium_ui',
          module: './config',
        },
        'debezium-mysql-1.9.0.Alpha1': {
          remoteEntry:
            'https://qaprodauth.cloud.redhat.com/apps/dbz-ui-build/dbz-connector-configurator.remoteEntry.js',
          scope: 'debezium_ui',
          module: './config',
        },
        'debezium-postgres-1.9.0.Alpha1': {
          remoteEntry:
            'https://qaprodauth.cloud.redhat.com/apps/dbz-ui-build/dbz-connector-configurator.remoteEntry.js',
          scope: 'debezium_ui',
          module: './config',
        },
      } as Record<string, unknown>,
    },
  } as Config;

  const authTokenContext = {
    kas: {
      getToken: () => Promise.resolve('dummy'),
    },
    getUsername: () => Promise.resolve('username'),
  } as Auth;

  return (
    <AuthContext.Provider value={authTokenContext}>
      <BasenameContext.Provider value={{ getBasename }}>
        <ConfigContext.Provider value={config}>
          <I18nextProvider i18n={i18n}>
            <AlertsProvider>
              <AnalyticsProvider>
                <React.Suspense fallback={<Loading />}>
                  <Router>
                    <AppLayout>
                      <ConnectedRoutes />
                    </AppLayout>
                  </Router>
                </React.Suspense>
              </AnalyticsProvider>
            </AlertsProvider>
          </I18nextProvider>
        </ConfigContext.Provider>
      </BasenameContext.Provider>
    </AuthContext.Provider>
  );
};

const ConnectedRoutes = () => {
  const auth = useAuth();
  const config = useConfig();

  return (
    <CosRoutes
      getToken={async () => (await auth?.kas.getToken()) || ''}
      connectorsApiBasePath={config?.cos.apiBasePath || ''}
      // TODO: remove after demo
      kafkaManagementApiBasePath={'localhost'}
    />
  );
};
