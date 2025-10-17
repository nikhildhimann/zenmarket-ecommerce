import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import AdminNavbar from './AdminNavbar';

const AdminLayout = () => {
  return (
    <Box>
      <AdminNavbar />
      <main>
        {/* All nested admin pages will be rendered here */}
        <Outlet />
      </main>
    </Box>
  );
};

export default AdminLayout;