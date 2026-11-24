import React, { useState } from 'react';
import DashboardLayout from '../../../components/layout/DashboardLayout';
import DataTable from '../../../components/common/DataTable';
import { Users, ShieldCheck, Search, Plus, Edit2, Power } from 'lucide-react';
import { usersService } from '../services/users.service';
import CreateUserModal from '../components/CreateUserModal';
import EditUserModal from '../components/EditUserModal';

export function UsersRolesPage() {
  const [users, setUsers] = useState(() => usersService.getUsers());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Derived metrics
  const totalStaff = users.length;
  const activeAccounts = users.filter((u) => u.status === 'Active').length;
  const pendingActivation = users.filter((u) => u.status === 'Pending').length;

  // Filtered users
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'All' ? true : user.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleAddUser = (newUser) => {
    setUsers((prev) => usersService.addUser(prev, newUser));
  };

  const handleUpdateUser = (id, updates) => {
    setUsers((prev) => usersService.updateUser(prev, id, updates));
    setEditingUser(null);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) => usersService.toggleStatus(prev, id));
  };

  const columns = [
    {
      key: 'user',
      header: 'Staff User',
      headerClassName: 'pr-4',
      cellClassName: 'pr-4',
      render: (user) => (
        <div className="flex items-center gap-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover border border-[#e8e2d5]"
          />
          <div>
            <p className="font-bold text-[#2c1b15] leading-tight">{user.name}</p>
            <p className="text-[11px] text-[#8f8278] font-mono mt-0.5">
              {user.email}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      cellClassName: 'font-medium text-[#2c1b15]',
    },
    {
      key: 'status',
      header: 'Status',
      render: (user) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
            user.status === 'Active'
              ? 'bg-[#e7f7ed] text-[#0d7a3e]'
              : 'bg-stone-100 text-stone-600'
          }`}
        >
          {user.status}
        </span>
      ),
    },
    {
      key: 'pageAccess',
      header: 'Page Access',
      cellClassName:
        'text-[#61554d] font-medium font-mono text-[11px]',
    },
    {
      key: 'actions',
      header: 'Actions',
      headerClassName: 'pl-4 text-right',
      cellClassName: 'pl-4 text-right',
      align: 'right',
      render: (user) => (
        <div className="inline-flex items-center gap-2">
          <button
            type="button"
            onClick={() => setEditingUser(user)}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white hover:bg-[#faf7f2] border border-[#e8e2d5] text-[#2c1b15] rounded-lg text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <Edit2 className="w-3 h-3 text-[#7a6e66]" />
            <span>Edit</span>
          </button>
          <button
            type="button"
            onClick={() => handleToggleStatus(user.id)}
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
              user.status === 'Active'
                ? 'bg-white hover:bg-stone-50 border-[#e8e2d5] text-[#61554d]'
                : 'bg-[#e7f7ed] hover:bg-[#d5f0de] border-[#c7ebd5] text-[#0d7a3e]'
            }`}
          >
            <Power className="w-3 h-3" />
            <span>{user.status === 'Active' ? 'Disable' : 'Enable'}</span>
          </button>
        </div>
      ),
    },
  ];

  return (
    <DashboardLayout pageTitle="User management & permissions">
      <div className="space-y-6">
        {/* Top Header Row with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold font-serif text-[#2c1b15]">
              User management & permissions
            </h1>
            <p className="text-xs text-[#8f8278] mt-0.5">
              Role-based access control, credentials, and staff directory
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#2c1b15] hover:bg-[#432b22] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create user</span>
          </button>
        </div>

        {/* 3 KPI Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Card 1: STAFF USERS */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#8f8278] uppercase">
                Staff Users
              </p>
              <p className="text-2xl font-bold font-serif text-[#2c1b15] mt-1">{totalStaff}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#faf7f2] border border-[#f0eae1] flex items-center justify-center text-[#8f8278]">
              <Users className="w-5 h-5" />
            </div>
          </div>

          {/* Card 2: ACTIVE ACCOUNTS */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#8f8278] uppercase">
                Active Accounts
              </p>
              <p className="text-2xl font-bold font-serif text-[#2c1b15] mt-1">{activeAccounts}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#e7f7ed] border border-[#c7ebd5] flex items-center justify-center text-[#0d7a3e]">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>

          {/* Card 3: PENDING ACTIVATION */}
          <div className="bg-white rounded-2xl border border-[#e8e2d5] p-5 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-[11px] font-semibold tracking-wider text-[#8f8278] uppercase">
                Pending Activation
              </p>
              <p className="text-2xl font-bold font-serif text-[#2c1b15] mt-1">{pendingActivation}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#faf7f2] border border-[#f0eae1] flex items-center justify-center text-[#8f8278]">
              <Users className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Search & Status Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative max-w-sm flex-1">
            <Search className="w-4 h-4 text-[#8f8278] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name or official email"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-[#e8e2d5] rounded-xl text-xs text-[#2c1b15] placeholder-[#8f8278] focus:outline-none focus:border-[#c88a29] transition-colors"
            />
          </div>

          {/* Filter tabs: All, Active, Pending, Disabled */}
          <div className="flex items-center gap-1 bg-[#ede7dc]/60 p-1 rounded-xl self-start sm:self-auto border border-[#e8e2d5]/80">
            {['All', 'Active', 'Pending', 'Disabled'].map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white text-[#2c1b15] shadow-xs'
                    : 'text-[#61554d] hover:text-[#2c1b15]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Staff Directory Table */}
        <div>
          <h2 className="text-sm font-bold text-[#2c1b15] mb-4">Staff directory</h2>
          <DataTable
            columns={columns}
            data={filteredUsers}
            emptyMessage="No staff users found matching your criteria."
          />
        </div>
      </div>

      {/* Create User Modal */}
      <CreateUserModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onAddUser={handleAddUser}
      />

      {/* Edit User Modal */}
      {editingUser && (
        <EditUserModal
          key={editingUser.id}
          isOpen={Boolean(editingUser)}
          onClose={() => setEditingUser(null)}
          user={editingUser}
          onUpdateUser={handleUpdateUser}
        />
      )}
    </DashboardLayout>
  );
}

export default UsersRolesPage;
