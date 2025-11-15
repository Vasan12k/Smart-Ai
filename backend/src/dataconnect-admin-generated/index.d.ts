import { ConnectorConfig, DataConnect, OperationOptions, ExecuteOperationResponse } from 'firebase-admin/data-connect';

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

/** Generated Node Admin SDK operation action function for the 'CreateMenuItem' Mutation. Allow users to execute without passing in DataConnect. */
export function createMenuItem(dc: DataConnect, vars: CreateMenuItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMenuItemData>>;
/** Generated Node Admin SDK operation action function for the 'CreateMenuItem' Mutation. Allow users to pass in custom DataConnect instances. */
export function createMenuItem(vars: CreateMenuItemVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<CreateMenuItemData>>;

/** Generated Node Admin SDK operation action function for the 'ListAvailableMenuItems' Query. Allow users to execute without passing in DataConnect. */
export function listAvailableMenuItems(dc: DataConnect, options?: OperationOptions): Promise<ExecuteOperationResponse<ListAvailableMenuItemsData>>;
/** Generated Node Admin SDK operation action function for the 'ListAvailableMenuItems' Query. Allow users to pass in custom DataConnect instances. */
export function listAvailableMenuItems(options?: OperationOptions): Promise<ExecuteOperationResponse<ListAvailableMenuItemsData>>;

/** Generated Node Admin SDK operation action function for the 'UpdateReservationStatus' Mutation. Allow users to execute without passing in DataConnect. */
export function updateReservationStatus(dc: DataConnect, vars: UpdateReservationStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateReservationStatusData>>;
/** Generated Node Admin SDK operation action function for the 'UpdateReservationStatus' Mutation. Allow users to pass in custom DataConnect instances. */
export function updateReservationStatus(vars: UpdateReservationStatusVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<UpdateReservationStatusData>>;

/** Generated Node Admin SDK operation action function for the 'ListUserOrders' Query. Allow users to execute without passing in DataConnect. */
export function listUserOrders(dc: DataConnect, vars: ListUserOrdersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserOrdersData>>;
/** Generated Node Admin SDK operation action function for the 'ListUserOrders' Query. Allow users to pass in custom DataConnect instances. */
export function listUserOrders(vars: ListUserOrdersVariables, options?: OperationOptions): Promise<ExecuteOperationResponse<ListUserOrdersData>>;

