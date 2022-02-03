import React from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import AuthenticatedViewController from "./authenticatedViewController";
import LoadingIndicator from "./components/loadingIndicator";
import realtimeStyles from "./constants/realtimeStyles";
import { NavigationContainer } from "@react-navigation/native";

const NavigationContainerView = () => {
  const { isLoading } = useSelector((state) => state);
  return (
    <View style={realtimeStyles.navigationContainerViewStyle}>
      <LoadingIndicator isLoading={isLoading} />
      <NavigationContainer>
        <AuthenticatedViewController />
      </NavigationContainer>
    </View>
  );
};

export default NavigationContainerView;
