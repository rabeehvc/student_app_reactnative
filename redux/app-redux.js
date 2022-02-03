import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import createSecureStore from "redux-persist-expo-securestore";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// INITIAL STATE
const initialState = {
  isAuthenticated: false,
  hasFullAccess: false,
  districtData: null,
  isLoading: false,
  userData: null,
  loginUser: null,
  loginPass: null,
  isTab: false,
};

// REDUCERS
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "AUTH_STATE_CHANGED":
      return { ...state, isAuthenticated: action.value };
    case "HAS_FULL_ACCESS_CHANGED":
      return { ...state, hasFullAccess: action.value };
    case "DISTRICT_DATA_CHANGED":
      return { ...state, districtData: action.value };
    case "IS_LOADING_CHANGED":
      return { ...state, isLoading: action.value };
    case "USER_DATA_CHANGED":
      return { ...state, userData: action.value };
    case "LOGIN_USER_CHANGED":
      return { ...state, loginUser: action.value };
    case "LOGIN_PASS_CHANGED":
      return { ...state, loginPass: action.value };
    case "IS_TAB_DEVICE":
      return { ...state, isTab: action.value };
    default:
      break;
  }
  return state;
};

// STORE
const secureStorage = createSecureStore();
const persistConfig = {
  key: "root",
  storage: secureStorage,
  whitelist: ["districtData","loginUser", "loginPass"],
};
const persistedReducer = persistReducer(persistConfig, reducer);
const store = createStore(persistedReducer);
const persistor = persistStore(store);
export { store, persistor };

// ACTIONS
const authStateChanged = (authState) => ({
  type: "AUTH_STATE_CHANGED",
  value: authState,
});
const hasFullAccessChanged = (hasFullAccess) => ({
  type: "HAS_FULL_ACCESS_CHANGED",
  value: hasFullAccess,
});
const districtDataChanged = (districtData) => ({
  type: "DISTRICT_DATA_CHANGED",
  value: districtData,
});
const isLoadingChanged = (isLoading) => ({
  type: "IS_LOADING_CHANGED",
  value: isLoading,
});
const userDataChanged = (userData) => ({
  type: "USER_DATA_CHANGED",
  value: userData,
});
const loginUserChanged = (loginUser) => ({
  type: "LOGIN_USER_CHANGED",
  value: loginUser,
});
const loginPassChanged = (loginPass) => ({
  type: "LOGIN_PASS_CHANGED",
  value: loginPass,
});
const isTabDevice = (isTab) => ({
  type: "IS_TAB_DEVICE",
  value: isTab,
});

export {
  authStateChanged,
  hasFullAccessChanged,
  districtDataChanged,
  isLoadingChanged,
  userDataChanged,
  loginUserChanged,
  loginPassChanged,
  isTabDevice,
};
