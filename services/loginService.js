import jwtDecode from 'jwt-decode';
import { loginRequest } from '../wrappers/axiosWrapper';
import UserData from '../models/userData';

class LoginService {
    constructor() {
        this.returnObject = {};
        this.responseData = {};
    }

    async performLoginRequest(username, password, districtID) {
        try {
            // Make request via wrapper
            const response = await loginRequest(username.trim(), password.trim(), districtID.trim());           
            // Check the validity of the data
            if (response.data === undefined || response.data == null || response.data === '') {
                this.returnObject.error = 'Unable to log in with these credentials.';
                return this.returnObject;
            }
            this.responseData = response.data;
            this.returnObject.status = this.responseData.status;
            this.returnObject.message = this.responseData.message;

            if (this.returnObject.status === 'reset') {
              this.returnObject.status = this.responseData.status;
              this.returnObject.message = this.responseData.message;
            } else if (this.returnObject.status === 'success') {
                this.parseUserData();
            }
            return this.returnObject;
        } catch (responseError) {
            this.returnObject.error = responseError;
            return this.returnObject;
        }
    }

    parseUserData() {
        try {
            const encodedJWT = this.responseData.session;
            const claims = jwtDecode(encodedJWT);           
            const userData = new UserData();
            userData.firstName = claims.userdata.FirstName.toString().trim();
            userData.lastName = claims.userdata.LastName.toString().trim();
            userData.description = claims.userdata.Description.toString().trim();
            userData.employeeID = claims.userdata.EmployeeId;
            userData.isActive = claims.userdata.IsActive;
            userData.sessionToken = encodedJWT;
            userData.username = claims.userdata.username.toString().trim();
            userData.permissions = Object.values(claims.options.permissions).map(value => value.description);
            userData.fullAccessExp = claims.fullAccessExp;
            userData.actualSchoolYear = claims.actualschoolyear;
            userData.academicYearStart = claims.options.academicyearstart;
            userData.academicYearEnd = claims.options.academicyearend;
            userData.locationID = claims.userdata.locationID.toString().trim();
            userData.featureFlags = claims.featureflags           
            this.returnObject.userData = userData;
        } catch {
            this.returnObject.error = 'Invalid Login - Unable to Build User Data';
        }
    }
}

export default LoginService;
