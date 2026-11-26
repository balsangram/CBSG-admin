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
          : 'rounded-2xl border border-[#e8d9bd] overflow-hidden shadow-[0_1px_2px_rgba(44,27,21,0.05),0_8px_24px_rgba(200,138,41,0.10)]'
      }
      style={
        bare
          ? undefined
          : { backgroundColor: '#faf0da' }
      }
    >
      <div className="overflow-x-auto bg-white/70">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#ecd9b8] bg-[#f3e7cf]/70 text-[10.5px] uppercase tracking-wider text-[#8a6d3b]">
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
          <tbody className="divide-y divide-[#f0e4c8]">
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
                    'transition-colors hover:bg-[#f6ecd4]',
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
