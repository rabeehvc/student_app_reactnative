import { Alert } from 'react-native';
import { store, authStateChanged, hasFullAccessChanged, isLoadingChanged } from '../redux/app-redux';

// Used after we get a response back from api to determine if our JWT Session token is still valid.
// If not, we throw an alert and send the user to the login screen.
function checkJWTIsValid(responseData, showAlert = true) {
    if (responseData.status === 'error' && responseData.errorDescription === 'FULL_ACCESS_EXPIRED') {
        store.dispatch(hasFullAccessChanged(false));
        store.dispatch(authStateChanged(false));
        store.dispatch(isLoadingChanged(false));
        if (showAlert) {
            Alert.alert('You need Full Access to do that.', 'Please log in again to regain full access.');            
        }
        return false;
    }
    if (responseData.status === 'error' && responseData.errorDescription === 'SESSION_EXPIRED') {
        store.dispatch(authStateChanged(false));
        store.dispatch(isLoadingChanged(false));
        if (showAlert) {
            Alert.alert('Session Expired.', 'Please log in again.');
        }
        return false;
    }

    if (responseData.status === 'error' && responseData.errorDescription === 'INVALID_KEY') {
        store.dispatch(authStateChanged(false));
        store.dispatch(isLoadingChanged(false));
        if (showAlert) {
            Alert.alert('Your session is invalid.', 'Please log in again.');
        }
        return false;
    }

    if (responseData.status === 'error' && responseData.errorDescription === 'INVALID_TOKEN_PROVIDED') {
        store.dispatch(authStateChanged(false));
        store.dispatch(isLoadingChanged(false));
        if (showAlert) {
            Alert.alert('Your session is invalid.', 'Please log in again.');
        }
        return false;
    }
    return true;
}

// Used to determine if we need to set global state to signify if the user has full access or not
function checkLocalFullAccessExp() {
    const { userData } = store.getState();
    const currentDateUnixTimestamp = new Date().valueOf() / 1000; // Get current date time in seconds
    let localFullAccessExp = 0; // Set default value for full access expiration
    if (userData && 'fullAccessExp' in userData) { // If we are logged in, get the current session's full access expiration
        localFullAccessExp = userData.fullAccessExp;
    }
    // Full access expiration will default to 0,
    // so if we are not on a screen with a deliberately hidden relog button, making the relog button always show
    if (currentDateUnixTimestamp < localFullAccessExp) {
        return;
    }
    store.dispatch(hasFullAccessChanged(false));
}

export { checkJWTIsValid, checkLocalFullAccessExp };
