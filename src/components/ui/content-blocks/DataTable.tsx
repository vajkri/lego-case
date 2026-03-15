import { BlockVariant, variantStyleMap } from './variants'

interface DataTableProps {
  headers: string[]
  rows: string[][]
  variant?: BlockVariant
}

export function DataTable({ headers, rows, variant = 'default' }: DataTableProps) {
  return (
    <div
      className="rounded-md overflow-hidden"
      style={variantStyleMap[variant]}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th
                key={index}
                className="text-left font-display font-bold text-[14px] text-lego-dark px-4 py-3 border-b border-lego-grey-pale/40"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-b last:border-b-0 border-lego-grey-pale/20">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={`font-body text-lg text-lego-dark px-4 py-3 ${cellIndex === 0 ? 'font-semibold' : ''}`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
