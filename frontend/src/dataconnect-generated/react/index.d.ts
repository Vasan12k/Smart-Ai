import { CreateMenuItemData, CreateMenuItemVariables, ListAvailableMenuItemsData, UpdateReservationStatusData, UpdateReservationStatusVariables, ListUserOrdersData, ListUserOrdersVariables } from '../';
import { UseDataConnectQueryResult, useDataConnectQueryOptions, UseDataConnectMutationResult, useDataConnectMutationOptions} from '@tanstack-query-firebase/react/data-connect';
import { UseQueryResult, UseMutationResult} from '@tanstack/react-query';
import { DataConnect } from 'firebase/data-connect';
import { FirebaseError } from 'firebase/app';


export function useCreateMenuItem(options?: useDataConnectMutationOptions<CreateMenuItemData, FirebaseError, CreateMenuItemVariables>): UseDataConnectMutationResult<CreateMenuItemData, CreateMenuItemVariables>;
export function useCreateMenuItem(dc: DataConnect, options?: useDataConnectMutationOptions<CreateMenuItemData, FirebaseError, CreateMenuItemVariables>): UseDataConnectMutationResult<CreateMenuItemData, CreateMenuItemVariables>;

export function useListAvailableMenuItems(options?: useDataConnectQueryOptions<ListAvailableMenuItemsData>): UseDataConnectQueryResult<ListAvailableMenuItemsData, undefined>;
export function useListAvailableMenuItems(dc: DataConnect, options?: useDataConnectQueryOptions<ListAvailableMenuItemsData>): UseDataConnectQueryResult<ListAvailableMenuItemsData, undefined>;

export function useUpdateReservationStatus(options?: useDataConnectMutationOptions<UpdateReservationStatusData, FirebaseError, UpdateReservationStatusVariables>): UseDataConnectMutationResult<UpdateReservationStatusData, UpdateReservationStatusVariables>;
export function useUpdateReservationStatus(dc: DataConnect, options?: useDataConnectMutationOptions<UpdateReservationStatusData, FirebaseError, UpdateReservationStatusVariables>): UseDataConnectMutationResult<UpdateReservationStatusData, UpdateReservationStatusVariables>;

export function useListUserOrders(vars: ListUserOrdersVariables, options?: useDataConnectQueryOptions<ListUserOrdersData>): UseDataConnectQueryResult<ListUserOrdersData, ListUserOrdersVariables>;
export function useListUserOrders(dc: DataConnect, vars: ListUserOrdersVariables, options?: useDataConnectQueryOptions<ListUserOrdersData>): UseDataConnectQueryResult<ListUserOrdersData, ListUserOrdersVariables>;
