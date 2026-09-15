import { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common/Loader";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return <AppRoutes />;
}

export default App;
