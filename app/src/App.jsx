import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import XDialog from "./component/dialog.jsx";
import MenuCards from "./component/cards.jsx";
import RestaurantPage from "./component/image.jsx"; // استيراد مكون الصفحة الفردية

function Page() {
  return (
    <>
      <MenuCards />
      <XDialog />
    </>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Page />} />
        {/* إضافة مسار جديد للصفحة الفردية للمطعم */}
        <Route path="/:restaurantName" element={<RestaurantPage />} />
      </Routes>
    </Router>
  );
}

export default App;