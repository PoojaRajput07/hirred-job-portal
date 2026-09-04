import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-6xl font-bold">404</h1>
      <h2 className="text-2xl">Page Not Found</h2>
      <p className="text-gray-400">The page you're looking for doesn't exist.</p>
      <Button onClick={() => navigate("/")} variant="secondary">
        Go Home
      </Button>
    </div>
  );
};

export default NotFound;
