import { Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface MasterTableProps {
  items: any[]
  columns: string[]
  renderRow: (item: any, index: number) => any[]
  onEdit: (item: any) => void
  onDelete: (id: string) => void
}

export function MasterTable({ items, columns, renderRow, onEdit, onDelete }: MasterTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((column) => (
              <th
                key={column}
                className="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => {
            const rowData = renderRow(item, index)
            return (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                {rowData.map((cell, cellIndex) => {
                  if (cellIndex === rowData.length - 1) {
                    // Status column
                    return (
                      <td key={cellIndex} className="py-3 px-4">
                        <Badge
                          variant={cell === "Active" ? "default" : "secondary"}
                          className={
                            cell === "Active"
                              ? "bg-green-100 text-green-700 hover:bg-green-100"
                              : "bg-red-100 text-red-700 hover:bg-red-100"
                          }
                        >
                          {cell}
                        </Badge>
                      </td>
                    )
                  }
                  return (
                    <td key={cellIndex} className="py-3 px-4 text-sm text-gray-900">
                      {cell}
                    </td>
                  )
                })}
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(item)}
                      className="h-8 w-8 text-gray-600 hover:text-[#E63946] hover:bg-red-50"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(item.id)}
                      className="h-8 w-8 text-gray-600 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            )
          })}
          {items.length === 0 && (
            <tr>
              <td colSpan={columns.length + 1} className="py-8 text-center text-gray-500">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
