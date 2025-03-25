import { useSelector } from "react-redux";
import { RootState } from "./store";
import useSpeech from "./hooks/useSpeech";
import { Container, Typography, Button } from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import StopIcon from "@mui/icons-material/Stop";

const App = () => {
  const { startRecording, stopRecording, isRecording } = useSpeech();
  const transcript = useSelector((state: RootState) => state.speech.transcript);

  return (
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h4" gutterBottom>
        Ki-dreven tale til tekst
      </Typography>
      <Button
        variant="contained"
        color={isRecording ? "secondary" : "primary"}
        startIcon={isRecording ? <StopIcon /> : <MicIcon />}
        onClick={isRecording ? stopRecording : startRecording}
      >
        {isRecording ? "Stop opptak" : "Start opptak"}
      </Button>
      <Typography
        variant="h6"
        style={{
          marginTop: "20px",
          padding: "10px",
          backgroundColor: "#f5f5f5",
          borderRadius: "10px",
        }}
      >
        {transcript || "Oversatt tekst dukker opp her..."}
      </Typography>
    </Container>
    <Container maxWidth="sm" style={{ textAlign: "center", marginTop: "50px" }}>
      <Typography variant="h6" gutterBottom>
        Thor Nydal
      </Typography>
    </Container>
  );
};

export default App;
