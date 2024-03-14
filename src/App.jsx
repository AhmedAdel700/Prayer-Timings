import "./App.css";
import MainContent from "./components/MainContent";
import { Container } from "@mui/material";

export default function App() {
  return (
    <>
      <div className="main-content">
        <Container maxWidth="xl">
          <MainContent />
        </Container>
      </div>
    </>
  );
}
