//Components
import Header from "./components/Header";
import ContactForm from "./components/ContactForm";
import UserContext from "./Context/UserContext";
import ContactsList from "./components/ContactsList";

const App = () => {
  return (
    <UserContext>
      <Header />
      <ContactForm />
      <ContactsList />
    </UserContext>
  );
};

export default App;
