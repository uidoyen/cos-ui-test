import { ComponentStory, ComponentMeta } from '@storybook/react';
import React from 'react';

import {
  List,
  ListComponent,
  ListItem,
  OrderType,
} from '@patternfly/react-core';

import { ConnectorStatus } from './ConnectorStatus';

// These values are copied over from the backend code
export enum ConnectorStatusValues {
  ConnectorStatusPhaseAssigning = 'assigning', // set by kas-fleet-manager - user request
  ConnectorStatusPhaseAssigned = 'assigned', // set by kas-fleet-manager - worker
  ConnectorStatusPhaseUpdating = 'updating', // set by kas-fleet-manager - user request
  ConnectorStatusPhaseStopped = 'stopped', // set by kas-fleet-manager - user request
  ConnectorStatusPhaseProvisioning = 'provisioning', // set by kas-agent
  ConnectorStatusPhaseReady = 'ready', // set by the agent
  ConnectorStatusPhaseFailed = 'failed', // set by the agent
  ConnectorStatusPhaseClickable = 'clickable', // set by the agent
  ConnectorStatusPhaseDeprovisioning = 'deprovisioning', // set by kas-agent
  ConnectorStatusPhaseDeleting = 'deleting', // set by the kas-fleet-manager - user request
  ConnectorStatusPhaseDeleted = 'deleted', // set by the agent
}

export default {
  title: 'UI/Components/Statuses',
  component: ConnectorStatus,
  excludeStories: /ConnectorStatusValues/,
} as ComponentMeta<typeof ConnectorStatus>;

const Template: ComponentStory<typeof ConnectorStatus> = (args) => (
  <List component={ListComponent.ol} type={OrderType.number}>
    {Object.values(ConnectorStatusValues).map((s, idx) => (
      <ListItem>
        <ConnectorStatus
          key={idx}
          {...args}
          desiredState={'ready'}
          state={s === 'clickable' ? 'failed' : s}
          clickable={s === 'clickable'}
          popoverHeader={s === 'clickable' ? 'Popover Header' : undefined}
          popoverBody={s === 'clickable' ? 'Popover Body' : undefined}
        />
      </ListItem>
    ))}
  </List>
);

export const Statuses = Template.bind({});
