const { validateAdminArgs } = require('firebase-admin/data-connect');

const connectorConfig = {
  connector: 'example',
  serviceId: 'hackathon',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

function createMenuItem(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('CreateMenuItem', inputVars, inputOpts);
}
exports.createMenuItem = createMenuItem;

function listAvailableMenuItems(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrOptions, options, undefined);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListAvailableMenuItems', undefined, inputOpts);
}
exports.listAvailableMenuItems = listAvailableMenuItems;

function updateReservationStatus(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeMutation('UpdateReservationStatus', inputVars, inputOpts);
}
exports.updateReservationStatus = updateReservationStatus;

function listUserOrders(dcOrVarsOrOptions, varsOrOptions, options) {
  const { dc: dcInstance, vars: inputVars, options: inputOpts} = validateAdminArgs(connectorConfig, dcOrVarsOrOptions, varsOrOptions, options, true, true);
  dcInstance.useGen(true);
  return dcInstance.executeQuery('ListUserOrders', inputVars, inputOpts);
}
exports.listUserOrders = listUserOrders;

