import React, { useEffect, useState } from "react";

/*----------------------LIBRARIES----------------------*/
import Papa from "papaparse";

/*----------------------API----------------------*/
import { uploadFile } from "hooks/endpoints/file_services";
import DataTypeSelector from "./data_type_selector";
import CSVPreviewTable from "./csv_preview_table";
import Criteria from "./upload_criteria";
import HeliosIcon from "@/Global/icons";

const mbSize = 1000000;

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function UploadPage() {
  const [inputFile, setInputFile] = useState<File>(null); // where the actual file is stored
  const [fileName, setFileName] = useState(""); // fileName is used for display purposes only
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isChecked, setIsChecked] = useState(false); // [true, false
  const [errorMessage, setErrorMessage] = useState("");

  // csvData stores preview data
  // Note: it is set with slice which gives a shallow copy
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
  const [csvData, setCsvData] = useState([]);

  useEffect(() => {
    // Nothing
  }, [inputFile]);

  const handleOnCheck = () => {
    setIsChecked(!isChecked);
  };

  const handleOnChange = async (e) => {
    if (!e.target.files[0]) {
      return;
    }

    setIsChecked(false);
    setCsvData([]);
    setErrorMessage("");
    setFileName(e.target.files[0].name);
    setIsSubmitted(false);

    // Validation
    if (e.target.files[0].type !== "text/csv") {
      setErrorMessage(
        "The file you are trying to upload is not in CSV format. Please make sure you are uploading a valid CSV file."
      );
      return;
    } else if (e.target.files[0].size / mbSize > 100) {
      setErrorMessage(
        "The file you are trying to upload is larger than the allowed maximum size of 100MB. Please choose a smaller file to upload."
      );
      return;
    } else if (!e.target.files[0].name.match("^[a-zA-Z0-9.,_@-]+$")) {
      setErrorMessage(
        "The filename contains invalid characters. Please ensure the filename only contains alphanumeric characters, periods, commas, underscores, and dashes."
      );
      return;
    }

    // This promise stuff keeps the file switching proper and stuff
    const parsePromise = new Promise<void>((resolve, reject) => {
      Papa.parse(e.target.files[0], {
        complete: (results) => {
          let tempCSV = results.data.slice(0, 6);

          if (tempCSV.length == 0) {
            setErrorMessage(
              "The uploaded CSV file appears to be empty. Please make sure the file contains data before uploading."
            );
            reject();
          }

          setCsvData(tempCSV);
          resolve();
        },
      });
    });

    try {
      await parsePromise;
    } catch (err) {
      return;
    }

    setInputFile(e.target.files[0]);
  };

  const handleOnSubmit = async (e) => {
    // Prevent refresh on submit
    e.preventDefault();

    // Do not allow submission if errors exist
    if (!inputFile || errorMessage.length > 0) {
      return;
    }

    const formData = new FormData();
    formData.append("file", inputFile);

    try {
      const result = await uploadFile(formData);

      setFileName("");
      setCsvData([]);
      setInputFile(null);
      setIsSubmitted(true);
    } catch (err) {
      console.log(err);
      setErrorMessage(
        "There was an error uploading your file. Please make sure your file is a properly formatted CSV file and try again."
      );
    }
  };

  return (
    <div className="flex flex-col w-full h-full gap-12 ">
      {/* <h1 className={`text-xl font-bold `}>Upload</h1> */}

      {/*---------------------------Upload Criteria---------------------------- */}
      <div className="self-center">
        <Criteria />
      </div>

      {/*-------------------------------File Input--------------------------------- */}
      <div>
        <label
          className=" inline-flex items-center justify-center gap-3 relative  rounded-t-md p-1 
          hover:border hover:border-accent bg-secondary w-full group hover:bg-primary-focus"
          htmlFor="upload-button"
        >
          <div className="w-5 h-5">
            <HeliosIcon
              icon_class={"inbox"}
              icon_type={"arrow-down"}
              color={""}
              stroke={"stroke-2 stroke-primary group-hover:stroke-accent "}
            />
          </div>
          <p className="font-bold text-primary self-center w-fit group-hover:text-secondary">
            {fileName ? fileName : "Upload File"}
          </p>
        </label>
        <input
          className="hidden"
          id="upload-button"
          type="file"
          accept=".csv"
          onChange={handleOnChange}
        />

        {/* <DataTypeSelector /> */}

        {csvData.length != 0 ? (
          <>
            <p>
              The follow is a preview of the first five rows of your file. No
              data will be uploaded until you click submit below.
            </p>
            <CSVPreviewTable csvData={csvData} />
          </>
        ) : (
          <div
            className="flex w-full h-40 border-4 border-neutral border-double rounded-md 
          items-center justify-center text-4xl text-neutral-focus font-bold"
          >
            Upload a CSV to preview
          </div>
        )}

        {errorMessage.length > 0 && (
          <div className="flex flex-col w-max h-max bg-error/30 border-2 border-error/50 pr-2 pl-1 py-1">
            <h2 className="flex font-bold">
              There was an error uploading your file.
            </h2>
            <p className="flex text-left text-md">{errorMessage}</p>
          </div>
        )}

        {isSubmitted && (
          <div className="flex flex-col w-max h-max bg-success/30 border-2 border-success/50 pr-2 pl-1 py-1">
            <h2 className="flex font-bold">
              Your file has been successfully uploaded.
            </h2>
            <p className="flex text-left text-md">{errorMessage}</p>
          </div>
        )}
      </div>

      {/*-------------------------------Submission--------------------------------- */}
      <div className="flex flex-col">
        <label>
          <input
            type="checkbox"
            className="checkbox checkbox-secondary w-4 h-4 rounded-sm"
            checked={isChecked}
            onChange={handleOnCheck}
          />
          <span className="ml-2">
            I understand that I am responsible for the accuracy of the data
            provided.
          </span>
        </label>

        <button
          className={classNames(
            inputFile && errorMessage.length == 0 && isChecked
              ? "bg-secondary hover:bg-secondary-focus"
              : "bg-neutral",
            "border text-md text-primary font-medium text-center w-[6rem] h-[1.5rem] px-2 rounded-sm "
          )}
          disabled={!inputFile || errorMessage.length > 0 || !isChecked}
          onClick={handleOnSubmit}
        >
          Submit
        </button>
      </div>
    </div>
  );
}

/* <h1 className="font-bold text-secondary">File Preview</h1> */
