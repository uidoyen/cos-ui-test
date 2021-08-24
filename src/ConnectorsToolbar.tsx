import React, { FunctionComponent, useRef } from 'react';
import { NavLink } from 'react-router-dom';

import {
  Button,
  InputGroup,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem,
  ToolbarToggleGroup,
} from '@patternfly/react-core';
import { FilterIcon, SearchIcon } from '@patternfly/react-icons';

import { useConnectorsMachine } from './Connectors.machine';
import { useConnectorsMachineService } from './Connectors.machine-context';
import { ConnectorsPagination } from './ConnectorsPagination';
import { PaginatedApiRequest } from './PaginatedResponse.machine';
import { useDebounce } from './useDebounce';

export const ConnectorsToolbar: FunctionComponent = () => {
  const service = useConnectorsMachineService();
  const { request } = useConnectorsMachine(service);

  const onChange = (request: PaginatedApiRequest<{}>) =>
    service.send({ type: 'api.query', ...request });
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const debouncedOnChange = useDebounce(onChange, 1000);

  // const [statuses, setStatuses] = useState<string[]>([
  //   'Pending',
  //   'Created',
  //   'Cancelled',
  // ]);
  // const [statusesToggled, setStatusesToggled] = useState(false);
  // const clearAllFilters = useCallback(() => {
  //   setSearchValue('');
  //   setStatuses([]);
  // }, []);
  // const toggleStatuses = useCallback(
  //   () => setStatusesToggled(prev => !prev),
  //   []
  // );
  // const onSelectStatus = useCallback(
  //   (_, status) =>
  //     setStatuses(prev =>
  //       prev.includes(status)
  //         ? prev.filter(s => s !== status)
  //         : [...prev, status]
  //     ),
  //   []
  // );
  // const statusMenuItems = [
  //   <SelectOption key="statusPending" value="Pending" />,
  //   <SelectOption key="statusCreated" value="Created" />,
  //   <SelectOption key="statusCancelled" value="Cancelled" />,
  // ];
  // ensure the search input value reflects what's specified in the request object
  // useEffect(() => {
  //   if (searchInputRef.current) {
  //     searchInputRef.current.value = (request.name as string | undefined) || '';
  //   }
  // }, [searchInputRef, request]);
  const toggleGroupItems = (
    <>
      <ToolbarItem>
        <InputGroup>
          <TextInput
            name="name"
            id="name"
            type="search"
            aria-label="filter by connector name"
            onChange={(value) =>
              debouncedOnChange({
                size: request.size,
                page: 1,
                name: value,
              })
            }
            ref={searchInputRef}
          />
          <Button
            variant={'control'}
            aria-label="search button for search input"
          >
            <SearchIcon />
          </Button>
        </InputGroup>
      </ToolbarItem>
      {/* <ToolbarGroup variant="filter-group">
              <ToolbarFilter
                chips={statuses}
                deleteChip={onSelectStatus}
                deleteChipGroup={() => setStatuses([])}
                categoryName="Status"
              >
                <Select
                  variant={'checkbox'}
                  aria-label="Status"
                  onToggle={toggleStatuses}
                  onSelect={onSelectStatus}
                  selections={statuses}
                  isOpen={statusesToggled}
                  placeholderText="Status"
                >
                  {statusMenuItems}
                </Select>
              </ToolbarFilter>
            </ToolbarGroup> */}
    </>
  );
  const toolbarItems = (
    <>
      <ToolbarToggleGroup toggleIcon={<FilterIcon />} breakpoint="xl">
        {toggleGroupItems}
      </ToolbarToggleGroup>
      <ToolbarGroup variant="icon-button-group">
        <ToolbarItem>
          <NavLink
            className="pf-c-button pf-m-primary"
            to={'/create-connector'}
          >
            Create Connector
          </NavLink>
        </ToolbarItem>
      </ToolbarGroup>
      <ToolbarItem variant="pagination" alignment={{ default: 'alignRight' }}>
        <ConnectorsPagination isCompact={true} />
      </ToolbarItem>
    </>
  );

  return (
    <Toolbar id="toolbar-group-types" collapseListedFiltersBreakpoint="xl">
      <ToolbarContent>{toolbarItems}</ToolbarContent>
    </Toolbar>
  );
};