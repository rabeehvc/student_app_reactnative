import { createTheme, createText, createBox } from '@shopify/restyle';

const palette = {
  purpleLight: '#8C6FF7',
  purplePrimary: '#5A31F4',
  purpleDark: '#3F22AB',
  lightPurple: '#D7BDE2',

  greenLight: '#56DCBA',
  greenPrimary: '#0ECD9D',
  greenDark: '#0A906E',
  newGrey: '#85929E',
  black: '#0B0B0B',
  white: '#FFFFFF',
  trueWhite: '#FFFFFF',
  blacks: '#0C0D34',
  primaryCol: '#0554F2',
  coolGrey: '#c3cfe2',
  notPrimaryCol: 'rgba(12,13,52,0.05)',
  darkGrey: '#8A8D90',
  lightGrey: '#FAFAFA',
  shadowGrey: '#EAEAEA',
  danger: '#BF1B28',
  primaryColLight: '#00B2FF',
  transparentCol: '#c3cfe2bb',
  borderCol: '#E1E1E1',
  validationCol: '#BF1B28',
  darkRed: '#FF0000',
  textBlue:'#034AA6',
  lightBlack : '#3D4464',
  headerCol:'#212121',
  specialCol:'#4f5eab',
};

const theme = createTheme({
  colors: {
    mainBackground: palette.white,
    mainForeground: palette.black,
    cardPrimaryBackground: palette.purplePrimary,
    buttonPrimaryBackground: palette.purplePrimary,
    textCol: palette.white,
    textColBlacks: palette.blacks,
    butColPrim: palette.primaryCol,
    butColPrimLight: palette.primaryColLight,
    butColNotPrim: palette.notPrimaryCol,
    butTextWhite: palette.trueWhite,
    headerCol: palette.newGrey,
    welcomeBack: palette.shadowGrey,
    darkGreyBord: palette.darkGrey,
    dangerCol: palette.danger,
    superLightGrey: palette.lightGrey,
    loaderTransparent: palette.transparentCol,
    borderCol: palette.borderCol,
    validationText: palette.validationCol,
    successCol: palette.greenDark,
    favCol: palette.primaryColLight,
    textBlue:palette.textBlue,
    iconCol: palette.lightBlack,
    disableCol: palette.coolGrey,
    headerCol:palette.headerCol,
    specialIconCol: palette.specialCol,
  },
  spacing: {
    s: 8,
    m: 16,
    m1: 20,
    l: 24,
    xl: 40,
    xxl: 60,
  },
  borderRadii: {
    s: 4,
    m: 10,
    ml: 19,
    l: 25,
    xl: 75,
  },

  textVariants: {
    header: {
      fontFamily: 'RRegular',
      fontWeight: "bold",
      fontSize: 80,
      lineHeight: 80,
      textAlign: "center",
      color: 'headerCol',
    },
    subheader: {
      fontFamily: 'RRegular',
      fontWeight: "bold",
      fontSize: 24,
      lineHeight: 30,
      color: 'textColBlacks',
      textAlign: "center",
      // marginBottom:12
    },
    smallheader: {
      fontFamily: 'RRegular',
      fontSize: 13,
      lineHeight: 22,
      color: 'textColBlacks',
      textAlign: "center",
      // marginBottom:12
    },
    body: {
      fontFamily: 'RRegular',
      fontSize: 16,
      lineHeight: 24,
      color: 'textColBlacks',
      textAlign: "center",
      // marginBottom:20
    },
    button: {
      fontFamily: 'RRegular',
      fontSize: 15,
      textAlign: "center",
    },
    buttoncolor: {
      fontFamily: 'RRegular',
      fontSize: 15,
      textAlign: "center",
      color: 'textCol',
    },
    topHeader: {
      fontSize: 18,
      fontFamily: 'RRegular',
      lineHeight: 36,
      color: 'textColBlacks',
    },
    pageHeader: {
      fontFamily: 'RRegular',
      fontSize: 20,
      lineHeight: 24,
      color: 'textColBlacks',
      textAlign: "center",
      // marginBottom:20
    },
    sideHeader: {
      fontFamily: 'RRegular',
      fontSize: 17,
      lineHeight: 24,
      fontWeight: 'bold',
      color: 'textColBlacks',
    },
    bodyText: {
      fontFamily: 'RRegular',
      fontSize: 16,
      lineHeight: 24,
      color: 'textColBlacks',
      // marginBottom:20
    },
    sideHeaderSmall: {
      fontFamily: 'RRegular',
      fontSize: 11,
      lineHeight: 24,
      color: 'textColBlacks',
    },
    sectionHeader: {
      fontFamily: 'RMedium',
      fontSize: 17,
      lineHeight: 24,
      fontWeight: 'bold',
      color: 'textColBlacks',
    }
  },
});

export const Text = createText();

export const Box = createBox();

export default theme;
