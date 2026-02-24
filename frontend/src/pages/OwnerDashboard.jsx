import MainLayout from '../layouts/MainLayout';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';

const OwnerDashboard = () => {
  const { user } = useAuth();

  return (
    
      <div className="p-8">
        <BackButton />
        <h1 className="text-3xl font-bold mb-4">Welcome, {user?.fullName}!</h1>
        <div className="bg-white p-6 rounded-lg shadow">
          <p className="text-lg">Role: {user?.role}</p>
          <p className="text-lg">Email: {user?.email}</p>
        </div>
      </div>
    
  );
};

export default OwnerDashboard;
