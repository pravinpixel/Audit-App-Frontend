import type React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"

import AddEmployeePage from "./pages/employee/add/page"
import AdminSettingsRolesAddPage from "./pages/admin-settings/roles/add/page"
import AdminSettingsRolesPage from "./pages/admin-settings/roles/page"
import AdminSettingsUsersAddPage from "./pages/admin-settings/users/add/page"
import AdminSettingsUsersPage from "./pages/admin-settings/users/page"
import AssignCustomerNewPage from "./pages/assign-customer/new/page"
import AssignCustomerPage from "./pages/assign-customer/page"
import AuditAssignmentsIdPage from "./pages/audit-assignments/[id]/page"
import AuditAssignmentsPage from "./pages/audit-assignments/page"
import AuditEnquiryIdEnquiryEnquiryIdPage from "./pages/audit-enquiry/[id]/enquiry/[enquiryId]/page"
import AuditEnquiryIdPage from "./pages/audit-enquiry/[id]/page"
import AuditEnquiryIdTrainingEnquiryEnquiryIdPage from "./pages/audit-enquiry/[id]/training-enquiry/[enquiryId]/page"
import AuditEnquiryPage from "./pages/audit-enquiry/page"
import AuditSummaryPage from "./pages/audit-summary/page"
import AuditsIdPage from "./pages/audits/[id]/page"
import AuditsPage from "./pages/audits/page"
import BannerManagementAddPage from "./pages/banner-management/add/page"
import BannerManagementEditIdPage from "./pages/banner-management/edit/[id]/page"
import BannerManagementPage from "./pages/banner-management/page"
import ContactDataIdPage from "./pages/contact-data/[id]/page"
import ContactDataPage from "./pages/contact-data/page"
import CustomerSuccessChangeRequestIdPage from "./pages/customer-success/change-request/[id]/page"
import CustomerSuccessChangeRequestPage from "./pages/customer-success/change-request/page"
import CustomerSuccessDueDateFollowupIdPage from "./pages/customer-success/due-date-followup/[id]/page"
import CustomerSuccessDueDateFollowupPage from "./pages/customer-success/due-date-followup/page"
import CustomersIdPage from "./pages/customers/[id]/page"
import CustomersPage from "./pages/customers/page"
import DashboardHomePage from "./pages/dashboard-home/page"
import DashboardPage from "./pages/dashboard/page"
import DataReviewContactDataPage from "./pages/data-review/contact-data/page"
import DataReviewCustomerDataPage from "./pages/data-review/customer-data/page"
import DataReviewDataCollectorPage from "./pages/data-review/data-collector/page"
import DataReviewSurveyDataIdPage from "./pages/data-review/survey-data/[id]/page"
import DataReviewSurveyDataPage from "./pages/data-review/survey-data/page"
import MasterBranchesAddPage from "./pages/master/branches/add/page"
import MasterBranchesEditIdPage from "./pages/master/branches/edit/[id]/page"
import MasterBranchesPage from "./pages/master/branches/page"
import MasterCitiesAddPage from "./pages/master/cities/add/page"
import MasterCitiesEditIdPage from "./pages/master/cities/edit/[id]/page"
import MasterCitiesPage from "./pages/master/cities/page"
import MasterCompaniesAddPage from "./pages/master/companies/add/page"
import MasterCompaniesEditIdPage from "./pages/master/companies/edit/[id]/page"
import MasterCompaniesPage from "./pages/master/companies/page"
import MasterDistrictsAddPage from "./pages/master/districts/add/page"
import MasterDistrictsEditIdPage from "./pages/master/districts/edit/[id]/page"
import MasterDistrictsPage from "./pages/master/districts/page"
import MasterFloorDetailsAddPage from "./pages/master/floor-details/add/page"
import MasterFloorDetailsEditIdPage from "./pages/master/floor-details/edit/[id]/page"
import MasterFloorDetailsPage from "./pages/master/floor-details/page"
import MasterSafetyEquipmentsAddPage from "./pages/master/safety-equipments/add/page"
import MasterSafetyEquipmentsEditIdPage from "./pages/master/safety-equipments/edit/[id]/page"
import MasterSafetyEquipmentsPage from "./pages/master/safety-equipments/page"
import MasterStatesAddPage from "./pages/master/states/add/page"
import MasterStatesEditIdPage from "./pages/master/states/edit/[id]/page"
import MasterStatesPage from "./pages/master/states/page"
import LoginPage from "./pages/page"
import ThirdPartyIdPage from "./pages/third-party/[id]/page"
import ThirdPartyPage from "./pages/third-party/page"
import VendorRegistrationIdPage from "./pages/vendor-registration/[id]/page"
import VendorRegistrationPage from "./pages/vendor-registration/page"

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = sessionStorage.getItem("isAuthenticated")
  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Page not found.</p>
    </div>
  )
}

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin-settings/roles/add" element={<ProtectedRoute><AdminSettingsRolesAddPage /></ProtectedRoute>} />
        <Route path="/admin-settings/roles" element={<ProtectedRoute><AdminSettingsRolesPage /></ProtectedRoute>} />
        <Route path="/admin-settings/users/add" element={<ProtectedRoute><AdminSettingsUsersAddPage /></ProtectedRoute>} />
        <Route path="/admin-settings/users" element={<ProtectedRoute><AdminSettingsUsersPage /></ProtectedRoute>} />
        <Route path="/assign-customer/new" element={<ProtectedRoute><AssignCustomerNewPage /></ProtectedRoute>} />
        <Route path="/assign-customer" element={<ProtectedRoute><AssignCustomerPage /></ProtectedRoute>} />
        <Route path="/audit-assignments/:id" element={<ProtectedRoute><AuditAssignmentsIdPage /></ProtectedRoute>} />
        <Route path="/audit-assignments" element={<ProtectedRoute><AuditAssignmentsPage /></ProtectedRoute>} />
        <Route path="/audit-enquiry/:id/enquiry/:enquiryId" element={<ProtectedRoute><AuditEnquiryIdEnquiryEnquiryIdPage /></ProtectedRoute>} />
        <Route path="/audit-enquiry/:id/training-enquiry/:enquiryId" element={<ProtectedRoute><AuditEnquiryIdTrainingEnquiryEnquiryIdPage /></ProtectedRoute>} />
        <Route path="/audit-enquiry/:id" element={<ProtectedRoute><AuditEnquiryIdPage /></ProtectedRoute>} />
        <Route path="/audit-enquiry" element={<ProtectedRoute><AuditEnquiryPage /></ProtectedRoute>} />
        <Route path="/audit-summary" element={<ProtectedRoute><AuditSummaryPage /></ProtectedRoute>} />
        <Route path="/audits/:id" element={<ProtectedRoute><AuditsIdPage /></ProtectedRoute>} />
        <Route path="/audits" element={<ProtectedRoute><AuditsPage /></ProtectedRoute>} />
        <Route path="/banner-management/add" element={<ProtectedRoute><BannerManagementAddPage /></ProtectedRoute>} />
        <Route path="/banner-management/edit/:id" element={<ProtectedRoute><BannerManagementEditIdPage /></ProtectedRoute>} />
        <Route path="/banner-management" element={<ProtectedRoute><BannerManagementPage /></ProtectedRoute>} />
        <Route path="/contact-data/:id" element={<ProtectedRoute><ContactDataIdPage /></ProtectedRoute>} />
        <Route path="/contact-data" element={<ProtectedRoute><ContactDataPage /></ProtectedRoute>} />
        <Route path="/customer-success/change-request/:id" element={<ProtectedRoute><CustomerSuccessChangeRequestIdPage /></ProtectedRoute>} />
        <Route path="/customer-success/change-request" element={<ProtectedRoute><CustomerSuccessChangeRequestPage /></ProtectedRoute>} />
        <Route path="/customer-success/due-date-followup/:id" element={<ProtectedRoute><CustomerSuccessDueDateFollowupIdPage /></ProtectedRoute>} />
        <Route path="/customer-success/due-date-followup" element={<ProtectedRoute><CustomerSuccessDueDateFollowupPage /></ProtectedRoute>} />
        <Route path="/customers/:id" element={<ProtectedRoute><CustomersIdPage /></ProtectedRoute>} />
        <Route path="/customers" element={<ProtectedRoute><CustomersPage /></ProtectedRoute>} />
        <Route path="/dashboard-home" element={<ProtectedRoute><DashboardHomePage /></ProtectedRoute>} />
        <Route path="/data-review/contact-data/:id" element={<ProtectedRoute><ContactDataIdPage /></ProtectedRoute>} />
        <Route path="/data-review/contact-data" element={<ProtectedRoute><DataReviewContactDataPage /></ProtectedRoute>} />
        <Route path="/data-review/customer-data/:id" element={<ProtectedRoute><CustomersIdPage /></ProtectedRoute>} />
        <Route path="/data-review/customer-data" element={<ProtectedRoute><DataReviewCustomerDataPage /></ProtectedRoute>} />
        <Route path="/data-review/customers/:id" element={<ProtectedRoute><CustomersIdPage /></ProtectedRoute>} />
        <Route path="/data-review/data-collector/:id" element={<ProtectedRoute><ThirdPartyIdPage /></ProtectedRoute>} />
        <Route path="/data-review/data-collector" element={<ProtectedRoute><DataReviewDataCollectorPage /></ProtectedRoute>} />
        <Route path="/data-review/survey-data/:id" element={<ProtectedRoute><DataReviewSurveyDataIdPage /></ProtectedRoute>} />
        <Route path="/data-review/survey-data" element={<ProtectedRoute><DataReviewSurveyDataPage /></ProtectedRoute>} />
        <Route path="/employee/add" element={<ProtectedRoute><AddEmployeePage /></ProtectedRoute>} />
        <Route path="/employee" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
        <Route path="/master/branches/add" element={<ProtectedRoute><MasterBranchesAddPage /></ProtectedRoute>} />
        <Route path="/master/branches/edit/:id" element={<ProtectedRoute><MasterBranchesEditIdPage /></ProtectedRoute>} />
        <Route path="/master/branches" element={<ProtectedRoute><MasterBranchesPage /></ProtectedRoute>} />
        <Route path="/master/cities/add" element={<ProtectedRoute><MasterCitiesAddPage /></ProtectedRoute>} />
        <Route path="/master/cities/edit/:id" element={<ProtectedRoute><MasterCitiesEditIdPage /></ProtectedRoute>} />
        <Route path="/master/cities" element={<ProtectedRoute><MasterCitiesPage /></ProtectedRoute>} />
        <Route path="/master/companies/add" element={<ProtectedRoute><MasterCompaniesAddPage /></ProtectedRoute>} />
        <Route path="/master/companies/edit/:id" element={<ProtectedRoute><MasterCompaniesEditIdPage /></ProtectedRoute>} />
        <Route path="/master/companies" element={<ProtectedRoute><MasterCompaniesPage /></ProtectedRoute>} />
        <Route path="/master/districts/add" element={<ProtectedRoute><MasterDistrictsAddPage /></ProtectedRoute>} />
        <Route path="/master/districts/edit/:id" element={<ProtectedRoute><MasterDistrictsEditIdPage /></ProtectedRoute>} />
        <Route path="/master/districts" element={<ProtectedRoute><MasterDistrictsPage /></ProtectedRoute>} />
        <Route path="/master/floor-details/add" element={<ProtectedRoute><MasterFloorDetailsAddPage /></ProtectedRoute>} />
        <Route path="/master/floor-details/edit/:id" element={<ProtectedRoute><MasterFloorDetailsEditIdPage /></ProtectedRoute>} />
        <Route path="/master/floor-details" element={<ProtectedRoute><MasterFloorDetailsPage /></ProtectedRoute>} />
        <Route path="/master/safety-equipments/add" element={<ProtectedRoute><MasterSafetyEquipmentsAddPage /></ProtectedRoute>} />
        <Route path="/master/safety-equipments/edit/:id" element={<ProtectedRoute><MasterSafetyEquipmentsEditIdPage /></ProtectedRoute>} />
        <Route path="/master/safety-equipments" element={<ProtectedRoute><MasterSafetyEquipmentsPage /></ProtectedRoute>} />
        <Route path="/master/states/add" element={<ProtectedRoute><MasterStatesAddPage /></ProtectedRoute>} />
        <Route path="/master/states/edit/:id" element={<ProtectedRoute><MasterStatesEditIdPage /></ProtectedRoute>} />
        <Route path="/master/states" element={<ProtectedRoute><MasterStatesPage /></ProtectedRoute>} />
        <Route path="/third-party/:id" element={<ProtectedRoute><ThirdPartyIdPage /></ProtectedRoute>} />
        <Route path="/third-party" element={<ProtectedRoute><ThirdPartyPage /></ProtectedRoute>} />
        <Route path="/vendor-registration/:id" element={<ProtectedRoute><VendorRegistrationIdPage /></ProtectedRoute>} />
        <Route path="/vendor-registration" element={<ProtectedRoute><VendorRegistrationPage /></ProtectedRoute>} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </>
  )
}
