import toast from 'react-hot-toast';
import axiosInstance from '@/pages/api/_axiosInstance';
/**
 *
 * @param {Number} patientPk patient primary key to check
 * @param {Number} timeDiffCheck how much time difference between visit and current time in minute
 * @param {boolean} confirmOnRecent whether to confirm on recent; true: current time diff is less than timeDiffCheck;
 * @param {string} confirmMessage the message to confirm
 * @returns {Promise<boolean>} if it is not recent. true: proceed OR error OR no visit; false: is recent;
 */
export async function checkRecency(
  patientPk,
  timeDiffCheck,
  confirmOnRecent,
  confirmMessage = ''
) {
  try {
    const { data: patient_visits } = await axiosInstance.get(
      `/visits?patient=${patientPk}`
    );
    if (patient_visits.length <= 0) {
      return true;
    } else {
      const mostRecentVisit = patient_visits.reduce((latest, visit) => {
        return new Date(visit.date) > new Date(latest.date) ? visit : latest;
      }, patient_visits[0]);

      const currentDate = new Date();
      const mostRecentVisitDate = new Date(mostRecentVisit.date);
      const timeDiffInMin =
        Math.abs(currentDate.getTime() - mostRecentVisitDate.getTime()) /
        (1000 * 60);

      if (
        confirmOnRecent
          ? timeDiffInMin < timeDiffCheck
          : timeDiffInMin > timeDiffCheck
      ) {
        return confirm(
          `It's been ${timeDiffInMin < 1440 ? `${Math.floor(timeDiffInMin)} min` : 'days'} since a visit for this patient was created.
           ${confirmMessage}
          `
        );
      }
    }
  } catch (error) {
    toast.error(`Error fetching patient visits: ${error.message}`);
    console.error('Error fetching patient vists:', error);
    return true;
  }
  return true;
}
