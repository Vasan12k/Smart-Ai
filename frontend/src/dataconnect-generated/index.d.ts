import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface CreateMenuItemData {
  menuItem_insert: MenuItem_Key;
}

export interface CreateMenuItemVariables {
  category: string;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  name: string;
  price: number;
}

export interface ListAvailableMenuItemsData {
  menuItems: ({
    id: UUIDString;
    name: string;
    description?: string | null;
    price: number;
    imageUrl?: string | null;
    category: string;
  } & MenuItem_Key)[];
}

export interface ListUserOrdersData {
  orders: ({
    id: UUIDString;
    orderDate: TimestampString;
    totalAmount: number;
    status: string;
  } & Order_Key)[];
}

export interface ListUserOrdersVariables {
  userId: UUIDString;
}

export interface MenuItem_Key {
  id: UUIDString;
  __typename?: 'MenuItem_Key';
}

export interface OrderItem_Key {
  orderId: UUIDString;
  menuItemId: UUIDString;
  __typename?: 'OrderItem_Key';
}

export interface Order_Key {
  id: UUIDString;
  __typename?: 'Order_Key';
}

export interface Reservation_Key {
  id: UUIDString;
  __typename?: 'Reservation_Key';
}

export interface Table_Key {
  id: UUIDString;
  __typename?: 'Table_Key';
}

export interface UpdateReservationStatusData {
  reservation_update?: Reservation_Key | null;
}

export interface UpdateReservationStatusVariables {
  id: UUIDString;
  status: string;
}

export interface User_Key {
  id: UUIDString;
  __typename?: 'User_Key';
}

interface CreateMenuItemRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
  operationName: string;
}
export const createMenuItemRef: CreateMenuItemRef;

export function createMenuItem(vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;
export function createMenuItem(dc: DataConnect, vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;

interface ListAvailableMenuItemsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableMenuItemsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListAvailableMenuItemsData, undefined>;
  operationName: string;
}
export const listAvailableMenuItemsRef: ListAvailableMenuItemsRef;

export function listAvailableMenuItems(): QueryPromise<ListAvailableMenuItemsData, undefined>;
export function listAvailableMenuItems(dc: DataConnect): QueryPromise<ListAvailableMenuItemsData, undefined>;

interface UpdateReservationStatusRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReservationStatusVariables): MutationRef<UpdateReservationStatusData, UpdateReservationStatusVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateReservationStatusVariables): MutationRef<UpdateReservationStatusData, UpdateReservationStatusVariables>;
  operationName: string;
}
export const updateReservationStatusRef: UpdateReservationStatusRef;

export function updateReservationStatus(vars: UpdateReservationStatusVariables): MutationPromise<UpdateReservationStatusData, UpdateReservationStatusVariables>;
export function updateReservationStatus(dc: DataConnect, vars: UpdateReservationStatusVariables): MutationPromise<UpdateReservationStatusData, UpdateReservationStatusVariables>;

interface ListUserOrdersRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserOrdersVariables): QueryRef<ListUserOrdersData, ListUserOrdersVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListUserOrdersVariables): QueryRef<ListUserOrdersData, ListUserOrdersVariables>;
  operationName: string;
}
export const listUserOrdersRef: ListUserOrdersRef;

export function listUserOrders(vars: ListUserOrdersVariables): QueryPromise<ListUserOrdersData, ListUserOrdersVariables>;
export function listUserOrders(dc: DataConnect, vars: ListUserOrdersVariables): QueryPromise<ListUserOrdersData, ListUserOrdersVariables>;

