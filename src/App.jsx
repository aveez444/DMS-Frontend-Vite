// App.jsx
import React from "react";
import { Routes, Route, Navigate,useLocation } from "react-router-dom";
import Navigation from "./components/Navigation";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import VehicleDetailsView from "./components/InventoryComponents/VehicleDetailsView";
import SeeHowItWorks from "./components/LandingPageComponents/WorkingComponents/SeeHowItWorks";
import VehicleInventoryViews from "./components/InventoryComponents/VehicleInventoryViews";
import Sales from "./components/SalesComponent/SalesPage";
import Maintenance from "./components/MaintenanceComponents/Maintenance";
import ListVehicles from "./components/UpdateComponents/ListVehicles";
import UsersTable from "./components/UserManagementComponents/UsersTable";
import InquiryList from "./components/InquiryList";
import UpdateDetails from "./components/UpdateComponents/UpdateDetails";
import DuePaymentsPage from "./components/DuePaymentsComponents/DuePaymentsPage";
import DuePaymentsView from "./components/DuePaymentsComponents/DuePaymentsView";
import Outbound from "./components/OutBoundComponent/Outbound";
import CataloguePage from "./components/CatalogueComponents/CataloguePage";
import DetailedCataloguePage from "./components/CatalogueComponents/DetailedCataloguePage";
import EditCatalogue from "./components/CatalogueComponents/EditCatalogue";
import SalesPage from "./components/SalesComponent/SalesPage";
import Documents from "./components/DocumentsComponent/Documents";




const App = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === "/" || location.pathname === "/working" || location.pathname === "/login";
      return (
          <>
              {isLandingPage && <Navigation />}

            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LandingPage />} />
                <Route path="/working" element={<SeeHowItWorks />} />
                
                {/* Dashboard routes with UUID */}
                <Route path="/dashboard/:uuid" element={<Dashboard />} />
                <Route path="/dashboard/:uuid/inventory" element={<VehicleInventoryViews />} />
                <Route path="/dashboard/:uuid/inventory/:id" element={<VehicleDetailsView />} />
                <Route path="/dashboard/:uuid/catalogue" element={<CataloguePage />} />
                <Route path="/dashboard/:uuid/catalogue/:id" element={<DetailedCataloguePage />} />
                <Route path="/dashboard/:uuid/catalogue/edit/:id" element={<EditCatalogue />} />
                <Route path="/dashboard/:uuid/due-payments" element={<DuePaymentsPage />} />
                <Route path="/dashboard/:uuid/due-payments/:id" element={<DuePaymentsView />} />
                <Route path="/user/:uuid/" element={<UsersTable />} />
                <Route path="/dashboard/:uuid/documents" element={<Documents />} />
                <Route path="/dashboard/:uuid/maintenance" element={<Maintenance />} />
                <Route path="/dashboard/:uuid/outbound/" element={<Outbound />} />
                <Route path="/dashboard/:uuid/inquiry/" element={<InquiryList />} />
                <Route path="/dashboard/:uuid/sales" element={<SalesPage />} />
                <Route path="/dashboard/:uuid/updates-management/" element={<ListVehicles />} />
                <Route path="/dashboard/:uuid/updates-management/:vehicle_id/" element={<UpdateDetails />} />
                <Route path="/inquiry" element={<InquiryList />} />
            
            </Routes>
        </>
    );
};

export default App;