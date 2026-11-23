import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignInPage from '../modules/auth/pages/SignInPage';
import TwoFactorPage from '../modules/auth/pages/TwoFactorPage';
import DashboardPage from '../modules/dashboard/pages/DashboardPage';
import CustomerRecordsPage from '../modules/customers/pages/CustomerRecordsPage';
import Customer360Page from '../modules/customers/pages/Customer360Page';
import KycQueuePage from '../modules/customers/pages/KycQueuePage';
import SchemeMasterPage from '../modules/savings/pages/SchemeMasterPage';
import DepositAccountsPage from '../modules/savings/pages/DepositAccountsPage';
import DaybookPage from '../modules/collections/pages/DaybookPage';
import TeamStructurePage from '../modules/team/pages/TeamStructurePage';
import IncentiveLedgerPage from '../modules/team/pages/IncentiveLedgerPage';
import PayoutManagementPage from '../modules/team/pages/PayoutManagementPage';
import ReportsPage from '../modules/reports/pages/ReportsPage';
import TransactionLogsPage from '../modules/reports/pages/TransactionLogsPage';
import BranchesPage from '../modules/admin/pages/BranchesPage';
import UsersRolesPage from '../modules/admin/pages/UsersRolesPage';
import AuditLogPage from '../modules/admin/pages/AuditLogPage';
import ProfilePage from '../modules/dashboard/pages/ProfilePage';
import SettingsPage from '../modules/dashboard/pages/SettingsPage';
import ProtectedRoute from '../components/common/ProtectedRoute';
import useAuth from '../modules/auth/hooks/useAuth';
import { ROUTES } from '../utils/constants';

export function AppRoutes() {
  const { isAuthenticated, step1Complete } = useAuth();

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={ROUTES.DASHBOARD} replace />
          ) : step1Complete ? (
            <Navigate to={ROUTES.TWO_FACTOR} replace />
          ) : (
            <Navigate to={ROUTES.LOGIN} replace />
          )
        }
      />

      {/* Authentication Step 1 */}
      <Route path={ROUTES.LOGIN} element={<SignInPage />} />

      {/* Authentication Step 2: Two-Factor Verification */}
      <Route path={ROUTES.TWO_FACTOR} element={<TwoFactorPage />} />

      {/* Protected Staff Dashboard */}
      <Route
        path={ROUTES.DASHBOARD}
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Customer Records */}
      <Route
        path={ROUTES.CUSTOMERS}
        element={
          <ProtectedRoute>
            <CustomerRecordsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.CUSTOMER_RECORDS}
        element={
          <ProtectedRoute>
            <CustomerRecordsPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Customer 360 Profile */}
      <Route
        path={ROUTES.CUSTOMER_360}
        element={
          <ProtectedRoute>
            <Customer360Page />
          </ProtectedRoute>
        }
      />

      <Route
        path={`${ROUTES.CUSTOMER_360}/:id`}
        element={
          <ProtectedRoute>
            <Customer360Page />
          </ProtectedRoute>
        }
      />

      {/* Protected KYC Approval Queue */}
      <Route
        path={ROUTES.KYC_QUEUE}
        element={
          <ProtectedRoute>
            <KycQueuePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Savings Scheme Master */}
      <Route
        path={ROUTES.SCHEME_MASTER}
        element={
          <ProtectedRoute>
            <SchemeMasterPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Deposit Accounts */}
      <Route
        path={ROUTES.DEPOSIT_ACCOUNTS}
        element={
          <ProtectedRoute>
            <DepositAccountsPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Collections Daybook */}
      <Route
        path={ROUTES.DAYBOOK}
        element={
          <ProtectedRoute>
            <DaybookPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Team Structure */}
      <Route
        path={ROUTES.TEAM_STRUCTURE}
        element={
          <ProtectedRoute>
            <TeamStructurePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Incentive Ledger */}
      <Route
        path={ROUTES.INCENTIVE_LEDGER}
        element={
          <ProtectedRoute>
            <IncentiveLedgerPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Payout Management */}
      <Route
        path={ROUTES.PAYOUT_MANAGEMENT}
        element={
          <ProtectedRoute>
            <PayoutManagementPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Reports & Analytics */}
      <Route
        path={ROUTES.REPORTS}
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path={ROUTES.REPORTS_ANALYTICS}
        element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Transaction Logs */}
      <Route
        path={ROUTES.TRANSACTION_LOGS}
        element={
          <ProtectedRoute>
            <TransactionLogsPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Branches */}
      <Route
        path={ROUTES.BRANCHES}
        element={
          <ProtectedRoute>
            <BranchesPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Users & Roles */}
      <Route
        path={ROUTES.USERS_ROLES}
        element={
          <ProtectedRoute>
            <UsersRolesPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Audit Log */}
      <Route
        path={ROUTES.AUDIT_LOG}
        element={
          <ProtectedRoute>
            <AuditLogPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Profile */}
      <Route
        path={ROUTES.PROFILE}
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* Protected Settings */}
      <Route
        path={ROUTES.SETTINGS}
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
