import React from "react";

export default function CSVPreviewTable({ csvData }) {
  if (csvData.length === 0) {
    return <div></div>;
  }

  const tableHeaders = csvData[0].map((header, index) => {
    return (
      <th key={index} className="border border-neutral p-2 truncate">
        {header}
      </th>
    );
  });

  const tableRows = csvData.map((row, index) => {
    if (index === 0) {
      return;
    }

    return (
      <tr key={index} className={`${index % 2 == 0 ? "bg-neutral/50" : "bg-primary"} hover:bg-secondary hover:text-primary`}>
        {row.map((cell, index) => {
          return (
            <td key={index} className={`border border-neutral p-2 truncate`}>
              {cell}
            </td>
          );
        })}
      </tr>
    );
  });

  return (
    <table className="max-w-full w-full truncate table-fixed">
      <thead>
        <tr className="bg-neutral">
          {tableHeaders}
        </tr>
      </thead>

      <tbody>
        {tableRows}
      </tbody>
    </table>
  );
}
