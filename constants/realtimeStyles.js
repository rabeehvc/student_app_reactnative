import { StyleSheet } from "react-native";
import * as realtimeStyleConstants from "./realtimeStyleConstants";

export default StyleSheet.create({
  realtimeLineSeparator: {
    borderBottomColor: realtimeStyleConstants.tableItemBorderColor,
    borderBottomWidth: 1,
    width: "90%",
    marginTop: 10,
    marginBottom: 15,
  },
  realtimeBGColor: {
    backgroundColor: realtimeStyleConstants.realtimeBlue,
  },
  backgroundWhite: {
    backgroundColor: "white",
  },
  backgroundTransparent: {
    backgroundColor: "transparent",
  },
  black: {
    color: "black",
  },
  white: {
    color: "white",
  },
  red: {
    color: "red",
  },
  emergencyRed: {
    color: "#721c24",
    backgroundColor: "#f8d7da",
    borderColor: "#f5c6cb",
  },
  column: {
    flexDirection: "column",
  },
  row: {
    flexDirection: "row",
  },
  w90: {
    width: "90%",
  },
  w100: {
    width: "100%",
  },
  h100: {
    height: "100%",
  },
  mx5: {
    marginLeft: 5,
    marginRight: 5,
  },
  my5: {
    marginTop: 5,
    marginBottom: 5,
  },
  m5: {
    margin: 5,
  },
  flexGrow: {
    // flexGrow: 1,
    flex:6
  },
  justifyContentCenter: {
    justifyContent: "center",
  },
  alignItemsEnd: {
    alignItems: "flex-end",
  },
  justifyContentEnd: {
    justifyContent: "flex-end",
  },
  centeredFlexColumn: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  centeredColumn: {
    flexDirection: "column",
    alignItems: "center",
  },
  centeredVertColumn: {
    flex:6,
    flexDirection: "column",
    justifyContent: "center"

  },
  rowSpaceBetween: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  rowFlexEnd: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  inputFontSize: {
    fontSize: 16,
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  copyrightText: {
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
  },
  largeTextBold: {
    fontSize: 13,
    fontWeight: "bold",
  },
  labelText: {
    fontSize: 14,
    paddingRight: 4,
  },
  bold: {
    fontWeight: "bold",
  },
  borderRight: {
    borderRightWidth: 0.5,
    borderLeftWidth: 1,
    borderColor: realtimeStyleConstants.tableItemBorderColor,
  },
  disabled: {
    backgroundColor: realtimeStyleConstants.disabledGray,
  },
  disabledText: {
    color: realtimeStyleConstants.disabledGray,
  },
  linkText: {
    color: realtimeStyleConstants.linkBlue,
  },
  simpleItemSeparator: {
    backgroundColor: realtimeStyleConstants.tableItemBorderColor,
    height: 1,
    width: "100%",
  },
  textLeft: {
    textAlign: "left",
  },
  textRight: {
    textAlign: "right",
  },
  contentContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },

  // COMPONENTS
  dateInput: {
    width: "100%",
    marginLeft: 36,
    backgroundColor: "white",
  },
  dateInputClockIcon: {
    position: "absolute",
    left: 0,
    top: 4,
    marginLeft: 0,
  },

  // DISTRICT SELECT
  districtSelectMarginTop: {
    marginTop: 30,
  },
  districtSelectMarginBottom: {
    marginBottom: 30,
  },
  districtSelectInputLabel: {
    marginBottom: 6,
    color: "white",
  },
  districtSearchBarContainer: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingBottom: 0,
  },
  districtSearchBarInputContainer: {
    height: 45,
    borderRadius: 5,
    paddingLeft: 15,
    marginHorizontal: 25,
  },
  districtSearchResultsContainer: {
    marginLeft: 12,
    marginRight: 12,
  },
  districtSearchResultsView: {
    position: "absolute",
    top: 0,
  },
  districtSearchListItem: {
    paddingLeft: 8,
    height: 40,
  },

  // LOGIN SCREEN
  loginContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  logo: {
    maxWidth: 275,
    maxHeight: 140,
  },
  loginLogo: {
    height: "25%",
    justifyContent: "flex-end",
  },
  loginFieldsContainer: {
    flex: 1,
    justifyContent: "center",
    width: "90%",
  },
  loginText: {
    alignSelf: "center",
    fontSize: 18,
    fontWeight: "600",
    color: realtimeStyleConstants.realtimeBlue,
    textAlign: "center",
  },
  loginButton: {
    height: 58,
    justifyContent: "center",
    backgroundColor: realtimeStyleConstants.realtimeBlue,
    borderRadius: 29,
    marginVertical: 10,
    padding: 10,
  },
  loginButtonText: {
    fontSize: 20,
    color: "white",
  },
  changeDistrictText: {
    color: realtimeStyleConstants.realtimeBlue,
  },
  loginFooter: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "flex-end",
    alignItems: "center",
    width: "100%",
    marginBottom: 12,
  },
  changeDistrictButton: {
    height: 50,
    width: 190,
    justifyContent: "center",
    borderRadius: 29,
    borderColor: realtimeStyleConstants.realtimeBlue,
    borderWidth: 1,
    padding: 10,
    marginBottom: 16,
  },

  // HOME
  announcementsView: {
    flex: 1,
    backgroundColor: realtimeStyleConstants.lightBackgroundGray,
  },

  // STUDENT SEARCH
  searchStudentTxt: {
    paddingTop: 36,
    paddingBottom: 20,
    fontWeight: "600",
    fontSize: 20,
  },
  realtimeButtonBlue: {
    backgroundColor: realtimeStyleConstants.realtimeButtonBlue,
  },
  searchButton: {
    height: 58,
    justifyContent: "center",
    width: "100%",
    backgroundColor: realtimeStyleConstants.realtimeButtonBlue,
    borderRadius: 29,
    marginVertical: 10,
    padding: 10,
  },
  searchButtonText: {
    fontSize: 20,
    fontWeight: "500",
    color: realtimeStyleConstants.realtimeCharcoal,
    textAlign: "center",
  },

  // STUDENT LIST
  studentListItemLabelText: {
    color: realtimeStyleConstants.hazyGray,
    paddingRight: 4,
  },
  extendedHeader: {
    padding: 12,
  },

 
  staffScheduleSectionTitleText: {
    color: "white",
    fontSize: 18,
  },
  staffScheduleListItemDetailView: {
    paddingBottom: 5,
    paddingTop: 5,
    paddingLeft: 12,
    paddingRight: 16,
    backgroundColor: "white",
  },
  staffScheduleCourseSectionText: {
    fontSize: 11,
    fontWeight: "bold",
    color: realtimeStyleConstants.realtimeCharcoal,
  },
  staffScheduleListItemScheduleView: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: realtimeStyleConstants.tableItemBorderColor,
  },
  staffScheduleListItemRoomLabelText: {
    fontSize: 13,    
    color: "white",    
  },
  staffScheduleListItemdayView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: realtimeStyleConstants.lightBackgroundGray,
  },
  currentDay: {
    backgroundColor: realtimeStyleConstants.lightRealtimeGreen,
  },
  staffScheduleListItemDayCodeText: {
    padding: 4,
    fontSize: 12,
    fontWeight: "bold",
  },
  staffScheduleListItemPeriodDisplayText: {
    paddingHorizontal: 2,
    paddingVertical: 4,
    fontSize: 11,
    fontWeight: "600",
  },
  staffScheduleHomeroomListItem: {
    paddingVertical: 16,
    paddingLeft: 12,
    paddingRight: 16,
    // backgroundColor: "#C2EDFF",
    backgroundColor: "#84C441",
    borderRadius: 5,
    marginBottom: 10,
  },
  staffScheduleStudentListExtendedHeader: {
    backgroundColor: realtimeStyleConstants.realtimeCharcoal,
  },
  disciplineText: {
    paddingTop: 36,
    paddingBottom: 20,
    fontWeight: "600",
    fontSize: 20,
  },

  // STUDENT PROFILE
  studentProfileContainer: {
    width: "100%",
    justifyContent: "flex-start",
  },
  studentProfileListStyle: {
    //padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#DCDCDC",
  },
  studentProfileListTitleStyle: {
    fontWeight: "500",
  },

  // STUDENT HEADER
  studentHeaderTopView: {
    height: 70,
    paddingBottom: 6,
  },
  studentHeaderBottomView: {
    paddingLeft: 118,
    paddingTop: 4,
    paddingBottom: 10,
    paddingRight: 12,
  },
  studentScheduledInContainer: {
    backgroundColor: realtimeStyleConstants.studentHeaderBGColor,
    padding: 4,
    flexDirection: "row",
  },
  studentScheduleDayContainer: {
    backgroundColor: realtimeStyleConstants.realtimeCharcoal,
    padding: 4,
    paddingLeft: 8,
    flexDirection: "row",
  },
  studentScheduledInDataContainer: {
    paddingRight: 2,
  },
  studentScheduledInIcon: {
    paddingHorizontal: 6,
  },
  studentScheduledInText: {
    flex: 1,
    flexWrap: "wrap",
    paddingTop: 1,
    fontSize: 12,
    color: "white",
    maxWidth: "100%",
  },
  studentCircleImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "white",
    position: "absolute",
    bottom: -45,
    left: 8,
  },
  studentName: {
    fontSize: 22,
    color: "white",
    fontWeight: "600",
    textAlign: "center",
    paddingLeft: 118,
  },
  studentHeaderValueView: {
    paddingTop: 4,
  },
  studentHeaderValue: {
    color: realtimeStyleConstants.studentHeaderValueColor,
  },
  studentHeaderLabel: {
    fontSize: 12,
    color: realtimeStyleConstants.studentHeaderLabelColor,
  },

  // MAIN MENU SCREEN
  logoutButton: {
    width: 350,
    borderRadius: 25,
    borderColor: "red",
    borderWidth: 1,
    marginVertical: 10,
    padding: 10,
  },

  // STUDENT CONTACTS SCREEN
  contactsTitle: {
    fontSize: 14,
    fontWeight: "900",
  },
  contactsRightTitle: {
    fontSize: 13,
  },
  noContactsFoundText: {
    textAlign: "center",
    fontWeight: "900",
  },
  callContactText: {
    color: "blue",
  },

  // PERIOD ATTENDANCE
  periodAttendanceHeaderLabel: {
    paddingRight: 4,
  },
  periodAttendanceLabelPadding: {
    paddingTop: 2,
  },
  periodAttendanceListItemContainer: {
    padding: 12,
  },
  periodAttendanceStudentIDView: {
    paddingTop: 6,
  },
  periodAttendanceTimePickerDiv: {
    marginLeft: 10,
    justifyContent: "center",
    flex: 0.4,
  },
  periodAttendanceFieldPadding: {
    paddingTop: 6,
    paddingLeft: 36,
  },
  periodAttendanceStaticTransactionTime: {
    paddingTop: 3,
    paddingLeft: 4,
  },
  dailyAttendanceIndicatorIcon: {
    fontSize: 12,
    paddingHorizontal: 6,
  },
  barcodeScanner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "blue",
    width: "100%",
  },
  navigationContainerViewStyle: {
    flex: 1,
    justifyContent: "center",
  },
  appTitleContainer: {
    flex: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  appTitleText: {
    fontSize: 46,
  },
  appSubTitleText: {
    fontSize: 36,
  },

  digitsRow: {
    flex: 0,
    flexDirection: "row",
    alignItems: "center",
    height: "auto",
  },
  digitMargins: {
    marginRight: 8,
  },

  spinnerTextStyle: {
    color: "#FFF",
  },
  spinnerView: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
    height: "100%",
    backgroundColor: "black",
    opacity: 0.4,
    zIndex: 1000,
    position: "absolute",
  },
});
