import { Edit, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Role } from "@/types/user"

interface RolesTableProps {
  roles: Role[]
  onEdit: (role: Role) => void
  onDelete: (roleId: string) => void
}

export function RolesTable({ roles, onEdit, onDelete }: RolesTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead className="font-semibold text-gray-700">S.NO</TableHead>
            <TableHead className="font-semibold text-gray-700">ROLE</TableHead>
            <TableHead className="font-semibold text-gray-700">STATUS</TableHead>
            <TableHead className="font-semibold text-gray-700 text-center">ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center text-gray-500 py-12">
                No roles found
              </TableCell>
            </TableRow>
          ) : (
            roles.map((role, index) => (
              <TableRow key={role.id} className="hover:bg-gray-50">
                <TableCell className="text-gray-900">{index + 1}</TableCell>
                <TableCell className="text-gray-900 font-medium">{role.roleName}</TableCell>
                <TableCell>
                  <Badge
                    className={
                      role.status === "Active"
                        ? "bg-green-100 text-green-700 hover:bg-green-100"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-100"
                    }
                  >
                    {role.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50"
                      onClick={() => onEdit(role)}
                    >
                      <Edit className="h-4 w-4 text-red-600" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 hover:bg-red-50"
                      onClick={() => onDelete(role.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
