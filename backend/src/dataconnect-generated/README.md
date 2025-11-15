# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListAvailableMenuItems*](#listavailablemenuitems)
  - [*ListUserOrders*](#listuserorders)
- [**Mutations**](#mutations)
  - [*CreateMenuItem*](#createmenuitem)
  - [*UpdateReservationStatus*](#updatereservationstatus)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListAvailableMenuItems
You can execute the `ListAvailableMenuItems` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listAvailableMenuItems(): QueryPromise<ListAvailableMenuItemsData, undefined>;

interface ListAvailableMenuItemsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListAvailableMenuItemsData, undefined>;
}
export const listAvailableMenuItemsRef: ListAvailableMenuItemsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listAvailableMenuItems(dc: DataConnect): QueryPromise<ListAvailableMenuItemsData, undefined>;

interface ListAvailableMenuItemsRef {
  ...
  (dc: DataConnect): QueryRef<ListAvailableMenuItemsData, undefined>;
}
export const listAvailableMenuItemsRef: ListAvailableMenuItemsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listAvailableMenuItemsRef:
```typescript
const name = listAvailableMenuItemsRef.operationName;
console.log(name);
```

### Variables
The `ListAvailableMenuItems` query has no variables.
### Return Type
Recall that executing the `ListAvailableMenuItems` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListAvailableMenuItemsData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListAvailableMenuItems`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listAvailableMenuItems } from '@dataconnect/generated';


// Call the `listAvailableMenuItems()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listAvailableMenuItems();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listAvailableMenuItems(dataConnect);

console.log(data.menuItems);

// Or, you can use the `Promise` API.
listAvailableMenuItems().then((response) => {
  const data = response.data;
  console.log(data.menuItems);
});
```

### Using `ListAvailableMenuItems`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listAvailableMenuItemsRef } from '@dataconnect/generated';


// Call the `listAvailableMenuItemsRef()` function to get a reference to the query.
const ref = listAvailableMenuItemsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listAvailableMenuItemsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.menuItems);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItems);
});
```

## ListUserOrders
You can execute the `ListUserOrders` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listUserOrders(vars: ListUserOrdersVariables): QueryPromise<ListUserOrdersData, ListUserOrdersVariables>;

interface ListUserOrdersRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListUserOrdersVariables): QueryRef<ListUserOrdersData, ListUserOrdersVariables>;
}
export const listUserOrdersRef: ListUserOrdersRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listUserOrders(dc: DataConnect, vars: ListUserOrdersVariables): QueryPromise<ListUserOrdersData, ListUserOrdersVariables>;

interface ListUserOrdersRef {
  ...
  (dc: DataConnect, vars: ListUserOrdersVariables): QueryRef<ListUserOrdersData, ListUserOrdersVariables>;
}
export const listUserOrdersRef: ListUserOrdersRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listUserOrdersRef:
```typescript
const name = listUserOrdersRef.operationName;
console.log(name);
```

### Variables
The `ListUserOrders` query requires an argument of type `ListUserOrdersVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListUserOrdersVariables {
  userId: UUIDString;
}
```
### Return Type
Recall that executing the `ListUserOrders` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListUserOrdersData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ListUserOrdersData {
  orders: ({
    id: UUIDString;
    orderDate: TimestampString;
    totalAmount: number;
    status: string;
  } & Order_Key)[];
}
```
### Using `ListUserOrders`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listUserOrders, ListUserOrdersVariables } from '@dataconnect/generated';

// The `ListUserOrders` query requires an argument of type `ListUserOrdersVariables`:
const listUserOrdersVars: ListUserOrdersVariables = {
  userId: ..., 
};

// Call the `listUserOrders()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listUserOrders(listUserOrdersVars);
// Variables can be defined inline as well.
const { data } = await listUserOrders({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listUserOrders(dataConnect, listUserOrdersVars);

console.log(data.orders);

// Or, you can use the `Promise` API.
listUserOrders(listUserOrdersVars).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

### Using `ListUserOrders`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listUserOrdersRef, ListUserOrdersVariables } from '@dataconnect/generated';

// The `ListUserOrders` query requires an argument of type `ListUserOrdersVariables`:
const listUserOrdersVars: ListUserOrdersVariables = {
  userId: ..., 
};

// Call the `listUserOrdersRef()` function to get a reference to the query.
const ref = listUserOrdersRef(listUserOrdersVars);
// Variables can be defined inline as well.
const ref = listUserOrdersRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listUserOrdersRef(dataConnect, listUserOrdersVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.orders);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.orders);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateMenuItem
You can execute the `CreateMenuItem` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createMenuItem(vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;

interface CreateMenuItemRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
}
export const createMenuItemRef: CreateMenuItemRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createMenuItem(dc: DataConnect, vars: CreateMenuItemVariables): MutationPromise<CreateMenuItemData, CreateMenuItemVariables>;

interface CreateMenuItemRef {
  ...
  (dc: DataConnect, vars: CreateMenuItemVariables): MutationRef<CreateMenuItemData, CreateMenuItemVariables>;
}
export const createMenuItemRef: CreateMenuItemRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createMenuItemRef:
```typescript
const name = createMenuItemRef.operationName;
console.log(name);
```

### Variables
The `CreateMenuItem` mutation requires an argument of type `CreateMenuItemVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateMenuItemVariables {
  category: string;
  description?: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  name: string;
  price: number;
}
```
### Return Type
Recall that executing the `CreateMenuItem` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateMenuItemData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateMenuItemData {
  menuItem_insert: MenuItem_Key;
}
```
### Using `CreateMenuItem`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createMenuItem, CreateMenuItemVariables } from '@dataconnect/generated';

// The `CreateMenuItem` mutation requires an argument of type `CreateMenuItemVariables`:
const createMenuItemVars: CreateMenuItemVariables = {
  category: ..., 
  description: ..., // optional
  imageUrl: ..., // optional
  isAvailable: ..., 
  name: ..., 
  price: ..., 
};

// Call the `createMenuItem()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createMenuItem(createMenuItemVars);
// Variables can be defined inline as well.
const { data } = await createMenuItem({ category: ..., description: ..., imageUrl: ..., isAvailable: ..., name: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createMenuItem(dataConnect, createMenuItemVars);

console.log(data.menuItem_insert);

// Or, you can use the `Promise` API.
createMenuItem(createMenuItemVars).then((response) => {
  const data = response.data;
  console.log(data.menuItem_insert);
});
```

### Using `CreateMenuItem`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createMenuItemRef, CreateMenuItemVariables } from '@dataconnect/generated';

// The `CreateMenuItem` mutation requires an argument of type `CreateMenuItemVariables`:
const createMenuItemVars: CreateMenuItemVariables = {
  category: ..., 
  description: ..., // optional
  imageUrl: ..., // optional
  isAvailable: ..., 
  name: ..., 
  price: ..., 
};

// Call the `createMenuItemRef()` function to get a reference to the mutation.
const ref = createMenuItemRef(createMenuItemVars);
// Variables can be defined inline as well.
const ref = createMenuItemRef({ category: ..., description: ..., imageUrl: ..., isAvailable: ..., name: ..., price: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createMenuItemRef(dataConnect, createMenuItemVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.menuItem_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.menuItem_insert);
});
```

## UpdateReservationStatus
You can execute the `UpdateReservationStatus` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateReservationStatus(vars: UpdateReservationStatusVariables): MutationPromise<UpdateReservationStatusData, UpdateReservationStatusVariables>;

interface UpdateReservationStatusRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateReservationStatusVariables): MutationRef<UpdateReservationStatusData, UpdateReservationStatusVariables>;
}
export const updateReservationStatusRef: UpdateReservationStatusRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateReservationStatus(dc: DataConnect, vars: UpdateReservationStatusVariables): MutationPromise<UpdateReservationStatusData, UpdateReservationStatusVariables>;

interface UpdateReservationStatusRef {
  ...
  (dc: DataConnect, vars: UpdateReservationStatusVariables): MutationRef<UpdateReservationStatusData, UpdateReservationStatusVariables>;
}
export const updateReservationStatusRef: UpdateReservationStatusRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateReservationStatusRef:
```typescript
const name = updateReservationStatusRef.operationName;
console.log(name);
```

### Variables
The `UpdateReservationStatus` mutation requires an argument of type `UpdateReservationStatusVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateReservationStatusVariables {
  id: UUIDString;
  status: string;
}
```
### Return Type
Recall that executing the `UpdateReservationStatus` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateReservationStatusData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateReservationStatusData {
  reservation_update?: Reservation_Key | null;
}
```
### Using `UpdateReservationStatus`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateReservationStatus, UpdateReservationStatusVariables } from '@dataconnect/generated';

// The `UpdateReservationStatus` mutation requires an argument of type `UpdateReservationStatusVariables`:
const updateReservationStatusVars: UpdateReservationStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateReservationStatus()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateReservationStatus(updateReservationStatusVars);
// Variables can be defined inline as well.
const { data } = await updateReservationStatus({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateReservationStatus(dataConnect, updateReservationStatusVars);

console.log(data.reservation_update);

// Or, you can use the `Promise` API.
updateReservationStatus(updateReservationStatusVars).then((response) => {
  const data = response.data;
  console.log(data.reservation_update);
});
```

### Using `UpdateReservationStatus`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateReservationStatusRef, UpdateReservationStatusVariables } from '@dataconnect/generated';

// The `UpdateReservationStatus` mutation requires an argument of type `UpdateReservationStatusVariables`:
const updateReservationStatusVars: UpdateReservationStatusVariables = {
  id: ..., 
  status: ..., 
};

// Call the `updateReservationStatusRef()` function to get a reference to the mutation.
const ref = updateReservationStatusRef(updateReservationStatusVars);
// Variables can be defined inline as well.
const ref = updateReservationStatusRef({ id: ..., status: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateReservationStatusRef(dataConnect, updateReservationStatusVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.reservation_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.reservation_update);
});
```

