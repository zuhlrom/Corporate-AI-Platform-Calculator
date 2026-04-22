import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"

import AppLayout from "@/components/layout/AppLayout"
import BenefitsPage from "@/pages/BenefitsPage"
import CostsPage from "@/pages/CostsPage"
import ExportPage from "@/pages/ExportPage"
import InputsPage from "@/pages/InputsPage"
import OverviewPage from "@/pages/OverviewPage"
import PhasesPage from "@/pages/PhasesPage"
import ScenariosPage from "@/pages/ScenariosPage"
import ValueCasePage from "@/pages/ValueCasePage"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/inputs" element={<InputsPage />} />
          <Route path="/scenarios" element={<ScenariosPage />} />
          <Route path="/phases" element={<PhasesPage />} />
          <Route path="/costs" element={<CostsPage />} />
          <Route path="/benefits" element={<BenefitsPage />} />
          <Route path="/value" element={<ValueCasePage />} />
          <Route path="/export" element={<ExportPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
