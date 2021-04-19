import { ComponentType } from 'react';
import { ConnectorType } from '@kas-connectors/api';
import { assign, createMachine, createSchema } from 'xstate';
import { createModel } from 'xstate/lib/model';
import { escalate } from 'xstate/lib/actions';

export type ConnectorConfiguratorProps = {
  activeStep: number;
  connector: ConnectorType;
  configuration: Map<string,unknown> | unknown;
  onChange: (configuration: Map<string,unknown> | unknown, isValid: boolean) => void;
};

export type ConnectorConfiguratorType = ComponentType<
  ConnectorConfiguratorProps
>;

export type ConnectorConfiguratorResponse = {
  Configurator: ConnectorConfiguratorType;
  steps: string[] | false;
};

type Context = {
  connector: ConnectorType;
  Configurator?: ConnectorConfiguratorType;
  steps?: string[] | false;
  error?: string;
};

const configuratorLoaderMachineSchema = {
  context: createSchema<Context>(),
};

const configuratorLoaderMachineModel = createModel({
  connector: { id: 'something', name: 'something', version: '0.1' },
  Configurator: undefined,
  steps: undefined,
  error: undefined,
} as Context);

export const configuratorLoaderMachine = createMachine<
  typeof configuratorLoaderMachineModel
>({
  schema: configuratorLoaderMachineSchema,
  id: 'configurator',
  initial: 'loading',
  states: {
    loading: {
      invoke: {
        id: 'fetchConfigurator',
        src: 'fetchConfigurator',
        onDone: {
          target: 'success',
          actions: assign((_context, event) => event.data),
        },
        onError: {
          target: 'failure',
          actions: assign({
            error: (_context, event) => event.data,
          }),
        },
      },
    },
    failure: {
      entry: escalate(context => ({ message: context.error })),
    },
    success: {
      type: 'final',
      data: ({ Configurator, steps }: Context) => ({
        Configurator: Configurator!,
        steps: steps as string[] | false,
      }),
    },
  },
});
