import React from "react";

//GLOBALS
const factors = [
  "Termination and Splice Inspection",
  "Insulation Resistance",
  "Asset Service Life",
  "Fiber Temperature",
];

export function FactorsTable({ selectedWeightPreset }) {
  return (
    <table className="h-full w-full">
      <caption className="border-b-2  border-secondary text-secondary text-sm xl:text-base font-bold bg-neutral/30 rounded-t-md ">
        <p className="whitespace-nowrap">Condition Factors</p>
      </caption>
      <thead className="border-b-1 border-text bg-base-100 text-sm">
        <tr>
          <th key={"conditionHeader"} className="text-secondary  font-bold">
            Type
          </th>
          <th key={"conditionHeader"} className="text-secondary  font-bold">
            Condition ID
          </th>
          <th key={"weightHeader"} className="text-secondary  font-bold">
            Weight
          </th>
          <th key={"gradeHeader"} className="text-secondary font-bold">
            Grade
          </th>
        </tr>
      </thead>
      {/* ${index % 2 == 0 ? "bg-primary" : "bg-neutral"} */}
      <tbody>
        {factors.map((factor, index) => (
          <tr
            className={`text-sm border-2 ${
              index % 2 == 0 ? "bg-primary" : "bg-base-100"
            }`}
            key={index}
          >
            <td
              key={factor + index}
              className="text-text  font-bold border-r border-neutral"
            >
              {factor}
            </td>
            <td
              key={factor + index}
              className="text-text text-center  font-bold border-r border-neutral"
            >
              {"F" + index}
            </td>
            <td
              key={factor + index + "weight"}
              className="text-text text-center font-bold border-r border-neutral"
            >
              {selectedWeightPreset.weights[index]}
            </td>
            <td
              key={factor + index + "grade"}
              className="text-text  text-center font-bold"
            >
              0 - 5
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function AgeTable({}) {
  const ageInfo = ["0 - 10", "10 - 30", "30 - 50", "50 - 60", "60+"];
  const InspectionInfo = [
    "Best Condition",
    "Normal Wear",
    "Requires Remediation",
    "Rapidly Deteriorating",
    "Beyond Repair",
  ];
  const fiberTempInfo = [
    "0 - 10(\u00b0C)",
    "10 - 30(\u00b0C)",
    "30 - 50(\u00b0C)",
    "50 - 60(\u00b0C)",
    "60(\u00b0C)+",
  ];

  return (
    <table className="h-full w-full">
      <caption className="border-b-2  border-secondary text-secondary text-sm xl:text-base font-bold bg-neutral/30 rounded-t-md ">
        Graded Factor Variables
      </caption>
      <thead className="bg-base-100">
        <tr className="text-center">
          <th key={"ageHeader"} className=" text-secondary   font-bold">
            Age
          </th>
          <th key={"inspectionHeader"} className=" text-secondary  font-bold">
            Inspection
          </th>
          <th key={"tempHeader"} className=" text-secondary  font-bold">
            Temperature
          </th>
          <th
            key={"ageGradeHeader"}
            className=" text-secondary  font-bold bg-accent/10"
          >
            Grade
          </th>
        </tr>
      </thead>
      <tbody>
        {ageInfo.map((age, index) => {
          const inspection = InspectionInfo[index];
          const temp = fiberTempInfo[index];
          return (
            <tr
              className={`text-sm border-2 ${
                index % 2 == 0 ? "bg-primary" : "bg-base-100"
              }`}
              key={age + "id"}
            >
              <td
                key={age + index}
                className="text-center text-text   font-bold border-r border-neutral"
              >
                {age}
              </td>
              <td
                key={inspection + index}
                className="text-start text-text font-bold border-r border-neutral"
              >
                {inspection}
              </td>
              <td
                key={temp + index}
                className="text-center text-text  x font-bold border-r border-neutral"
              >
                {temp}
              </td>
              <td
                key={age + index + "grade"}
                className="text-center text-text  font-bold bg-accent/10"
              >
                {index % 5}
              </td>
            </tr>
          );
        })}
        {/* {InspectionInfo.map((inspection, index) => (
          <tr
            className={`${index % 2 == 0 ? "bg-primary" : "bg-neutral"}`}
            key={inspection + "id"}
          >
            <td
              key={inspection + index}
              className="text-text text-lg text-center font-bold border-r border-neutral"
            >
              {inspection}
            </td>
            <td
              key={inspection + index + "grade"}
              className="text-text text-lg text-center font-bold"
            >
              {index % 5}
            </td>
          </tr>
        ))} */}
        {/* {fiberTempInfo.map((temp, index) => (
          <tr
            className={`${index % 2 == 0 ? "bg-primary" : "bg-neutral"}`}
            key={temp + "id"}
          >
            <td
              key={temp + index}
              className="text-text text-lg text-center font-bold border-r border-neutral"
            >
              {temp}
            </td>
            <td
              key={temp + index + "grade"}
              className="text-text text-lg text-center font-bold"
            >
              {index % 5}
            </td>
          </tr>
        ))} */}
      </tbody>
    </table>
  );
}

// export function InspectionTable({}) {

//   return (
//     <table className="w-full border border-secondary">
//       <thead>
//         <tr className="bg-secondary">
//           <th
//             key={"inspectionHeader"}
//             className="text-primary text-lg font-bold"
//           >
//             Inspection
//           </th>
//           <th
//             key={"inspectionGradeHeader"}
//             className="text-primary text-lg font-bold"
//           >
//             Grade
//           </th>
//         </tr>
//       </thead>

//       <tbody>
//         {InspectionInfo.map((inspection, index) => (
//           <tr
//             className={`${index % 2 == 0 ? "bg-primary" : "bg-neutral"}`}
//             key={inspection + "id"}
//           >
//             <td
//               key={inspection + index}
//               className="text-text text-lg text-center font-bold border-r border-neutral"
//             >
//               {inspection}
//             </td>
//             <td
//               key={inspection + index + "grade"}
//               className="text-text text-lg text-center font-bold"
//             >
//               {index % 5}
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   );
// }
// export function TemperatureTable({}) {

//   return (
//     <table className="w-full border border-secondary">
//       <thead className="bg-secondary">
//         <tr>
//           <th key={"tempHeader"} className="text-primary text-lg font-bold">
//             Temperature
//           </th>
//           <th
//             key={"tempGradeHeader"}
//             className="text-primary text-lg font-bold"
//           >
//             Grade
//           </th>
//         </tr>
//       </thead>

//       <tbody>

//       </tbody>
//     </table>
//   );
// }
