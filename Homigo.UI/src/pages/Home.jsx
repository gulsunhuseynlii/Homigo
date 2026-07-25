import { isAuthenticated, getRole } from "../utils/auth";

import GuestHome from "./home/GuestHome";
import CustomerHome from "./home/CustomerHome";
import ProviderHome from "./home/ProviderHome";
import AdminHome from "./home/AdminHome";

function Home() {
  if (!isAuthenticated()) {
    return <GuestHome />;
  }

  const role = getRole();

  switch (role) {
    case "Admin":
      return <AdminHome />;

    case "Provider":
      return <ProviderHome />;

    case "Customer":
      return <CustomerHome />;

    default:
      return <GuestHome />;
  }
}

export default Home;