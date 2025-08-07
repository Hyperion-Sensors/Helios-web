//Created At: 9/12/2021, 11:06:00 PM By H.Ossias

/*
This component exists as a warning for users that the page they are viewing is 
under construction and may not be representative of the final product.
*/

function Criteria() {
  return (
    <div className="flex flex-col w-max h-max bg-secondary/20 ring-info/70 pr-2 rounded-lg p-6 shadow-lg shadow-secondary/50">
      <h2 className="flex font-bold">
        Before proceeding with your upload, kindly ensure that your file adheres
        to the following criteria:
      </h2>
      <p className="flex text-left text-md">
        {"- The first row should serve as the header row."}
      </p>
      <p className="flex text-left text-md">
        {"- The file's size should not exceed 100 MB"}
      </p>
    </div>
  );
}

export default Criteria;
