import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { useAuth } from '@/hooks/useAuth';
import { AttendanceChart } from '@/components/charts/AttendanceChart';
import { Avatar } from '@/components/common/Avatar';
import { Colors } from '@/constants/colors';
import { BorderRadius, FontSizes, FontWeights, Shadow, Spacing } from '@/constants/theme';
import { userApi, DashboardStats } from '@/api/user.api';
import { attendanceApi } from '@/api/attendance.api';
import { getGreeting, formatPercentage } from '@/utils/helpers';

const { width } = Dimensions.get('window');

interface MetricCard { label: string; value: string | number; icon: string; color: string; change?: string; }

const getDateDaysAgo = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const AdminDashboardScreen: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [trendData, setTrendData] = useState<{ label: string; value: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statsError, setStatsError] = useState(false);
  const [trendError, setTrendError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    const [statsResult, trendResult] = await Promise.allSettled([
      userApi.getDashboardStats(),
      attendanceApi.getAttendanceTrend({
        from: getDateDaysAgo(29),
        to: getDateDaysAgo(0),
      }),
    ]);

    if (statsResult.status === 'fulfilled') {
      setStats(statsResult.value.data.data);
      setStatsError(false);
    } else {
      console.error('Failed to load admin dashboard stats:', statsResult.reason);
      setStatsError(true);
    }

    if (trendResult.status === 'fulfilled') {
      setTrendData(
        trendResult.value.data.data.map((point) => ({
          label: new Date(`${point.date}T00:00:00`).toLocaleDateString('en', {
            month: 'short',
            day: 'numeric',
          }),
          value: point.percentage,
        }))
      );
      setTrendError(false);
    } else {
      console.error('Failed to load admin attendance trend:', trendResult.reason);
      setTrendError(true);
    }

    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await loadDashboard();
    } finally {
      setRefreshing(false);
    }
  }, [loadDashboard]);

  const metrics: MetricCard[] = [
    {
      label: 'Total Students',
      value: statsError || !stats ? '—' : stats.total_students,
      icon: 'people-outline',
      color: Colors.primary,
    },
    {
      label: 'Teachers',
      value: statsError || !stats ? '—' : stats.total_teachers,
      icon: 'person-outline',
      color: Colors.secondary,
    },
    {
      label: 'Today\'s Rate',
      value: statsError || !stats
        ? '—'
        : `${Math.round(stats.today_attendance_rate)}%`,
      icon: 'checkmark-circle-outline',
      color: Colors.success,
    },
    {
      label: 'Active Sessions',
      value: statsError || !stats ? '—' : stats.active_sessions,
      icon: 'play-circle-outline',
      color: Colors.warning,
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.success} />
        }
      >
        {/* Header */}
        <LinearGradient
          colors={[Colors.successDark, Colors.success]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.greeting}>{getGreeting()},</Text>
              <Text style={styles.adminName} numberOfLines={1}>{user?.name || 'Admin'}</Text>
              <Text style={styles.adminRole}>System Administrator</Text>
            </View>
            <Avatar name={user?.name || 'A'} photoUrl={user?.photo_url} size={52} />
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {(statsError || trendError) && (
            <View style={styles.errorBanner}>
              <Ionicons name="alert-circle-outline" size={18} color={Colors.danger} />
              <Text style={styles.errorText}>
                {statsError
                  ? 'Some dashboard data could not be loaded. Pull to refresh.'
                  : 'Attendance trend could not be loaded. Pull to refresh.'}
              </Text>
            </View>
          )}

          {/* Key metrics grid */}
          <View style={styles.metricsGrid}>
            {metrics.map(({ label, value, icon, color }) => (
              <View key={label} style={[styles.metricCard, { borderTopColor: color }]}>
                <View style={[styles.metricIconWrapper, { backgroundColor: color + '15' }]}>
                  <Ionicons name={icon as never} size={22} color={color} />
                </View>
                <Text style={[styles.metricValue, { color }]}>{value}</Text>
                <Text style={styles.metricLabel}>{label}</Text>
              </View>
            ))}
          </View>

          {/* Attendance trend chart */}
          <View style={styles.chartCard}>
            <Text style={styles.chartTitle}>Attendance Trend</Text>
            <Text style={styles.chartSubtitle}>Last 30 days</Text>
            {isLoading ? (
              <View style={styles.chartEmpty}>
                <ActivityIndicator color={Colors.success} />
              </View>
            ) : trendData.length > 0 ? (
              <AttendanceChart data={trendData} type="line" height={180} color={Colors.success} />
            ) : (
              <View style={styles.chartEmpty}>
                <Text style={styles.chartEmptyText}>
                  {trendError ? 'Unable to load attendance trend' : 'No attendance data for this period'}
                </Text>
              </View>
            )}
          </View>

          {/* Quick alerts */}
          <View style={styles.alertsCard}>
            <Text style={styles.sectionTitle}>System Alerts</Text>
            {[
              {
                icon: 'warning-outline',
                color: Colors.danger,
                bg: Colors.dangerFaded,
                title: 'Low Attendance Alert',
                desc: 'Some students are below 75% attendance threshold',
              },
              {
                icon: 'people-outline',
                color: Colors.warning,
                bg: Colors.warningFaded,
                title: 'Enrollment Pending',
                desc: `${Math.max(0, (stats?.total_students || 0) - 10)} students haven't enrolled face data`,
              },
              {
                icon: 'checkmark-circle-outline',
                color: Colors.success,
                bg: Colors.successFaded,
                title: 'System Operational',
                desc: 'All services running normally',
              },
            ].map(({ icon, color, bg, title, desc }) => (
              <View key={title} style={[styles.alertItem, { backgroundColor: bg }]}>
                <Ionicons name={icon as never} size={20} color={color} />
                <View style={styles.alertContent}>
                  <Text style={[styles.alertTitle, { color }]}>{title}</Text>
                  <Text style={styles.alertDesc}>{desc}</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Today overview */}
          <View style={styles.overviewCard}>
            <Text style={styles.sectionTitle}>Today's Overview</Text>
            <View style={styles.overviewRow}>
              <View style={styles.overviewItem}>
                <Ionicons name="people" size={28} color={Colors.primary} />
                <Text style={styles.overviewValue}>
                  {statsError || !stats ? '—' : stats.total_students}
                </Text>
                <Text style={styles.overviewLabel}>Total Students</Text>
              </View>
              <View style={styles.overviewDivider} />
              <View style={styles.overviewItem}>
                <Ionicons name="checkmark-circle" size={28} color={Colors.success} />
                <Text style={styles.overviewValue}>
                  {statsError || !stats ? '—' : stats.today_present_count}
                </Text>
                <Text style={styles.overviewLabel}>Present Today</Text>
              </View>
              <View style={styles.overviewDivider} />
              <View style={styles.overviewItem}>
                <Ionicons name="play-circle" size={28} color={Colors.warning} />
                <Text style={styles.overviewValue}>
                  {statsError || !stats ? '—' : stats.active_sessions}
                </Text>
                <Text style={styles.overviewLabel}>Active Sessions</Text>
              </View>
            </View>

            <View style={styles.rateContainer}>
              <View style={styles.rateHeader}>
                <Text style={styles.rateLabel}>Today's Attendance Rate</Text>
                <Text
                  style={[
                    styles.rateValue,
                    { color: (stats?.today_attendance_rate || 0) >= 75 ? Colors.success : Colors.danger },
                  ]}
                >
                  {formatPercentage(stats?.today_attendance_rate || 0)}
                </Text>
              </View>
              <View style={styles.rateTrack}>
                <View
                  style={[
                    styles.rateFill,
                    {
                      width: `${Math.min(stats?.today_attendance_rate || 0, 100)}%`,
                      backgroundColor:
                        (stats?.today_attendance_rate || 0) >= 75 ? Colors.success : Colors.danger,
                    },
                  ]}
                />
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl + 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { fontSize: FontSizes.md, color: 'rgba(255,255,255,0.8)' },
  adminName: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.bold,
    color: 'white',
    maxWidth: width * 0.6,
  },
  adminRole: { fontSize: FontSizes.sm, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  content: { padding: Spacing.md, marginTop: -20 },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metricCard: {
    width: (width - Spacing.md * 2 - Spacing.sm) / 2,
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderTopWidth: 3,
    ...Shadow.sm,
  },
  metricIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  metricValue: {
    fontSize: FontSizes.xxl,
    fontWeight: FontWeights.extrabold,
  },
  metricLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginTop: 4 },
  chartCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.md,
  },
  chartTitle: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  chartSubtitle: { fontSize: FontSizes.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  chartEmpty: {
    height: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
  },
  chartEmptyText: { color: Colors.textMuted, fontSize: FontSizes.sm },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.dangerFaded,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  errorText: { flex: 1, color: Colors.danger, fontSize: FontSizes.sm },
  alertsCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
    gap: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: FontWeights.bold,
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  alertItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.md,
  },
  alertContent: { flex: 1 },
  alertTitle: { fontSize: FontSizes.sm, fontWeight: FontWeights.semibold },
  alertDesc: { fontSize: FontSizes.xs, color: Colors.textSecondary, marginTop: 2 },
  overviewCard: {
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Shadow.sm,
  },
  overviewRow: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  overviewItem: { flex: 1, alignItems: 'center', gap: 4 },
  overviewDivider: { width: 1, backgroundColor: Colors.border },
  overviewValue: { fontSize: FontSizes.xl, fontWeight: FontWeights.bold, color: Colors.textPrimary },
  overviewLabel: { fontSize: FontSizes.xs, color: Colors.textSecondary, textAlign: 'center' },
  rateContainer: { gap: Spacing.sm },
  rateHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rateLabel: { fontSize: FontSizes.sm, color: Colors.textSecondary },
  rateValue: { fontSize: FontSizes.lg, fontWeight: FontWeights.bold },
  rateTrack: { height: 8, backgroundColor: Colors.border, borderRadius: 4, overflow: 'hidden' },
  rateFill: { height: '100%', borderRadius: 4 },
});

export default AdminDashboardScreen;
