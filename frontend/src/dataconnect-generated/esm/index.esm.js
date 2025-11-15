import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'example',
  service: 'hackathon',
  location: 'us-east4'
};

export const createMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMenuItem', inputVars);
}
createMenuItemRef.operationName = 'CreateMenuItem';

export function createMenuItem(dcOrVars, vars) {
  return executeMutation(createMenuItemRef(dcOrVars, vars));
}

export const listAvailableMenuItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableMenuItems');
}
listAvailableMenuItemsRef.operationName = 'ListAvailableMenuItems';

export function listAvailableMenuItems(dc) {
  return executeQuery(listAvailableMenuItemsRef(dc));
}

export const updateReservationStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateReservationStatus', inputVars);
}
updateReservationStatusRef.operationName = 'UpdateReservationStatus';

export function updateReservationStatus(dcOrVars, vars) {
  return executeMutation(updateReservationStatusRef(dcOrVars, vars));
}

export const listUserOrdersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUserOrders', inputVars);
}
listUserOrdersRef.operationName = 'ListUserOrders';

export function listUserOrders(dcOrVars, vars) {
  return executeQuery(listUserOrdersRef(dcOrVars, vars));
}

