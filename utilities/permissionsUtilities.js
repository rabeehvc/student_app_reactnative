import { Alert } from 'react-native';
import { store } from '../redux/app-redux';

// Check the UserData stores in Redux global state to see if the user has the requested permission
function checkLocalUserPermission(permission) {
    const currentUserPermissions = store.getState().userData.permissions;
    if (permission === "All Users Allowed") { return true; }
    return currentUserPermissions.includes(permission);
}

function checkLocalUserFeatureFlag(featureFlag) {
    const currentUserFeatures = store.getState().userData.featureFlags;
    if (featureFlag === "") { return true; }
    if (featureFlag === "All Users Allowed") { return true; }
    return currentUserFeatures.includes(featureFlag);
}

// Used after we get a response back from API to determine if our request was denied because of user permissions.
function checkUserPermissionResponse(responseData, showAlert = true) {
    if (responseData.status === 'error' && responseData.errorDescription === 'PERMISSION_UNAUTHORIZED') {
        if (showAlert) {
            Alert.alert('Permission Denied.', 'You are not authorized for this functionality.');
        }
        return false;
    }
    return true;
}

export { checkLocalUserPermission, checkUserPermissionResponse, checkLocalUserFeatureFlag };
