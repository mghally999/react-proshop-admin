import AppProviders from "./providers/AppProviders.jsx";
import Router from "./router/Router.jsx";

export default function App() {
  return (
    <AppProviders>
      <Router />
    </AppProviders>
  );
}
