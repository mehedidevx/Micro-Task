import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import { FaTrash, FaUserShield, FaCoins, FaEnvelope, FaSearch, FaUserCog, FaUsers } from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi';
import useAxios from '../../../../hooks/useAxios';

const ManageUsers = () => {
  const axiosSecure = useAxios();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // ✅ Load all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const res = await axiosSecure.get('/users');
      return res.data;
    }
  });

  // ✅ Remove user mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axiosSecure.delete(`/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire({
        title: 'Deleted!',
        text: 'User has been deleted successfully.',
        icon: 'success',
        confirmButtonColor: '#00bba7'
      });
    }
  });

  // ✅ Update role mutation
  const roleMutation = useMutation({
    mutationFn: async ({ id, newRole }) => {
      return await axiosSecure.patch(`/users/${id}/role`, { role: newRole });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      Swal.fire({
        title: 'Success!',
        text: 'User role updated successfully',
        icon: 'success',
        confirmButtonColor: '#00bba7'
      });
    }
  });

  const handleRemove = (id, userName) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `You want to remove ${userName}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  const handleRoleChange = (id, newRole, userName) => {
    Swal.fire({
      title: 'Change User Role?',
      text: `Change ${userName}'s role to ${newRole}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#00bba7',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, change it!'
    }).then((result) => {
      if (result.isConfirmed) {
        roleMutation.mutate({ id, newRole });
      }
    });
  };

  const getRoleBadge = (role) => {
    const configs = {
      Admin: { bg: 'bg-purple-100 dark:bg-purple-900/30', text: '', },
      Buyer: { bg: 'bg-blue-100 dark:bg-blue-900/30',  },
      Worker: { bg: 'bg-green-100 dark:bg-green-900/30',  }
    };
    const config = configs[role] || configs.Worker;
    return (
      <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${config.bg} ${config.text} flex items-center gap-1.5 w-fit`}>
        <span>{config.icon}</span>
        {role}
      </span>
    );
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Stats
  const stats = {
    total: users.length,
    admins: users.filter(u => u.role === 'Admin').length,
    buyers: users.filter(u => u.role === 'Buyer').length,
    workers: users.filter(u => u.role === 'Worker').length
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg text-primary"></span>
          <p className="text-base-content/70">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/10 via-secondary/5 to-accent/10 rounded-3xl p-8 border border-base-300/50">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center shadow-lg">
            <FaUsers className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-base-content flex items-center gap-2">
              Manage Users
              <HiSparkles className="w-6 h-6 text-warning animate-pulse" />
            </h1>
            <p className="text-base-content/60 text-sm">Control user roles and permissions</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">Total Users</p>
              <p className="text-3xl font-bold text-base-content mt-1">{stats.total}</p>
            </div>
            <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center">
              <FaUsers className="w-6 h-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">Admins</p>
              <p className="text-3xl font-bold text-purple-600 mt-1">{stats.admins}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👑</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">Buyers</p>
              <p className="text-3xl font-bold text-blue-600 mt-1">{stats.buyers}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💼</span>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-base-100 to-base-200 rounded-2xl p-6 border border-base-content/10 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-base-content/60 text-sm font-medium">Workers</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.workers}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚡</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-base-100 rounded-2xl p-6 border border-base-content/10">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input input-bordered w-full pl-12 rounded-xl"
              />
            </div>
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="select select-bordered rounded-xl min-w-[200px]"
          >
            <option value="all">All Roles</option>
            <option value="Admin">Admin</option>
            <option value="Buyer">Buyer</option>
            <option value="Worker">Worker</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-base-100 rounded-2xl border border-base-content/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead className="bg-base-200">
              <tr>
                <th className="text-base-content font-semibold">#</th>
                <th className="text-base-content font-semibold">User</th>
                <th className="text-base-content font-semibold">Contact</th>
                <th className="text-base-content font-semibold">Coins</th>
                <th className="text-base-content font-semibold">Role</th>
                <th className="text-base-content font-semibold">Change Role</th>
                <th className="text-base-content font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12">
                    <div className="flex flex-col items-center gap-3">
                      <FaUsers className="w-12 h-12 text-base-content/30" />
                      <p className="text-base-content/60">No users found</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user, index) => (
                  <tr key={user._id} className="hover:bg-base-200/50 transition-colors">
                    <td className="font-medium">{index + 1}</td>
                    
                    {/* User Info */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar">
                          <div className="w-12 h-12 rounded-full ring-2 ring-primary/30 ring-offset-2 ring-offset-base-100">
                            <img
                              src={user.photo || 'https://via.placeholder.com/40'}
                              alt={user.name}
                              className="object-cover"
                            />
                          </div>
                        </div>
                        <div>
                          <p className="font-semibold text-base-content">{user.name || 'N/A'}</p>
                          <p className="text-xs text-base-content/60">ID: {user._id.slice(-6)}</p>
                        </div>
                      </div>
                    </td>

                    {/* Contact */}
                    <td>
                      <div className="flex items-center gap-2 text-sm text-base-content/70">
                        <FaEnvelope className="w-3 h-3 text-primary" />
                        {user.email}
                      </div>
                    </td>

                    {/* Coins */}
                    <td>
                      <div className="flex items-center gap-2">
                        <FaCoins className="w-4 h-4 text-warning" />
                        <span className="font-semibold text-warning">{user.coin || 0}</span>
                      </div>
                    </td>

                    {/* Current Role */}
                    <td>{getRoleBadge(user.role)}</td>

                    {/* Change Role */}
                    <td>
                      <select
                        className="select select-bordered select-sm rounded-lg hover:border-primary transition-colors"
                        value={user.role}
                        onChange={(e) => handleRoleChange(user._id, e.target.value, user.name)}
                      >
                        <option value="Admin">Admin 👑</option>
                        <option value="Buyer">Buyer 💼</option>
                        <option value="Worker">Worker ⚡</option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td>
                      <button
                        onClick={() => handleRemove(user._id, user.name)}
                        className="btn btn-sm btn-primary rounded-lg hover:scale-105 transition-all duration-300 hover:shadow-lg"
                      >
                        <FaTrash className="w-3 h-3" />
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Results Info */}
      {filteredUsers.length > 0 && (
        <div className="text-center text-sm text-base-content/60">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      )}
    </div>
  );
};

export default ManageUsers;