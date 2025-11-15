const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'example',
  service: 'hackathon',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const createMenuItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMenuItem', inputVars);
}
createMenuItemRef.operationName = 'CreateMenuItem';
exports.createMenuItemRef = createMenuItemRef;

exports.createMenuItem = function createMenuItem(dcOrVars, vars) {
  return executeMutation(createMenuItemRef(dcOrVars, vars));
};

const listAvailableMenuItemsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListAvailableMenuItems');
}
listAvailableMenuItemsRef.operationName = 'ListAvailableMenuItems';
exports.listAvailableMenuItemsRef = listAvailableMenuItemsRef;

exports.listAvailableMenuItems = function listAvailableMenuItems(dc) {
  return executeQuery(listAvailableMenuItemsRef(dc));
};

const updateReservationStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateReservationStatus', inputVars);
}
updateReservationStatusRef.operationName = 'UpdateReservationStatus';
exports.updateReservationStatusRef = updateReservationStatusRef;

exports.updateReservationStatus = function updateReservationStatus(dcOrVars, vars) {
  return executeMutation(updateReservationStatusRef(dcOrVars, vars));
};

const listUserOrdersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListUserOrders', inputVars);
}
listUserOrdersRef.operationName = 'ListUserOrders';
exports.listUserOrdersRef = listUserOrdersRef;

exports.listUserOrders = function listUserOrders(dcOrVars, vars) {
  return executeQuery(listUserOrdersRef(dcOrVars, vars));
};
