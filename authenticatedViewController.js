// We are using global state variables via Redux to determine which screens the user should see by default.
// The benefit of this is that when a global state variable changes, if that variable is related to authentication,
// we can instantly navigate the user to the screen where they can obtain the proper authentication.
// At any point, if the user does not have valid district data, they can be immediately taken to the
// district code entry screen. Likewise, if the user is not properly authenticated but has valid district data,
// they will be immediately taken to the login screen.

import React from "react";
import { useSelector } from 'react-redux';
import DistrictSelectStackNavigation from "./navigation/DistrictSelectStackNavigation";
import LoginStackNavigation from "./navigation/LoginStackNavigation";
import RelogStackNavigation from "./navigation/RelogStackNavigation";

const AuthenticatedViewController = () => {
  const { districtData } = useSelector((state) => state);
  const { isAuthenticated } = useSelector((state) => state);

  const userDistrictIsValid = () => {
    
    const distData = districtData;
    if (distData == null || distData === undefined || distData === "") {
      return false;
    }

    if (
      distData.districtID == null ||
      distData.districtID === undefined ||
      distData.districtID === ""
    ) {
      return false;
    }
    return true;
  }

  const userIsAuthenticated = () => {    
    return isAuthenticated;
  }
  
  // if district data is not present in the state then it will redirect to the district selection screen
  if (!userDistrictIsValid()) {
    return <DistrictSelectStackNavigation />;
  }

  // if user is not validated then it will redirect to the login screen
  if (!userIsAuthenticated()) {
    return <LoginStackNavigation />;
  }

  // it will redirect to the main screen
  return <RelogStackNavigation />;

}

export default AuthenticatedViewController;
