import { useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import Loader from "./components/common/Loader";

function App() {
  const [loading, setLoading] = useState(true);

  if (loading) {
    return <Loader onComplete={() => setLoading(false)} />;
  }

  return <AppRoutes />;
}

export default App;
