import Swal from "sweetalert2";

const alertSuccess = (text) => {
  Swal.fire({
    title: "Success!",
    text,
    icon: "success",
  });
};

const alertError = (text) => {
  Swal.fire({
    title: "Error!",
    text,
    icon: "error",
  });
};

const alertWarning = (text) => {
  Swal.fire({
    title: "Warning!",
    text,
    icon: "warning",
  });
};

export { alertSuccess, alertError, alertWarning };
