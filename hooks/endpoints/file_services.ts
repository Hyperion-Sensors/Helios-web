import helios_server, { download_server } from ".";
import download from "downloadjs";
import { format, add } from "date-fns";

export async function uploadFile(formData: FormData) {
  const response = await helios_server.post(`files/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response;
}

export async function downloadAssetTemps(formData: any) {
  const response = await download_server
    .post(`downloads/asset-agg-data`, formData, {
      responseType: "blob",
    })
    .then((response: any) => {
      if (response && response.data instanceof Blob) {
        const content = response.headers["content-type"];
        download(
          response.data,
          `${
            //create download file name based on number of assets selected
            formData.asset_names.length === 1
              ? `${formData.asset_names[0]}-temps`
              : "avg-asset-temps"
          }-[${format(
            add(new Date(formData.start_date), { days: 1 }), // add 1 day to start date to account for the fact that the start date is inclusive
            "ee"
          )} - ${format(
            add(new Date(formData.end_date), { days: 1 }),
            "dd LLL yy"
          )}].csv`,
          content
        );
        return true;
      }
    })
    .catch((error: any) => {
      console.log(error);
      return false;
    });

  return response;
}

export async function downloadFiberTemps(formData: any) {
  const response = await download_server
    .post(`downloads/fiber-temp-data`, formData, {
      responseType: "blob",
    })
    .then((response: any) => {
      if (response && response.data instanceof Blob) {
        const content = response.headers["content-type"];
        console.log(response.data);
        download(
          response.data,
          `${
            formData.asset_names.length === 1
              ? `${formData.asset_names[0]}-SZ-temps`
              : "avg-SZ-temps"
          }-[${format(
            add(new Date(formData.start_date), { days: 1 }), // add 1 day to start date to account for the fact that the start date is inclusive
            "dd"
          )} -- ${format(
            add(new Date(formData.end_date), { days: 1 }),
            "dd LLL yy"
          )}].csv`,
          content
        );
        return true;
      } else {
        console.error("Invalid response data or data type");
      }
    })
    .catch((error: any) => {
      console.error(error);
      return false;
    });

  return response;
}

export async function downloadAssetInfo() {
  try {
    const response = await helios_server.get(`downloads/asset-info-data`, {
      responseType: "blob",
    });

    // Check if the response contains data and is of the correct type
    if (response && response.data instanceof Blob) {
      const content = response.headers["content-type"];
      download(
        response.data,
        `asset-info-${format(new Date(), "MM/dd/yy")}.csv`,
        content
      );
      return true;
    } else {
      console.error("Invalid response data or data type");
    }
  } catch (error) {
    console.error("An error occurred during the download:", error);
    return false;
  }
}

export async function downloadSystemInfo() {
  try {
    const response = await helios_server.get(`downloads/all-systems`, {
      responseType: "blob",
    });

    // Check if the response contains data and is of the correct type
    if (response && response.data instanceof Blob) {
      const content = response.headers["content-type"];
      download(
        response.data,
        `systems-summary-${format(new Date(), "MM/dd/yy")}.csv`,
        content
      );
      return true;
    } else {
      console.error("Invalid response data or data type");
    }
  } catch (error) {
    console.error("An error occurred during the download:", error);
    return false;
  }
}

export async function getAllFiles() {
  try {
    const response = await helios_server.get(`files/get-all-names`);

    // Check if the response contains data and is of the correct type
    if (response.data != null && response.data instanceof Array) {
      return response.data;
    } else {
      console.error("Invalid response data or data type");
      return [];
    }
  } catch (error) {
    console.error("An error occurred during download from s3, error");
  }
}
