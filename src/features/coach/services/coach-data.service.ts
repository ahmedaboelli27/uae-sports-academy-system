import {
  coachAssignedPlayersMock,
  coachAttendanceTrendMock,
  coachChartColors,
  coachIncidentReportsMock,
  coachProgressNotesMock,
  coachSkillAssessmentsMock,
  coachTasksMock,
  coachTodaySessionsMock,
  coachUpcomingSessionsMock,
  currentCoachMock,
} from '@/features/coach/services/coach.mock';
import type {
  CoachAssignedPlayerDto,
  CoachCapacityPointDto,
  CoachDashboardSummaryDto,
  CoachStatusBreakdownPointDto,
} from '@/features/coach/types/coach.dto';

function getCoachScopedSessions() {
  return coachTodaySessionsMock.filter((session) =>
    session.assignedCoachIds.includes(currentCoachMock.id),
  );
}

function getCoachScopedUpcomingSessions() {
  return coachUpcomingSessionsMock.filter((session) =>
    session.assignedCoachIds.includes(currentCoachMock.id),
  );
}

function getCoachScopedPlayers() {
  return coachAssignedPlayersMock.filter((player) =>
    player.assignedCoachIds.includes(currentCoachMock.id),
  );
}

function getCoachScopedTasks() {
  return coachTasksMock.filter((task) => task.coachId === currentCoachMock.id);
}

function getDashboardSummary(): CoachDashboardSummaryDto {
  const sessions = getCoachScopedSessions();
  const players = getCoachScopedPlayers();

  const totalSessions = sessions.length;
  const totalAssignedPlayers = players.length;

  const attendancePending = sessions.filter(
    (session) => session.status === 'attendancePending',
  ).length;

  const attendanceCompletion = totalSessions
    ? Math.round(
      (sessions.filter((session) => session.status !== 'attendancePending')
        .length /
        totalSessions) *
      100,
    )
    : 0;

  const averageAttendance = players.length
    ? Math.round(
      players.reduce((total, player) => total + player.attendanceRate, 0) /
      players.length,
    )
    : 0;

  const pendingNotes = players.filter(
    (player) => player.status === 'needsFollowUp',
  ).length;

  return {
    totalSessions,
    totalAssignedPlayers,
    attendancePending,
    attendanceCompletion,
    averageAttendance,
    pendingNotes,
  };
}

function getCapacityData(): CoachCapacityPointDto[] {
  return getCoachScopedSessions().map((session) => ({
    name: session.title.replace('Football ', '').replace(' Training', ''),
    assigned: session.assignedPlayers,
    remaining: Math.max(session.capacity - session.assignedPlayers, 0),
  }));
}

function getPlayerStatusBreakdown(): CoachStatusBreakdownPointDto[] {
  const players = getCoachScopedPlayers();

  return [
    {
      name: 'Excellent',
      value: players.filter((player) => player.status === 'excellent').length,
      color: coachChartColors.green,
    },
    {
      name: 'Active',
      value: players.filter((player) => player.status === 'active').length,
      color: coachChartColors.blue,
    },
    {
      name: 'Needs Follow-up',
      value: players.filter((player) => player.status === 'needsFollowUp').length,
      color: coachChartColors.orange,
    },
  ].filter((item) => item.value > 0);
}

function searchAssignedPlayers(
  players: CoachAssignedPlayerDto[],
  searchTerm: string,
) {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  if (!normalizedSearch) return players;

  return players.filter((player) => {
    return (
      player.name.toLowerCase().includes(normalizedSearch) ||
      player.program.toLowerCase().includes(normalizedSearch) ||
      player.level.toLowerCase().includes(normalizedSearch) ||
      player.latestNote.toLowerCase().includes(normalizedSearch)
    );
  });
}

function getCoachScopedProgressNotes() {
  const playerIds = new Set(getCoachScopedPlayers().map((player) => player.id));
  const sessionIds = new Set(getCoachScopedSessions().map((session) => session.id));

  return coachProgressNotesMock.filter(
    (note) =>
      note.coachId === currentCoachMock.id &&
      playerIds.has(note.studentId) &&
      sessionIds.has(note.sessionId),
  );
}

function getCoachScopedSkillAssessments() {
  const playerIds = new Set(getCoachScopedPlayers().map((player) => player.id));

  return coachSkillAssessmentsMock.filter(
    (assessment) =>
      assessment.coachId === currentCoachMock.id &&
      playerIds.has(assessment.studentId),
  );
}

function getCoachScopedIncidentReports() {
  const playerIds = new Set(getCoachScopedPlayers().map((player) => player.id));
  const sessionIds = new Set(getCoachScopedSessions().map((session) => session.id));

  return coachIncidentReportsMock.filter(
    (incident) =>
      incident.coachId === currentCoachMock.id &&
      playerIds.has(incident.studentId) &&
      sessionIds.has(incident.sessionId),
  );
}

export const coachDataService = {
  getCurrentCoach: () => currentCoachMock,
  getChartColors: () => coachChartColors,
  getTodaySessions: getCoachScopedSessions,
  getUpcomingSessions: getCoachScopedUpcomingSessions,
  getAssignedPlayers: getCoachScopedPlayers,
  getCoachTasks: getCoachScopedTasks,
  getProgressNotes: getCoachScopedProgressNotes,
  getSkillAssessments: getCoachScopedSkillAssessments,
  getIncidentReports: getCoachScopedIncidentReports,
  getAttendanceTrend: () => coachAttendanceTrendMock,
  getDashboardSummary,
  getCapacityData,
  getPlayerStatusBreakdown,
  searchAssignedPlayers,
};
