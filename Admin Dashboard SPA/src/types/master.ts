export interface SafetyEquipment {
  id: string
  name: string
  status: "Active" | "InActive"
}

export interface Company {
  id: string
  name: string
  status: "Active" | "InActive"
}

export interface Branch {
  id: string
  name: string
  companyId: string
  companyName: string
  status: "Active" | "InActive"
}

export interface District {
  id: string
  name: string
  status: "Active" | "InActive"
}

export interface State {
  id: string
  name: string
  districtId: string
  districtName: string
  status: "Active" | "InActive"
}

export interface City {
  id: string
  name: string
  stateId: string
  stateName: string
  status: "Active" | "InActive"
}

export interface FloorDetail {
  id: string
  name: string
  status: "Active" | "InActive"
}
