import { development } from '../app-config';

//fecth url for announcement screen - announsements
export const StudentServices = async (token, distID, studentid) => {
  let response = await fetch(
    `${development.apiBaseUrl}/students/parentMobileAppHeadlinesByStudentID.cfm?districtID=${distID}&validateRequest=1&sel=${studentid}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: token,
      },
    }
  );
  return response;
};
