import React from 'react';
import Spinner from 'react-native-loading-spinner-overlay';
import realtimeStyles from '../constants/realtimeStyles';

const LoadingIndicator = (props) => {
  return (
    <>
      {props.isLoading === true ? (
        <Spinner
          visible={props.isLoading}          
          textStyle={realtimeStyles.spinnerTextStyle}
        />
      ) : null}
    </>
  );
};

export default LoadingIndicator;
