import { useState } from "react"
import { ChevronDown, ChevronRight, Package, GraduationCap, Calendar, User } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { AuditCompany, ExtinguisherSurvey, TrainingSurvey } from "@/types/audit"

interface AuditSummaryTableProps {
  companies: AuditCompany[]
  extinguisherSurveys: ExtinguisherSurvey[]
  trainingSurveys: TrainingSurvey[]
}

export function AuditSummaryTable({ companies, extinguisherSurveys, trainingSurveys }: AuditSummaryTableProps) {
  const [expandedCompanies, setExpandedCompanies] = useState<Set<string>>(new Set())

  const toggleCompany = (companyId: string) => {
    setExpandedCompanies((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(companyId)) {
        newSet.delete(companyId)
      } else {
        newSet.add(companyId)
      }
      return newSet
    })
  }

  const getCompanyExtinguishers = (companyId: string) => {
    return extinguisherSurveys.filter((survey) => survey.companyId === companyId)
  }

  const getCompanyTrainings = (companyId: string) => {
    return trainingSurveys.filter((survey) => survey.companyId === companyId)
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-[#E63946] to-[#FF8C00]">
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider w-12"></th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Company Details
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Industry Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider">
                Location
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                Extinguisher Surveys
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-white uppercase tracking-wider">
                Training Surveys
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {companies.map((company) => {
              const isExpanded = expandedCompanies.has(company.id)
              const extinguishers = getCompanyExtinguishers(company.id)
              const trainings = getCompanyTrainings(company.id)
              const verifiedExt = extinguishers.filter((e) => e.status === "Verified").length
              const verifiedTrain = trainings.filter((t) => t.status === "Verified").length

              return (
                <>
                  <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleCompany(company.id)}
                        className="h-8 w-8 p-0"
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-4 w-4 text-gray-600" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-gray-600" />
                        )}
                      </Button>
                    </td>
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-semibold text-sm text-gray-900">{company.companyName}</div>
                        <div className="text-xs text-gray-500">{company.id}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary" className="text-xs">
                        {company.industryType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-sm">
                        <div className="font-medium text-gray-900">{company.city}</div>
                        <div className="text-xs text-gray-500">{company.state}</div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm font-semibold text-gray-900">{extinguishers.length}</div>
                      <div className="text-xs text-green-600">{verifiedExt} Verified</div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="text-sm font-semibold text-gray-900">{trainings.length}</div>
                      <div className="text-xs text-green-600">{verifiedTrain} Verified</div>
                    </td>
                  </tr>

                  {isExpanded && (
                    <tr>
                      <td colSpan={6} className="bg-gray-50 px-4 py-4">
                        <div className="space-y-6">
                          {/* Extinguisher Surveys */}
                          {extinguishers.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <Package className="h-5 w-5 text-orange-600" />
                                <h3 className="font-semibold text-gray-900">Extinguisher Surveys</h3>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {extinguishers.map((ext) => (
                                  <div
                                    key={ext.id}
                                    className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="font-semibold text-sm text-gray-900">
                                          {ext.extinguisherType}
                                        </div>
                                        <div className="text-xs text-gray-500">{ext.id}</div>
                                      </div>
                                      <Badge
                                        variant={ext.status === "Verified" ? "default" : "secondary"}
                                        className={
                                          ext.status === "Verified"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                        }
                                      >
                                        {ext.status}
                                      </Badge>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                      <div>
                                        <span className="text-gray-500">Capacity:</span>
                                        <span className="ml-1 font-medium">{ext.capacity}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Brand:</span>
                                        <span className="ml-1 font-medium">{ext.brand}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Floor:</span>
                                        <span className="ml-1 font-medium">{ext.floorDetails}</span>
                                      </div>
                                      <div>
                                        <span className="text-gray-500">Location:</span>
                                        <span className="ml-1 font-medium">{ext.locationDetails}</span>
                                      </div>
                                    </div>

                                    <div className="border-t pt-2 space-y-1">
                                      <div className="flex items-center gap-2 text-xs">
                                        <Calendar className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-500">Refill Due:</span>
                                        <span className="font-medium">{ext.refillDueDate}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        <User className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-500">Auditor:</span>
                                        <span className="font-medium">{ext.auditorName}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Training Surveys */}
                          {trainings.length > 0 && (
                            <div>
                              <div className="flex items-center gap-2 mb-3">
                                <GraduationCap className="h-5 w-5 text-purple-600" />
                                <h3 className="font-semibold text-gray-900">Training Surveys</h3>
                              </div>
                              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {trainings.map((train) => (
                                  <div
                                    key={train.id}
                                    className="bg-white rounded-lg border border-gray-200 p-4 space-y-3"
                                  >
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <div className="font-semibold text-sm text-gray-900">{train.trainingTitle}</div>
                                        <div className="text-xs text-gray-500">{train.id}</div>
                                      </div>
                                      <Badge
                                        variant={train.status === "Verified" ? "default" : "secondary"}
                                        className={
                                          train.status === "Verified"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                        }
                                      >
                                        {train.status}
                                      </Badge>
                                    </div>

                                    <div className="space-y-2 text-xs">
                                      <div>
                                        <span className="text-gray-500">Training Given By:</span>
                                        <div className="font-medium text-gray-900 mt-1">{train.trainingGivenBy}</div>
                                      </div>
                                    </div>

                                    <div className="border-t pt-2 space-y-1">
                                      <div className="flex items-center gap-2 text-xs">
                                        <Calendar className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-500">Training Due:</span>
                                        <span className="font-medium">{train.trainingDueDate}</span>
                                      </div>
                                      <div className="flex items-center gap-2 text-xs">
                                        <User className="h-3 w-3 text-gray-400" />
                                        <span className="text-gray-500">Auditor:</span>
                                        <span className="font-medium">{train.auditorName}</span>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              )
            })}
          </tbody>
        </table>

        {companies.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <Package className="h-12 w-12 mx-auto mb-3 text-gray-300" />
            <p>No audit summaries found</p>
          </div>
        )}
      </div>
    </div>
  )
}
