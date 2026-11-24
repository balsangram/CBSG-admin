import React from 'react';
import { cn } from '../../utils/helpers';

/**
 * Reusable data table.
 *
 * columns: [
 *   {
 *     key: 'name',               // unique key + default row accessor
 *     header: 'Customer',        // column title
 *     headerClassName: '...',    // optional th classes
 *     cellClassName: '...',      // optional td classes
 *     render: (row) => <jsx/>,   // optional custom cell renderer
 *     align: 'right',            // optional 'left' | 'center' | 'right'
 *   }
 * ]
 *
 * data: array of row objects
 * rowKey: field used as React key (default 'id')
 * emptyMessage: shown when data is empty
 * onRowClick: optional (row) => void
 */
export function DataTable({
  columns,
  data = [],
  rowKey = 'id',
  emptyMessage = 'No records found.',
  onRowClick,
  rowClassName,
  bare = false,
}) {
  const alignClass = (align) =>
    align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : '';

  return (
    <div
      className={
        bare
          ? ''
          : 'bg-white rounded-2xl border border-[#e8e2d5] shadow-2xs overflow-hidden'
      }
    >
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#f3efe6] text-[10.5px] uppercase tracking-wider text-[#968a80]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'py-3.5 px-3 font-semibold',
                    col.headerClassName,
                    alignClass(col.align)
                  )}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#f5f1e8]">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-12 text-center text-xs text-[#8a7e75]"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row[rowKey]}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    'hover:bg-[#faf7f0]/60 transition-colors',
                    onRowClick && 'cursor-pointer',
                    typeof rowClassName === 'function'
                      ? rowClassName(row)
                      : rowClassName
                  )}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        'py-3.5 px-3',
                        col.cellClassName,
                        alignClass(col.align)
                      )}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DataTable;
