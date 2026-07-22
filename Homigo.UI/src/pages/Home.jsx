import { getRole } from "../utils/auth";

import CustomerHome from "./home/CustomerHome";
import ProviderHome from "./home/ProviderHome";
import AdminHome from "./home/AdminHome";

function Home() {
  const role = getRole();

  switch (role) {
    case "Admin":
      return <AdminHome />;

    case "Provider":
      return <ProviderHome />;

    case "Customer":
    default:
      return <CustomerHome />;
  }
}

export default Home;