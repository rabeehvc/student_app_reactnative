import {
  submitDistrictCode,
  retrieveDistrictsList,
} from "../wrappers/axiosWrapper";
import DistrictData from "../models/districtData";

class DistrictDataLookupService {
  constructor(districtCode) {
    this.districtCode = districtCode;
    this.returnObject = {};
    this.responseData = {};
  }

  async retrieveDistrictSettings() {
    try {
      // Make request via wrapper
      const response = await submitDistrictCode(this.districtCode);

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error =
          "Please check that you have entered a valid district and that you are connected to the network.";
        return this.returnObject;
      }

      this.responseData = response.data;
      if (
        this.responseData.districtid === undefined ||
        this.responseData.districtid == null ||
        this.responseData.districtid === ""
      ) {
        this.returnObject.error = "Invalid District Configuration";
        return this.returnObject;
      }

      // Parse Response Data into District Data
      this.parseDistrictData();

      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  async performRetrieveDistrictListRequest() {
    try {
      // Make request via wrapper
      const response = await retrieveDistrictsList();

      // Check the validity of the data
      if (
        response.data === undefined ||
        response.data == null ||
        response.data === ""
      ) {
        this.returnObject.error =
          "Unable to retrieve district data. Please check that you are connected to the network.";
        return this.returnObject;
      }

      this.responseData = response.data;

      this.returnObject.status = this.responseData.status;
      this.returnObject.districts = this.responseData.data;
      return this.returnObject;
    } catch (responseError) {
      this.returnObject.error = responseError;
      return this.returnObject;
    }
  }

  parseDistrictData() {
    try {
      const newDistrictData = new DistrictData();
      newDistrictData.districtID = this.responseData.districtid;
      newDistrictData.backgroundImageURL = this.responseData.backgroundimageurl;
      newDistrictData.districtDisplayName =
        this.responseData.districtdisplayname;
      newDistrictData.primaryColor =
        this.responseData.primarycolor || "#FFFFFF";
      newDistrictData.secondaryColor =
        this.responseData.secondarycolor || "#000000";
      newDistrictData.portalCurrentSchoolYear =
        this.responseData.portalcurrentschoolyear;
      newDistrictData.requirePortalCode = this.responseData.requireportalcode;
      this.returnObject.districtData = newDistrictData;
    } catch {
      this.returnObject.error =
        "Invalid District Configuration - Unable to Build District Data";
    }
  }
}

export default DistrictDataLookupService;
