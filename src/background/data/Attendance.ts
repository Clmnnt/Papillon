import { getCurrentAccount } from "../utils/accounts";
import { papillonNotify } from "../Notifications";
import { Attendance } from "@/services/shared/Attendance";
import { getAttendance, updateAttendanceState } from "../utils/attendance";
import { info } from "@/utils/logger/logger";

const getDifferences = (
  currentAttendance: Attendance,
  updatedAttendance: Attendance
): Attendance => {
  const absFilter = updatedAttendance.absences.filter(
    (updatedItem) =>
      !currentAttendance.absences.some(
        (item) =>
          item.fromTimestamp === updatedItem.fromTimestamp &&
          item.toTimestamp === updatedItem.toTimestamp
      )
  );

  const delFilter = updatedAttendance.delays.filter(
    (updatedItem) =>
      !currentAttendance.delays.some(
        (item) =>
          item.timestamp === updatedItem.timestamp &&
          item.duration === updatedItem.duration
      )
  );

  const obsFilter = updatedAttendance.observations.filter(
    (updatedItem) =>
      !currentAttendance.observations.some(
        (item) =>
          item.timestamp === updatedItem.timestamp &&
          item.sectionName === updatedItem.sectionName
      )
  );

  const punFilter = updatedAttendance.punishments.filter(
    (updatedItem) =>
      !currentAttendance.punishments.some(
        (item) =>
          item.timestamp === updatedItem.timestamp &&
          item.duration === updatedItem.duration
      )
  );

  return {
    absences: absFilter,
    delays: delFilter,
    observations: obsFilter,
    punishments: punFilter,
  };
};

const fetchAttendance = async (): Promise<Attendance> => {
  info("▶️ Running background Attendance", "BackgroundEvent");
  const account = getCurrentAccount();
  const notificationsTypesPermissions = account.personalization.notifications;

  const { defaultPeriod, attendances } = getAttendance();
  await updateAttendanceState(account, defaultPeriod);
  const updatedAttendance = getAttendance().attendances[defaultPeriod];

  const differences = getDifferences(
    attendances[defaultPeriod],
    updatedAttendance
  );
  const LAdifference =
    differences.absences.length +
    differences.delays.length +
    differences.observations.length +
    differences.punishments.length;

  if (notificationsTypesPermissions?.attendance) {
    switch (LAdifference) {
      case 0:
        break;
      case 1:
        let thenewevent = "";
        let explication = "";

        if (differences.absences.length === 1) {
          const dateAbsencesDebut = `${new Date(
            differences.absences[0].fromTimestamp
          )
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date(differences.absences[0].fromTimestamp)
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          const dateAbsencesFin = `${new Date(
            differences.absences[0].toTimestamp
          )
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date(differences.absences[0].toTimestamp)
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          thenewevent = "Nouvelle absence";
          explication = `Tu as été absent de ${dateAbsencesDebut} à ${dateAbsencesFin}.`;
        } else if (differences.delays.length === 1) {
          const dateRetard = `${new Date(differences.delays[0].timestamp)
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date(differences.delays[0].timestamp)
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          thenewevent = "Nouveau retard";
          explication = `Tu as été en retard de ${differences.delays[0].duration} min à ${dateRetard}.`;
        } else if (differences.observations.length === 1) {
          const dateObservations = `${new Date(
            differences.observations[0].timestamp
          )
            .getHours()
            .toString()
            .padStart(2, "0")}:${new Date(differences.observations[0].timestamp)
            .getMinutes()
            .toString()
            .padStart(2, "0")}`;

          thenewevent = "Nouvelle observation";
          explication = `Tu as eu une observation en ${
            differences.observations[0].subjectName ?? "Matière inconnue"
          } à ${dateObservations}.`;
        } else {
          thenewevent = "Nouvelle punition";
          explication = `
          Tu as eu une punition de ${differences.punishments[0].givenBy}.<br />
          Raison : ${differences.punishments[0].reason.circumstances}
          `;
        }

        await papillonNotify(
          {
            id: `${account.name}-attendance`,
            title: `[${account.name}] ${thenewevent}`,
            subtitle: defaultPeriod,
            body: explication,
          },
          "Attendance"
        );
        break;
      default:
        let LesExplication: string[] = [];

        if (differences.absences.length > 0) {
          if (differences.absences.length === 1) {
            LesExplication.push("1 nouvelle absence");
          } else {
            LesExplication.push(
              `${differences.absences.length} nouvelles absences`
            );
          }
        }

        if (differences.delays.length > 0) {
          if (differences.delays.length === 1) {
            LesExplication.push("1 nouveau retard");
          } else {
            LesExplication.push(
              `${differences.delays.length} nouveaux retards`
            );
          }
        }

        if (differences.observations.length > 0) {
          if (differences.observations.length === 1) {
            LesExplication.push("1 nouvelle observation");
          } else {
            LesExplication.push(
              `${differences.observations.length} nouvelles observations`
            );
          }
        }

        if (differences.punishments.length > 0) {
          if (differences.absences.length === 1) {
            LesExplication.push("1 nouvelle punition");
          } else {
            LesExplication.push(
              `${differences.punishments.length} nouvelles punitions`
            );
          }
        }

        await papillonNotify(
          {
            id: `${account.name}-attendance`,
            title: `[${account.name}] Vie Scolaire`,
            subtitle: defaultPeriod,
            body: `De nouveaux événements ont été publiés, consulte la vie scolaire pour plus de détails : ${LesExplication.join(
              ", "
            )}.`,
          },
          "Attendance"
        );
        break;
    }
  }

  return updatedAttendance;
};

export { fetchAttendance };
