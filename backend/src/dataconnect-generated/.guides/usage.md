# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { createMenuItem, listAvailableMenuItems, updateReservationStatus, listUserOrders } from '@dataconnect/generated';


// Operation CreateMenuItem:  For variables, look at type CreateMenuItemVars in ../index.d.ts
const { data } = await CreateMenuItem(dataConnect, createMenuItemVars);

// Operation ListAvailableMenuItems: 
const { data } = await ListAvailableMenuItems(dataConnect);

// Operation UpdateReservationStatus:  For variables, look at type UpdateReservationStatusVars in ../index.d.ts
const { data } = await UpdateReservationStatus(dataConnect, updateReservationStatusVars);

// Operation ListUserOrders:  For variables, look at type ListUserOrdersVars in ../index.d.ts
const { data } = await ListUserOrders(dataConnect, listUserOrdersVars);


```