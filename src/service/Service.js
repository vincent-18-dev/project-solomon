import axios from "axios";

export async function Customers(data) {
  return await axios.post(
    `https://bpartner.in/personal/bpartner/imeilogger/getipaddress.php`,
    {
      ...data,
    }
  );
}

export async function user(items) {
  return await axios.post(
    `http://106.51.2.145:2081/Dlite_Kot/Service1.svc/webreport`,
    JSON?.stringify(items)
  );
}
