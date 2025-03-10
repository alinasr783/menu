import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import XDialog from "./component/dialog.jsx";
import MenuCards from "./component/cards.jsx";
import RestaurantPage from "./component/image.jsx";
import Login from "./component/login.jsx";
import "./app.css";

// التحقق من تسجيل الدخول
function PrivateRoute({ children }) {
  const navigate = useNavigate();

  useEffect(() => {
    const email = localStorage.getItem("email");
    const password = localStorage.getItem("password");

    if (!email || !password) {
      navigate("/login"); // إعادة التوجيه إلى صفحة تسجيل الدخول
    }
  }, [navigate]);

  return children;
}

function Page() {
  return (
    <div className="app">
      <MenuCards />
      <XDialog />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* حماية الصفحة الرئيسية وصفحة المطاعم */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Page />
            </PrivateRoute>
          }
        />
        <Route
          path="/menu/:id"
          element={
            <PrivateRoute>
              <RestaurantPage />
            </PrivateRoute>
          }
        />

        {/* السماح بفتح صفحة تسجيل الدخول دائمًا */}
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;